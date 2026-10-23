import type { OrderItem } from '@/services/api';

export function generateDefaultImeiSerial(productNameOrId?: string, unitCode?: string): string {
  const p = `${productNameOrId || ''}`.toLowerCase();
  const digits = String(unitCode || '').replace(/[^0-9]/g, '').slice(-7) || Math.floor(1000000 + Math.random() * 9000000).toString();

  let prefix = 'SN-MFG-';
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
  }
  return `${prefix}${digits}`;
}

export function ensureDeviceUnits(item: OrderItem): { code: string; manufacturerSerial: string }[] {
  const codes = item.serialNumbers?.length
    ? item.serialNumbers
    : item.serialNumber
    ? [item.serialNumber]
    : [`SN-DPC-${Date.now().toString().slice(-6)}-1`];

  const existingUnits = item.deviceUnits || [];

  return codes.map((code, idx) => {
    const found = existingUnits.find((u) => u.code === code) || existingUnits[idx];
    const mSerial = (found?.manufacturerSerial && found.manufacturerSerial.trim())
      ? found.manufacturerSerial.trim()
      : generateDefaultImeiSerial(item.name || item.productId, code);
    return {
      code,
      manufacturerSerial: mSerial,
    };
  });
}

export function formatUnitCodes(item: OrderItem): string {
  const units = ensureDeviceUnits(item);
  return units.map(unit => `${unit.code} (S/N: ${unit.manufacturerSerial})`).join('\n');
}

export function expandOrderUnits(items: OrderItem[]): (OrderItem & { serialNumber: string; manufacturerSerial: string })[] {
  return items.flatMap(item => {
    const units = ensureDeviceUnits(item);
    return units.map(unit => ({
      ...item,
      quantity: 1,
      serialNumber: unit.code,
      manufacturerSerial: unit.manufacturerSerial,
    }));
  });
}
