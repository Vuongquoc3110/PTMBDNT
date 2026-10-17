// Prices include VAT. Split it out without changing the amount charged.
function calculateInvoiceTotals(subtotal, totalAmount, shippingAmount) {
  const shipping = Math.min(Math.max(0, shippingAmount), totalAmount);
  const goodsTotal = Math.max(0, totalAmount - shipping);
  const netAmount = Math.round(goodsTotal / 1.08);
  return {
    vatRate: 8,
    netAmount,
    vatAmount: goodsTotal - netAmount,
    shippingAmount: shipping,
    discountAmount: Math.max(0, subtotal - goodsTotal),
  };
}

module.exports = { calculateInvoiceTotals };
