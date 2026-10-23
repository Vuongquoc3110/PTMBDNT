const { randomUUID } = require('node:crypto');

const unitSchema = `CREATE TABLE IF NOT EXISTS product_units (
  code VARCHAR(40) PRIMARY KEY,
  productId VARCHAR(50) NOT NULL,
  manufacturerSerial VARCHAR(100) UNIQUE NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  orderId INT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX units_product_status (productId, status),
  INDEX units_order (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;

function quantity(value) {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1) throw new Error('Số lượng phải là số nguyên dương');
  return n;
}

function parseItems(items) {
  return typeof items === 'string' ? JSON.parse(items) : (items || []);
}

function generateSerial(productId, productName = '') {
  const p = `${productId || ''} ${productName || ''}`.toLowerCase();
  let prefix = 'SN-';
  if (p.includes('dell')) {
    prefix = 'SN-DELL-';
  } else if (p.includes('hp')) {
    prefix = 'SN-HP-';
  } else if (p.includes('thinkpad') || p.includes('lenovo')) {
    prefix = 'SN-LNV-';
  } else if (p.includes('asus') || p.includes('rog') || p.includes('tuf')) {
    prefix = 'SN-ASUS-';
  } else if (p.includes('acer') || p.includes('nitro') || p.includes('predator')) {
    prefix = 'SN-ACER-';
  } else if (p.includes('macbook') || p.includes('apple')) {
    prefix = 'SN-APL-';
  } else if (p.includes('msi')) {
    prefix = 'SN-MSI-';
  } else if (p.includes('lap') || p.includes('l360') || p.includes('latitude') || p.includes('inspiron')) {
    prefix = 'SN-LP-';
  } else if (p.includes('vga') || p.includes('rtx') || p.includes('gtx') || p.includes('rx')) {
    prefix = 'SN-VGA-';
  } else if (p.includes('cpu') || p.includes('intel') || p.includes('ryzen') || p.includes('core')) {
    prefix = 'SN-CPU-';
  } else if (p.includes('ram') || p.includes('ddr')) {
    prefix = 'SN-RAM-';
  } else if (p.includes('ssd') || p.includes('hdd') || p.includes('nvme')) {
    prefix = 'SN-SSD-';
  } else if (p.includes('main') || p.includes('b760') || p.includes('z790') || p.includes('b650')) {
    prefix = 'SN-MB-';
  } else if (p.includes('mon') || p.includes('screen') || p.includes('display')) {
    prefix = 'SN-MON-';
  } else if (p.includes('mouse') || p.includes('chuot') || p.includes('dareu') || p.includes('logitech')) {
    prefix = 'SN-MS-';
  } else if (p.includes('key') || p.includes('phim')) {
    prefix = 'SN-KB-';
  } else {
    const clean = p.replace(/[^a-z0-9]/g, '').slice(0, 3).toUpperCase() || 'DPC';
    prefix = `SN-${clean}-`;
  }
  const rand = randomUUID().replace(/-/g, '').toUpperCase().slice(0, 8);
  return `${prefix}${rand}`;
}

async function createUnits(connection, productId, count, status = 'available', orderId = null) {
  const unitsData = Array.from({ length: count }, () => ({
    code: `BH-${randomUUID().replace(/-/g, '').toUpperCase()}`,
    serial: generateSerial(productId),
  }));
  const codes = unitsData.map(u => u.code);

  // Bound query size for large inventories.
  for (let start = 0; start < unitsData.length; start += 500) {
    await connection.query(
      'INSERT INTO product_units (code, productId, manufacturerSerial, status, orderId) VALUES ?',
      [unitsData.slice(start, start + 500).map(u => [u.code, productId, u.serial, status, orderId])]
    );
  }
  return codes;
}

// Caller must hold the product row lock inside a transaction.
async function syncStockUnits(connection, productId) {
  const [[product]] = await connection.query('SELECT stock, name FROM products WHERE id = ? FOR UPDATE', [productId]);
  if (!product) throw new Error('Không tìm thấy sản phẩm');
  const target = Number(product.stock);
  if (!Number.isSafeInteger(target) || target < 0) throw new Error('Tồn kho phải là số nguyên không âm');
  const [available] = await connection.query(
    "SELECT code FROM product_units WHERE productId = ? AND status = 'available' ORDER BY createdAt, code FOR UPDATE", [productId]);
  if (available.length < target) await createUnits(connection, productId, target - available.length);
  if (available.length > target) {
    await connection.query("UPDATE product_units SET status = 'removed' WHERE code IN (?)",
      [available.slice(target).map(unit => unit.code)]);
  }
}

async function allocateUnits(connection, productId, count) {
  count = quantity(count);
  await syncStockUnits(connection, productId);
  const [units] = await connection.query(
    "SELECT code FROM product_units WHERE productId = ? AND status = 'available' ORDER BY createdAt, code LIMIT ? FOR UPDATE",
    [productId, count]);
  if (units.length !== count) throw new Error('Không đủ máy trong kho để cấp mã bảo hành');
  const codes = units.map(unit => unit.code);
  await connection.query("UPDATE product_units SET status = 'allocated' WHERE code IN (?)", [codes]);
  return codes;
}

async function releaseOrderUnits(connection, orderId) {
  await connection.query("UPDATE product_units SET status = 'available', orderId = NULL WHERE orderId = ? AND status = 'allocated'", [orderId]);
}

async function hydrateOrders(connection, orders) {
  const parsed = orders.map(order => ({ ...order, items: parseItems(order.items) }));
  const codes = [...new Set(parsed.flatMap(order => order.items.flatMap(item => item.serialNumbers || (item.serialNumber ? [item.serialNumber] : []))))];

  let byCode = new Map();
  if (codes.length) {
    try {
      const [units] = await connection.query('SELECT code, manufacturerSerial, productId FROM product_units WHERE code IN (?)', [codes]);
      byCode = new Map(units.map(unit => [unit.code, unit]));
    } catch {}
  }

  return parsed.map(order => ({
    ...order,
    items: order.items.map(item => {
      const serialList = item.serialNumbers?.length
        ? item.serialNumbers
        : item.serialNumber
        ? [item.serialNumber]
        : [`SN-DPC-${order.id || Date.now().toString().slice(-6)}-1`];

      const deviceUnits = serialList.map((code) => {
        let mSerial = byCode.get(code)?.manufacturerSerial;
        if (!mSerial) {
          // Tự động sinh IMEI / Serial hãng cố định nếu chưa có
          mSerial = generateSerial(item.productId, item.name);
          // Ghi nhận vào MySQL product_units để lưu vĩnh viễn
          if (byCode.has(code)) {
            connection.query('UPDATE product_units SET manufacturerSerial = ? WHERE code = ?', [mSerial, code]).catch(() => {});
          } else {
            connection.query(
              'INSERT INTO product_units (code, productId, manufacturerSerial, status, orderId) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE manufacturerSerial = VALUES(manufacturerSerial), orderId = VALUES(orderId)',
              [code, item.productId || 'prod-001', mSerial, 'allocated', order.id]
            ).catch(() => {});
          }
        }
        return {
          code,
          manufacturerSerial: mSerial,
        };
      });

      return {
        ...item,
        serialNumbers: serialList,
        serialNumber: serialList[0],
        deviceUnits,
      };
    })
  }));
}

async function initializeUnits(pool) {
  const connection = await pool.getConnection();
  let locked = false;
  try {
    const [[lock]] = await connection.query("SELECT GET_LOCK('dpc_product_units_migration', 30) AS acquired");
    if (!lock.acquired) throw new Error('Không thể khóa migration mã bảo hành');
    locked = true;
    await connection.query(unitSchema);
    await connection.beginTransaction();
    const [orders] = await connection.query('SELECT id, orderNumber, status, items FROM orders ORDER BY id FOR UPDATE');
    for (const order of orders) {
      const items = parseItems(order.items);
      let changed = false;
      for (const [index, item] of items.entries()) {
        const count = quantity(item.quantity || 1);
        if (!item.legacySerialNumber && item.unitCodeSource !== 'inventory') {
          const digits = String(order.orderNumber || order.id).replace(/[^0-9]/g, '');
          item.legacySerialNumber = item.serialNumber && item.unitCodeSource !== 'backfill'
            ? item.serialNumber : `SN-DPC-${digits.slice(-8) || order.id}-${index + 1}`;
          changed = true;
        }
        if (item.serialNumbers?.length === count) continue;
        const codes = await createUnits(connection, item.productId, count,
          order.status === 'cancelled' ? 'retired' : 'allocated', order.id);
        item.serialNumbers = codes;
        item.serialNumber = codes[0];
        item.unitCodeSource = 'backfill';
        changed = true;
      }
      if (changed) await connection.query('UPDATE orders SET items = ?, updatedAt = updatedAt WHERE id = ?', [JSON.stringify(items), order.id]);
    }
    const [products] = await connection.query('SELECT id FROM products ORDER BY id FOR UPDATE');
    for (const product of products) await syncStockUnits(connection, product.id);

    // Tự động cấp IMEI / S/N cho các thiết bị còn thiếu serial trong kho & đơn hàng
    const [emptySerials] = await connection.query(
      "SELECT code, productId FROM product_units WHERE manufacturerSerial IS NULL OR manufacturerSerial = '' FOR UPDATE"
    );
    for (const row of emptySerials) {
      const serial = generateSerial(row.productId);
      await connection.query(
        'UPDATE product_units SET manufacturerSerial = ? WHERE code = ?',
        [serial, row.code]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    if (locked) await connection.query("SELECT RELEASE_LOCK('dpc_product_units_migration')");
    connection.release();
  }
}

module.exports = { unitSchema, quantity, generateSerial, createUnits, syncStockUnits, allocateUnits, releaseOrderUnits, hydrateOrders, initializeUnits };
