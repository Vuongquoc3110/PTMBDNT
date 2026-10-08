import { Ionicons } from '@expo/vector-icons';

export interface CategoryOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  category?: string;
  q?: string;
  filter?: string;
}

export const GEAR_CATEGORIES: CategoryOption[] = [
  { id: 'laptop', label: 'Laptop', icon: 'laptop-outline', category: 'laptop' },
  { id: 'laptop-gaming', label: 'Laptop Gaming', icon: 'game-controller-outline', category: 'laptop', q: 'gaming' },
  { id: 'pc-gaming', label: 'PC Gaming', icon: 'desktop-outline', category: 'gaming-pc' },
  { id: 'office-pc', label: 'PC Văn Phòng', icon: 'business-outline', category: 'office-pc' },
  { id: 'main-cpu-vga', label: 'Main, CPU, VGA', icon: 'hardware-chip-outline', category: 'cpu' },
  { id: 'case-psu-cooling', label: 'Case, Nguồn, Tản', icon: 'cube-outline', category: 'case-psu-cooling' },
  { id: 'ram-storage', label: 'Ổ cứng, RAM, Thẻ nhớ', icon: 'server-outline', category: 'ram' },
  { id: 'monitor', label: 'Màn hình', icon: 'tv-outline', category: 'monitor' },
  { id: 'keyboard', label: 'Bàn phím', icon: 'keypad-outline', category: 'keyboard' },
  { id: 'mouse', label: 'Chuột + Lót chuột', icon: 'disc-outline', category: 'mouse' },
  { id: 'headset', label: 'Tai Nghe', icon: 'headset-outline', category: 'headset' },
  { id: 'audio-cam', label: 'Loa, Micro, Webcam', icon: 'videocam-outline', category: 'audio-cam' },
  { id: 'desk-chair', label: 'Ghế - Bàn', icon: 'briefcase-outline', category: 'desk-chair' },
  { id: 'apple', label: 'Apple', icon: 'logo-apple', category: 'apple' },
  { id: 'accessories-console', label: 'Phụ kiện - Console', icon: 'hardware-chip-outline', category: 'accessories-console' },
];

export const normalizeCategory = (value: string) =>
  value.trim().toLowerCase().replace(/[\s_-]+/g, '');

/**
 * Hàm phân loại sản phẩm thuộc danh mục nào một cách chuẩn xác,
 * đồng bộ giữa Sidebar Trang chủ, Trang Phân loại, và Trang Sản phẩm.
 */
