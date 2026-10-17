export interface InvoiceTotals {
  vatRate: number;
  netAmount: number;
  vatAmount: number;
  shippingAmount: number;
  discountAmount: number;
}
export function calculateInvoiceTotals(subtotal: number, totalAmount: number, shippingAmount: number): InvoiceTotals;
