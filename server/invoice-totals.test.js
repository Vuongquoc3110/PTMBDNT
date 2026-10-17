const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateInvoiceTotals } = require('../utils/invoiceTotals');

test('included VAT is split without increasing the payment', () => {
  const totals = calculateInvoiceTotals(10800000, 10800000, 0);
  assert.equal(totals.netAmount, 10000000);
  assert.equal(totals.vatAmount, 800000);
  assert.equal(totals.discountAmount, 0);
});

test('discount is deducted before VAT and shipping stays separate', () => {
  const totals = calculateInvoiceTotals(2160000, 1110000, 30000);
  assert.equal(totals.netAmount, 1000000);
  assert.equal(totals.vatAmount, 80000);
  assert.equal(totals.discountAmount, 1080000);
  assert.equal(totals.netAmount + totals.vatAmount + totals.shippingAmount, 1110000);
});

test('rounding and zero totals preserve the exact payment', () => {
  for (const amount of [0, 1, 99999, 4690000]) {
    const totals = calculateInvoiceTotals(amount, amount, 0);
    assert.equal(totals.netAmount + totals.vatAmount, amount);
    assert.ok(totals.vatAmount >= 0);
  }
});
