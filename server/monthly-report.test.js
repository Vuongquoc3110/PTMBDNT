const test = require('node:test');
const assert = require('node:assert/strict');
const { buildReport } = require('./monthly-report');
const products = [{ id: 'p1', name: 'Laptop A', categoryName: 'Laptop' }];
test('manual month opening is used without fabricating closing stock or sales', () => {
  const report = buildReport('2026-10', products, [], [], [], '2026-11-01', [{ productId: 'p1', quantity: 100 }]);
  assert.equal(report.rows[0].opening, 100);
  assert.equal(report.rows[0].openingSource, 'manual');
  assert.equal(report.rows[0].closing, null);
  assert.equal(report.sold, 0);
});

test('sales aggregate quantities, prices and deleted products without changing inventory', () => {
  const report = buildReport('2026-10', products, [{ items: JSON.stringify([{ productId: 'p1', quantity: 2, price: 100 }, { productId: 'removed', name: 'Old item', quantity: 1, price: 50 }]) }], [], [], '2026-11-01');
  assert.equal(report.sold, 3);
  assert.equal(report.salesAmount, 250);
  assert.equal(report.rows[0].category, 'Laptop');
  assert.equal(report.rows[0].opening, null);
  assert.equal(report.rows[1].category, 'Sản phẩm đã xóa');
});

test('inventory reconciles opening + incoming - outgoing = closing, excluding next month', () => {
  const baseline = [{ productId: 'p1', quantity: 10, capturedAt: '2026-09-01 00:00:00' }];
  const movements = [
    { productId: 'p1', delta: 3, occurredAt: '2026-09-15 10:00:00' },
    { productId: 'p1', delta: -2, occurredAt: '2026-10-01 00:00:00' },
    { productId: 'p1', delta: 5, occurredAt: '2026-10-20 10:00:00' },
    { productId: 'p1', delta: 99, occurredAt: '2026-11-01 00:00:00' },
  ];
  const row = buildReport('2026-10', products, [], baseline, movements, '2026-11-01 00:00:00').rows[0];
  assert.equal(row.opening, 13); assert.equal(row.incoming, 5); assert.equal(row.outgoing, 2); assert.equal(row.closing, 16);
  assert.equal(row.opening + row.incoming - row.outgoing, row.closing);
});

test('historical stock is unknown before tracking, current closing is available', () => {
  const baseline = [{ productId: 'p1', quantity: 10, capturedAt: '2026-10-17 10:00:00' }];
  const old = buildReport('2026-09', products, [], baseline, [], '2026-10-01 00:00:00').rows[0];
  assert.equal(old.opening, null); assert.equal(old.closing, null);
  const current = buildReport('2026-10', products, [], baseline, [], '2026-10-17 12:00:00').rows[0];
  assert.equal(current.opening, null); assert.equal(current.closing, 10);
});
