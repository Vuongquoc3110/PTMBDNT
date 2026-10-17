const fs = require('fs');
const path = require('path');

async function initializeReporting(pool) {
  const sql = fs.readFileSync(path.join(__dirname, 'monthly-report.sql'), 'utf8');
  const connection = await pool.getConnection();
  try {
    for (const statement of sql.split('-- statement-break').map(s => s.trim()).filter(Boolean)) {
      if (statement.includes('CREATE TRIGGER')) {
        const name = statement.match(/CREATE TRIGGER (\w+)/)[1];
        const [existing] = await connection.query('SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE() AND TRIGGER_NAME = ?', [name]);
        if (existing.length) continue;
      }
      await connection.query(statement);
    }
  } finally { connection.release(); }
}

function buildReport(month, products, orders, baselines, movements, cutoff, openings = []) {
  const start = `${month}-01 00:00:00`;
  const rows = new Map(products.map(p => [String(p.id), { productId: String(p.id), name: p.name, category: p.categoryName || 'Chưa phân loại', sold: 0, salesAmount: 0, opening: null, closing: null, incoming: 0, outgoing: 0 }]));
  for (const order of orders) {
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    for (const item of items || []) {
      const id = String(item.productId);
      if (!rows.has(id)) rows.set(id, { productId: id, name: item.name || id, category: 'Sản phẩm đã xóa', sold: 0, salesAmount: 0, opening: null, closing: null, incoming: 0, outgoing: 0 });
      const row = rows.get(id);
      row.sold += Number(item.quantity) || 0;
      row.salesAmount += (Number(item.quantity) || 0) * (Number(item.price) || 0);
    }
  }
  for (const base of baselines) {
    const row = rows.get(String(base.productId));
    if (!row) continue;
    const changes = movements.filter(m => String(m.productId) === String(base.productId));
    if (base.capturedAt <= start) row.opening = Number(base.quantity) + changes.filter(m => m.occurredAt < start).reduce((s, m) => s + Number(m.delta), 0);
    if (base.capturedAt < cutoff) row.closing = Number(base.quantity) + changes.filter(m => m.occurredAt < cutoff).reduce((s, m) => s + Number(m.delta), 0);
    for (const move of changes.filter(m => m.occurredAt >= start && m.occurredAt < cutoff)) {
      if (Number(move.delta) > 0) row.incoming += Number(move.delta);
      else row.outgoing -= Number(move.delta);
    }
  }
  for (const opening of openings) {
    const row = rows.get(String(opening.productId));
    if (row) { row.opening = Number(opening.quantity); row.openingSource = 'manual'; }
  }
  const result = [...rows.values()].sort((a, b) => b.sold - a.sold || a.name.localeCompare(b.name));
  return { month, orderCount: orders.length, sold: result.reduce((s, r) => s + r.sold, 0), salesAmount: result.reduce((s, r) => s + r.salesAmount, 0), rows: result };
}

async function getMonthlyReport(pool, month) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || Number(month.slice(0, 4)) < 2000 || Number(month.slice(0, 4)) > 2100) throw Object.assign(new Error('Tháng phải có dạng YYYY-MM'), { status: 400 });
  const start = `${month}-01 00:00:00`;
  const [year, number] = month.split('-').map(Number);
  const end = `${number === 12 ? year + 1 : year}-${String(number === 12 ? 1 : number + 1).padStart(2, '0')}-01 00:00:00`;
  const connection = await pool.getConnection();
  try {
    await connection.query("SET time_zone = '+07:00'");
    await connection.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    await connection.query('START TRANSACTION WITH CONSISTENT SNAPSHOT');
    const [[clock]] = await connection.query("SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') AS now");
    const cutoff = end < clock.now ? end : clock.now;
    const [products] = await connection.query('SELECT p.id, p.name, c.name AS categoryName FROM products p LEFT JOIN categories c ON c.id = p.category_id');
    const [orders] = await connection.query("SELECT items FROM orders WHERE status = 'completed' AND (returnStatus IS NULL OR returnStatus != 'approved') AND createdAt >= ? AND createdAt < ?", [start, end]);
    const [[counts]] = await connection.query('SELECT COUNT(*) AS totalOrders FROM orders WHERE createdAt >= ? AND createdAt < ?', [start, end]);
    const [baselines] = await connection.query("SELECT productId, quantity, DATE_FORMAT(capturedAt, '%Y-%m-%d %H:%i:%s.%f') AS capturedAt FROM inventory_baselines");
    const [movements] = await connection.query("SELECT productId, delta, DATE_FORMAT(occurredAt, '%Y-%m-%d %H:%i:%s.%f') AS occurredAt FROM inventory_movements WHERE occurredAt < ?", [cutoff]);
    const [openings] = await connection.query('SELECT productId, quantity FROM monthly_inventory_openings WHERE month = ?', [month]);
    await connection.commit();
    return { ...buildReport(month, products, orders, baselines, movements, cutoff, openings), totalOrders: Number(counts.totalOrders), asOf: cutoff };
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}
async function saveMonthlyOpenings(pool, month, entries, userId, note = 'Nhập tồn đầu từ quản trị') {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || Number(month.slice(0, 4)) < 2000 || Number(month.slice(0, 4)) > 2100) throw Object.assign(new Error('Tháng phải có dạng YYYY-MM'), { status: 400 });
  if (!Array.isArray(entries) || !entries.length || entries.length > 1000 || entries.some(e => !e || typeof e.productId !== 'string' || !Number.isInteger(e.quantity) || e.quantity < 0 || e.quantity > 2147483647)) throw Object.assign(new Error('Tồn đầu phải là số nguyên không âm; tối đa 1000 sản phẩm mỗi lần'), { status: 400 });
  if (new Set(entries.map(e => e.productId)).size !== entries.length) throw Object.assign(new Error('Danh sách trùng mã sản phẩm'), { status: 400 });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [products] = await connection.query('SELECT id FROM products WHERE id IN (?) FOR UPDATE', [entries.map(e => e.productId)]);
    if (products.length !== entries.length) throw Object.assign(new Error('Có sản phẩm không còn tồn tại'), { status: 400 });
    for (const entry of entries) await connection.query('INSERT INTO monthly_inventory_openings (month, productId, quantity, note, updatedBy) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), note = VALUES(note), updatedBy = VALUES(updatedBy)', [month, entry.productId, entry.quantity, note.slice(0, 255), userId || null]);
    await connection.commit();
    return { saved: entries.length };
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}
module.exports = { initializeReporting, getMonthlyReport, buildReport, saveMonthlyOpenings };
