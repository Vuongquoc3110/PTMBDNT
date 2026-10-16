require('dotenv').config({ path: '.env.local', quiet: true });
const { test } = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql2/promise');
const { randomUUID } = require('node:crypto');
const { quantity, syncStockUnits, allocateUnits, releaseOrderUnits, hydrateOrders } = require('./product-units');

test('Reject fractional, negative, missing and nonnumeric unit quantities', () => {
  for (const value of [undefined, 0, -1, 1.5, 'abc']) assert.throws(() => quantity(value));
  assert.equal(quantity('3'), 3);
});

test('MySQL: individual codes, restocking, rollback and unique real serials', async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh',
  });
  const productId = `test-unit-${randomUUID()}`;
  try {
    await connection.beginTransaction();
    const [[category]] = await connection.query('SELECT id FROM categories LIMIT 1');
    await connection.query('INSERT INTO products (id, name, category_id, price, stock) VALUES (?, ?, ?, 1, 3)', [productId, 'Unit test fixture', category.id]);
    await syncStockUnits(connection, productId);
    await syncStockUnits(connection, productId);
    const [initial] = await connection.query('SELECT code FROM product_units WHERE productId = ?', [productId]);
    assert.equal(initial.length, 3, 'sync is idempotent');
    const codes = await allocateUnits(connection, productId, 2);
    assert.equal(new Set(codes).size, 2);
    await connection.query('UPDATE products SET stock = 1 WHERE id = ?', [productId]);
    await connection.query('UPDATE product_units SET orderId = 2147483647 WHERE code IN (?)', [codes]);
    await connection.query('UPDATE product_units SET manufacturerSerial = ? WHERE code = ?', [`TEST-${productId}`, codes[0]]);
    await assert.rejects(connection.query('UPDATE product_units SET manufacturerSerial = ? WHERE code = ?', [`TEST-${productId}`, codes[1]]), { code: 'ER_DUP_ENTRY' });
    const [order] = await hydrateOrders(connection, [{ id: 2147483647, items: JSON.stringify([{ productId, quantity: 2, serialNumbers: codes }]) }]);
    assert.equal(order.items[0].deviceUnits.length, 2);
    assert.equal(order.items[0].deviceUnits[0].manufacturerSerial, `TEST-${productId}`);
    await assert.rejects(allocateUnits(connection, productId, 2));
    await releaseOrderUnits(connection, 2147483647);
    await releaseOrderUnits(connection, 2147483647);
    await connection.query('UPDATE products SET stock = 3 WHERE id = ?', [productId]);
    await syncStockUnits(connection, productId);
    const [restored] = await connection.query("SELECT code FROM product_units WHERE productId = ? AND status = 'available'", [productId]);
    assert.deepEqual(restored.map(row => row.code).sort(), initial.map(row => row.code).sort());
    await connection.query('UPDATE products SET stock = 2 WHERE id = ?', [productId]);
    await syncStockUnits(connection, productId);
    const [[removed]] = await connection.query("SELECT COUNT(*) AS total FROM product_units WHERE productId = ? AND status = 'removed'", [productId]);
    assert.equal(removed.total, 1, 'manual stock-out retains code history');
  } finally {
    await connection.rollback();
    const [[remaining]] = await connection.query('SELECT COUNT(*) AS total FROM product_units WHERE productId = ?', [productId]);
    assert.equal(remaining.total, 0, 'rollback leaves no test inventory');
    await connection.end();
  }
});
