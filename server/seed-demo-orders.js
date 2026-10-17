// Synthetic orders for dashboard demos; does not allocate devices or change stock.
require('dotenv').config({ path: '.env.local', quiet: true });
const mysql = require('mysql2/promise');
const assert = require('node:assert/strict');
const { calculateInvoiceTotals } = require('../utils/invoiceTotals');

async function main() {
  const asOf = '2026-10-17';
  const prefix = 'DEMO-REPORT-';
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh',
  });
  try {
    await connection.query("SET time_zone = '+07:00'");
    const [users] = await connection.query("SELECT id FROM users WHERE role NOT IN ('admin', 'staff') ORDER BY id LIMIT 1");
    assert.ok(users.length, 'Cần ít nhất một tài khoản khách hàng để gắn đơn mẫu');
    const [products] = await connection.query('SELECT id, name, price, image FROM products WHERE price > 0 ORDER BY id LIMIT 60');
    assert.ok(products.length, 'Không có sản phẩm để tạo dữ liệu mẫu');
    const [columns] = await connection.query("SHOW COLUMNS FROM orders LIKE 'invoiceTotals'");
    const hasTaxColumn = columns.length > 0;
    const dates = [];
    // Three orders every month across the last three reporting years.
    for (let year = 2024; year <= 2026; year++) {
      for (let month = 1; month <= (year === 2026 ? 10 : 12); month++) {
        for (const day of [3, 9, 15]) {
          dates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        }
      }
    }
    // Three extra orders per day for the seven-day chart.
    for (let day = 11; day <= 17; day++) {
      for (let n = 0; n < 3; n++) dates.push(`2026-10-${day}`);
    }
    await connection.beginTransaction();
    const [[before]] = await connection.query('SELECT COUNT(*) AS count FROM orders WHERE orderNumber NOT LIKE ?', [prefix + '%']);
    let inserted = 0;
    for (let i = 0; i < dates.length; i++) {
      assert.ok(dates[i] <= asOf);
      const code = `${prefix}${dates[i].replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`;
      const [[exists]] = await connection.query('SELECT COUNT(*) AS count FROM orders WHERE orderNumber = ?', [code]);
      if (exists.count) continue;
      const product = products[(i * 7) % products.length];
      const qty = 1 + (i % 3);
      const subtotal = Number(product.price) * qty;
      const shipping = subtotal >= 5000000 ? 0 : 30000;
      const total = subtotal + shipping;
      const tax = calculateInvoiceTotals(subtotal, total, shipping);
      assert.equal(tax.netAmount + tax.vatAmount + tax.shippingAmount, total);
      const items = [{ productId: product.id, name: product.name, price: Number(product.price), quantity: qty, image: product.image, isDemo: true }];
      const timestamp = `${dates[i]} ${String(8 + i % 3).padStart(2, '0')}:15:00`;
      const fields = ['userId', 'orderNumber', 'items', 'totalAmount', 'shippingAddress', 'shippingMethod', 'paymentMethod', 'status', 'createdAt', 'updatedAt'];
      const values = [users[0].id, code, JSON.stringify(items), total, '[DỮ LIỆU MẪU] Đơn dùng kiểm tra báo cáo doanh thu', 'standard', 'cod', 'completed', timestamp, timestamp];
      if (hasTaxColumn) { fields.push('invoiceTotals'); values.push(JSON.stringify(tax)); }
      await connection.query(`INSERT INTO orders (${fields.join(',')}) VALUES (${values.map(() => '?').join(',')})`, values);
      inserted++;
    }
    const [[after]] = await connection.query('SELECT COUNT(*) AS count FROM orders WHERE orderNumber NOT LIKE ?', [prefix + '%']);
    assert.equal(after.count, before.count, 'Số đơn hiện có phải được giữ nguyên');
    const [summary] = await connection.query("SELECT YEAR(createdAt) AS year, COUNT(*) AS orders, SUM(totalAmount) AS total FROM orders WHERE orderNumber LIKE ? GROUP BY YEAR(createdAt) ORDER BY year", [prefix + '%']);
    await connection.commit();
    console.log(JSON.stringify({ inserted, existingOrdersPreserved: before.count, invoiceTotalsSaved: hasTaxColumn, summary }, null, 2));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