export function isProductInCategory(product: any, targetCategoryOrId: string): boolean {
  if (!product || !targetCategoryOrId) return false;

  const pCat = String(product.category || product.category_id || '').toLowerCase();
  const pName = String(product.name || '').toLowerCase();
  const pDesc = String(product.description || '').toLowerCase();
  const target = normalizeCategory(targetCategoryOrId);

  // Khớp chính xác category hoặc category_id
  if (normalizeCategory(pCat) === target) return true;

  switch (target) {
    case 'laptopgaming':
      return (
        (pCat.includes('laptop') || pCat.includes('lap')) &&
        (pName.includes('gaming') ||
          pName.includes('tuf') ||
          pName.includes('rog') ||
          pName.includes('nitro') ||
          pName.includes('legion') ||
          pName.includes('loq') ||
          pName.includes('helios') ||
          pName.includes('victus') ||
          pName.includes('predator') ||
          pName.includes('alienware') ||
          pDesc.includes('gaming'))
      );

    case 'laptop':
      return pCat.includes('laptop') || pCat.includes('lap');

    case 'pcgaming':
    case 'gamingpc':
      return (
        pCat.includes('gaming-pc') ||
        pCat.includes('gaming_pc') ||
        pCat.includes('gamingpc') ||
        (pCat.includes('pc') && (pName.includes('gaming') || pDesc.includes('gaming')))
      );

    case 'officepc':
      return (
        pCat.includes('office-pc') ||
        pCat.includes('office_pc') ||
        pCat.includes('officepc') ||
        (pCat.includes('pc') && !pName.includes('gaming') && !pDesc.includes('gaming'))
      );

    case 'maincpuvga':
    case 'cpu':
    case 'gpu':
    case 'vga':
    case 'mainboard':
      return (
        pCat.includes('cpu') ||
        pCat.includes('gpu') ||
        pCat.includes('mainboard') ||
        pCat.includes('vga') ||
        pCat.includes('bo mạch') ||
        pName.includes('cpu') ||
        pName.includes('intel core') ||
        pName.includes('ryzen') ||
        pName.includes('rtx') ||
        pName.includes('gtx') ||
        pName.includes('radeon') ||
        pName.includes('mainboard') ||
        pName.includes('bo mạch chủ')
      );

    case 'casepsucooling':
    case 'case':
    case 'psu':
    case 'cooling':
      return (
        pCat.includes('case') ||
        pCat.includes('psu') ||
        pCat.includes('cooling') ||
        pCat.includes('nguồn') ||
        pCat.includes('tản') ||
        pName.includes('vỏ case') ||
        pName.includes('case ') ||
        pName.includes('nguồn') ||
        pName.includes('psu') ||
        pName.includes('tản nhiệt') ||
        pName.includes('cooling') ||
        pName.includes('aio')
      );

    case 'ramstorage':
    case 'ram':
    case 'storage':
    case 'ssd':
    case 'hdd':
      return (
        pCat.includes('ram') ||
        pCat.includes('ssd') ||
        pCat.includes('storage') ||
        pCat.includes('hdd') ||
        pName.includes('ram') ||
        pName.includes('ddr4') ||
        pName.includes('ddr5') ||
        pName.includes('ssd') ||
        pName.includes('ổ cứng') ||
        pName.includes('thẻ nhớ')
      );

    case 'monitor':
      return pCat.includes('monitor') || pName.includes('màn hình') || pName.includes('monitor');

    case 'keyboard':
      return pCat.includes('keyboard') || pName.includes('bàn phím') || pName.includes('keyboard');

    case 'mouse':
      return (
        pCat.includes('mouse') ||
        pName.includes('chuột') ||
        pName.includes('lót chuột') ||
        pName.includes('pad chuột') ||
        pName.includes('mousepad')
      );

    case 'headset':
      return (
        pCat.includes('headset') ||
        pName.includes('tai nghe') ||
        pName.includes('headphone') ||
        pName.includes('earphone')
      );

    case 'audiocam':
      return (
        pCat.includes('audio') ||
        pCat.includes('webcam') ||
        pCat.includes('mic') ||
        pCat.includes('speaker') ||
        pCat.includes('loa') ||
        pName.includes('loa') ||
        pName.includes('soundbar') ||
        pName.includes('webcam') ||
        pName.includes('micro') ||
        pName.includes('mic ') ||
        pName.includes('elgato')
      );

    case 'deskchair':
      return (
        pCat.includes('chair') ||
        pCat.includes('desk') ||
        pCat.includes('ghế') ||
        pCat.includes('bàn') ||
        pName.includes('ghế') ||
        pName.includes('bàn nâng hạ') ||
        pName.includes('bàn gaming') ||
        pName.includes('bàn chữ z') ||
        pName.includes('bàn công thái học')
      );

    case 'apple':
      return (
        pCat.includes('apple') ||
        pName.includes('apple') ||
        pName.includes('macbook') ||
        pName.includes('mac mini') ||
        pName.includes('imac') ||
        pName.includes('mac studio') ||
        pName.includes('ipad') ||
        pName.includes('airpods') ||
        pName.includes('apple watch')
      );

    case 'accessoriesconsole':
    case 'accessories':
    case 'console':
      return (
        pCat.includes('accessories') ||
        pCat.includes('console') ||
        pCat.includes('phụ kiện') ||
        pName.includes('playstation') ||
        pName.includes('ps5') ||
        pName.includes('xbox') ||
        pName.includes('nintendo') ||
        pName.includes('tay cầm') ||
        pName.includes('controller') ||
        pName.includes('giá treo') ||
        pName.includes('hub') ||
        pName.includes('dock')
      );

    default:
      return pCat.includes(target) || pName.includes(target) || pDesc.includes(target);
  }
}
