require('dotenv').config({ path: '.env.local', quiet: true });
const { test } = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql2/promise');
const { randomUUID } = require('node:crypto');

test('API: checkout persists one code per device; failed checkout rolls back; cancellation restores same devices', async () => {
  const db = await mysql.createConnection({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'maytinh' });
  const productId = `test-api-${randomUUID()}`;
  let userId;
  const base = process.env.UNIT_CODES_TEST_URL || 'http://localhost:5000';
  const request = async (url, method = 'GET', body) => {
    const response = await fetch(`${base}${url}`, { method, headers: { 'Content-Type': 'application/json', 'x-user-id': String(userId) }, body: body ? JSON.stringify(body) : undefined });
    return { status: response.status, data: await response.json() };
  };
  try {
    const [[category]] = await db.query('SELECT id FROM categories LIMIT 1');
    const [user] = await db.query("INSERT INTO users (email, password, name, role) VALUES (?, 'test-only', 'Unit test fixture', 'admin')", [`${productId}@example.invalid`]);
    userId = user.insertId;
    await db.query('INSERT INTO products (id, name, category_id, price, stock) VALUES (?, ?, ?, 1, 3)', [productId, 'Unit test fixture', category.id]);
    const body = { userId, items: [{ productId, name: 'Unit test fixture', price: 1, quantity: 2 }], totalAmount: 2, shippingAddress: 'Test fixture only', shippingMethod: 'test', paymentMethod: 'cod' };
    const attempts = await Promise.all([request('/orders', 'POST', body), request('/orders', 'POST', body)]);
    assert.deepEqual(attempts.map(result => result.status).sort(), [201, 400]);
    const created = attempts.find(result => result.status === 201);
    const orderId = created.data.orderId;
    const order = await request(`/orders/${orderId}`);
    const codes = order.data.items[0].serialNumbers;
    assert.equal(new Set(codes).size, 2, JSON.stringify({ created, order }));
    const duplicate = await request('/orders', 'POST', { ...body, items: [{ ...body.items[0], quantity: 1 }, { ...body.items[0], quantity: 1 }] });
    assert.equal(duplicate.status, 400);
    const [[remaining]] = await db.query('SELECT stock FROM products WHERE id = ?', [productId]);
    assert.equal(remaining.stock, 1);
    const units = await request(`/products/${productId}/units`);
    assert.equal(units.data.length, 3);
    const realSerial = `REAL-${productId}`;
    assert.equal((await request(`/product-units/${codes[0]}`, 'PUT', { manufacturerSerial: realSerial })).status, 200);
    assert.equal((await request(`/product-units/${codes[1]}`, 'PUT', { manufacturerSerial: realSerial })).status, 400);
    const hydrated = await request(`/orders/${orderId}`);
    assert.equal(hydrated.data.items[0].deviceUnits.find(unit => unit.code === codes[0]).manufacturerSerial, realSerial.toUpperCase());
    const cancellations = await Promise.all([request(`/orders/${orderId}/cancel`, 'PUT', {}), request(`/orders/${orderId}/cancel`, 'PUT', {})]);
    assert.deepEqual(cancellations.map(result => result.status).sort(), [200, 400]);
    const [[restocked]] = await db.query('SELECT stock FROM products WHERE id = ?', [productId]);
    assert.equal(restocked.stock, 3);
    const [[available]] = await db.query("SELECT COUNT(*) AS total FROM product_units WHERE productId = ? AND status = 'available'", [productId]);
    assert.equal(available.total, 3);
  } finally {
    // Delete only fixtures created by this test, including generated in-app notifications.
    if (userId) {
      await db.query('DELETE FROM notifications WHERE orderId IN (SELECT id FROM orders WHERE userId = ?)', [userId]);
      await db.query('DELETE FROM orders WHERE userId = ?', [userId]);
      await db.query('DELETE FROM users WHERE id = ?', [userId]);
    }
    await db.query('DELETE FROM product_units WHERE productId = ?', [productId]);
    await db.query('DELETE FROM products WHERE id = ?', [productId]);
    await db.end();
  }
});
