import type { OrderItem } from '@/services/api';

export function formatUnitCodes(item: OrderItem): string {
  if (item.deviceUnits?.length) {
    return item.deviceUnits.map(unit => `${unit.code}${unit.manufacturerSerial ? ` (S/N: ${unit.manufacturerSerial})` : ''}`).join('\n');
  }
  return item.serialNumbers?.join('\n') || item.serialNumber || 'Chưa được cấp mã bảo hành';
}

export function expandOrderUnits(items: OrderItem[]): (OrderItem & { serialNumber: string; manufacturerSerial?: string | null })[] {
  return items.flatMap(item => {
    const codes = item.serialNumbers?.length ? item.serialNumbers : item.serialNumber ? [item.serialNumber] : [];
    return codes.map(code => ({ ...item, quantity: 1, serialNumber: code,
      manufacturerSerial: item.deviceUnits?.find(unit => unit.code === code)?.manufacturerSerial,
    }));
  });
}
