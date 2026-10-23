import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { AdminSupportPanel } from '@/components/admin/AdminSupportPanel';
import { MonthlyReport } from '@/components/admin/MonthlyReport';
import { InvoiceModal } from '@/components/InvoiceModal';
import { ProductUnitsModal } from '@/components/ProductUnitsModal';
import { formatUnitCodes, ensureDeviceUnits } from '@/utils/deviceUnits';
import { playNotificationSound } from '@/utils/sound';
import { useAppContext } from '@/context/AppContext';
import { formatPrice, getProductFallbackImage, isInvalidOrBlockedImageUrl } from '@/data/products';
import { apiService, type Order, type User, type Voucher } from '@/services/api';

function getOrderDateKey(dateVal: any): string {
  if (!dateVal) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    return `${dateVal.getFullYear()}-${pad(dateVal.getMonth() + 1)}-${pad(dateVal.getDate())}`;
  }
  const s = String(dateVal).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const candidate = new Date(s.includes(' ') && !s.includes('T') ? s.replace(' ', 'T') : s);
    if (!isNaN(candidate.getTime())) {
      return `${candidate.getFullYear()}-${pad(candidate.getMonth() + 1)}-${pad(candidate.getDate())}`;
    }
    return `${m[1]}-${m[2]}-${m[3]}`;
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  return '';
}

type AdminTab = 'overview' | 'products' | 'orders' | 'vouchers' | 'categories' | 'users' | 'inventory' | 'support' | 'reports';

interface ProductItem {
  id: string;
  name: string;
  category_id?: string;
  category?: string;
  price: number;
  oldPrice?: number | null;
  discount?: number;
  rating?: number;
  stock?: number;
  image?: string;
  description?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  isHot?: boolean;
  isHidden?: boolean;
  specifications?: Record<string, string>;
}

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  icon: string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

function AdminProductThumb({
  image,
  product,
  style,
}: {
  image?: string;
  product?: any;
  style?: any;
}) {
  const fallback = product ? getProductFallbackImage(product) || DEFAULT_IMAGE : DEFAULT_IMAGE;
  const initial = image && !isInvalidOrBlockedImageUrl(image) ? image : fallback;
  const [imgUri, setImgUri] = useState(initial);

  useEffect(() => {
    const next = image && !isInvalidOrBlockedImageUrl(image) ? image : fallback;
    setImgUri(next);
  }, [image, fallback]);

  return (
    <Image
      source={{ uri: imgUri }}
      style={style}
      resizeMode="cover"
      onError={() => {
        if (imgUri !== fallback) {
          setImgUri(fallback);
        } else if (imgUri !== DEFAULT_IMAGE) {
          setImgUri(DEFAULT_IMAGE);
        }
      }}
      {...({ referrerPolicy: 'no-referrer' } as any)}
    />
  );
}

function getProductBrand(product: ProductItem) {
  return product.specifications?.['Thương hiệu'] || product.specifications?.Brand || product.name.split(' ')[0] || 'Khác';
}

const PRESET_CATEGORIES = [
  { id: 'laptop', label: 'Laptop Gaming', icon: '💻' },
  { id: 'pc', label: 'PC Gaming', icon: '🖥️' },
  { id: 'gpu', label: 'Card đồ họa RTX', icon: '🎮' },
  { id: 'cpu', label: 'CPU Intel / AMD', icon: '⚡' },
  { id: 'ram', label: 'RAM Bộ nhớ', icon: '🧠' },
  { id: 'ssd', label: 'Ổ cứng SSD', icon: '💾' },
  { id: 'monitor', label: 'Màn hình hiển thị', icon: '📺' },
  { id: 'gear', label: 'Gaming Gear', icon: '⌨️' },
];

const PRESET_PHOTOS = [
  { label: 'Laptop ROG', icon: '💻', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { label: 'PC LED RGB', icon: '🖥️', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Card RTX 4090', icon: '🎮', url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80' },
  { label: 'CPU Intel Core i9', icon: '⚡', url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80' },
  { label: 'Màn hình 4K', icon: '📺', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bàn phím cơ', icon: '⌨️', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chuột Gaming', icon: '🖱️', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tai nghe chụp tai', icon: '🎧', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80' },
];

export interface SpecFieldDefinition {
  key: string;
  label: string;
  placeholder: string;
  example: string;
}

export const CATEGORY_SPECS_CONFIG: Record<string, { title: string; icon: string; fields: SpecFieldDefinition[] }> = {
  laptop: {
    title: 'Thông số kỹ thuật – Laptop',
    icon: '💻',
    fields: [
      { key: 'CPU', label: 'CPU (Vi xử lý)', placeholder: 'VD: Intel Core i7-14700HX', example: 'Intel Core i7-14700HX' },
      { key: 'RAM', label: 'RAM', placeholder: 'VD: 16GB DDR5 5600MHz', example: '16GB DDR5 5600MHz' },
      { key: 'Ổ cứng', label: 'Ổ cứng', placeholder: 'VD: 1TB SSD NVMe PCIe 4.0', example: '1TB SSD NVMe PCIe 4.0' },
      { key: 'Card đồ họa', label: 'Card đồ họa (GPU)', placeholder: 'VD: NVIDIA RTX 4060 8GB', example: 'NVIDIA GeForce RTX 4060 8GB' },
      { key: 'Màn hình', label: 'Màn hình', placeholder: 'VD: 16 inch, 2.5K, 240Hz, 100% sRGB', example: '16 inch, 2.5K, 240Hz' },
      { key: 'Hệ điều hành', label: 'Hệ điều hành', placeholder: 'VD: Windows 11 Home bản quyền', example: 'Windows 11 Home bản quyền' },
      { key: 'Pin', label: 'Pin & Sạc', placeholder: 'VD: 90Wh, sạc nhanh 240W', example: '90Wh, sạc nhanh 240W' },
      { key: 'Trọng lượng', label: 'Trọng lượng', placeholder: 'VD: 2.2 kg', example: '2.2 kg' },
    ],
  },
  pc: {
    title: 'Thông số kỹ thuật – PC / Máy để bàn',
    icon: '🖥️',
    fields: [
      { key: 'CPU', label: 'CPU (Vi xử lý)', placeholder: 'VD: Intel Core i5-13400F', example: 'Intel Core i5-13400F (10 Nhân 16 Luồng)' },
      { key: 'Mainboard', label: 'Bo mạch chủ (Mainboard)', placeholder: 'VD: B760M Gaming Plus WiFi', example: 'MSI B760M Gaming Plus WiFi' },
      { key: 'RAM', label: 'RAM', placeholder: 'VD: 32GB (2x16GB) DDR5 6000MHz RGB', example: '32GB (2x16GB) DDR5 6000MHz' },
      { key: 'Ổ cứng', label: 'Ổ cứng SSD', placeholder: 'VD: 1TB SSD NVMe M.2 Gen4', example: '1TB SSD NVMe PCIe Gen4' },
      { key: 'Card đồ họa', label: 'Card đồ họa (VGA)', placeholder: 'VD: NVIDIA GeForce RTX 4070 12GB', example: 'NVIDIA GeForce RTX 4070 12GB' },
      { key: 'Nguồn', label: 'Nguồn máy tính (PSU)', placeholder: 'VD: 750W 80 Plus Gold', example: '750W 80 Plus Gold' },
      { key: 'Tản nhiệt', label: 'Tản nhiệt', placeholder: 'VD: Tản nước AIO 240mm ARGB', example: 'Tản nhiệt nước AIO 240mm ARGB' },
      { key: 'Vỏ case', label: 'Vỏ case', placeholder: 'VD: Bể cá kính cường lực Panoramic', example: 'Bể cá kính cường lực Panoramic' },
    ],
  },
  cpu: {
    title: 'Thông số kỹ thuật – CPU (Vi xử lý)',
    icon: '⚡',
    fields: [
      { key: 'Socket', label: 'Socket', placeholder: 'VD: LGA 1700 / AM5', example: 'LGA 1700' },
      { key: 'Số nhân & Luồng', label: 'Số nhân / Số luồng', placeholder: 'VD: 16 nhân (8P + 8E), 24 luồng', example: '16 nhân, 24 luồng' },
      { key: 'Xung nhịp', label: 'Xung nhịp cơ bản / Boost', placeholder: 'VD: 3.4 GHz - 5.4 GHz', example: '3.4 GHz Turbo 5.4 GHz' },
      { key: 'Bộ nhớ đệm', label: 'Bộ nhớ đệm (Cache)', placeholder: 'VD: 33MB Intel Smart Cache', example: '33MB Cache' },
      { key: 'Điện năng (TDP)', label: 'Công suất tiêu thụ (TDP)', placeholder: 'VD: 125W (Max 253W)', example: '125W (Max 253W)' },
      { key: 'Đồ họa tích hợp', label: 'Đồ họa tích hợp (iGPU)', placeholder: 'VD: Intel UHD Graphics 770 / Không có', example: 'Intel UHD Graphics 770' },
    ],
  },
  vga: {
    title: 'Thông số kỹ thuật – Card màn hình (VGA)',
    icon: '🎮',
    fields: [
      { key: 'Chipset', label: 'Chipset đồ họa', placeholder: 'VD: NVIDIA GeForce RTX 4070 Super', example: 'NVIDIA GeForce RTX 4070 Super' },
      { key: 'Dung lượng VRAM', label: 'Dung lượng VRAM', placeholder: 'VD: 12GB GDDR6X 192-bit', example: '12GB GDDR6X 192-bit' },
      { key: 'Xung nhịp Boost', label: 'Xung nhịp Boost', placeholder: 'VD: 2505 MHz (OC Mode: 2535 MHz)', example: '2505 MHz' },
      { key: 'Cổng xuất hình', label: 'Cổng xuất hình', placeholder: 'VD: 3x DisplayPort 1.4a, 1x HDMI 2.1a', example: '3x DisplayPort 1.4a, 1x HDMI 2.1a' },
      { key: 'Nguồn đề xuất', label: 'Nguồn đề xuất & Chân nguồn', placeholder: 'VD: 700W trở lên (1x 16-pin 12VHPWR)', example: '700W (1x 16-pin)' },
      { key: 'Kích thước', label: 'Kích thước & Số khe cắm', placeholder: 'VD: 269 x 120 x 42 mm (2.5 slot)', example: '269 x 120 x 42 mm (2.5 slot)' },
    ],
  },
  ram: {
    title: 'Thông số kỹ thuật – Bộ nhớ RAM',
    icon: '🧠',
    fields: [
      { key: 'Dung lượng', label: 'Dung lượng', placeholder: 'VD: 16GB (1x16GB) / 32GB (2x16GB)', example: '32GB (2x16GB)' },
      { key: 'Chuẩn RAM', label: 'Chuẩn RAM', placeholder: 'VD: DDR5 / DDR4', example: 'DDR5' },
      { key: 'Tốc độ Bus', label: 'Tốc độ Bus (MHz)', placeholder: 'VD: 5600MHz / 6000MHz', example: '6000MHz' },
      { key: 'Độ trễ (Timing)', label: 'Độ trễ (Timing / CL)', placeholder: 'VD: CL30 / CL36', example: 'CL30-36-36-76' },
      { key: 'Điện áp', label: 'Điện áp', placeholder: 'VD: 1.35V', example: '1.35V' },
      { key: 'Tản nhiệt & LED', label: 'Tản nhiệt & LED', placeholder: 'VD: Nhôm nguyên khối, LED RGB đa vùng', example: 'Nhôm tản nhiệt, LED RGB' },
    ],
  },
  ssd: {
    title: 'Thông số kỹ thuật – Ổ cứng SSD',
    icon: '💾',
    fields: [
      { key: 'Dung lượng', label: 'Dung lượng', placeholder: 'VD: 1TB / 2TB', example: '1TB' },
      { key: 'Chuẩn kết nối', label: 'Chuẩn giao tiếp', placeholder: 'VD: M.2 NVMe PCIe Gen 4.0 x4', example: 'M.2 NVMe PCIe 4.0 x4' },
      { key: 'Tốc độ đọc', label: 'Tốc độ đọc (Read)', placeholder: 'VD: Up to 7450 MB/s', example: '7450 MB/s' },
      { key: 'Tốc độ ghi', label: 'Tốc độ ghi (Write)', placeholder: 'VD: Up to 6900 MB/s', example: '6900 MB/s' },
      { key: 'Độ bền (TBW)', label: 'Độ bền (TBW)', placeholder: 'VD: 600 TBW', example: '600 TBW' },
      { key: 'Kích thước', label: 'Form Factor', placeholder: 'VD: M.2 2280', example: 'M.2 2280' },
    ],
  },
  monitor: {
    title: 'Thông số kỹ thuật – Màn hình',
    icon: '📺',
    fields: [
      { key: 'Kích thước', label: 'Kích thước màn hình', placeholder: 'VD: 27 inch / 32 inch', example: '27 inch' },
      { key: 'Độ phân giải', label: 'Độ phân giải', placeholder: 'VD: 2K QHD (2560 x 1440)', example: '2K QHD (2560 x 1440)' },
      { key: 'Tấm nền', label: 'Tấm nền (Panel)', placeholder: 'VD: Fast IPS / Nano IPS / OLED', example: 'Fast IPS' },
      { key: 'Tần số quét', label: 'Tần số quét', placeholder: 'VD: 180Hz / 240Hz', example: '180Hz' },
      { key: 'Thời gian đáp ứng', label: 'Thời gian phản hồi', placeholder: 'VD: 1ms (GTG)', example: '1ms (GTG)' },
      { key: 'Độ phủ màu', label: 'Độ phủ màu & Độ sáng', placeholder: 'VD: 99% sRGB, 95% DCI-P3, 400 nits', example: '99% sRGB, 400 nits HDR400' },
      { key: 'Cổng kết nối', label: 'Cổng xuất hình', placeholder: 'VD: 2x HDMI 2.0, 1x DP 1.4, Audio Out', example: '2x HDMI 2.0, 1x DP 1.4' },
    ],
  },
  gear: {
    title: 'Thông số kỹ thuật – Phụ kiện & Gaming Gear',
    icon: '⌨️',
    fields: [
      { key: 'Kết nối', label: 'Phương thức kết nối', placeholder: 'VD: Không dây 2.4GHz + Bluetooth + Cáp Type-C', example: 'Wireless 2.4GHz / Bluetooth / Type-C' },
      { key: 'Cảm biến / Switch', label: 'Cảm biến / Loại Switch', placeholder: 'VD: Cảm biến quang Focus Pro 30K / Switch cơ', example: 'Cảm biến quang 30K DPI' },
      { key: 'Thời lượng pin', label: 'Thời lượng pin', placeholder: 'VD: Lên đến 80 giờ liên tục', example: '80 giờ liên tục' },
      { key: 'Trọng lượng', label: 'Trọng lượng', placeholder: 'VD: 63g siêu nhẹ', example: '63g siêu nhẹ' },
      { key: 'Đèn LED', label: 'Đèn LED', placeholder: 'VD: RGB 16.8 triệu màu Chroma', example: 'RGB 16.8 triệu màu' },
      { key: 'Tương thích', label: 'Hệ thống tương thích', placeholder: 'VD: Windows, macOS, Android', example: 'Windows, macOS' },
    ],
  },
};

function getCategorySpecsTemplate(catId: string) {
  const c = (catId || '').toLowerCase();
  if (c.includes('lap') || c.includes('l360')) return CATEGORY_SPECS_CONFIG.laptop;
  if (c.includes('pc')) return CATEGORY_SPECS_CONFIG.pc;
  if (c.includes('cpu')) return CATEGORY_SPECS_CONFIG.cpu;
  if (c.includes('vga') || c.includes('gpu')) return CATEGORY_SPECS_CONFIG.vga;
  if (c.includes('ram')) return CATEGORY_SPECS_CONFIG.ram;
  if (c.includes('ssd') || c.includes('hdd') || c.includes('storage')) return CATEGORY_SPECS_CONFIG.ssd;
  if (c.includes('mon') || c.includes('screen') || c.includes('display')) return CATEGORY_SPECS_CONFIG.monitor;
  return CATEGORY_SPECS_CONFIG.gear;
}

type ProductModalTab = 'basic' | 'specs' | 'pricing' | 'media' | 'display';

const PRODUCT_MODAL_TABS: { id: ProductModalTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'basic', label: '1. Cơ bản', icon: 'information-circle-outline' },
  { id: 'specs', label: '2. Cấu hình', icon: 'hardware-chip-outline' },
  { id: 'pricing', label: '3. Giá & Kho', icon: 'pricetag-outline' },
  { id: 'media', label: '4. Hình ảnh', icon: 'image-outline' },
  { id: 'display', label: '5. Hiển thị', icon: 'eye-outline' },
];

export default function AdminScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;
  const isMobile = width < 600;
  const { user, isAdmin, isDark, logout } = useAppContext();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    logout();
    router.replace('/login');
  };

  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: '0',
  });

  // Data lists
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [voucherList, setVoucherList] = useState<Voucher[]>([]);

  // Search & Filters in tabs
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryQuantities, setInventoryQuantities] = useState<Record<string, string>>({});

  // Product specific filters
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'hidden'>('all');
  const [productSortBy, setProductSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'stock_desc'>('default');

  // Order specific filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [returnSubFilter, setReturnSubFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Viewing Order Detail Modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [invoicePreview, setInvoicePreview] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  // Unit & IMEI Serial Modal
  const [unitProduct, setUnitProduct] = useState<{ id: string; name: string } | null>(null);
  const [unitCodes, setUnitCodes] = useState<string[] | undefined>();

  // Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productModalTab, setProductModalTab] = useState<ProductModalTab>('basic');
  const [productSpecsForm, setProductSpecsForm] = useState<Record<string, string>>({});
  const [customSpecsList, setCustomSpecsList] = useState<Array<{ id: string; key: string; value: string }>>([]);
  const [productFlags, setProductFlags] = useState({
    isNew: true,
    isHot: true,
    isFeatured: false,
    isHidden: false,
  });
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category_id: 'laptop',
    price: '',
    oldPrice: '',
    stock: '',
    image: '',
    description: '',
  });

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', count: '0', icon: '💻' });
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Voucher Modal
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discount: '',
    minOrder: '',
    label: '',
    expiryDate: '2026-12-31',
  });

  // Loading flags for modals
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isSavingVoucher, setIsSavingVoucher] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);

  // User Management & Role Filter
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'staff' | 'customer'>('all');
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'staff' as 'admin' | 'staff' | 'customer',
    address: '',
    city: '',
  });

  // Delete Confirm Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'product' | 'order' | 'category' | 'user' | 'voucher';
    id: string | number;
    title: string;
  } | null>(null);

  // Quản lý xuất & in hóa đơn bán lẻ
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Bộ lọc phân tích doanh thu theo Ngày, Tháng, Năm
  const [revenuePeriod, setRevenuePeriod] = useState<'day' | 'month' | 'year' | 'all'>('all');
  const [revenueChartMode, setRevenueChartMode] = useState<'day' | 'day_7' | 'day_30' | 'month' | 'year' | 'range'>('month');
  const [chartSingleDate, setChartSingleDate] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [chartViewType, setChartViewType] = useState<'bar' | 'line'>('bar');
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);
  const [showDetailNotice, setShowDetailNotice] = useState<boolean>(true);
  const [chartCustomMonth, setChartCustomMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [chartCustomYear, setChartCustomYear] = useState<number>(() => new Date().getFullYear());
  const [chartRangeStart, setChartRangeStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [chartRangeEnd, setChartRangeEnd] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [chartTableOnlyActive, setChartTableOnlyActive] = useState<boolean>(false);
  const [revenueStatusMode, setRevenueStatusMode] = useState<'completed' | 'all_active'>('completed');
  const [selectedSpecificDate, setSelectedSpecificDate] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [selectedSpecificMonth, setSelectedSpecificMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedSpecificYear, setSelectedSpecificYear] = useState<number>(() => new Date().getFullYear());

  const dateScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);

  const scrollDatePills = (delta: number) => {
    if (dateScrollRef.current) {
      if (Platform.OS === 'web') {
        const node = (dateScrollRef.current as any)?.getScrollableNode?.() || (dateScrollRef.current as any);
        if (node && typeof node.scrollBy === 'function') {
          node.scrollBy({ left: delta, behavior: 'smooth' });
          return;
        }
      }
      (dateScrollRef.current as any)?.scrollTo?.({ x: delta > 0 ? 300 : 0, animated: true });
    }
  };

  const scrollMonthPills = (delta: number) => {
    if (monthScrollRef.current) {
      if (Platform.OS === 'web') {
        const node = (monthScrollRef.current as any)?.getScrollableNode?.() || (monthScrollRef.current as any);
        if (node && typeof node.scrollBy === 'function') {
          node.scrollBy({ left: delta, behavior: 'smooth' });
          return;
        }
      }
      (monthScrollRef.current as any)?.scrollTo?.({ x: delta > 0 ? 300 : 0, animated: true });
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  // Helper adjustment
  const adjustStock = (delta: number) => {
    const current = parseInt(productForm.stock || '0', 10) || 0;
    const next = Math.max(0, current + delta);
    setProductForm((prev) => ({ ...prev, stock: next.toString() }));
  };

  const adjustPrice = (field: 'price' | 'oldPrice', delta: number) => {
    const current = parseInt(productForm[field] || '0', 10) || 0;
    const next = Math.max(0, current + delta);
    setProductForm((prev) => ({ ...prev, [field]: next.toString() }));
  };

  const setMarkupOldPrice = (percent: number) => {
    const currentPrice = parseInt(productForm.price || '0', 10) || 0;
    if (currentPrice > 0) {
      if (percent === 0) {
        setProductForm((prev) => ({ ...prev, oldPrice: currentPrice.toString() }));
      } else {
        const calculated = Math.round((currentPrice * (1 + percent / 100)) / 10000) * 10000;
        setProductForm((prev) => ({ ...prev, oldPrice: calculated.toString() }));
      }
    }
  };

  const regenerateId = () => {
    const autoId = `prod-${Date.now().toString().slice(-6)}`;
    setProductForm((prev) => ({ ...prev, id: autoId }));
  };

  // Đồng bộ số lượng sản phẩm theo danh mục cục bộ
  const syncCategoryCounts = (prods: ProductItem[]) => {
    setCategoryList((prev) =>
      prev.map((c) => ({
        ...c,
        count: prods.filter((p) => (p.category_id || p.category) === c.id && !p.isHidden).length,
      }))
    );
  };

  // Load all admin data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      
      // Thử tải từ API server
      let [statsData, productsData, ordersData, categoriesData, usersData, vouchersData] = await Promise.all([
        apiService.request<{
          totalProducts: number;
          totalOrders: number;
          totalUsers: number;
          totalRevenue: number | string;
        }>('/admin/stats').catch(() => null),
        apiService.request<ProductItem[]>('/products?admin=true&limit=500').catch(() => null),
        apiService.request<Order[]>('/orders').catch(() => null),
        apiService.request<CategoryItem[]>('/categories').catch(() => null),
        apiService.request<User[]>('/users').catch(() => null),
        apiService.getVouchers().catch(() => null),
      ]);

      if (productsData === null && ordersData === null && categoriesData === null) {
        setLoadError('Không thể kết nối đến API máy chủ (Port 5000). Đang hiển thị dữ liệu bộ nhớ đệm / mẫu ngoại tuyến.');
      }

      // Chỉ fallback dữ liệu mẫu khi server không phản hồi (null)
      const validProducts: ProductItem[] = Array.isArray(productsData)
        ? productsData
        : (await apiService.getProducts({ limit: 500 }).catch(() => [])) as ProductItem[];

      // Hợp nhất đơn hàng từ MySQL và dpc_local_orders (đặt hàng khi offline/fallback) để không bao giờ bị sót đơn
      let serverOrders: Order[] = Array.isArray(ordersData) ? ordersData : [];
      let localSavedOrders: Order[] = [];
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const raw = window.localStorage.getItem('dpc_local_orders');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) localSavedOrders = parsed;
          }
        } catch {}
      }

      const orderMap = new Map<string, Order>();
      localSavedOrders.forEach((o) => {
        const k = o.orderNumber || String(o.id);
        orderMap.set(k, o);
      });
      serverOrders.forEach((o) => {
        const k = o.orderNumber || String(o.id);
        orderMap.set(k, o);
      });
      const validOrders: Order[] = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      const validCategories: CategoryItem[] = Array.isArray(categoriesData)
        ? categoriesData
        : await apiService.getCategories().catch(() => []);

      const validUsers: User[] = Array.isArray(usersData)
        ? usersData
        : await apiService.getAllUsers().catch(() => []);

      const validVouchers: Voucher[] = Array.isArray(vouchersData)
        ? vouchersData
        : await apiService.getVouchers().catch(() => []);

      const totalRev = statsData?.totalRevenue ?? validOrders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

      setStats({
        totalProducts: statsData?.totalProducts ?? validProducts.length,
        totalOrders: Math.max(statsData?.totalOrders ?? 0, validOrders.length),
        totalUsers: statsData?.totalUsers ?? validUsers.length,
        totalRevenue: String(totalRev),
      });

      setProductList(validProducts);
      setOrderList(validOrders);
      setCategoryList(validCategories);
      setUserList(validUsers);
      setVoucherList(validVouchers);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      const message = err instanceof Error ? err.message : 'Lỗi kết nối';
      setLoadError(`Không thể tải dữ liệu: ${message}`);
      showToast('Lỗi tải dữ liệu máy chủ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, loadData]);

  // Đồng bộ đơn hàng thời gian thực: Polling ngầm mỗi 5 giây, BroadcastChannel & CustomEvent
  useEffect(() => {
    if (!isAdmin) return;

    const syncOrdersSilently = async () => {
      try {
        const freshOrders = await apiService.request<Order[]>('/orders').catch(() => null);
        let localSavedOrders: Order[] = [];
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const raw = window.localStorage.getItem('dpc_local_orders');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) localSavedOrders = parsed;
            }
          } catch {}
        }
        const serverList = Array.isArray(freshOrders) ? freshOrders : [];
        const orderMap = new Map<string, Order>();
        localSavedOrders.forEach((o) => {
          const k = o.orderNumber || String(o.id);
          orderMap.set(k, o);
        });
        serverList.forEach((o) => {
          const k = o.orderNumber || String(o.id);
          orderMap.set(k, o);
        });
        const merged = Array.from(orderMap.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );

        setOrderList((prev) => {
          if (prev.length !== merged.length || prev[0]?.orderNumber !== merged[0]?.orderNumber) {
            if (prev.length > 0 && merged.length > prev.length) {
              playNotificationSound();
              showToast(`🔔 Vừa nhận thêm ${merged.length - prev.length} đơn hàng mới!`);
            }
            return merged;
          }
          return prev;
        });
      } catch {}
    };

    const interval = setInterval(syncOrdersSilently, 5000);

    const handleOrderEvent = () => {
      loadData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('dpc_order_created', handleOrderEvent);
      window.addEventListener('dpc_order_updated', handleOrderEvent);
      window.addEventListener('focus', handleOrderEvent);

      let bc: BroadcastChannel | null = null;
      try {
        bc = new BroadcastChannel('dpc_order_sync');
        bc.onmessage = (ev) => {
          if (ev.data?.type === 'order_created' || ev.data?.type === 'order_updated') {
            loadData();
          }
        };
      } catch {}

      return () => {
        clearInterval(interval);
        window.removeEventListener('dpc_order_created', handleOrderEvent);
        window.removeEventListener('dpc_order_updated', handleOrderEvent);
        window.removeEventListener('focus', handleOrderEvent);
        if (bc) bc.close();
      };
    }

    return () => clearInterval(interval);
  }, [isAdmin, loadData]);

  // Số tin nhắn hỗ trợ đang chờ xử lý (hiển thị badge trên tab)
  const [supportPendingCount, setSupportPendingCount] = useState(0);
  useEffect(() => {
    if (!isAdmin) return;
    const fetchPending = () =>
      apiService
        .getSupportTickets('open')
        .then((list) => setSupportPendingCount(Array.isArray(list) ? list.length : 0))
        .catch(() => {});
    fetchPending();
    const timer = setInterval(fetchPending, 15000);
    return () => clearInterval(timer);
  }, [isAdmin]);

  // Product Actions
  const handleOpenAddProduct = () => {
    const autoId = `prod-${Date.now().toString().slice(-6)}`;
    setEditingProduct(null);
    setProductModalTab('basic');
    setProductSpecsForm({});
    setCustomSpecsList([]);
    setProductFlags({
      isNew: true,
      isHot: true,
      isFeatured: false,
      isHidden: false,
    });
    setProductForm({
      id: autoId,
      name: '',
      category_id: categoryList[0]?.id || 'laptop',
      price: '',
      oldPrice: '',
      stock: '20',
      image: PRESET_PHOTOS[0].url,
      description: '',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProductModalTab('basic');
    setProductForm({
      id: prod.id,
      name: prod.name,
      category_id: prod.category_id || prod.category || 'laptop',
      price: prod.price?.toString() || '',
      oldPrice: prod.oldPrice?.toString() || '',
      stock: (prod.stock ?? 15).toString(),
      image: prod.image || '',
      description: prod.description || '',
    });
    setProductFlags({
      isNew: prod.isNew ?? true,
      isHot: prod.isHot ?? true,
      isFeatured: prod.isFeatured ?? false,
      isHidden: prod.isHidden ?? false,
    });

    // Phân tích và tải cấu hình kỹ thuật vào form
    let specs = prod.specifications || {};
    if (typeof specs === 'string') {
      try {
        specs = JSON.parse(specs);
      } catch {
        specs = {};
      }
    }
    const template = getCategorySpecsTemplate(prod.category_id || prod.category || 'laptop');
    const templateKeys = new Set(template.fields.map((f) => f.key.toLowerCase()));
    const standardSpecs: Record<string, string> = {};
    const customList: Array<{ id: string; key: string; value: string }> = [];

    Object.entries(specs).forEach(([k, v]) => {
      const matchedField = template.fields.find(
        (f) => f.key.toLowerCase() === k.toLowerCase() || f.label.toLowerCase() === k.toLowerCase()
      );
      if (matchedField) {
        standardSpecs[matchedField.key] = String(v);
      } else {
        customList.push({ id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, key: k, value: String(v) });
      }
    });

    setProductSpecsForm(standardSpecs);
    setCustomSpecsList(customList);
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (prod: ProductItem) => {
    const newId = `prod-${Date.now().toString().slice(-6)}`;
    setEditingProduct(null);
    setProductModalTab('basic');
    setProductForm({
      id: newId,
      name: `${prod.name} (Bản sao)`,
      category_id: prod.category_id || prod.category || 'laptop',
      price: prod.price?.toString() || '',
      oldPrice: prod.oldPrice?.toString() || '',
      stock: (prod.stock ?? 10).toString(),
      image: prod.image || '',
      description: prod.description || '',
    });
    setProductFlags({
      isNew: true,
      isHot: true,
      isFeatured: false,
      isHidden: false,
    });
    let dupSpecs = prod.specifications ? { ...prod.specifications } : {};
    if (typeof prod.specifications === 'string') {
      try {
        dupSpecs = JSON.parse(prod.specifications);
      } catch {
        dupSpecs = {};
      }
    }
    setProductSpecsForm(dupSpecs);
    setCustomSpecsList([]);
    setIsProductModalOpen(true);
    showToast('Đã sao chép cấu hình sản phẩm');
  };

  // Helper thao tác cấu hình máy tính
  const handleDemoFillSpecs = () => {
    const template = getCategorySpecsTemplate(productForm.category_id);
    const demoSpecs: Record<string, string> = { ...productSpecsForm };
    template.fields.forEach((f) => {
      demoSpecs[f.key] = f.example;
    });
    setProductSpecsForm(demoSpecs);
    showToast(`Đã điền cấu hình mẫu cho "${template.title}"`);
  };

  const handleClearSpecs = () => {
    setProductSpecsForm({});
    setCustomSpecsList([]);
    showToast('Đã làm trống thông số kỹ thuật');
  };

  const handleQuickFillSingleSpec = (key: string, exampleVal: string) => {
    setProductSpecsForm((prev) => ({ ...prev, [key]: exampleVal }));
  };

  const handleAddCustomSpec = () => {
    setCustomSpecsList((prev) => [
      ...prev,
      { id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, key: '', value: '' },
    ]);
  };

  const handleRemoveCustomSpec = (id: string) => {
    setCustomSpecsList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateCustomSpec = (id: string, field: 'key' | 'value', text: string) => {
    setCustomSpecsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: text } : item))
    );
  };

  const handleGenerateDescriptionFromSpecs = () => {
    const parts: string[] = [];
    const template = getCategorySpecsTemplate(productForm.category_id);
    template.fields.forEach((f) => {
      const val = productSpecsForm[f.key];
      if (val && val.trim()) {
        parts.push(`${f.key}: ${val.trim()}`);
      }
    });
    customSpecsList.forEach((c) => {
      if (c.key && c.key.trim() && c.value && c.value.trim()) {
        parts.push(`${c.key.trim()}: ${c.value.trim()}`);
      }
    });

    if (parts.length === 0) {
      showToast('Chưa có thông số nào được nhập để tạo mô tả');
      return;
    }
    const generated = parts.join(' | ');
    setProductForm((prev) => ({ ...prev, description: generated }));
    showToast('✨ Đã tự động tạo mô tả từ cấu hình!');
  };

  const handleNavigateModalTab = (direction: 'next' | 'prev') => {
    const tabKeys: ProductModalTab[] = ['basic', 'specs', 'pricing', 'media', 'display'];
    const currentIndex = tabKeys.indexOf(productModalTab);
    if (direction === 'next' && currentIndex < tabKeys.length - 1) {
      setProductModalTab(tabKeys[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setProductModalTab(tabKeys[currentIndex - 1]);
    }
  };

  const toggleProductVisibility = async (prod: ProductItem) => {
    try {
      setLoading(true);
      await apiService.updateProduct(prod.id, { ...prod, isHidden: !prod.isHidden } as any);
      const updated = productList.map((p) => (p.id === prod.id ? { ...p, isHidden: !p.isHidden } : p));
      setProductList(updated);
      syncCategoryCounts(updated);
      showToast(!prod.isHidden ? `Đã ẩn "${prod.name}"` : `Đã hiện lại "${prod.name}"`);
    } catch {
      showToast('Lỗi khi cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    const priceNum = Number(productForm.price);
    const oldPriceNum = productForm.oldPrice ? Number(productForm.oldPrice) : 0;
    const stockNum = Number(productForm.stock);
    const categoryId = productForm.category_id.trim();

    if (!productForm.name.trim() || !productForm.price.trim()) {
      showToast('Vui lòng nhập tên và giá sản phẩm');
      setProductModalTab('basic');
      return;
    }
    if (!editingProduct && !productForm.id.trim()) {
      showToast('Vui lòng nhập mã sản phẩm');
      setProductModalTab('basic');
      return;
    }
    if (!editingProduct && productList.some((product) => product.id === productForm.id.trim())) {
      showToast('Mã sản phẩm đã tồn tại. Vui lòng tạo mã khác.');
      setProductModalTab('basic');
      return;
    }
    if (!Number.isSafeInteger(priceNum) || priceNum <= 0) {
      showToast('Giá bán phải lớn hơn 0');
      setProductModalTab('pricing');
      return;
    }
    if (productForm.oldPrice && (!Number.isSafeInteger(oldPriceNum) || oldPriceNum <= priceNum)) {
      showToast('Giá gốc phải lớn hơn giá bán để tạo khuyến mãi');
      setProductModalTab('pricing');
      return;
    }
    if (!Number.isSafeInteger(stockNum) || stockNum < 0) {
      showToast('Số lượng tồn kho không được âm');
      setProductModalTab('pricing');
      return;
    }

    // Tổng hợp thông số kỹ thuật (chuẩn hóa các trường rỗng)
    const finalSpecs: Record<string, string> = {};
    Object.entries(productSpecsForm).forEach(([k, v]) => {
      if (v && v.trim()) {
        finalSpecs[k.trim()] = v.trim();
      }
    });
    customSpecsList.forEach((item) => {
      if (item.key && item.key.trim() && item.value && item.value.trim()) {
        finalSpecs[item.key.trim()] = item.value.trim();
      }
    });

    const payload = {
      name: productForm.name.trim(),
      category_id: categoryId,
      price: priceNum,
      oldPrice: oldPriceNum || null,
      discount: oldPriceNum > priceNum ? Math.round((1 - priceNum / oldPriceNum) * 100) : 0,
      isSale: oldPriceNum > priceNum,
      isNew: productFlags.isNew,
      isHot: productFlags.isHot,
      isFeatured: productFlags.isFeatured,
      isHidden: productFlags.isHidden,
      stock: stockNum,
      image: productForm.image.trim() || DEFAULT_IMAGE,
      description: productForm.description.trim(),
      specifications: finalSpecs,
    };

    try {
      setIsSavingProduct(true);
      if (editingProduct) {
        await apiService.updateProduct(editingProduct.id, payload);
        const updated = productList.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p));
        setProductList(updated);
        syncCategoryCounts(updated);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('dpc_product_updated'));
        }
        showToast(`Đã cập nhật "${productForm.name}"`);
      } else {
        const newProduct = {
          id: productForm.id.trim(),
          ...payload,
          rating: 5,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
        };
        await apiService.createProduct(newProduct);
        const updated = [newProduct as any, ...productList];
        setProductList(updated);
        syncCategoryCounts(updated);
        setStats((prev) => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('dpc_product_updated'));
        }
        showToast(`Đã thêm "${productForm.name}" thành công!`);
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      showToast('Lỗi khi lưu sản phẩm: ' + (err.message || 'Thất bại'));
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Chọn ảnh sản phẩm từ máy tính / thiết bị (hỗ trợ nén Canvas & lưu trữ máy chủ)
  const handlePickProductImage = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
          showToast('Ảnh quá lớn (>10MB). Vui lòng chọn ảnh nhỏ hơn.');
          return;
        }

        setIsUploadingImage(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
          const rawDataUrl = event.target?.result as string;
          if (!rawDataUrl) {
            setIsUploadingImage(false);
            return;
          }

          const img = document.createElement('img');
          img.onload = async () => {
            let width = img.width;
            let height = img.height;
            const maxDim = 1200;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

            try {
              const res = await apiService.uploadImage(compressedDataUrl, productForm.name || 'product');
              if (res?.url) {
                setProductForm((prev) => ({ ...prev, image: res.url }));
                showToast('✅ Đã tải ảnh lên máy chủ thành công!');
              } else {
                setProductForm((prev) => ({ ...prev, image: compressedDataUrl }));
                showToast('✅ Đã chọn ảnh từ máy!');
              }
            } catch {
              setProductForm((prev) => ({ ...prev, image: compressedDataUrl }));
              showToast('✅ Đã chọn ảnh từ máy!');
            } finally {
              setIsUploadingImage(false);
            }
          };
          img.onerror = () => {
            setProductForm((prev) => ({ ...prev, image: rawDataUrl }));
            setIsUploadingImage(false);
            showToast('✅ Đã chọn ảnh từ máy!');
          };
          img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
      };
      input.click();
    } else {
      showToast('Chọn ảnh từ tệp tin tối ưu trên trình duyệt Web.');
    }
  };

  // Order Actions
  const ALLOWED_ORDER_TRANSITIONS: Record<string, string[]> = {
    pending: ['confirmed', 'shipping', 'cancelled'],
    confirmed: ['shipping', 'completed', 'cancelled'],
    shipping: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    const currentOrder = orderList.find((order) => order.id === orderId);
    if (!currentOrder || currentOrder.status === newStatus || updatingOrderId !== null) return;

    // Chặn tuyệt đối nếu đơn hàng đã hoàn tất (giao thành công) hoặc đã hủy
    if (currentOrder.status === 'completed' || currentOrder.status === 'cancelled') {
      showToast(
        `Đơn hàng đã ${currentOrder.status === 'completed' ? 'giao thành công' : 'hủy'}, trạng thái đã được khóa vĩnh viễn!`
      );
      return;
    }

    // Chặn đi lùi quy trình (ví dụ: đang giao không thể lùi về đã xác nhận hay chờ duyệt)
    const allowedTransitions = ALLOWED_ORDER_TRANSITIONS[currentOrder.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      showToast(
        `Không thể chuyển ngược từ "${getStatusLabel(currentOrder.status)}" về "${getStatusLabel(newStatus)}"!`
      );
      return;
    }

    // Hỏi xác nhận trước khi chốt đơn vào trạng thái kết thúc (completed hoặc cancelled)
    if (newStatus === 'completed' || newStatus === 'cancelled') {
      const orderCode = currentOrder.orderNumber || `#${orderId}`;
      const isCompleted = newStatus === 'completed';
      const confirmMsg = isCompleted
        ? `Xác nhận đơn hàng ${orderCode} "Đã giao thành công"?\n\nLưu ý: Sau khi hoàn thành, đơn hàng sẽ được khóa cố định và không thể thay đổi hay hủy nữa!`
        : `Xác nhận HỦY đơn hàng ${orderCode}?\n\nLưu ý: Giao dịch sẽ bị đóng vĩnh viễn và không thể khôi phục hay thay đổi nữa!`;

      if (typeof window !== 'undefined') {
        const ok = window.confirm(confirmMsg);
        if (!ok) return;
      }
    }

    try {
      setUpdatingOrderId(orderId);
      await apiService.updateOrderStatus(currentOrder.id || currentOrder.orderNumber || orderId, newStatus);
      setOrderList((prev) =>
        prev.map((o) =>
          String(o.id) === String(orderId) || (currentOrder.orderNumber && o.orderNumber === currentOrder.orderNumber)
            ? { ...o, status: newStatus }
            : o
        )
      );
      if (viewingOrder && (String(viewingOrder.id) === String(orderId) || (currentOrder.orderNumber && viewingOrder.orderNumber === currentOrder.orderNumber))) {
        setViewingOrder({ ...viewingOrder, status: newStatus });
      }
      showToast(`Đơn #${currentOrder.orderNumber || orderId} chuyển sang: ${getStatusLabel(newStatus)}`);
      setTimeout(() => loadData(), 400);
    } catch (err: any) {
      showToast('Lỗi đổi trạng thái đơn: ' + err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Xử lý duyệt / từ chối yêu cầu đổi trả / bảo hành từ khách
  const handleUpdateReturnStatus = async (orderId: string | number, status: 'approved' | 'rejected') => {
    const currentOrder = orderList.find(
      (o) => String(o.id) === String(orderId) || (o.orderNumber && o.orderNumber === String(orderId))
    );
    const orderCode = currentOrder?.orderNumber || `#${orderId}`;

    if (typeof window !== 'undefined') {
      const confirmMsg =
        status === 'approved'
          ? `Xác nhận DUYỆT yêu cầu đổi trả / bảo hành cho đơn ${orderCode}?\n\nKhách hàng sẽ nhận được thông báo chấp thuận đổi mới sản phẩm.`
          : `Xác nhận TỪ CHỐI yêu cầu đổi trả cho đơn ${orderCode}?`;
      if (!window.confirm(confirmMsg)) return;
    }

    try {
      setLoading(true);
      await apiService.updateReturnStatus(currentOrder?.id || currentOrder?.orderNumber || orderId, status);
      setOrderList((prev) =>
        prev.map((o) =>
          String(o.id) === String(orderId) || (currentOrder?.orderNumber && o.orderNumber === currentOrder.orderNumber)
            ? {
                ...o,
                returnStatus: status,
                // Khi duyệt đổi trả → đổi status đơn thành cancelled để trừ doanh số ngay lập tức
                ...(status === 'approved' ? { status: 'cancelled' } : {}),
              }
            : o
        )
      );
      if (
        viewingOrder &&
        (String(viewingOrder.id) === String(orderId) ||
          (currentOrder?.orderNumber && viewingOrder.orderNumber === currentOrder.orderNumber))
      ) {
        setViewingOrder({
          ...viewingOrder,
          returnStatus: status,
          ...(status === 'approved' ? { status: 'cancelled' } : {}),
        });
      }
      showToast(
        status === 'approved'
          ? `Đã duyệt đổi trả đơn #${currentOrder?.orderNumber || orderId} — doanh số đã được trừ`
          : `Đã từ chối yêu cầu đổi trả đơn #${currentOrder?.orderNumber || orderId}`
      );
      setTimeout(() => loadData(), 400);
    } catch (err: any) {
      showToast('Lỗi cập nhật đổi trả: ' + (err.message || 'Thất bại'));
    } finally {
      setLoading(false);
    }
  };

  const getWarrantyRangeForItem = (orderCreatedAt?: string, it?: any) => {
    const nameLower = (it?.name || '').toLowerCase();
    let months = it?.warrantyMonths || 24;
    if (!it?.warrantyMonths) {
      if (nameLower.includes('laptop') || nameLower.includes('macbook')) months = 24;
      else if (nameLower.includes('màn hình') || nameLower.includes('pc') || nameLower.includes('vga') || nameLower.includes('rtx')) months = 36;
      else if (nameLower.includes('chuột') || nameLower.includes('bàn phím') || nameLower.includes('tai nghe')) months = 12;
    }
    const orderDate = orderCreatedAt ? new Date(orderCreatedAt) : new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formatD = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    const purchaseStr = it?.purchaseDate || formatD(orderDate);
    const expDate = new Date(orderDate);
    expDate.setMonth(expDate.getMonth() + months);
    const expiryStr = it?.warrantyExpiry || formatD(expDate);
    return {
      months,
      purchaseStr,
      expiryStr,
      range: it?.warrantyRange || `${purchaseStr} đến ${expiryStr}`,
    };
  };

  // In Phiếu Tiếp Nhận & Thẩm Định Bảo Hành / Đổi Trả
  const handlePrintWarrantyReceipt = (order: Order) => {
    if (typeof window === 'undefined') return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Vui lòng cho phép popup trình duyệt để in phiếu');
      return;
    }

    const itemsHtml = (order.items || [])
      .map((it, idx) => {
        const w = getWarrantyRangeForItem(order.createdAt, it);
        return `
          <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td>
              <strong>${it.name}</strong>
              <div style="font-size: 11px; color: #16a34a; margin-top: 3px;">
                🛡️ Thời hạn BH dự kiến: <strong>${w.range}</strong> (${w.months} Tháng)
              </div>
            </td>
            <td style="text-align: center;">${it.quantity}</td>
            <td style="text-align: right;">${Number(it.price).toLocaleString('vi-VN')} đ</td>
            <td style="text-align: right;"><strong>${(it.price * it.quantity).toLocaleString('vi-VN')} đ</strong></td>
          </tr>
        `;
      })
      .join('');

    const statusText =
      order.returnStatus === 'approved'
        ? '<span style="color: #16a34a; font-weight: bold;">ĐÃ CHẤP THUẬN ĐỔI MỚI 1-1 CHÍNH HÃNG</span>'
        : order.returnStatus === 'pending'
        ? '<span style="color: #d97706; font-weight: bold;">ĐANG XÉT DUYỆT BẢO HÀNH</span>'
        : '<span style="color: #dc2626; font-weight: bold;">TỪ CHỐI BẢO HÀNH</span>';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Phiếu Bảo Hành & Đổi Trả #${order.orderNumber || order.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 28px; color: #1e293b; line-height: 1.5; font-size: 13px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #dc2626; padding-bottom: 14px; margin-bottom: 18px; }
          .brand { font-size: 22px; font-weight: 800; color: #dc2626; }
          .title { text-align: center; font-size: 18px; font-weight: 800; text-transform: uppercase; margin: 16px 0; color: #0f172a; }
          .info-table { width: 100%; margin-bottom: 16px; border-collapse: collapse; }
          .info-table td { padding: 5px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
          .items-table th, .items-table td { border: 1px solid #cbd5e1; padding: 8px 10px; }
          .items-table th { background: #f8fafc; font-weight: 700; text-align: left; }
          .fault-box { background: #fffbeb; border: 1px solid #fde047; padding: 12px; border-radius: 8px; margin-bottom: 18px; }
          .sign-row { display: flex; justify-content: space-between; margin-top: 36px; text-align: center; }
          .sign-col { width: 45%; }
          .sign-space { height: 75px; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">DANGVINHPC</div>
            <div style="font-size: 12px; color: #64748b;">Trung tâm phân phối linh kiện PC & Máy tính Gaming</div>
            <div style="font-size: 12px; color: #64748b;">Hotline CSKH: 1800 6868 • Kỹ thuật: 0909 123 456</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-size: 13px;">BIÊN BẢN TIẾP NHẬN BẢO HÀNH</div>
            <div style="color: #64748b;">Mã RMA: #${order.orderNumber || order.id}</div>
            <div style="color: #64748b;">Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</div>
          </div>
        </div>

        <div class="title">BIÊN BẢN BẢO HÀNH & ĐỔI TRẢ THIẾT BỊ</div>

        <table class="info-table">
          <tr>
            <td style="width: 50%;"><strong>Khách hàng:</strong> ${order.shippingAddress?.split(',')[0] || 'Khách hàng'}</td>
            <td><strong>Mã đơn mua gốc:</strong> #${order.orderNumber || order.id}</td>
          </tr>
          <tr>
            <td><strong>Địa chỉ / Liên hệ:</strong> ${order.shippingAddress || 'Chưa cung cấp'}</td>
            <td><strong>Ngày mua:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'Gần đây'}</td>
          </tr>
          <tr>
            <td><strong>Thẩm định lỗi:</strong> ${statusText}</td>
            <td><strong>Hình thức:</strong> Đổi mới sản phẩm 1-1</td>
          </tr>
        </table>

        <div class="fault-box">
          <div style="font-weight: 700; color: #b45309; margin-bottom: 3px;">⚠️ TÌNH TRẠNG LỖI GHI NHẬN KHI TIẾP NHẬN:</div>
          <div style="color: #78350f;">${order.returnReason || 'Sản phẩm lỗi kỹ thuật / nứt vỡ, móp méo khi vận chuyển'}</div>
        </div>

        <div style="font-weight: 700; margin-bottom: 6px;">DANH SÁCH SẢN PHẨM BẢO HÀNH:</div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">STT</th>
              <th>Tên sản phẩm / Linh kiện</th>
              <th style="width: 70px; text-align: center;">SL</th>
              <th style="width: 130px; text-align: right;">Đơn giá</th>
              <th style="width: 140px; text-align: right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="sign-row">
          <div class="sign-col">
            <strong>KHÁCH HÀNG BÀN GIAO</strong><br>
            <span style="font-size: 11px; color: #64748b;">(Ký và ghi rõ họ tên)</span>
            <div class="sign-space"></div>
          </div>
          <div class="sign-col">
            <strong>KỸ THUẬT VIÊN / DANGVINHPC</strong><br>
            <span style="font-size: 11px; color: #64748b;">(Ký và ghi rõ họ tên)</span>
            <div class="sign-space"></div>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // In Hóa Đơn Bán Lẻ Gốc
  const handlePrintSalesInvoice = (order: Order) => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Vui lòng cho phép popup trình duyệt để in hóa đơn');
      return;
    }
    const itemsHtml = (order.items || [])
      .map((it, idx) => {
        const w = getWarrantyRangeForItem(order.createdAt, it);
        return `
          <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td>
              <strong>${it.name}</strong>
              <div style="font-size: 11px; color: #16a34a; margin-top: 3px;">
                🛡️ Thời hạn BH dự kiến: <strong>${w.range}</strong> (${w.months} Tháng)
              </div>
            </td>
            <td style="text-align: center;">${it.quantity}</td>
            <td style="text-align: right;">${Number(it.price).toLocaleString('vi-VN')} đ</td>
            <td style="text-align: right;"><strong>${(it.price * it.quantity).toLocaleString('vi-VN')} đ</strong></td>
          </tr>
        `;
      })
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Hóa Đơn Bán Hàng #${order.orderNumber || order.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 28px; color: #1e293b; line-height: 1.5; font-size: 13px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 14px; margin-bottom: 18px; }
          .brand { font-size: 22px; font-weight: 800; color: #2563eb; }
          .title { text-align: center; font-size: 18px; font-weight: 800; text-transform: uppercase; margin: 16px 0; color: #0f172a; }
          .info-table { width: 100%; margin-bottom: 16px; border-collapse: collapse; }
          .info-table td { padding: 5px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
          .items-table th, .items-table td { border: 1px solid #cbd5e1; padding: 8px 10px; }
          .items-table th { background: #f8fafc; font-weight: 700; text-align: left; }
          .total-box { text-align: right; margin-top: 10px; font-size: 16px; font-weight: 800; color: #dc2626; }
          .sign-row { display: flex; justify-content: space-between; margin-top: 36px; text-align: center; }
          .sign-col { width: 45%; }
          .sign-space { height: 75px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">DANGVINHPC</div>
            <div style="font-size: 12px; color: #64748b;">Hệ thống linh kiện máy tính & PC Gaming cao cấp</div>
            <div style="font-size: 12px; color: #64748b;">Hotline: 1800 6868 • cskh@dangvinhpc.vn</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-size: 13px;">HÓA ĐƠN BÁN HÀNG & PHIẾU XUẤT KHO</div>
            <div style="color: #64748b;">Mã đơn: #${order.orderNumber || order.id}</div>
            <div style="color: #64748b;">Ngày đặt: ${order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : ''}</div>
          </div>
        </div>

        <div class="title">HÓA ĐƠN BÁN LẺ</div>

        <table class="info-table">
          <tr>
            <td style="width: 55%;"><strong>Khách hàng:</strong> ${order.shippingAddress?.split(',')[0] || 'Khách hàng'}</td>
            <td><strong>Thanh toán:</strong> ${order.paymentMethod === 'cod' ? 'COD (Tiền mặt khi nhận)' : order.paymentMethod?.toUpperCase()}</td>
          </tr>
          <tr>
            <td><strong>Địa chỉ giao:</strong> ${order.shippingAddress || 'Chưa cung cấp'}</td>
            <td><strong>Ngày mua máy:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : ''}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 6px; font-size: 11px; color: #15803d;">
              🛡️ <strong>LƯU Ý BẢO HÀNH CHÍNH HÃNG:</strong> Thời hạn bảo hành dự kiến tính chính xác từ ngày khách mua máy đến ngày hết hạn bảo hành trên hệ thống tra cứu điện tử DANGVINHPC.
            </td>
          </tr>
        </table>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">STT</th>
              <th>Tên sản phẩm</th>
              <th style="width: 70px; text-align: center;">SL</th>
              <th style="width: 130px; text-align: right;">Đơn giá</th>
              <th style="width: 140px; text-align: right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 14px; text-align: right; font-size: 13px; line-height: 1.8; color: #475569;">
          <div>Tiền hàng trước thuế: <strong>${Math.round(Math.max(0, (Number(order.totalAmount) || 0) - ((Number(order.totalAmount) || 0) >= 5000000 ? 0 : 30000)) / 1.08).toLocaleString('vi-VN')} đ</strong></div>
          <div style="color: #2563eb;">Thuế GTGT (VAT 8% đã bao gồm): <strong>${(Math.max(0, (Number(order.totalAmount) || 0) - ((Number(order.totalAmount) || 0) >= 5000000 ? 0 : 30000)) - Math.round(Math.max(0, (Number(order.totalAmount) || 0) - ((Number(order.totalAmount) || 0) >= 5000000 ? 0 : 30000)) / 1.08)).toLocaleString('vi-VN')} đ</strong></div>
          <div>Phí vận chuyển: <strong>${(Number(order.totalAmount) || 0) >= 5000000 ? 'Miễn phí (0 đ)' : '30.000 đ'}</strong></div>
        </div>

        <div class="total-box">
          TỔNG THANH TOÁN: ${Number(order.totalAmount).toLocaleString('vi-VN')} đ
        </div>

        <div class="sign-row">
          <div class="sign-col">
            <strong>NGƯỜI MUA HÀNG</strong><br>
            <span style="font-size: 11px; color: #64748b;">(Ký và ghi rõ họ tên)</span>
            <div class="sign-space"></div>
          </div>
          <div class="sign-col">
            <strong>NGƯỜI BÁN HÀNG / THỦ KHO</strong><br>
            <span style="font-size: 11px; color: #64748b;">(Ký và ghi rõ họ tên)</span>
            <div class="sign-space"></div>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // User Role Management
  const handleSetUserRole = async (targetUser: User, newRole: 'admin' | 'staff' | 'customer') => {
    if (targetUser.role === newRole) return;
    if (Number(targetUser.id) === Number(user?.id)) {
      showToast('Không thể tự thay đổi vai trò tài khoản đang đăng nhập');
      return;
    }
    if (targetUser.email === 'admin@promart.vn') {
      showToast('Không thể thay đổi quyền Quản trị viên gốc (Super Admin)');
      return;
    }
    try {
      setLoading(true);
      await apiService.updateUserRole(targetUser.id, newRole);
      setUserList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      const roleText =
        newRole === 'admin'
          ? 'Quản Trị Viên (Admin)'
          : newRole === 'staff'
          ? 'Nhân Viên Cửa Hàng (Staff)'
          : 'Khách Hàng (Customer)';
      showToast(`Đã chuyển vai trò của "${targetUser.name || targetUser.email}" sang ${roleText}`);
    } catch (err: any) {
      showToast('Lỗi đổi vai trò: ' + (err.message || 'Thất bại'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password.trim()) {
      showToast('Vui lòng nhập họ tên, email và mật khẩu');
      return;
    }
    try {
      setIsSavingUser(true);
      const res = await apiService.createStaffUser(newUserForm);
      if (res.user) {
        setUserList((prev) => [res.user, ...prev]);
        setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
      }
      showToast(res.message || 'Đã tạo tài khoản thành công!');
      setIsCreateUserModalOpen(false);
      setNewUserForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'staff',
        address: '',
        city: '',
      });
    } catch (err: any) {
      showToast('Lỗi tạo tài khoản: ' + (err.message || 'Thất bại'));
    } finally {
      setIsSavingUser(false);
    }
  };

  // Category Actions
  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim() || !categoryForm.id.trim()) {
      showToast('Vui lòng nhập ID và tên danh mục');
      return;
    }
    const categoryId = editingCategory?.id || categoryForm.id.trim().toLowerCase();
    const payload = {
      id: categoryId,
      name: categoryForm.name.trim(),
      count: productList.filter((product) => (product.category_id || product.category) === categoryId).length,
      icon: categoryForm.icon.trim() || '📁',
    };

    try {
      setIsSavingCategory(true);
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.id, payload);
        setCategoryList((prev) => prev.map((c) => (c.id === editingCategory.id ? payload : c)));
        showToast(`Đã cập nhật "${payload.name}"`);
      } else {
        await apiService.createCategory(payload);
        setCategoryList((prev) => [...prev, payload]);
        showToast(`Đã thêm danh mục "${payload.name}"`);
      }
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      showToast('Lỗi lưu danh mục: ' + err.message);
    } finally {
      setIsSavingCategory(false);
    }
  };

  // Voucher Actions
  const handleOpenAddVoucher = () => {
    setVoucherForm({
      code: '',
      discount: '50000',
      minOrder: '1000000',
      label: 'Giảm 50.000₫ cho đơn từ 1tr',
      expiryDate: '2026-12-31',
    });
    setIsVoucherModalOpen(true);
  };

  const handleSaveVoucher = async () => {
    if (!voucherForm.code.trim() || !voucherForm.discount || !voucherForm.label.trim()) {
      showToast('Vui lòng điền đủ mã, mức giảm và mô tả');
      return;
    }
    const cleanCode = voucherForm.code.trim().toUpperCase();
    const discountVal = parseInt(voucherForm.discount.replace(/[^0-9]/g, ''), 10) || 0;
    const minOrderVal = parseInt(voucherForm.minOrder.replace(/[^0-9]/g, ''), 10) || 0;

    const payload: Voucher = {
      code: cleanCode,
      discount: discountVal,
      minOrder: minOrderVal,
      label: voucherForm.label.trim(),
      expiryDate: voucherForm.expiryDate.trim() || '2026-12-31',
    };

    try {
      setIsSavingVoucher(true);
      await apiService.createVoucher(payload);
      setVoucherList((prev) => {
        const idx = prev.findIndex((v) => v.code === cleanCode);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = payload;
          return next;
        }
        return [payload, ...prev];
      });
      showToast(`Đã lưu mã giảm giá ${cleanCode}`);
      setIsVoucherModalOpen(false);
    } catch (err: any) {
      showToast('Lỗi lưu mã voucher: ' + err.message);
    } finally {
      setIsSavingVoucher(false);
    }
  };

  // Delete Action Execution
  const handleDeleteExecute = async () => {
    if (!deleteConfirm) return;
    const { type, id, title } = deleteConfirm;
    try {
      if (type === 'product') {
        await apiService.deleteProduct(id.toString());
        const updated = productList.filter((p) => p.id !== id);
        setProductList(updated);
        syncCategoryCounts(updated);
        setStats((prev) => ({ ...prev, totalProducts: Math.max(0, prev.totalProducts - 1) }));
        showToast(`Đã xóa "${title}"`);
      } else if (type === 'order') {
        // Đơn hàng KHÔNG được phép xóa — phải lưu trữ vĩnh viễn
        showToast('⚠️ Không thể xóa đơn hàng! Đây là bằng chứng giao dịch, phải lưu trữ theo quy định. Hãy hủy đơn nếu cần.');
        setDeleteConfirm(null);
        return;
      } else if (type === 'category') {
        await apiService.deleteCategory(id.toString());
        setCategoryList((prev) => prev.filter((c) => c.id !== id));
        showToast(`Đã xóa danh mục "${title}"`);
      } else if (type === 'voucher') {
        await apiService.deleteVoucher(id.toString());
        setVoucherList((prev) => prev.filter((v) => v.code !== id));
        showToast(`Đã xóa mã voucher "${title}"`);
      } else if (type === 'user') {
        if (Number(id) === Number(user?.id)) {
          showToast('Không thể xóa tài khoản quản trị đang đăng nhập');
          setDeleteConfirm(null);
          return;
        }
        await apiService.deleteUser(id);
        setUserList((prev) => prev.filter((u) => u.id !== id));
        setStats((prev) => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
        showToast(`Đã xóa người dùng "${title}"`);
      }
      setDeleteConfirm(null);
    } catch (err: any) {
      showToast('Lỗi khi xóa: ' + (err.message || 'Thất bại'));
      setDeleteConfirm(null);
    }
  };

  // Inventory Adjustment
  const handleInventoryAdjustment = async (product: ProductItem, direction: 'in' | 'out') => {
    const quantity = Number(inventoryQuantities[product.id]);
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      showToast('Vui lòng nhập số lượng hợp lệ (> 0)');
      return;
    }
    const currentStock = product.stock ?? 0;
    const nextStock = direction === 'in' ? currentStock + quantity : Math.max(0, currentStock - quantity);
    if (direction === 'out' && quantity > currentStock) {
      showToast(`Tồn kho chỉ còn ${currentStock}, không thể xuất ${quantity}`);
      return;
    }
    try {
      setLoading(true);
      await apiService.updateProduct(product.id, { ...product, stock: nextStock });
      setInventoryQuantities((prev) => ({ ...prev, [product.id]: '' }));
      const updated = productList.map((p) => (p.id === product.id ? { ...p, stock: nextStock } : p));
      setProductList(updated);
      syncCategoryCounts(updated);
      showToast(`${direction === 'in' ? 'Đã nhập' : 'Đã xuất'} ${quantity} sản phẩm cho "${product.name}"`);
    } catch {
      showToast('Không thể cập nhật tồn kho');
    } finally {
      setLoading(false);
    }
  };

  // Derived filtered data
  const filteredProducts = useMemo(() => {
    let result = productList.filter((p) => {
      const query = searchTerm.toLowerCase();
      const matchSearch =
        p.name?.toLowerCase().includes(query) ||
        p.id?.toLowerCase().includes(query) ||
        p.category_id?.toLowerCase().includes(query);

      const matchCat = productCategoryFilter === 'all' || (p.category_id || p.category) === productCategoryFilter;

      let matchStock = true;
      const s = p.stock ?? 0;
      if (productStockFilter === 'in_stock') matchStock = s > 5 && !p.isHidden;
      else if (productStockFilter === 'low_stock') matchStock = s > 0 && s <= 5 && !p.isHidden;
      else if (productStockFilter === 'out_of_stock') matchStock = s <= 0 && !p.isHidden;
      else if (productStockFilter === 'hidden') matchStock = !!p.isHidden;

      return matchSearch && matchCat && matchStock;
    });

    if (productSortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (productSortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (productSortBy === 'stock_desc') {
      result.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
    }

    return result;
  }, [productList, searchTerm, productCategoryFilter, productStockFilter, productSortBy]);

  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        order.orderNumber?.toLowerCase().includes(query) ||
        String(order.id).includes(query) ||
        order.shippingAddress?.toLowerCase().includes(query) ||
        order.paymentMethod?.toLowerCase().includes(query) ||
        order.returnReason?.toLowerCase().includes(query) ||
        order.items?.some((i) => i.name?.toLowerCase().includes(query));

      let matchStatus = true;
      if (orderStatusFilter === 'returns') {
        if (!order.returnStatus) {
          matchStatus = false;
        } else if (returnSubFilter === 'pending') {
          matchStatus = order.returnStatus === 'pending';
        } else if (returnSubFilter === 'approved') {
          matchStatus = order.returnStatus === 'approved';
        } else if (returnSubFilter === 'rejected') {
          matchStatus = order.returnStatus === 'rejected';
        } else {
          matchStatus = true;
        }
      } else if (orderStatusFilter === 'shipping') {
        matchStatus = order.status === 'shipping' || order.status === 'delivered';
      } else if (orderStatusFilter !== 'all') {
        matchStatus = order.status === orderStatusFilter;
      }

      return matchSearch && matchStatus;
    });
  }, [orderList, searchTerm, orderStatusFilter, returnSubFilter]);

  const filteredCategories = useMemo(() => {
    return categoryList.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoryList, searchTerm]);

  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole =
        userRoleFilter === 'all'
          ? true
          : userRoleFilter === 'customer'
          ? !u.role || u.role === 'customer'
          : u.role === userRoleFilter;
      return matchSearch && matchRole;
    });
  }, [userList, searchTerm, userRoleFilter]);

  const adminCount = useMemo(() => userList.filter((u) => u.role === 'admin').length, [userList]);
  const staffCount = useMemo(() => userList.filter((u) => u.role === 'staff').length, [userList]);
  const customerCount = useMemo(() => userList.filter((u) => !u.role || u.role === 'customer').length, [userList]);

  const filteredVouchers = useMemo(() => {
    return voucherList.filter((v) =>
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [voucherList, searchTerm]);

  // Dashboard calculations
  const totalCompletedRevenue = useMemo(() => {
    return orderList
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orderList]);

  // Phân tích doanh thu bán hàng theo Ngày, Tháng, Năm chi tiết
  const revenueAnalytics = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const thisMonthStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    const thisYear = now.getFullYear();

    const completedOrders = orderList.filter((o) => o.status === 'completed');

    // 1. Thống kê theo 7 ngày gần nhất
    const dailyMap: Record<string, { label: string; dateStr: string; fullDate: string; revenue: number; count: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const dayLabel = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
      dailyMap[dStr] = {
        label: dayLabel,
        dateStr: dStr,
        fullDate: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
        revenue: 0,
        count: 0,
      };
    }

    // 2. Thống kê theo 12 tháng của năm nay
    const monthlyMap: Record<string, { label: string; monthStr: string; fullMonth: string; revenue: number; count: number }> = {};
    for (let m = 1; m <= 12; m++) {
      const mStr = `${thisYear}-${pad(m)}`;
      monthlyMap[mStr] = {
        label: `Tháng ${m}`,
        monthStr: mStr,
        fullMonth: `Tháng ${m}/${thisYear}`,
        revenue: 0,
        count: 0,
      };
    }

    // 3. Thống kê theo năm
    const yearlyMap: Record<string, { label: string; yearStr: string; fullYear: string; revenue: number; count: number }> = {};
    [thisYear - 2, thisYear - 1, thisYear].forEach((yr) => {
      yearlyMap[String(yr)] = {
        label: `Năm ${yr}`,
        yearStr: String(yr),
        fullYear: `Năm ${yr}`,
        revenue: 0,
        count: 0,
      };
    });

    let todayRevenue = 0;
    let todayCount = 0;
    let monthRevenue = 0;
    let monthCount = 0;
    let yearRevenue = 0;
    let yearCount = 0;
    let totalAll = 0;

    completedOrders.forEach((o) => {
      const amt = Number(o.totalAmount) || 0;
      totalAll += amt;
      const dStr = getOrderDateKey(o.createdAt);
      const mStr = dStr ? dStr.slice(0, 7) : `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
      const yStr = dStr ? dStr.slice(0, 4) : String(now.getFullYear());

      // Ngày
      if (dStr === todayStr) {
        todayRevenue += amt;
        todayCount += 1;
      }
      if (dailyMap[dStr]) {
        dailyMap[dStr].revenue += amt;
        dailyMap[dStr].count += 1;
      }

      // Tháng
      if (mStr === thisMonthStr) {
        monthRevenue += amt;
        monthCount += 1;
      }
      if (monthlyMap[mStr]) {
        monthlyMap[mStr].revenue += amt;
        monthlyMap[mStr].count += 1;
      }

      // Năm
      if (yStr === String(thisYear)) {
        yearRevenue += amt;
        yearCount += 1;
      }
      if (!yearlyMap[yStr]) {
        yearlyMap[yStr] = {
          label: `Năm ${yStr}`,
          yearStr: yStr,
          fullYear: `Năm ${yStr}`,
          revenue: 0,
          count: 0,
        };
      }
      yearlyMap[yStr].revenue += amt;
      yearlyMap[yStr].count += 1;
    });

    return {
      todayRevenue,
      todayCount,
      monthRevenue,
      monthCount,
      yearRevenue,
      yearCount,
      totalAll,
      dailyList: Object.values(dailyMap),
      monthlyList: Object.values(monthlyMap),
      yearlyList: Object.values(yearlyMap).sort((a, b) => Number(a.yearStr) - Number(b.yearStr)),
    };
  }, [orderList]);

  // Danh sách các ngày thực tế có phát sinh đơn hàng để chọn nhanh
  const availableOrderDates = useMemo(() => {
    const map = new Map<string, { dateStr: string; label: string; fullDate: string; count: number }>();
    orderList.forEach((o) => {
      const dStr = getOrderDateKey(o.createdAt);
      if (!dStr) return;
      const [y, m, d] = dStr.split('-');
      const label = `${d}/${m}`;
      const fullDate = `${d}/${m}/${y}`;
      const existing = map.get(dStr);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(dStr, { dateStr: dStr, label, fullDate, count: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  }, [orderList]);

  // Danh sách các năm để chọn nhanh trên biểu đồ (luôn có sẵn dải năm từ quá khứ đến tương lai)
  const availableChartYears = useMemo(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();
    // Tạo sẵn dải năm từ currentYear - 4 đến currentYear + 2 (ví dụ: 2022 -> 2028)
    for (let y = Math.min(2022, currentYear - 4); y <= currentYear + 2; y++) {
      years.add(y);
    }
    orderList.forEach((o) => {
      const dStr = getOrderDateKey(o.createdAt);
      if (dStr) {
        const yr = parseInt(dStr.slice(0, 4), 10);
        if (!isNaN(yr)) years.add(yr);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [orderList]);

  // Dữ liệu biểu đồ doanh thu theo tùy chọn động (theo ngày, 7 ngày, 30 ngày, theo tháng, theo năm, khoảng ngày)
  const revenueChartData = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const now = new Date();
    const completedOrders = orderList.filter((o) => o.status === 'completed');

    // Gom đơn completed theo ngày: map "YYYY-MM-DD" -> { revenue, count }
    const ordersByDate = new Map<string, { revenue: number; count: number }>();
    completedOrders.forEach((o) => {
      const dStr = getOrderDateKey(o.createdAt);
      if (!dStr) return;
      const amt = Number(o.totalAmount) || 0;
      const cur = ordersByDate.get(dStr) || { revenue: 0, count: 0 };
      cur.revenue += amt;
      cur.count += 1;
      ordersByDate.set(dStr, cur);
    });

    let chartList: {
      label: string;
      dateKey: string;
      fullDate: string;
      fullMonth?: string;
      fullYear?: string;
      revenue: number;
      count: number;
    }[] = [];

    let periodTitle = '';
    let periodSubtitle = '';

    if (revenueChartMode === 'day') {
      // 12 khung giờ trong ngày, mỗi khung 2 tiếng
      const hoursSlots = [
        { label: '00:00 - 02:00', shortLabel: '0h-2h', startH: 0, endH: 2 },
        { label: '02:00 - 04:00', shortLabel: '2h-4h', startH: 2, endH: 4 },
        { label: '04:00 - 06:00', shortLabel: '4h-6h', startH: 4, endH: 6 },
        { label: '06:00 - 08:00', shortLabel: '6h-8h', startH: 6, endH: 8 },
        { label: '08:00 - 10:00', shortLabel: '8h-10h', startH: 8, endH: 10 },
        { label: '10:00 - 12:00', shortLabel: '10h-12h', startH: 10, endH: 12 },
        { label: '12:00 - 14:00', shortLabel: '12h-14h', startH: 12, endH: 14 },
        { label: '14:00 - 16:00', shortLabel: '14h-16h', startH: 14, endH: 16 },
        { label: '16:00 - 18:00', shortLabel: '16h-18h', startH: 16, endH: 18 },
        { label: '18:00 - 20:00', shortLabel: '18h-20h', startH: 18, endH: 20 },
        { label: '20:00 - 22:00', shortLabel: '20h-22h', startH: 20, endH: 22 },
        { label: '22:00 - 24:00', shortLabel: '22h-24h', startH: 22, endH: 24 },
      ];

      const dayOrders = completedOrders.filter((o) => {
        return getOrderDateKey(o.createdAt) === chartSingleDate;
      });

      hoursSlots.forEach((slot) => {
        let slotRev = 0;
        let slotCnt = 0;
        dayOrders.forEach((o) => {
          const d = new Date(o.createdAt);
          const h = !isNaN(d.getTime()) ? d.getHours() : 12;
          if (h >= slot.startH && h < slot.endH) {
            slotRev += Number(o.totalAmount) || 0;
            slotCnt += 1;
          }
        });
        chartList.push({
          label: slot.shortLabel,
          dateKey: `${chartSingleDate}_${slot.startH}`,
          fullDate: `${slot.label}`,
          revenue: slotRev,
          count: slotCnt,
        });
      });

      const [sy, sm, sd] = (chartSingleDate || '').split('-');
      periodTitle = `Ngày ${sd || '??'}/${sm || '??'}/${sy || '????'}`;
      periodSubtitle = `Thống kê 24 giờ ngày ${sd || '??'}/${sm || '??'}/${sy || '????'} (${dayOrders.length} đơn hoàn tất)`;
    } else if (revenueChartMode === 'day_7') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        const stat = ordersByDate.get(dStr) || { revenue: 0, count: 0 };
        chartList.push({
          label: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`,
          dateKey: dStr,
          fullDate: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
          revenue: stat.revenue,
          count: stat.count,
        });
      }
      periodTitle = '7 Ngày gần nhất';
      periodSubtitle = `Thống kê 7 ngày từ ${chartList[0]?.label} đến ${chartList[chartList.length - 1]?.label}`;
    } else if (revenueChartMode === 'day_30') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        const stat = ordersByDate.get(dStr) || { revenue: 0, count: 0 };
        chartList.push({
          label: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`,
          dateKey: dStr,
          fullDate: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
          revenue: stat.revenue,
          count: stat.count,
        });
      }
      periodTitle = '30 Ngày qua';
      periodSubtitle = `Thống kê 30 ngày từ ${chartList[0]?.label} đến ${chartList[chartList.length - 1]?.label}`;
    } else if (revenueChartMode === 'month') {
      const daysInMonth = new Date(chartCustomYear, chartCustomMonth, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dStr = `${chartCustomYear}-${pad(chartCustomMonth)}-${pad(day)}`;
        const stat = ordersByDate.get(dStr) || { revenue: 0, count: 0 };
        chartList.push({
          label: `${pad(day)}/${pad(chartCustomMonth)}`,
          dateKey: dStr,
          fullDate: `${pad(day)}/${pad(chartCustomMonth)}/${chartCustomYear}`,
          revenue: stat.revenue,
          count: stat.count,
        });
      }
      periodTitle = `Tháng ${chartCustomMonth}/${chartCustomYear}`;
      periodSubtitle = `Thống kê doanh thu ${daysInMonth} ngày của Tháng ${chartCustomMonth}/${chartCustomYear}`;
    } else if (revenueChartMode === 'year') {
      for (let m = 1; m <= 12; m++) {
        const mStr = `${chartCustomYear}-${pad(m)}`;
        let monthRev = 0;
        let monthCnt = 0;
        completedOrders.forEach((o) => {
          const dStr = getOrderDateKey(o.createdAt);
          if (dStr && dStr.startsWith(mStr)) {
            monthRev += Number(o.totalAmount) || 0;
            monthCnt += 1;
          }
        });
        chartList.push({
          label: `Tháng ${m}`,
          dateKey: mStr,
          fullDate: `Tháng ${m}/${chartCustomYear}`,
          fullMonth: `Tháng ${m}/${chartCustomYear}`,
          revenue: monthRev,
          count: monthCnt,
        });
      }
      periodTitle = `Năm ${chartCustomYear}`;
      periodSubtitle = `Biểu đồ 12 tháng của Năm ${chartCustomYear}`;
    } else if (revenueChartMode === 'range') {
      let start = chartRangeStart;
      let end = chartRangeEnd;
      if (start > end) {
        const tmp = start;
        start = end;
        end = tmp;
      }
      const [sy, sm, sd] = start.split('-').map(Number);
      const [ey, em, ed] = end.split('-').map(Number);
      const cur = new Date(sy, sm - 1, sd);
      const last = new Date(ey, em - 1, ed);

      let guard = 0;
      while (cur <= last && guard < 180) {
        guard++;
        const dStr = `${cur.getFullYear()}-${pad(cur.getMonth() + 1)}-${pad(cur.getDate())}`;
        const stat = ordersByDate.get(dStr) || { revenue: 0, count: 0 };
        chartList.push({
          label: `${pad(cur.getDate())}/${pad(cur.getMonth() + 1)}`,
          dateKey: dStr,
          fullDate: `${pad(cur.getDate())}/${pad(cur.getMonth() + 1)}/${cur.getFullYear()}`,
          revenue: stat.revenue,
          count: stat.count,
        });
        cur.setDate(cur.getDate() + 1);
      }
      periodTitle = 'Khoảng ngày tùy chọn';
      periodSubtitle = `Từ ${chartList[0]?.fullDate || start} đến ${chartList[chartList.length - 1]?.fullDate || end} (${chartList.length} ngày)`;
    }

    const maxRevenue = Math.max(...chartList.map((c) => c.revenue), 0);
    const totalPeriodRev = chartList.reduce((sum, c) => sum + c.revenue, 0);
    const totalPeriodOrders = chartList.reduce((sum, c) => sum + c.count, 0);
    const aovPeriod = totalPeriodOrders > 0 ? Math.round(totalPeriodRev / totalPeriodOrders) : 0;
    const activeCount = chartList.filter((c) => c.revenue > 0 || c.count > 0).length;

    let peakItem = chartList[0];
    for (const item of chartList) {
      if (item.revenue > (peakItem?.revenue || 0)) {
        peakItem = item;
      }
    }
    const peakRevenue = peakItem?.revenue || 0;
    const peakDate = peakRevenue > 0 ? (peakItem?.fullDate || peakItem?.label) : '--';

    // Tính kỳ trước để so sánh tăng trưởng %
    let prevRev = 0;
    let prevOrders = 0;
    if (revenueChartMode === 'day') {
      const [sy, sm, sd] = (chartSingleDate || '').split('-').map(Number);
      const prevD = new Date(sy, sm - 1, sd);
      prevD.setDate(prevD.getDate() - 1);
      const prevDStr = `${prevD.getFullYear()}-${pad(prevD.getMonth() + 1)}-${pad(prevD.getDate())}`;
      completedOrders.forEach((o) => {
        if (getOrderDateKey(o.createdAt) === prevDStr) {
          prevRev += Number(o.totalAmount) || 0;
          prevOrders += 1;
        }
      });
    } else if (revenueChartMode === 'month') {
      const prevM = chartCustomMonth === 1 ? 12 : chartCustomMonth - 1;
      const prevY = chartCustomMonth === 1 ? chartCustomYear - 1 : chartCustomYear;
      const prevMStr = `${prevY}-${pad(prevM)}`;
      completedOrders.forEach((o) => {
        const dStr = getOrderDateKey(o.createdAt);
        if (dStr && dStr.startsWith(prevMStr)) {
          prevRev += Number(o.totalAmount) || 0;
          prevOrders += 1;
        }
      });
    } else if (revenueChartMode === 'year') {
      const prevYStr = `${chartCustomYear - 1}`;
      completedOrders.forEach((o) => {
        const dStr = getOrderDateKey(o.createdAt);
        if (dStr && dStr.startsWith(prevYStr)) {
          prevRev += Number(o.totalAmount) || 0;
          prevOrders += 1;
        }
      });
    } else if (revenueChartMode === 'day_7' || revenueChartMode === 'day_30') {
      const days = revenueChartMode === 'day_7' ? 7 : 30;
      for (let i = days * 2 - 1; i >= days; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        const stat = ordersByDate.get(dStr);
        if (stat) {
          prevRev += stat.revenue;
          prevOrders += stat.count;
        }
      }
    }

    const revGrowthPct = prevRev > 0
      ? Math.round(((totalPeriodRev - prevRev) / prevRev) * 100)
      : (totalPeriodRev > 0 ? 100 : 0);
    const ordersGrowthPct = prevOrders > 0
      ? Math.round(((totalPeriodOrders - prevOrders) / prevOrders) * 100)
      : (totalPeriodOrders > 0 ? 100 : 0);

    return {
      chartList,
      periodTitle,
      periodSubtitle,
      maxRevenue,
      totalPeriodRev,
      totalPeriodOrders,
      aovPeriod,
      activeCount,
      peakRevenue,
      peakDate,
      revGrowthPct,
      ordersGrowthPct,
    };
  }, [revenueChartMode, chartSingleDate, chartCustomMonth, chartCustomYear, chartRangeStart, chartRangeEnd, orderList]);

  const currentPeriodRevenue = useMemo(() => {
    const targetOrders = orderList.filter((o) => {
      if (revenueStatusMode === 'completed') {
        return o.status === 'completed';
      }
      return o.status !== 'cancelled';
    });

    if (revenuePeriod === 'day') {
      const dayOrders = targetOrders.filter((o) => {
        return getOrderDateKey(o.createdAt) === selectedSpecificDate;
      });
      const amount = dayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
      const [y, m, d] = (selectedSpecificDate || '').split('-');
      return {
        amount,
        ordersCount: dayOrders.length,
        label: `Doanh thu ngày ${d || '??'}/${m || '??'}/${y || '????'}`,
        badge: `${d || '??'}/${m || '??'}`,
      };
    }

    if (revenuePeriod === 'month') {
      const monthOrders = targetOrders.filter((o) => {
        const dStr = getOrderDateKey(o.createdAt);
        if (!dStr) return false;
        const [y, m] = dStr.split('-');
        return Number(m) === selectedSpecificMonth && Number(y) === selectedSpecificYear;
      });
      const amount = monthOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
      return {
        amount,
        ordersCount: monthOrders.length,
        label: `Doanh thu Tháng ${selectedSpecificMonth}/${selectedSpecificYear}`,
        badge: `T${selectedSpecificMonth}`,
      };
    }

    if (revenuePeriod === 'year') {
      const yearOrders = targetOrders.filter((o) => {
        const dStr = getOrderDateKey(o.createdAt);
        if (!dStr) return false;
        const [y] = dStr.split('-');
        return Number(y) === selectedSpecificYear;
      });
      const amount = yearOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
      return {
        amount,
        ordersCount: yearOrders.length,
        label: `Doanh thu Năm ${selectedSpecificYear}`,
        badge: `Năm ${selectedSpecificYear}`,
      };
    }

    // 'all'
    const allAmount = targetOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    return {
      amount: allAmount,
      ordersCount: targetOrders.length,
      label: revenueStatusMode === 'completed' ? 'Tổng doanh thu thực thu' : 'Tổng giá trị đơn phát sinh',
      badge: 'Tất cả',
    };
  }, [revenuePeriod, revenueStatusMode, selectedSpecificDate, selectedSpecificMonth, selectedSpecificYear, orderList]);
  const pendingOrdersCount = useMemo(() => orderList.filter((o) => o.status === 'pending').length, [orderList]);
  const allWarrantyOrdersCount = useMemo(() => orderList.filter((o) => Boolean(o.returnStatus)).length, [orderList]);
  const pendingReturnOrdersCount = useMemo(() => orderList.filter((o) => o.returnStatus === 'pending').length, [orderList]);
  const approvedReturnOrdersCount = useMemo(() => orderList.filter((o) => o.returnStatus === 'approved').length, [orderList]);
  const rejectedReturnOrdersCount = useMemo(() => orderList.filter((o) => o.returnStatus === 'rejected').length, [orderList]);
  const returnOrdersCount = pendingReturnOrdersCount;
  const lowStockProducts = useMemo(() => productList.filter((p) => (p.stock ?? 0) <= 5), [productList]);
  const totalStockCount = useMemo(() => productList.reduce((sum, p) => sum + (p.stock ?? 0), 0), [productList]);
  const totalInventoryValue = useMemo(() => productList.reduce((sum, p) => sum + (p.price * (p.stock ?? 0)), 0), [productList]);

  const orderStatusStats = useMemo(() => {
    const total = orderList.length || 1;
    const completed = orderList.filter((o) => o.status === 'completed').length;
    const shipping = orderList.filter((o) => o.status === 'shipping' || o.status === 'delivered').length;
    const pending = orderList.filter((o) => o.status === 'pending').length;
    const cancelled = orderList.filter((o) => o.status === 'cancelled').length;
    return {
      completed,
      shipping,
      pending,
      cancelled,
      completedPct: Math.round((completed / total) * 100),
      shippingPct: Math.round((shipping / total) * 100),
      pendingPct: Math.round((pending / total) * 100),
      cancelledPct: Math.round((cancelled / total) * 100),
    };
  }, [orderList]);

  const brandInventory = useMemo(() => {
    return Object.values(
      productList.reduce<Record<string, { brand: string; products: ProductItem[]; stock: number }>>((groups, product) => {
        const brand = getProductBrand(product);
        const current = groups[brand] || { brand, products: [], stock: 0 };
        current.products.push(product);
        current.stock += product.stock ?? 0;
        groups[brand] = current;
        return groups;
      }, {})
    ).sort((a, b) => b.stock - a.stock);
  }, [productList]);

  function getStatusLabel(st: string = 'pending') {
    switch (st) {
      case 'pending': return 'Chờ duyệt';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao';
      case 'completed': return 'Đã giao thành công';
      case 'cancelled': return 'Đã hủy';
      default: return st;
    }
  }

  function getStatusBadgeStyle(st: string = 'pending') {
    switch (st) {
      case 'pending': return { color: '#d97706', bg: '#fef3c7', border: '#fde68a' };
      case 'confirmed': return { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' };
      case 'shipping': return { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' };
      case 'completed': return { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
      case 'cancelled': return { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
      default: return { color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' };
    }
  }

  // Chặn người dùng không có quyền admin
  if (!isAdmin) {
    return (
      <View style={[styles.guardContainer, isDark && styles.containerDark]}>
        <View style={[styles.guardCard, isDark && styles.cardDark]}>
          <View style={styles.guardIconWrap}>
            <Ionicons name="shield-outline" size={38} color="#dc2626" />
          </View>
          <Text style={[styles.guardTitle, isDark && styles.textDark]}>
            Quyền Quản Trị Bị Giới Hạn
          </Text>
          <Text style={[styles.guardText, isDark && styles.textMutedDark]}>
            Tài khoản hiện tại ({user?.name || user?.email || 'Khách hàng'}) không có đặc quyền Quản trị viên (Admin). Bạn cần đăng nhập tài khoản có thẩm quyền để truy cập trang điều hành này.
          </Text>
          <View style={styles.guardActionRow}>
            <Pressable style={styles.guardBtnSecondary} onPress={() => router.push('/')}>
              <Ionicons name="home-outline" size={17} color="#2563eb" style={{ marginRight: 6 }} />
              <Text style={styles.guardBtnSecondaryText}>Về trang chủ</Text>
            </Pressable>
            <Pressable style={styles.guardBtnPrimary} onPress={() => router.push('/login')}>
              <Ionicons name="log-in-outline" size={17} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.guardBtnPrimaryText}>Đăng nhập Admin</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* TOAST THÔNG BÁO */}
      {toast ? (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color="#22c55e" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {/* ADMIN HEADER CAO CẤP */}
      <View style={[styles.header, isMobile && styles.headerMobile, isDark && styles.headerDark]}>
        <View style={[styles.headerLeft, isMobile && styles.headerLeftMobile]}>
          <Pressable style={[styles.backBtn, isDark && styles.backBtnDark]} onPress={() => router.push('/(tabs)' as any)}>
            <Ionicons name="storefront-outline" size={19} color={isDark ? '#38bdf8' : '#2563eb'} />
            {isDesktop && <Text style={[styles.backBtnText, isDark && { color: '#38bdf8' }]}>Cửa hàng</Text>}
          </Pressable>

          <View style={[styles.brandGroup, isMobile && { flex: 1, minWidth: 0 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={[styles.headerBrand, isDark && styles.textDark]}>DANGVINHPC</Text>
              <View style={styles.adminBadge}>
                <View style={styles.badgePulseDot} />
                <Text style={styles.adminBadgeText}>ADMIN PORTAL</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, isDark && styles.textMutedDark]} numberOfLines={1}>
              Hệ thống quản trị kinh doanh linh kiện máy tính cao cấp
            </Text>
          </View>

          {isMobile && (
            <Pressable
              style={[styles.logoutBtn, isDark && styles.logoutBtnDark, { paddingHorizontal: 10, paddingVertical: 8 }]}
              onPress={() => setLogoutModalVisible(true)}
              accessibilityLabel="Đăng xuất tài khoản Admin"
            >
              <Ionicons name="log-out-outline" size={17} color="#dc2626" />
            </Pressable>
          )}
        </View>

        <View style={[styles.headerActions, isMobile && styles.headerActionsMobile]}>
          <Pressable
            style={[styles.refreshBtn, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }, isMobile && styles.headerActionBtnMobile]}
            onPress={() => router.push('/staff' as any)}
          >
            <Ionicons name="id-card-outline" size={16} color="#16a34a" />
            <Text style={[styles.refreshBtnText, { color: '#16a34a' }, isMobile && { fontSize: 11 }]}>{isMobile ? 'Nhân viên' : 'Cổng Nhân viên'}</Text>
          </Pressable>

          <Pressable style={[styles.refreshBtn, isDark && styles.refreshBtnDark, isMobile && styles.headerActionBtnMobile]} onPress={loadData} disabled={loading}>
            <Ionicons name="sync-outline" size={16} color={isDark ? '#38bdf8' : '#2563eb'} />
            <Text style={[styles.refreshBtnText, isDark && { color: '#38bdf8' }, isMobile && { fontSize: 11 }]}>Làm mới</Text>
          </Pressable>

          <Pressable style={[styles.addPrimaryBtn, isMobile && styles.headerActionBtnMobile, isMobile && { flex: 1.2 }]} onPress={handleOpenAddProduct}>
            <Ionicons name="add-circle" size={18} color="#ffffff" />
            <Text style={[styles.addPrimaryBtnText, isMobile && { fontSize: 12 }]}>{isMobile ? 'Thêm SP' : 'Thêm sản phẩm'}</Text>
          </Pressable>

          {!isMobile && (
            <Pressable
              style={[styles.logoutBtn, isDark && styles.logoutBtnDark]}
              onPress={() => setLogoutModalVisible(true)}
              accessibilityLabel="Đăng xuất tài khoản Admin"
            >
              <Ionicons name="log-out-outline" size={17} color="#dc2626" />
              {isDesktop && <Text style={styles.logoutBtnText}>Đăng xuất</Text>}
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.contentScroll} contentContainerStyle={[styles.contentContainer, isMobile && styles.contentContainerMobile]} showsVerticalScrollIndicator={false}>
        {/* BANNER BÁO LỖI NẾU CÓ */}
        {loadError ? (
          <View style={[styles.loadErrorBanner, isDark && styles.loadErrorBannerDark]}>
            <Ionicons name="alert-circle" size={22} color="#dc2626" />
            <View style={{ flex: 1 }}>
              <Text style={styles.loadErrorTitle}>Cảnh báo kết nối máy chủ</Text>
              <Text style={styles.loadErrorText}>{loadError}</Text>
            </View>
            <Pressable style={styles.loadErrorRetry} onPress={loadData}>
              <Text style={styles.loadErrorRetryText}>Thử lại ngay</Text>
            </Pressable>
          </View>
        ) : null}

        {/* STATS OVERVIEW CARDS (KPIs) */}
        <View style={[styles.statsGrid, isMobile && styles.statsGridMobile]}>
          {/* Doanh thu */}
          <View style={[styles.statCard, isMobile && styles.statCardMobile, isDark && styles.cardDark, { borderLeftColor: '#2563eb' }]}>
            <View style={[styles.statHeaderRow, isMobile && styles.statHeaderRowMobile]}>
              <View style={[styles.statIconWrap, isMobile && { width: 38, height: 38, borderRadius: 10 }, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="wallet-outline" size={isMobile ? 19 : 22} color="#2563eb" />
              </View>
              <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                {[
                  { id: 'day', label: 'Ngày' },
                  { id: 'month', label: 'Tháng' },
                  { id: 'year', label: 'Năm' },
                  { id: 'all', label: 'Tất cả' },
                ].map((p) => {
                  const isSel = revenuePeriod === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      style={[styles.revenuePeriodPill, isSel && styles.revenuePeriodPillActive]}
                      onPress={() => setRevenuePeriod(p.id as any)}
                    >
                      <Text style={[styles.revenuePeriodPillText, isSel && styles.revenuePeriodPillTextActive]}>
                        {p.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <Text style={[styles.statValue, isMobile && styles.statValueMobile, isDark && styles.textDark]}>
              {currentPeriodRevenue.amount.toLocaleString('vi-VN')} ₫
            </Text>

            {/* PICKER CHỌN NGÀY CỤ THỂ */}
            {revenuePeriod === 'day' && (
              <View style={[styles.inlineDateSelectorRow, { flexWrap: 'wrap', gap: 6 }]}>
                {Platform.OS === 'web' && typeof document !== 'undefined' ? (
                  <View style={[styles.webDatePickerWrap, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
                    <Ionicons name="calendar" size={13} color="#2563eb" style={{ marginRight: 4 }} />
                    <input
                      type="date"
                      value={selectedSpecificDate}
                      onChange={(e: any) => e?.target?.value && setSelectedSpecificDate(e.target.value)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: isDark ? '#60a5fa' : '#2563eb',
                        cursor: 'pointer',
                      }}
                    />
                  </View>
                ) : null}

                {/* THANH SCROLL KÈM NÚT CUỘN TRÁI / PHẢI VÀ LĂN CHUỘT */}
                <View style={{ flex: 1, minWidth: isMobile ? 0 : 140, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Pressable
                    style={({ hovered }: any) => [
                      styles.dateScrollNavBtn,
                      isDark && styles.dateScrollNavBtnDark,
                      hovered && { backgroundColor: isDark ? '#334155' : '#e2e8f0' },
                    ]}
                    onPress={() => scrollDatePills(-120)}
                    accessibilityLabel="Cuộn ngày trước"
                  >
                    <Ionicons name="chevron-back" size={12} color={isDark ? '#94a3b8' : '#475569'} />
                  </Pressable>

                  <ScrollView
                    ref={dateScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={Platform.OS === 'web'}
                    onWheel={(e: any) => {
                      if (Platform.OS === 'web' && e?.deltaY) {
                        e.currentTarget.scrollLeft += e.deltaY;
                      }
                    }}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ gap: 4, paddingBottom: 2 }}
                  >
                    {availableOrderDates.map((od) => {
                      const isSelDate = selectedSpecificDate === od.dateStr;
                      return (
                        <Pressable
                          key={od.dateStr}
                          style={[styles.quickDatePill, isDark && styles.quickDatePillDark, isSelDate && styles.quickDatePillActive]}
                          onPress={() => setSelectedSpecificDate(od.dateStr)}
                        >
                          <Text style={[styles.quickDatePillText, isDark && styles.textMutedDark, isSelDate && styles.quickDatePillTextActive]}>
                            {od.label} ({od.count}đ)
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  <Pressable
                    style={({ hovered }: any) => [
                      styles.dateScrollNavBtn,
                      isDark && styles.dateScrollNavBtnDark,
                      hovered && { backgroundColor: isDark ? '#334155' : '#e2e8f0' },
                    ]}
                    onPress={() => scrollDatePills(120)}
                    accessibilityLabel="Cuộn ngày sau"
                  >
                    <Ionicons name="chevron-forward" size={12} color={isDark ? '#94a3b8' : '#475569'} />
                  </Pressable>
                </View>
              </View>
            )}

            {/* PICKER CHỌN THÁNG CỤ THỂ */}
            {revenuePeriod === 'month' && (
              <View style={[styles.inlineDateSelectorRow, { gap: 4 }]}>
                <Pressable
                  style={({ hovered }: any) => [
                    styles.dateScrollNavBtn,
                    isDark && styles.dateScrollNavBtnDark,
                    hovered && { backgroundColor: isDark ? '#334155' : '#e2e8f0' },
                  ]}
                  onPress={() => scrollMonthPills(-120)}
                  accessibilityLabel="Cuộn tháng trước"
                >
                  <Ionicons name="chevron-back" size={12} color={isDark ? '#94a3b8' : '#475569'} />
                </Pressable>

                <ScrollView
                  ref={monthScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={Platform.OS === 'web'}
                  onWheel={(e: any) => {
                    if (Platform.OS === 'web' && e?.deltaY) {
                      e.currentTarget.scrollLeft += e.deltaY;
                    }
                  }}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ gap: 4, paddingBottom: 2 }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                    const isSelM = selectedSpecificMonth === m;
                    return (
                      <Pressable
                        key={m}
                        style={[styles.quickDatePill, isDark && styles.quickDatePillDark, isSelM && styles.quickDatePillActive]}
                        onPress={() => setSelectedSpecificMonth(m)}
                      >
                        <Text style={[styles.quickDatePillText, isDark && styles.textMutedDark, isSelM && styles.quickDatePillTextActive]}>
                          Tháng {m}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Pressable
                  style={({ hovered }: any) => [
                    styles.dateScrollNavBtn,
                    isDark && styles.dateScrollNavBtnDark,
                    hovered && { backgroundColor: isDark ? '#334155' : '#e2e8f0' },
                  ]}
                  onPress={() => scrollMonthPills(120)}
                  accessibilityLabel="Cuộn tháng sau"
                >
                  <Ionicons name="chevron-forward" size={12} color={isDark ? '#94a3b8' : '#475569'} />
                </Pressable>
              </View>
            )}

            {/* PICKER CHỌN NĂM CỤ THỂ */}
            {revenuePeriod === 'year' && (
              <View style={styles.inlineDateSelectorRow}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {[2024, 2025, 2026].map((yr) => {
                    const isSelY = selectedSpecificYear === yr;
                    return (
                      <Pressable
                        key={yr}
                        style={[styles.quickDatePill, isDark && styles.quickDatePillDark, isSelY && styles.quickDatePillActive]}
                        onPress={() => setSelectedSpecificYear(yr)}
                      >
                        <Text style={[styles.quickDatePillText, isDark && styles.textMutedDark, isSelY && styles.quickDatePillTextActive]}>
                          Năm {yr}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, flexWrap: 'wrap', gap: 4 }}>
              <Text style={[styles.statLabel, isDark && styles.textMutedDark]}>{currentPeriodRevenue.label}</Text>
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                onPress={() => setRevenueStatusMode((prev) => (prev === 'completed' ? 'all_active' : 'completed'))}
              >
                <Ionicons
                  name={revenueStatusMode === 'completed' ? 'checkmark-circle' : 'time'}
                  size={13}
                  color={revenueStatusMode === 'completed' ? '#16a34a' : '#2563eb'}
                />
                <Text style={{ fontSize: 11, fontWeight: '700', color: revenueStatusMode === 'completed' ? '#16a34a' : '#2563eb' }}>
                  {revenueStatusMode === 'completed'
                    ? `${currentPeriodRevenue.ordersCount} đơn thành công`
                    : `${currentPeriodRevenue.ordersCount} đơn (cả đơn chờ)`}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Đơn hàng */}
          <View style={[styles.statCard, isMobile && styles.statCardMobile, isDark && styles.cardDark, { borderLeftColor: '#059669' }]}>
            <View style={[styles.statHeaderRow, isMobile && styles.statHeaderRowMobile]}>
              <View style={[styles.statIconWrap, isMobile && { width: 38, height: 38, borderRadius: 10 }, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="receipt-outline" size={isMobile ? 19 : 22} color="#059669" />
              </View>
              {pendingOrdersCount > 0 ? (
                <View style={[styles.statTrendBadge, { backgroundColor: '#fee2e2' }]}>
                  <Text style={[styles.statTrendText, { color: '#b91c1c' }]} numberOfLines={1}>{pendingOrdersCount} chờ duyệt</Text>
                </View>
              ) : (
                <View style={[styles.statTrendBadge, { backgroundColor: '#f0fdf4' }]}>
                  <Text style={[styles.statTrendText, { color: '#15803d' }]} numberOfLines={1}>Đã xử lý tốt</Text>
                </View>
              )}
            </View>
            <Text style={[styles.statValue, isMobile && styles.statValueMobile, isDark && styles.textDark]}>{orderList.filter(o => o.status !== 'cancelled').length} đơn hàng</Text>
            <Text style={[styles.statLabel, isDark && styles.textMutedDark]}>Tổng giao dịch phát sinh</Text>
          </View>

          {/* Sản phẩm trong kho */}
          <View style={[styles.statCard, isMobile && styles.statCardMobile, isDark && styles.cardDark, { borderLeftColor: '#d97706' }]}>
            <View style={[styles.statHeaderRow, isMobile && styles.statHeaderRowMobile]}>
              <View style={[styles.statIconWrap, isMobile && { width: 38, height: 38, borderRadius: 10 }, { backgroundColor: '#fffbeb' }]}>
                <Ionicons name="cube-outline" size={isMobile ? 19 : 22} color="#d97706" />
              </View>
              <View style={[styles.statTrendBadge, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.statTrendText, { color: '#b45309' }]} numberOfLines={1}>Tồn: {totalStockCount} sp</Text>
              </View>
            </View>
            <Text style={[styles.statValue, isMobile && styles.statValueMobile, isDark && styles.textDark]}>{productList.length} mặt hàng</Text>
            <Text style={[styles.statLabel, isDark && styles.textMutedDark]}>
              Giá trị kho: {(totalInventoryValue / 1000000).toFixed(1)} tr ₫
            </Text>
          </View>

          {/* Khách hàng & Phân quyền */}
          <View style={[styles.statCard, isMobile && styles.statCardMobile, isDark && styles.cardDark, { borderLeftColor: '#7c3aed' }]}>
            <View style={[styles.statHeaderRow, isMobile && styles.statHeaderRowMobile]}>
              <View style={[styles.statIconWrap, isMobile && { width: 38, height: 38, borderRadius: 10 }, { backgroundColor: '#faf5ff' }]}>
                <Ionicons name="people-outline" size={isMobile ? 19 : 22} color="#7c3aed" />
              </View>
              <View style={[styles.statTrendBadge, { backgroundColor: '#f3e8ff', maxWidth: '78%' }]}>
                <Text style={[styles.statTrendText, { color: '#6b21a8' }]} numberOfLines={1}>
                  {adminCount} Quản trị • {staffCount} Nhân viên
                </Text>
              </View>
            </View>
            <Text style={[styles.statValue, isMobile && styles.statValueMobile, isDark && styles.textDark]}>{userList.length} tài khoản</Text>
            <Text style={[styles.statLabel, isDark && styles.textMutedDark]}>Admin, Nhân viên & Khách</Text>
          </View>
        </View>

        {/* NAVIGATION SEGMENTED TABS */}
        <View style={styles.navBarWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabButtonsScroll}>
            {[
              { id: 'overview', label: 'Tổng quan', icon: 'speedometer-outline', badge: null },
              { id: 'reports', label: 'Báo cáo tháng', icon: 'bar-chart-outline', badge: null },
              {
                id: 'orders',
                label: 'Đơn hàng',
                icon: 'receipt-outline',
                badge: (pendingOrdersCount + returnOrdersCount) > 0 ? (pendingOrdersCount + returnOrdersCount) : null,
                badgeColor: returnOrdersCount > 0 ? '#f59e0b' : '#ef4444',
              },
              { id: 'support', label: 'Hỗ trợ KH', icon: 'chatbubbles-outline', badge: supportPendingCount > 0 ? supportPendingCount : null, badgeColor: '#7c3aed' },
              { id: 'products', label: 'Sản phẩm', icon: 'hardware-chip-outline', badge: productList.length },
              { id: 'inventory', label: 'Nhập / Xuất kho', icon: 'swap-vertical-outline', badge: null },
              { id: 'vouchers', label: 'Mã giảm giá', icon: 'ticket-outline', badge: voucherList.length },
              { id: 'categories', label: 'Danh mục', icon: 'grid-outline', badge: categoryList.length },
              { id: 'users', label: 'Tài khoản & Phân quyền', icon: 'shield-checkmark-outline', badge: userList.length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  style={[
                    styles.tabPill,
                    isDark && styles.tabPillDark,
                    isActive && styles.tabPillActive,
                  ]}
                  onPress={() => {
                    setActiveTab(tab.id as AdminTab);
                    setSearchTerm('');
                  }}
                >
                  <Ionicons
                    name={tab.icon as any}
                    size={17}
                    color={isActive ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.tabPillText, isDark && styles.textMutedDark, isActive && styles.tabPillTextActive]}>
                    {tab.label}
                  </Text>
                  {tab.badge !== null ? (
                    <View
                      style={[
                        styles.tabBadge,
                        { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : tab.badgeColor || '#e2e8f0' },
                      ]}
                    >
                      <Text style={[styles.tabBadgeText, isActive ? { color: '#ffffff' } : { color: tab.badgeColor ? '#ffffff' : '#475569' }]}>
                        {tab.badge}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* QUICK SEARCH FOR CURRENT TAB */}
          {activeTab !== 'overview' && activeTab !== 'reports' && (
            <View style={[styles.searchBox, isMobile && { minWidth: '100%', maxWidth: '100%' }, isDark && styles.searchBoxDark]}>
              <Ionicons name="search-outline" size={17} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder={
                  activeTab === 'products'
                    ? 'Tìm sản phẩm theo tên, mã, hãng...'
                    : activeTab === 'orders'
                    ? 'Tìm đơn hàng theo mã, địa chỉ, khách...'
                    : activeTab === 'vouchers'
                    ? 'Tìm mã voucher...'
                    : activeTab === 'users'
                    ? 'Tìm theo tên, email, sđt...'
                    : activeTab === 'support'
                    ? 'Tìm theo tên khách, liên hệ, nội dung...'
                    : 'Tìm kiếm nhanh...'
                }
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                style={[styles.searchInput, isDark && styles.textDark]}
              />
              {searchTerm ? (
                <Pressable onPress={() => setSearchTerm('')}>
                  <Ionicons name="close-circle" size={16} color="#94a3b8" />
                </Pressable>
              ) : null}
            </View>
          )}
        </View>

        {/* ======================================================== */}
        {/* TAB 1: TỔNG QUAN (OVERVIEW)                              */}
        {/* ======================================================== */}
        {activeTab === 'reports' && <MonthlyReport />}
        {activeTab === 'overview' && (
          <View style={styles.overviewContainer}>
            {/* HERO WELCOME */}
            <View style={[styles.welcomeCard, isMobile && styles.welcomeCardMobile]}>
              <View style={[styles.welcomeLeft, isMobile && styles.welcomeLeftMobile]}>
                <View style={[styles.welcomeAvatar, isMobile && { width: 44, height: 44, borderRadius: 12 }]}>
                  <Ionicons name="shield-checkmark" size={isMobile ? 22 : 28} color="#ffffff" />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.welcomeGreeting, isMobile && { fontSize: 16 }]}>
                    Xin chào, {user?.name || 'Quản trị viên DANGVINHPC'} 👋
                  </Text>
                  <Text style={[styles.welcomeDesc, isMobile && { fontSize: 12, lineHeight: 17 }]}>
                    Cửa hàng đang hoạt động bình thường. Hôm nay bạn có {pendingOrdersCount} đơn hàng mới cần duyệt
                    {returnOrdersCount > 0 ? ` và ${returnOrdersCount} yêu cầu đổi trả / bảo hành chờ xử lý.` : '.'}
                  </Text>
                </View>
              </View>
              <View style={[styles.welcomeRightActions, isMobile && styles.welcomeRightActionsMobile]}>
                <Pressable style={[styles.welcomeBtn, isMobile && { flex: 1, justifyContent: 'center' }]} onPress={() => setActiveTab('orders')}>
                  <Ionicons name="receipt" size={16} color="#2563eb" />
                  <Text style={styles.welcomeBtnText}>{isMobile ? 'Xử lý đơn' : 'Xử lý đơn hàng'}</Text>
                </Pressable>
                <Pressable style={[styles.welcomeBtn, { backgroundColor: '#10b981' }, isMobile && { flex: 1, justifyContent: 'center' }]} onPress={handleOpenAddProduct}>
                  <Ionicons name="add-circle" size={16} color="#ffffff" />
                  <Text style={[styles.welcomeBtnText, { color: '#ffffff' }]}>{isMobile ? 'Đăng SP' : 'Đăng sản phẩm'}</Text>
                </Pressable>
              </View>
            </View>

            {/* ======================================================== */}
            {/* CARD THEO DÕI ĐƠN HÀNG THEO NGÀY (HÔM NAY / HÔM QUA...)    */}
            {/* ======================================================== */}
            {(() => {
              const pad = (n: number) => String(n).padStart(2, '0');
              const now = new Date();
              const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
              const yesterday = new Date(now);
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = `${yesterday.getFullYear()}-${pad(yesterday.getMonth() + 1)}-${pad(yesterday.getDate())}`;

              // Mặc định chọn ngày đang chọn ở bộ lọc (selectedSpecificDate), nếu không có thì lấy hôm nay
              const targetDateStr = selectedSpecificDate || todayStr;
              const isToday = targetDateStr === todayStr;
              const isYesterday = targetDateStr === yesterdayStr;
              const [tY, tM, tD] = (targetDateStr || '').split('-');
              const displayDateLabel = isToday
                ? `Hôm nay (${tD}/${tM})`
                : isYesterday
                ? `Hôm qua (${tD}/${tM})`
                : `Ngày ${tD}/${tM}/${tY}`;

              // Lọc các đơn của ngày được chọn
              const dayOrders = orderList.filter((o) => {
                return getOrderDateKey(o.createdAt) === targetDateStr;
              });

              // Đếm số đơn hôm nay và hôm qua để hiển thị badge trên nút
              const todayCount = orderList.filter((o) => {
                return getOrderDateKey(o.createdAt) === todayStr;
              }).length;

              const yesterdayCount = orderList.filter((o) => {
                return getOrderDateKey(o.createdAt) === yesterdayStr;
              }).length;

              const statusGroups = [
                { key: 'pending',    label: 'Chờ duyệt',   color: '#f59e0b', bg: '#fffbeb', icon: 'time-outline' as const },
                { key: 'confirmed',  label: 'Đã xác nhận', color: '#3b82f6', bg: '#eff6ff', icon: 'checkmark-circle-outline' as const },
                { key: 'shipping',   label: 'Đang giao',   color: '#8b5cf6', bg: '#f5f3ff', icon: 'bicycle-outline' as const },
                { key: 'completed',  label: 'Hoàn tất',    color: '#10b981', bg: '#ecfdf5', icon: 'shield-checkmark-outline' as const },
                { key: 'cancelled',  label: 'Đã huỷ',      color: '#ef4444', bg: '#fef2f2', icon: 'close-circle-outline' as const },
                { key: 'returns',    label: 'Đổi/Trả',     color: '#f97316', bg: '#fff7ed', icon: 'return-down-back-outline' as const },
              ];

              const completedRevenue = dayOrders
                .filter((o) => o.status === 'completed')
                .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

              const totalGross = dayOrders
                .filter((o) => o.status !== 'cancelled')
                .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

              return (
                <View style={[styles.dashCard, isMobile && styles.dashCardMobile, isDark && styles.cardDark, { marginBottom: 16 }]}>
                  {/* HEADER & CHỌN NGÀY */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="calendar-outline" size={19} color="#10b981" />
                      </View>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={[styles.dashCardTitle, isDark && styles.textDark]}>
                            Đơn hàng: {displayDateLabel}
                          </Text>
                          {isToday && (
                            <View style={{ backgroundColor: '#10b98120', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                              <Text style={{ fontSize: 10, fontWeight: '700', color: '#10b981' }}>HÔM NAY</Text>
                            </View>
                          )}
                          {isYesterday && (
                            <View style={{ backgroundColor: '#2563eb20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                              <Text style={{ fontSize: 10, fontWeight: '700', color: '#2563eb' }}>HÔM QUA</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.dashCardSubtitle, isDark && styles.textMutedDark]}>
                          Chi tiết các đơn hàng phát sinh ngày {`${tD}/${tM}/${tY}`}
                        </Text>
                      </View>
                    </View>

                    {/* TỔNG ĐƠN GÓC PHẢI */}
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 24, fontWeight: '800', color: dayOrders.length > 0 ? '#10b981' : '#94a3b8' }}>
                        {dayOrders.length}
                      </Text>
                      <Text style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>đơn hàng phát sinh</Text>
                    </View>
                  </View>

                  {/* THANH CHỌN NGÀY NHANH (HÔM NAY, HÔM QUA, CÁC NGÀY CÓ ĐƠN, DATE PICKER) */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 6,
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                    marginBottom: 14,
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: isDark ? '#94a3b8' : '#64748b', marginRight: 4 }}>
                      Chọn mốc ngày:
                    </Text>

                    {/* NÚT HÔM NAY */}
                    <Pressable
                      style={[
                        styles.quickDatePill,
                        isDark && styles.quickDatePillDark,
                        isToday && styles.quickDatePillActive,
                        { flexDirection: 'row', alignItems: 'center', gap: 4 }
                      ]}
                      onPress={() => setSelectedSpecificDate(todayStr)}
                    >
                      <Ionicons name="sunny-outline" size={12} color={isToday ? '#ffffff' : '#10b981'} />
                      <Text style={[styles.quickDatePillText, isToday && styles.quickDatePillTextActive]}>
                        Hôm nay ({todayCount}đ)
                      </Text>
                    </Pressable>

                    {/* NÚT HÔM QUA */}
                    <Pressable
                      style={[
                        styles.quickDatePill,
                        isDark && styles.quickDatePillDark,
                        isYesterday && styles.quickDatePillActive,
                        { flexDirection: 'row', alignItems: 'center', gap: 4 }
                      ]}
                      onPress={() => setSelectedSpecificDate(yesterdayStr)}
                    >
                      <Ionicons name="time-outline" size={12} color={isYesterday ? '#ffffff' : '#2563eb'} />
                      <Text style={[styles.quickDatePillText, isYesterday && styles.quickDatePillTextActive]}>
                        Hôm qua ({yesterdayCount}đ)
                      </Text>
                    </Pressable>

                    {/* CÁC NGÀY CÓ ĐƠN KHÁC */}
                    {availableOrderDates
                      .filter((od) => od.dateStr !== todayStr && od.dateStr !== yesterdayStr)
                      .slice(0, 4)
                      .map((od) => {
                        const isCur = targetDateStr === od.dateStr;
                        return (
                          <Pressable
                            key={od.dateStr}
                            style={[
                              styles.quickDatePill,
                              isDark && styles.quickDatePillDark,
                              isCur && styles.quickDatePillActive,
                            ]}
                            onPress={() => setSelectedSpecificDate(od.dateStr)}
                          >
                            <Text style={[styles.quickDatePillText, isCur && styles.quickDatePillTextActive]}>
                              {od.label} ({od.count}đ)
                            </Text>
                          </Pressable>
                        );
                      })}

                    {/* NATIVE / WEB DATE PICKER CHO PHÉP CHỌN BẤT KỲ NGÀY NÀO */}
                    {Platform.OS === 'web' && typeof document !== 'undefined' ? (
                      <View style={[styles.webDatePickerWrap, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }, { marginLeft: 'auto' }]}>
                        <Ionicons name="calendar" size={13} color="#2563eb" style={{ marginRight: 4 }} />
                        <input
                          type="date"
                          value={targetDateStr}
                          onChange={(e: any) => e?.target?.value && setSelectedSpecificDate(e.target.value)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            color: isDark ? '#f1f5f9' : '#0f172a',
                            fontSize: 12,
                            fontWeight: '600',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                          }}
                        />
                      </View>
                    ) : null}
                  </View>

                  {/* GRID 6 TRẠNG THÁI CỦA NGÀY ĐƯỢC CHỌN */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    {statusGroups.map((sg) => {
                      const cnt = sg.key === 'returns'
                        ? dayOrders.filter((o) => Boolean(o.returnStatus)).length
                        : dayOrders.filter((o) => o.status === sg.key).length;
                      return (
                        <Pressable
                          key={sg.key}
                          style={[{
                            flex: 1, minWidth: 105,
                            flexDirection: 'row', alignItems: 'center', gap: 8,
                            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : sg.bg,
                            borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
                            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : `${sg.color}35`,
                          }]}
                          onPress={() => {
                            if (sg.key === 'returns') {
                              setOrderStatusFilter('returns');
                            } else {
                              setOrderStatusFilter(sg.key);
                            }
                            setActiveTab('orders');
                          }}
                        >
                          <Ionicons name={sg.icon} size={15} color={sg.color} />
                          <View>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: sg.color }}>{cnt}</Text>
                            <Text style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>{sg.label}</Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* DÒNG TỔNG DOANH THU & GIÁ TRỊ CỦA NGÀY NÀY */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                    backgroundColor: isDark ? 'rgba(16,185,129,0.08)' : '#ecfdf5',
                    borderRadius: 10,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(16,185,129,0.2)' : '#a7f3d0',
                    marginBottom: 14,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="cash-outline" size={18} color="#10b981" />
                      <View>
                        <Text style={{ fontSize: 13, color: isDark ? '#6ee7b7' : '#065f46', fontWeight: '700' }}>
                          Thực thu ngày {`${tD}/${tM}`}: {formatPrice(completedRevenue)}
                        </Text>
                        <Text style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#059669' }}>
                          Tổng giá trị đơn phát sinh: {formatPrice(totalGross)}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor: '#10b981',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 6,
                      }}
                      onPress={() => {
                        setOrderStatusFilter('all');
                        setActiveTab('orders');
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#ffffff' }}>Mở quản lý đơn</Text>
                      <Ionicons name="arrow-forward" size={12} color="#ffffff" />
                    </Pressable>
                  </View>

                  {/* DANH SÁCH ĐƠN HÀNG CỦA NGÀY NÀY */}
                  {dayOrders.length > 0 ? (
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Danh sách đơn ngày {`${tD}/${tM}/${tY}`} ({dayOrders.length} đơn)
                        </Text>
                        <Text style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
                          Bấm vào đơn để xem & xử lý trong tab Đơn hàng
                        </Text>
                      </View>

                      <View style={{ gap: 8 }}>
                        {dayOrders.map((o) => {
                          const badge = getStatusBadgeStyle(o.status);
                          const customer = userList.find((u) => u.id === o.userId);
                          const customerTitle = customer?.name || (o as any).customerName || (o.shippingAddress ? o.shippingAddress.split(',')[0] : 'Khách vãng lai');
                          const orderTime = o.createdAt
                            ? new Date(o.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            : '--:--';

                          return (
                            <Pressable
                              key={o.id}
                              style={({ hovered }: any) => [
                                {
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexWrap: 'wrap',
                                  gap: 10,
                                  padding: 10,
                                  borderRadius: 8,
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                  borderWidth: 1,
                                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                },
                                hovered && { borderColor: '#3b82f6', backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff' },
                              ]}
                              onPress={() => {
                                setSearchTerm(o.orderNumber || String(o.id));
                                setActiveTab('orders');
                              }}
                            >
                              {/* CỘT TRÁI: MÃ ĐƠN, GIỜ, KHÁCH, HÀNG HÓA */}
                              <View style={{ flex: 1, minWidth: isMobile ? 0 : 240 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#2563eb' }}>
                                    {o.orderNumber || `#ORD-${o.id}`}
                                  </Text>
                                  <Text style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
                                    • {orderTime}
                                  </Text>
                                  <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                                    • {customerTitle}
                                  </Text>
                                </View>

                                {o.items?.length ? (
                                  <Text style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} numberOfLines={1}>
                                    🛒 {o.items.map((it) => `${it.name} (x${it.quantity})`).join(' • ')}
                                  </Text>
                                ) : (
                                  <Text style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }} numberOfLines={1}>
                                    📍 {o.shippingAddress || 'Không có địa chỉ chi tiết'}
                                  </Text>
                                )}
                              </View>

                              {/* CỘT PHẢI: TIỀN, TRẠNG THÁI, NÚT XEM */}
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <View style={{ alignItems: 'flex-end' }}>
                                  <Text style={{ fontSize: 14, fontWeight: '800', color: o.status === 'cancelled' ? '#dc2626' : '#0f172a', ...(isDark && o.status !== 'cancelled' ? { color: '#f1f5f9' } : {}) }}>
                                    {formatPrice(Number(o.totalAmount) || 0)}
                                  </Text>
                                  <Text style={{ fontSize: 10, color: isDark ? '#64748b' : '#94a3b8' }}>
                                    {o.paymentMethod === 'cod' ? 'COD' : o.paymentMethod?.toUpperCase()}
                                  </Text>
                                </View>

                                <View style={[styles.statusTag, { backgroundColor: badge.bg, borderColor: badge.border, paddingVertical: 2, paddingHorizontal: 6 }]}>
                                  <Text style={[styles.statusTagText, { color: badge.color, fontSize: 10 }]}>
                                    {getStatusLabel(o.status)}
                                  </Text>
                                </View>

                                <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: isDark ? '#1e293b' : '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}>
                                  <Ionicons name="chevron-forward" size={14} color="#64748b" />
                                </View>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ) : (
                    /* EMPTY STATE KHI NGÀY ĐÓ CHƯA CÓ ĐƠN */
                    <View style={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 }}>
                      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: isDark ? '#1e293b' : '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                        <Ionicons name="receipt-outline" size={24} color={isDark ? '#64748b' : '#94a3b8'} />
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 4 }}>
                        Không có đơn hàng nào vào {displayDateLabel}
                      </Text>
                      <Text style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', textAlign: 'center', maxWidth: 420, marginBottom: 12 }}>
                        Không có giao dịch phát sinh vào ngày {`${tD}/${tM}/${tY}`}. Bạn có thể bấm chọn ngày hôm qua hoặc mốc ngày có phát sinh đơn hàng bên dưới để kiểm tra.
                      </Text>

                      {/* GỢI Ý CHUYỂN NHANH SANG NGÀY CÓ ĐƠN */}
                      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {yesterdayCount > 0 && !isYesterday && (
                          <Pressable
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 6,
                              backgroundColor: '#2563eb',
                              paddingHorizontal: 12,
                              paddingVertical: 7,
                              borderRadius: 8,
                            }}
                            onPress={() => setSelectedSpecificDate(yesterdayStr)}
                          >
                            <Ionicons name="time-outline" size={14} color="#ffffff" />
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#ffffff' }}>
                              Xem đơn Hôm qua ({yesterdayCount} đơn)
                            </Text>
                          </Pressable>
                        )}

                        {availableOrderDates.length > 0 && availableOrderDates[0].dateStr !== targetDateStr && (
                          <Pressable
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 6,
                              backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                              borderWidth: 1,
                              borderColor: isDark ? '#334155' : '#cbd5e1',
                              paddingHorizontal: 12,
                              paddingVertical: 7,
                              borderRadius: 8,
                            }}
                            onPress={() => setSelectedSpecificDate(availableOrderDates[0].dateStr)}
                          >
                            <Ionicons name="calendar" size={14} color="#2563eb" />
                            <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                              Xem ngày gần nhất ({availableOrderDates[0].label} - {availableOrderDates[0].count} đơn)
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              );
            })()}

            {/* ======================================================== */}
            {/* BÁO CÁO DOANH THU BÁN HÀNG THEO NGÀY / THÁNG / NĂM       */}
            {/* ======================================================== */}
            {(() => {
              const {
                chartList,
                periodTitle,
                periodSubtitle,
                maxRevenue,
                totalPeriodRev,
                totalPeriodOrders,
                aovPeriod,
                activeCount,
                peakRevenue,
                peakDate,
                revGrowthPct,
                ordersGrowthPct,
              } = revenueChartData;

              const displayedTableList = chartTableOnlyActive
                ? chartList.filter((item) => item.revenue > 0 || item.count > 0)
                : chartList;

              const formatCompact = (val: number) => {
                if (val <= 0) return '0 ₫';
                if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)} tr`;
                if (val >= 1_000) return `${Math.round(val / 1_000)}k`;
                return `${val} ₫`;
              };

              const yTicks = [
                { pct: 100, label: maxRevenue > 0 ? formatCompact(maxRevenue) : '1 tr' },
                { pct: 75, label: maxRevenue > 0 ? formatCompact(maxRevenue * 0.75) : '750k' },
                { pct: 50, label: maxRevenue > 0 ? formatCompact(maxRevenue * 0.5) : '500k' },
                { pct: 25, label: maxRevenue > 0 ? formatCompact(maxRevenue * 0.25) : '250k' },
                { pct: 0, label: '0 ₫' },
              ];

              return (
                <View style={{ gap: 16, marginBottom: 16 }}>
                  {/* ======================================================== */}
                  {/* CARD 1: TOP DASHBOARD & BỘ LỌC DOANH THU + 4 PASTEL KPIS  */}
                  {/* ======================================================== */}
                  <View style={[styles.revenueDashCard, isDark && styles.cardDark]}>
                    {/* HEADER BÁO CÁO */}
                    <View style={[styles.dashCardHeader, { flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }]}>
                      <View style={{ flex: 1, minWidth: 240 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="bar-chart" size={18} color="#2563eb" />
                          </View>
                          <Text style={[styles.dashCardTitle, isDark && styles.textDark, { fontSize: 17, fontWeight: '800' }]}>
                            Báo cáo doanh thu bán hàng
                          </Text>
                        </View>
                        <Text style={[styles.dashCardSubtitle, isDark && styles.textMutedDark, { fontSize: 12, lineHeight: 18 }]}>
                          Thống kê chi tiết doanh thu bán hàng theo mốc thời gian. Theo dõi xu hướng và hiệu quả kinh doanh.
                        </Text>
                      </View>

                      {/* 6 MODE PILLS */}
                      <View style={styles.revenueModePillsRow}>
                        {[
                          { id: 'day', label: 'Theo Ngày', icon: 'today-outline' },
                          { id: 'day_7', label: '7 Ngày gần nhất', icon: 'calendar-outline' },
                          { id: 'day_30', label: '30 Ngày qua', icon: 'calendar-number-outline' },
                          { id: 'month', label: `Tháng này (T${chartCustomMonth}/${chartCustomYear})`, icon: 'calendar' },
                          { id: 'year', label: `Theo Năm (${chartCustomYear})`, icon: 'time-outline' },
                          { id: 'range', label: 'Khoảng ngày', icon: 'options-outline' },
                        ].map((m) => {
                          const isSel = revenueChartMode === m.id;
                          return (
                            <Pressable
                              key={m.id}
                              style={[
                                styles.revenueModePillBtn,
                                isDark && styles.revenueModePillBtnDark,
                                isSel && styles.revenueModePillBtnActive,
                              ]}
                              onPress={() => setRevenueChartMode(m.id as any)}
                            >
                              <Ionicons
                                name={m.icon as any}
                                size={13}
                                color={isSel ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'}
                                style={{ marginRight: 4 }}
                              />
                              <Text
                                style={[
                                  styles.revenueModePillText,
                                  isDark && styles.textMutedDark,
                                  isSel && styles.revenueModePillTextActive,
                                ]}
                              >
                                {m.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    {/* SUB-TOOLBAR (when in Day mode - Chọn ngày cụ thể) */}
                    {revenueChartMode === 'day' && (
                      <View style={[styles.chartSubFilterRow, isDark && styles.chartSubFilterRowDark]}>
                        <Pressable
                          style={[styles.chartSubNavBtn, isDark && styles.chartSubNavBtnDark]}
                          onPress={() => {
                            const [y, m, d] = (chartSingleDate || '').split('-').map(Number);
                            const dt = new Date(y, m - 1, d);
                            dt.setDate(dt.getDate() - 1);
                            const pad = (n: number) => String(n).padStart(2, '0');
                            setChartSingleDate(`${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`);
                          }}
                        >
                          <Ionicons name="chevron-back" size={13} color={isDark ? '#cbd5e1' : '#475569'} />
                          <Text style={[styles.chartSubNavBtnText, isDark && styles.chartSubNavBtnTextDark]}>Ngày trước</Text>
                        </Pressable>

                        {/* Ô CHỌN NGÀY (DATE PICKER NỔI BẬT) */}
                        {Platform.OS === 'web' && typeof document !== 'undefined' ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                              border: '1.5px solid #2563eb',
                              borderRadius: '10px',
                              padding: '6px 12px',
                              gap: '8px',
                            }}
                          >
                            <Ionicons name="calendar" size={14} color="#2563eb" />
                            <span style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569' }}>
                              Chọn ngày:
                            </span>
                            <input
                              type="date"
                              value={chartSingleDate}
                              onChange={(e: any) => e?.target?.value && setChartSingleDate(e.target.value)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                color: '#2563eb',
                                fontSize: '13px',
                                fontWeight: '800',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                              }}
                            />
                          </div>
                        ) : null}

                        <Pressable
                          style={[styles.chartSubNavBtn, isDark && styles.chartSubNavBtnDark]}
                          onPress={() => {
                            const [y, m, d] = (chartSingleDate || '').split('-').map(Number);
                            const dt = new Date(y, m - 1, d);
                            dt.setDate(dt.getDate() + 1);
                            const pad = (n: number) => String(n).padStart(2, '0');
                            setChartSingleDate(`${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`);
                          }}
                        >
                          <Text style={[styles.chartSubNavBtnText, isDark && styles.chartSubNavBtnTextDark]}>Ngày sau</Text>
                          <Ionicons name="chevron-forward" size={13} color={isDark ? '#cbd5e1' : '#475569'} />
                        </Pressable>

                        {/* Nút Hôm nay */}
                        <Pressable
                          style={[
                            styles.chartSubNavBtn,
                            isDark && styles.chartSubNavBtnDark,
                            (() => {
                              const pad = (n: number) => String(n).padStart(2, '0');
                              const d = new Date();
                              return chartSingleDate === `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                            })() && { borderColor: '#2563eb', backgroundColor: isDark ? '#1e293b' : '#eff6ff' },
                          ]}
                          onPress={() => {
                            const pad = (n: number) => String(n).padStart(2, '0');
                            const d = new Date();
                            setChartSingleDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
                          }}
                        >
                          <Ionicons name="today-outline" size={13} color="#2563eb" />
                          <Text style={[styles.chartSubNavBtnText, { color: '#2563eb', fontWeight: '700' }]}>Hôm nay</Text>
                        </Pressable>

                        {/* Nút Hôm qua */}
                        <Pressable
                          style={[styles.chartSubNavBtn, isDark && styles.chartSubNavBtnDark]}
                          onPress={() => {
                            const pad = (n: number) => String(n).padStart(2, '0');
                            const d = new Date();
                            d.setDate(d.getDate() - 1);
                            setChartSingleDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
                          }}
                        >
                          <Text style={[styles.chartSubNavBtnText, isDark && styles.chartSubNavBtnTextDark]}>Hôm qua</Text>
                        </Pressable>

                        {/* Quick pills các ngày có đơn hàng gần đây */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 4 }}>
                          {availableOrderDates.slice(0, 5).map((od) => {
                            const isCur = chartSingleDate === od.dateStr;
                            return (
                              <Pressable
                                key={od.dateStr}
                                style={[
                                  styles.chartMonthPill,
                                  isDark && styles.chartMonthPillDark,
                                  isCur && styles.chartMonthPillActive,
                                ]}
                                onPress={() => setChartSingleDate(od.dateStr)}
                              >
                                <Text style={[styles.chartMonthPillText, isCur && styles.chartMonthPillTextActive]}>
                                  {od.label} ({od.count}đ)
                                </Text>
                              </Pressable>
                            );
                          })}
                        </ScrollView>

                        <View style={{ marginLeft: 'auto' }}>
                          <Text style={{ fontSize: 11, fontWeight: '700', color: isDark ? '#94a3b8' : '#64748b' }}>
                            ⏰ {periodSubtitle}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* SUB-TOOLBAR (when in Month mode) */}
                    {revenueChartMode === 'month' && (
                      <View style={[styles.chartSubFilterRow, isDark && styles.chartSubFilterRowDark]}>
                        {/* Nút lùi tháng */}
                        <Pressable
                          style={[styles.chartSubNavBtn, isDark && styles.chartSubNavBtnDark]}
                          onPress={() => {
                            if (chartCustomMonth === 1) {
                              setChartCustomMonth(12);
                              setChartCustomYear((y) => y - 1);
                            } else {
                              setChartCustomMonth((m) => m - 1);
                            }
                          }}
                        >
                          <Ionicons name="chevron-back" size={13} color={isDark ? '#cbd5e1' : '#475569'} />
                          <Text style={[styles.chartSubNavBtnText, isDark && styles.chartSubNavBtnTextDark]}>Tháng trước</Text>
                        </Pressable>

                        {/* Month Pills T1 - T12 */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 4 }}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                            const isCurM = chartCustomMonth === m;
                            return (
                              <Pressable
                                key={m}
                                style={[
                                  styles.chartMonthPill,
                                  isDark && styles.chartMonthPillDark,
                                  isCurM && styles.chartMonthPillActive,
                                ]}
                                onPress={() => setChartCustomMonth(m)}
                              >
                                <Text style={[styles.chartMonthPillText, isCurM && styles.chartMonthPillTextActive]}>
                                  T{m}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </ScrollView>

                        {/* Ô CHỌN NĂM (SELECT DROPDOWN CHO THÁNG) */}
                        {Platform.OS === 'web' && typeof document !== 'undefined' ? (
                          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                            <select
                              value={chartCustomYear}
                              onChange={(e: any) => setChartCustomYear(Number(e.target.value))}
                              style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                                color: '#2563eb',
                                fontWeight: '800',
                                fontSize: '13px',
                                border: '1.5px solid #2563eb',
                                borderRadius: '10px',
                                padding: '6px 28px 6px 10px',
                                cursor: 'pointer',
                                outline: 'none',
                                fontFamily: 'inherit',
                              }}
                            >
                              {availableChartYears.map((yr) => (
                                <option key={yr} value={yr} style={{ color: '#0f172a', fontWeight: '600' }}>
                                  Năm {yr} {yr === new Date().getFullYear() ? '(Năm nay)' : ''}
                                </option>
                              ))}
                            </select>
                            <span style={{ position: 'absolute', right: 8, pointerEvents: 'none', color: '#2563eb', fontSize: '9px' }}>
                              ▼
                            </span>
                          </div>
                        ) : (
                          <View style={{ position: 'relative', zIndex: 60 }}>
                            <Pressable
                              style={[
                                styles.chartSubNavBtn,
                                isDark && styles.chartSubNavBtnDark,
                                showYearDropdown && { borderColor: '#2563eb' },
                              ]}
                              onPress={() => setShowYearDropdown((v) => !v)}
                            >
                              <Ionicons name="calendar-outline" size={13} color="#2563eb" />
                              <Text style={[styles.chartSubNavBtnText, { fontWeight: '700', color: isDark ? '#f8fafc' : '#0f172a' }]}>
                                Năm {chartCustomYear}
                              </Text>
                              <Ionicons name={showYearDropdown ? "chevron-up" : "chevron-down"} size={12} color="#64748b" />
                            </Pressable>

                            {showYearDropdown && (
                              <View style={[styles.yearDropdownMenu, isDark && styles.yearDropdownMenuDark]}>
                                {availableChartYears.map((yr) => (
                                  <Pressable
                                    key={yr}
                                    style={[
                                      styles.yearDropdownItem,
                                      yr === chartCustomYear && (isDark ? styles.yearDropdownItemActiveDark : styles.yearDropdownItemActive),
                                    ]}
                                    onPress={() => {
                                      setChartCustomYear(yr);
                                      setShowYearDropdown(false);
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.yearDropdownItemText,
                                        isDark && styles.textDark,
                                        yr === chartCustomYear && { color: '#2563eb', fontWeight: '800' },
                                      ]}
                                    >
                                      Năm {yr}
                                    </Text>
                                    {yr === chartCustomYear && <Ionicons name="checkmark" size={14} color="#2563eb" />}
                                  </Pressable>
                                ))}
                              </View>
                            )}
                          </View>
                        )}

                        {/* Nút Tháng này */}
                        <Pressable
                          style={[
                            styles.chartSubNavBtn,
                            isDark && styles.chartSubNavBtnDark,
                            chartCustomMonth === new Date().getMonth() + 1 && chartCustomYear === new Date().getFullYear() && { borderColor: '#2563eb' },
                          ]}
                          onPress={() => {
                            setChartCustomMonth(new Date().getMonth() + 1);
                            setChartCustomYear(new Date().getFullYear());
                          }}
                        >
                          <Ionicons name="today-outline" size={13} color="#2563eb" />
                          <Text style={[styles.chartSubNavBtnText, { color: '#2563eb' }]}>Tháng này</Text>
                        </Pressable>

                        {/* Nút tiến tháng */}
                        <Pressable
                          style={[styles.chartSubNavBtn, isDark && styles.chartSubNavBtnDark]}
                          onPress={() => {
                            if (chartCustomMonth === 12) {
                              setChartCustomMonth(1);
                              setChartCustomYear((y) => y + 1);
                            } else {
                              setChartCustomMonth((m) => m + 1);
                            }
                          }}
                        >
                          <Text style={[styles.chartSubNavBtnText, isDark && styles.chartSubNavBtnTextDark]}>Tháng sau</Text>
                          <Ionicons name="chevron-forward" size={13} color={isDark ? '#cbd5e1' : '#475569'} />
                        </Pressable>

                        {/* Checkbox badge: Hiển thị chi tiết ngày */}
                        <Pressable
                          style={[styles.checkboxNoticeWrap, isDark && styles.checkboxNoticeWrapDark]}
                          onPress={() => setShowDetailNotice((prev) => !prev)}
                        >
                          <View style={[styles.checkboxBox, showDetailNotice && styles.checkboxBoxChecked]}>
                            {showDetailNotice && <Ionicons name="checkmark" size={11} color="#ffffff" />}
                          </View>
                          <Text style={[styles.checkboxNoticeText, isDark && styles.textDark]}>
                            Hiển thị chi tiết {chartList.length} ngày của {periodTitle}
                          </Text>
                        </Pressable>
                      </View>
                    )}

                    {/* SUB-TOOLBAR (when in Year mode) */}
                    {revenueChartMode === 'year' && (
                      <View style={[styles.chartSubFilterRow, isDark && styles.chartSubFilterRowDark]}>
                        <Pressable
                          style={[styles.chartSubNavBtn, isDark && styles.chartSubNavBtnDark]}
                          onPress={() => setChartCustomYear((y) => y - 1)}
                        >
                          <Ionicons name="chevron-back" size={13} color={isDark ? '#cbd5e1' : '#475569'} />
                          <Text style={[styles.chartSubNavBtnText, isDark && styles.chartSubNavBtnTextDark]}>Năm trước</Text>
                        </Pressable>

                        {/* Ô CHỌN NĂM (SELECT / DROPDOWN NỔI BẬT DỄ CHỌN BẬC NHẤT) */}
                        {Platform.OS === 'web' && typeof document !== 'undefined' ? (
                          <div
                            style={{
                              position: 'relative',
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                              border: '1.5px solid #2563eb',
                              borderRadius: '10px',
                              padding: '2px 8px',
                              gap: '6px',
                            }}
                          >
                            <Ionicons name="calendar-outline" size={14} color="#2563eb" />
                            <span style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569' }}>
                              Chọn năm:
                            </span>
                            <select
                              value={chartCustomYear}
                              onChange={(e: any) => setChartCustomYear(Number(e.target.value))}
                              style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                backgroundColor: 'transparent',
                                color: '#2563eb',
                                fontWeight: '800',
                                fontSize: '13px',
                                border: 'none',
                                padding: '4px 22px 4px 4px',
                                cursor: 'pointer',
                                outline: 'none',
                                fontFamily: 'inherit',
                              }}
                            >
                              {availableChartYears.map((yr) => (
                                <option key={yr} value={yr} style={{ color: '#0f172a', fontWeight: '600' }}>
                                  Năm {yr} {yr === new Date().getFullYear() ? '★ (Năm nay)' : ''}
                                </option>
                              ))}
                            </select>
                            <span style={{ position: 'absolute', right: 8, pointerEvents: 'none', color: '#2563eb', fontSize: '9px' }}>
                              ▼
                            </span>
                          </div>
                        ) : (
                          <Pressable
                            style={[
                              styles.chartSubNavBtn,
                              isDark && styles.chartSubNavBtnDark,
                              { borderColor: '#2563eb', backgroundColor: isDark ? '#1e293b' : '#eff6ff' },
                            ]}
                            onPress={() => setShowYearDropdown((v) => !v)}
                          >
                            <Ionicons name="calendar-outline" size={13} color="#2563eb" />
                            <Text style={{ fontWeight: '800', color: '#2563eb', fontSize: 13 }}>Năm {chartCustomYear}</Text>
                            <Ionicons name={showYearDropdown ? 'chevron-up' : 'chevron-down'} size={12} color="#2563eb" />
                          </Pressable>
                        )}

                        {/* Quick pills cho các năm gần nhất */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          {availableChartYears.slice(0, 4).map((yr) => {
                            const isCurY = chartCustomYear === yr;
                            return (
                              <Pressable
                                key={yr}
                                style={[
                                  styles.chartMonthPill,
                                  isDark && styles.chartMonthPillDark,
                                  isCurY && styles.chartMonthPillActive,
                                  { paddingHorizontal: 12 },
                                ]}
                                onPress={() => setChartCustomYear(yr)}
                              >
                                <Text style={[styles.chartMonthPillText, isCurY && styles.chartMonthPillTextActive]}>
                                  Năm {yr}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>

                        <Pressable
                          style={[styles.chartSubNavBtn, isDark && styles.chartSubNavBtnDark]}
                          onPress={() => setChartCustomYear((y) => y + 1)}
                        >
                          <Text style={[styles.chartSubNavBtnText, isDark && styles.chartSubNavBtnTextDark]}>Năm sau</Text>
                          <Ionicons name="chevron-forward" size={13} color={isDark ? '#cbd5e1' : '#475569'} />
                        </Pressable>

                        <Pressable
                          style={[
                            styles.chartSubNavBtn,
                            isDark && styles.chartSubNavBtnDark,
                            chartCustomYear === new Date().getFullYear() && { borderColor: '#2563eb', backgroundColor: isDark ? '#1e293b' : '#eff6ff' },
                          ]}
                          onPress={() => setChartCustomYear(new Date().getFullYear())}
                        >
                          <Ionicons name="today-outline" size={13} color="#2563eb" />
                          <Text style={[styles.chartSubNavBtnText, { color: '#2563eb', fontWeight: '700' }]}>Năm nay</Text>
                        </Pressable>

                        <View style={{ marginLeft: 'auto' }}>
                          <Text style={{ fontSize: 11, fontWeight: '700', color: isDark ? '#94a3b8' : '#64748b' }}>
                            📆 {periodSubtitle}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* SUB-TOOLBAR (when in Range mode) */}
                    {revenueChartMode === 'range' && (
                      <View style={[styles.chartSubFilterRow, isDark && styles.chartSubFilterRowDark]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {Platform.OS === 'web' && typeof document !== 'undefined' ? (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                                border: '1.5px solid #2563eb',
                                borderRadius: '10px',
                                padding: '6px 12px',
                                gap: '8px',
                              }}
                            >
                              <Ionicons name="calendar-outline" size={14} color="#2563eb" />
                              <span style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569' }}>
                                Từ ngày:
                              </span>
                              <input
                                type="date"
                                value={chartRangeStart}
                                onChange={(e: any) => e?.target?.value && setChartRangeStart(e.target.value)}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  outline: 'none',
                                  color: '#2563eb',
                                  fontSize: '13px',
                                  fontWeight: '800',
                                  fontFamily: 'inherit',
                                  cursor: 'pointer',
                                }}
                              />
                            </div>
                          ) : null}

                          <Ionicons name="arrow-forward" size={14} color="#94a3b8" />

                          {Platform.OS === 'web' && typeof document !== 'undefined' ? (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: isDark ? '#1e293b' : '#eff6ff',
                                border: '1.5px solid #2563eb',
                                borderRadius: '10px',
                                padding: '6px 12px',
                                gap: '8px',
                              }}
                            >
                              <Ionicons name="calendar-outline" size={14} color="#2563eb" />
                              <span style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569' }}>
                                Đến ngày:
                              </span>
                              <input
                                type="date"
                                value={chartRangeEnd}
                                onChange={(e: any) => e?.target?.value && setChartRangeEnd(e.target.value)}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  outline: 'none',
                                  color: '#2563eb',
                                  fontSize: '13px',
                                  fontWeight: '800',
                                  fontFamily: 'inherit',
                                  cursor: 'pointer',
                                }}
                              />
                            </div>
                          ) : null}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                          {[
                            { label: '7 ngày', days: 7 },
                            { label: '14 ngày', days: 14 },
                            { label: '30 ngày', days: 30 },
                          ].map((p) => (
                            <Pressable
                              key={p.days}
                              style={[styles.chartMonthPill, isDark && styles.chartMonthPillDark]}
                              onPress={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - (p.days - 1));
                                const pad = (n: number) => String(n).padStart(2, '0');
                                setChartRangeStart(`${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`);
                                setChartRangeEnd(`${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`);
                              }}
                            >
                              <Text style={styles.chartMonthPillText}>{p.label}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* 4 PASTEL KPI SUMMARY CARDS */}
                    <View style={styles.kpiPastelGrid}>
                      {/* Card 1: Xanh Dương Pastel */}
                      <View style={[styles.kpiPastelCard, styles.kpiPastelBlue, isDark && styles.kpiPastelBlueDark]}>
                        <View style={styles.kpiPastelWatermark} pointerEvents="none">
                          <Ionicons name="trending-up" size={76} color={isDark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.06)'} />
                        </View>
                        <View style={styles.kpiPastelHeader}>
                          <View style={[styles.kpiPastelIconBox, { backgroundColor: '#dbeafe' }]}>
                            <Ionicons name="cart-outline" size={16} color="#2563eb" />
                          </View>
                          <Text style={[styles.kpiPastelLabel, isDark && styles.textDark]}>Tổng doanh thu trong kỳ</Text>
                        </View>
                        <Text style={[styles.kpiPastelValue, { color: '#1d4ed8' }, isDark && { color: '#60a5fa' }]} numberOfLines={1}>
                          {formatPrice(totalPeriodRev)}
                        </Text>
                        <View style={styles.kpiPastelFooter}>
                          <View style={[styles.kpiGrowthBadge, revGrowthPct >= 0 ? styles.kpiGrowthUp : styles.kpiGrowthDown]}>
                            <Ionicons
                              name={revGrowthPct >= 0 ? 'arrow-up' : 'arrow-down'}
                              size={10}
                              color={revGrowthPct >= 0 ? '#15803d' : '#b91c1c'}
                            />
                            <Text style={[styles.kpiGrowthText, { color: revGrowthPct >= 0 ? '#15803d' : '#b91c1c' }]}>
                              {revGrowthPct >= 0 ? `+${revGrowthPct}%` : `${revGrowthPct}%`}
                            </Text>
                          </View>
                          <Text style={[styles.kpiPastelSubtext, isDark && styles.textMutedDark]}>so với kỳ trước</Text>
                        </View>
                      </View>

                      {/* Card 2: Xanh Lá Ngọc Lục Bảo (Emerald) Pastel */}
                      <View style={[styles.kpiPastelCard, styles.kpiPastelEmerald, isDark && styles.kpiPastelEmeraldDark]}>
                        <View style={styles.kpiPastelWatermark} pointerEvents="none">
                          <Ionicons name="bag-handle" size={76} color={isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)'} />
                        </View>
                        <View style={styles.kpiPastelHeader}>
                          <View style={[styles.kpiPastelIconBox, { backgroundColor: '#dcfce7' }]}>
                            <Ionicons name="receipt-outline" size={16} color="#16a34a" />
                          </View>
                          <Text style={[styles.kpiPastelLabel, isDark && styles.textDark]}>Số lượng đơn hàng</Text>
                        </View>
                        <Text style={[styles.kpiPastelValue, { color: '#15803d' }, isDark && { color: '#4ade80' }]}>
                          {totalPeriodOrders} <Text style={{ fontSize: 13, fontWeight: '700' }}>đơn</Text>
                        </Text>
                        <View style={styles.kpiPastelFooter}>
                          <View style={[styles.kpiGrowthBadge, ordersGrowthPct >= 0 ? styles.kpiGrowthUp : styles.kpiGrowthDown]}>
                            <Ionicons
                              name={ordersGrowthPct >= 0 ? 'arrow-up' : 'arrow-down'}
                              size={10}
                              color={ordersGrowthPct >= 0 ? '#15803d' : '#b91c1c'}
                            />
                            <Text style={[styles.kpiGrowthText, { color: ordersGrowthPct >= 0 ? '#15803d' : '#b91c1c' }]}>
                              {ordersGrowthPct >= 0 ? `+${ordersGrowthPct}%` : `${ordersGrowthPct}%`}
                            </Text>
                          </View>
                          <Text style={[styles.kpiPastelSubtext, isDark && styles.textMutedDark]}>so với kỳ trước</Text>
                        </View>
                      </View>

                      {/* Card 3: Tím Pastel (Purple) */}
                      <View style={[styles.kpiPastelCard, styles.kpiPastelPurple, isDark && styles.kpiPastelPurpleDark]}>
                        <View style={styles.kpiPastelWatermark} pointerEvents="none">
                          <Ionicons name="pie-chart" size={76} color={isDark ? 'rgba(147,51,234,0.08)' : 'rgba(147,51,234,0.06)'} />
                        </View>
                        <View style={styles.kpiPastelHeader}>
                          <View style={[styles.kpiPastelIconBox, { backgroundColor: '#f3e8ff' }]}>
                            <Ionicons name="wallet-outline" size={16} color="#9333ea" />
                          </View>
                          <Text style={[styles.kpiPastelLabel, isDark && styles.textDark]}>Doanh thu / đơn hàng (TB)</Text>
                        </View>
                        <Text style={[styles.kpiPastelValue, { color: '#7e22ce' }, isDark && { color: '#c084fc' }]} numberOfLines={1}>
                          {formatPrice(aovPeriod)}
                        </Text>
                        <View style={styles.kpiPastelFooter}>
                          <View style={[styles.kpiGrowthBadge, { backgroundColor: '#f3e8ff' }]}>
                            <Ionicons name="analytics" size={10} color="#7e22ce" />
                            <Text style={[styles.kpiGrowthText, { color: '#7e22ce' }]}>Bình quân</Text>
                          </View>
                          <Text style={[styles.kpiPastelSubtext, isDark && styles.textMutedDark]}>mỗi đơn thành công</Text>
                        </View>
                      </View>

                      {/* Card 4: Vàng Cam Pastel (Amber) */}
                      <View style={[styles.kpiPastelCard, styles.kpiPastelAmber, isDark && styles.kpiPastelAmberDark]}>
                        <View style={styles.kpiPastelWatermark} pointerEvents="none">
                          <Ionicons name="trophy" size={76} color={isDark ? 'rgba(217,119,6,0.08)' : 'rgba(217,119,6,0.06)'} />
                        </View>
                        <View style={styles.kpiPastelHeader}>
                          <View style={[styles.kpiPastelIconBox, { backgroundColor: '#fef3c7' }]}>
                            <Ionicons name="bar-chart-outline" size={16} color="#d97706" />
                          </View>
                          <Text style={[styles.kpiPastelLabel, isDark && styles.textDark]}>Doanh thu cao nhất (ngày)</Text>
                        </View>
                        <Text style={[styles.kpiPastelValue, { color: '#b45309' }, isDark && { color: '#fbbf24' }]} numberOfLines={1}>
                          {formatPrice(peakRevenue)}
                        </Text>
                        <View style={styles.kpiPastelFooter}>
                          <View style={[styles.kpiGrowthBadge, { backgroundColor: '#fef3c7' }]}>
                            <Ionicons name="star" size={10} color="#b45309" />
                            <Text style={[styles.kpiGrowthText, { color: '#b45309' }]}>Đỉnh kỳ</Text>
                          </View>
                          <Text style={[styles.kpiPastelSubtext, isDark && styles.textMutedDark]} numberOfLines={1}>
                            {peakDate}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* ======================================================== */}
                  {/* CARD 2: BIỂU ĐỒ DOANH THU THEO NGÀY (CỘT & ĐƯỜNG)         */}
                  {/* ======================================================== */}
                  <View style={[styles.revenueDashCard, isDark && styles.cardDark]}>
                    {/* HEADER BIỂU ĐỒ VÀ TOGGLE VIEW */}
                    <View style={[styles.dashCardHeader, { flexWrap: 'wrap', gap: 12, alignItems: 'center' }]}>
                      <View style={{ flex: 1, minWidth: 220 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Ionicons name="analytics" size={18} color="#2563eb" />
                          <Text style={[styles.dashCardTitle, isDark && styles.textDark, { fontSize: 16, fontWeight: '800' }]}>
                            Biểu đồ doanh thu theo ngày
                          </Text>
                        </View>
                        <Text style={[styles.dashCardSubtitle, isDark && styles.textMutedDark, { fontSize: 12 }]}>
                          {periodSubtitle}
                        </Text>
                      </View>

                      {/* NÚT CHUYỂN ĐỔI: [ 📊 Biểu đồ cột ] vs [ 📈 Biểu đồ đường ] */}
                      <View style={[styles.chartViewToggleWrap, isDark && styles.chartViewToggleWrapDark]}>
                        <Pressable
                          style={[
                            styles.chartViewToggleBtn,
                            chartViewType === 'bar' && styles.chartViewToggleBtnActive,
                          ]}
                          onPress={() => setChartViewType('bar')}
                        >
                          <Ionicons
                            name="bar-chart"
                            size={13}
                            color={chartViewType === 'bar' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'}
                          />
                          <Text
                            style={[
                              styles.chartViewToggleText,
                              chartViewType === 'bar' && styles.chartViewToggleTextActive,
                            ]}
                          >
                            Biểu đồ cột
                          </Text>
                        </Pressable>

                        <Pressable
                          style={[
                            styles.chartViewToggleBtn,
                            chartViewType === 'line' && styles.chartViewToggleBtnActive,
                          ]}
                          onPress={() => setChartViewType('line')}
                        >
                          <Ionicons
                            name="trending-up"
                            size={13}
                            color={chartViewType === 'line' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'}
                          />
                          <Text
                            style={[
                              styles.chartViewToggleText,
                              chartViewType === 'line' && styles.chartViewToggleTextActive,
                            ]}
                          >
                            Biểu đồ đường
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    {/* LEGEND CHÚ THÍCH */}
                    <View style={styles.chartLegendRow}>
                      <View style={styles.chartLegendItem}>
                        <View style={[styles.chartLegendPill, { backgroundColor: '#93c5fd' }]} />
                        <Text style={[styles.chartLegendLabel, isDark && styles.textMutedDark]}>Doanh thu ngày thường</Text>
                      </View>
                      <View style={styles.chartLegendItem}>
                        <View style={[styles.chartLegendPill, { backgroundColor: '#2563eb' }]} />
                        <Text style={[styles.chartLegendLabel, isDark && styles.textMutedDark]}>
                          Đỉnh doanh thu ({formatCompact(peakRevenue)})
                        </Text>
                      </View>
                      <View style={styles.chartLegendItem}>
                        <View style={[styles.chartLegendDot, { backgroundColor: '#10b981' }]} />
                        <Text style={[styles.chartLegendLabel, isDark && styles.textMutedDark]}>Có đơn thành công</Text>
                      </View>
                    </View>

                    {/* KHUNG BIỂU ĐỒ CÓ TRỤC Y VÀ ĐƯỜNG KẺ NGANG DASHED */}
                    <View style={styles.chartCanvasRow}>
                      {/* TRỤC TỌA ĐỘ Y BÊN TRÁI */}
                      <View style={styles.chartYAxisCol}>
                        {yTicks.map((t, idx) => (
                          <Text key={idx} style={styles.chartYTickText} numberOfLines={1}>
                            {t.label}
                          </Text>
                        ))}
                      </View>

                      {/* KHUNG VẼ BIỂU ĐỒ */}
                      <View style={styles.chartPlotArea}>
                        {/* CÁC ĐƯỜNG LƯỚI NGANG NÉT ĐỨT (HORIZONTAL DASHED GRIDLINES) */}
                        <View style={StyleSheet.absoluteFill} pointerEvents="none">
                          {[0, 25, 50, 75, 100].map((p, idx) => (
                            <View
                              key={idx}
                              style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: `${p}%`,
                                borderBottomWidth: 1,
                                borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                                borderStyle: 'dashed',
                              }}
                            />
                          ))}
                        </View>

                        {/* HIỂN THỊ DẠNG CỘT (BAR CHART) */}
                        {chartViewType === 'bar' && (
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={[
                              styles.barChartScrollContent,
                              chartList.length > 20 && { justifyContent: 'flex-start' },
                              { paddingBottom: 4, minHeight: 210 },
                            ]}
                            onWheel={(e: any) => {
                              if (Platform.OS === 'web' && e?.deltaY) {
                                e.currentTarget.scrollLeft += e.deltaY;
                              }
                            }}
                          >
                            {chartList.map((item, idx) => {
                              const pct = maxRevenue > 0 ? Math.round((item.revenue / maxRevenue) * 100) : 0;
                              const isPeak = item.revenue === maxRevenue && maxRevenue > 0;
                              return (
                                <View
                                  key={idx}
                                  style={[
                                    styles.barColumnWrap,
                                    chartList.length > 20 && { minWidth: 42 },
                                  ]}
                                >
                                  {/* Số tiền vắn tắt trên đỉnh cột */}
                                  <Text
                                    style={[
                                      styles.barAmountText,
                                      isPeak && { color: '#2563eb', fontWeight: '800' },
                                      item.revenue === 0 && { color: isDark ? '#475569' : '#cbd5e1' },
                                    ]}
                                    numberOfLines={1}
                                  >
                                    {formatCompact(item.revenue)}
                                  </Text>

                                  {/* Cột biểu đồ */}
                                  <View style={[styles.barTrack, isDark && { backgroundColor: '#1e293b' }]}>
                                    <View
                                      style={[
                                        styles.barFill,
                                        { height: `${Math.max(item.revenue > 0 ? 10 : 3, pct)}%` },
                                        item.revenue > 0
                                          ? isPeak
                                            ? { backgroundColor: '#2563eb', borderTopLeftRadius: 6, borderTopRightRadius: 6 }
                                            : { backgroundColor: '#93c5fd', borderTopLeftRadius: 6, borderTopRightRadius: 6 }
                                          : { backgroundColor: isDark ? '#334155' : '#e2e8f0' },
                                      ]}
                                    />
                                  </View>

                                  {/* Nhãn ngày/tháng bên dưới */}
                                  <Text
                                    style={[
                                      styles.barLabelText,
                                      isDark && styles.textMutedDark,
                                      isPeak && { fontWeight: '800', color: '#2563eb' },
                                    ]}
                                  >
                                    {item.label}
                                  </Text>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 1 }}>
                                    {item.count > 0 && (
                                      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#10b981' }} />
                                    )}
                                    <Text style={styles.barSubCountText}>
                                      {item.count > 0 ? `${item.count} đơn` : '-'}
                                    </Text>
                                  </View>
                                </View>
                              );
                            })}
                          </ScrollView>
                        )}

                        {/* HIỂN THỊ DẠNG ĐƯỜNG (LINE CHART) */}
                        {chartViewType === 'line' && (
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 }}
                            onWheel={(e: any) => {
                              if (Platform.OS === 'web' && e?.deltaY) {
                                e.currentTarget.scrollLeft += e.deltaY;
                              }
                            }}
                          >
                            {(() => {
                              const stepX = Math.max(50, Math.floor(700 / (chartList.length || 1)));
                              const chartW = Math.max(chartList.length * stepX, 600);
                              const chartH = 150;
                              const pts = chartList.map((item, idx) => {
                                const x = idx * stepX + stepX / 2;
                                const norm = maxRevenue > 0 ? item.revenue / maxRevenue : 0;
                                const y = chartH - norm * (chartH - 26) - 10;
                                return { x, y, item, idx };
                              });
                              const pathD = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
                              const areaD = pts.length > 0
                                ? `${pathD} L ${pts[pts.length - 1].x} ${chartH} L ${pts[0].x} ${chartH} Z`
                                : '';

                              if (Platform.OS === 'web') {
                                return (
                                  <View style={{ width: chartW, height: chartH + 48, position: 'relative' }}>
                                    <svg width={chartW} height={chartH} style={{ overflow: 'visible' }}>
                                      <defs>
                                        <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                                        </linearGradient>
                                      </defs>
                                      {areaD ? <path d={areaD} fill="url(#lineAreaGrad)" /> : null}
                                      {pathD ? (
                                        <path
                                          d={pathD}
                                          fill="none"
                                          stroke="#2563eb"
                                          strokeWidth="2.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      ) : null}
                                      {pts.map((p) => {
                                        const isPeak = p.item.revenue === maxRevenue && maxRevenue > 0;
                                        if (p.item.revenue === 0) return null;
                                        return (
                                          <g key={p.idx}>
                                            <circle
                                              cx={p.x}
                                              cy={p.y}
                                              r={isPeak ? 5 : 3.5}
                                              fill={isPeak ? '#2563eb' : '#ffffff'}
                                              stroke={isPeak ? '#ffffff' : '#2563eb'}
                                              strokeWidth={isPeak ? 2.5 : 2}
                                            />
                                            <text
                                              x={p.x}
                                              y={p.y - 7}
                                              textAnchor="middle"
                                              fontSize="9"
                                              fontWeight={isPeak ? "800" : "600"}
                                              fill={isPeak ? "#2563eb" : (isDark ? "#94a3b8" : "#475569")}
                                            >
                                              {formatCompact(p.item.revenue)}
                                            </text>
                                          </g>
                                        );
                                      })}
                                    </svg>
                                    <View style={{ flexDirection: 'row', width: chartW, position: 'absolute', bottom: 0, left: 0 }}>
                                      {pts.map((p) => (
                                        <View key={p.idx} style={{ width: stepX, alignItems: 'center' }}>
                                          <Text style={{ fontSize: 10, fontWeight: '700', color: isDark ? '#94a3b8' : '#475569' }}>
                                            {p.item.label}
                                          </Text>
                                          <Text style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>
                                            {p.item.count > 0 ? `${p.item.count} đơn` : '-'}
                                          </Text>
                                        </View>
                                      ))}
                                    </View>
                                  </View>
                                );
                              }

                              return (
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: chartH + 30 }}>
                                  {chartList.map((item, idx) => (
                                    <View key={idx} style={{ width: 44, alignItems: 'center' }}>
                                      <Text style={{ fontSize: 9, color: '#2563eb', fontWeight: '700' }}>
                                        {item.revenue > 0 ? formatCompact(item.revenue) : ''}
                                      </Text>
                                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2563eb', marginVertical: 4 }} />
                                      <Text style={{ fontSize: 10, color: '#64748b' }}>{item.label}</Text>
                                    </View>
                                  ))}
                                </View>
                              );
                            })()}
                          </ScrollView>
                        )}
                      </View>
                    </View>

                    {/* BẢNG KÊ CHI TIẾT THEO MỐC */}
                    {showDetailNotice && (
                      <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: isDark ? '#1e293b' : '#f1f5f9' }}>
                        <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Ionicons name="list" size={15} color="#2563eb" />
                            <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#94a3b8' : '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              Bảng kê chi tiết ({displayedTableList.length}/{chartList.length} mốc)
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', gap: 6 }}>
                            <Pressable
                              style={[
                                styles.tableFilterPill,
                                isDark && styles.tableFilterPillDark,
                                !chartTableOnlyActive && styles.tableFilterPillActive,
                              ]}
                              onPress={() => setChartTableOnlyActive(false)}
                            >
                              <Text style={[styles.tableFilterPillText, !chartTableOnlyActive && styles.tableFilterPillTextActive]}>
                                Hiện tất cả ({chartList.length})
                              </Text>
                            </Pressable>
                            <Pressable
                              style={[
                                styles.tableFilterPill,
                                isDark && styles.tableFilterPillDark,
                                chartTableOnlyActive && styles.tableFilterPillActive,
                              ]}
                              onPress={() => setChartTableOnlyActive(true)}
                            >
                              <Text style={[styles.tableFilterPillText, chartTableOnlyActive && styles.tableFilterPillTextActive]}>
                                Chỉ mốc có đơn ({activeCount})
                              </Text>
                            </Pressable>
                          </View>
                        </View>

                        <View style={styles.revenueTableWrap}>
                          <View style={styles.revenueTableHeader}>
                            <Text style={[styles.revTh, { flex: 2 }]}>Mốc thời gian</Text>
                            <Text style={[styles.revTh, { flex: 1.5, textAlign: 'center' }]}>Đơn hoàn tất</Text>
                            <Text style={[styles.revTh, { flex: 2, textAlign: 'right' }]}>Doanh thu thực thu</Text>
                            <Text style={[styles.revTh, { flex: 2, textAlign: 'right' }]}>Tỷ trọng %</Text>
                          </View>
                          {displayedTableList.length > 0 ? (
                            displayedTableList.map((item, i) => {
                              const sharePct = totalPeriodRev > 0 ? Math.round((item.revenue / totalPeriodRev) * 100) : 0;
                              return (
                                <View key={i} style={[styles.revenueTableRow, i % 2 === 1 && (isDark ? styles.revenueTableRowAltDark : styles.revenueTableRowAlt)]}>
                                  <View style={{ flex: 2 }}>
                                    <Text style={[styles.revTdTime, isDark && styles.textDark]}>
                                      {(item as any).fullDate || (item as any).fullMonth || (item as any).fullYear || item.label}
                                    </Text>
                                  </View>
                                  <Text style={[styles.revTd, { flex: 1.5, textAlign: 'center', fontWeight: '700' }]}>
                                    {item.count} đơn
                                  </Text>
                                  <Text style={[styles.revTd, { flex: 2, textAlign: 'right', fontWeight: '800', color: item.revenue > 0 ? '#16a34a' : '#94a3b8' }]}>
                                    {formatPrice(item.revenue)}
                                  </Text>
                                  <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                      <View style={[styles.shareBarTrack, isDark && { backgroundColor: '#334155' }]}>
                                        <View style={[styles.shareBarFill, { width: `${sharePct}%` }]} />
                                      </View>
                                      <Text style={[styles.sharePctText, isDark && styles.textMutedDark]}>{sharePct}%</Text>
                                    </View>
                                  </View>
                                </View>
                              );
                            })
                          ) : (
                            <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                                Không có mốc nào phát sinh đơn hàng trong kỳ này.
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              );
            })()}

            {/* DASHBOARD CHARTS & BREAKDOWN */}
            <View style={[styles.dashGrid, !isDesktop && styles.dashGridMobile]}>
              {/* Tình trạng xử lý đơn hàng */}
              <View style={[styles.dashCard, isDark && styles.cardDark]}>
                <View style={styles.dashCardHeader}>
                  <View>
                    <Text style={[styles.dashCardTitle, isDark && styles.textDark]}>Phân bổ trạng thái đơn</Text>
                    <Text style={[styles.dashCardSubtitle, isDark && styles.textMutedDark]}>Tỷ lệ hoàn thành giao dịch</Text>
                  </View>
                  <Ionicons name="pie-chart-outline" size={20} color="#2563eb" />
                </View>

                {/* Progress bar visual */}
                <View style={styles.stackedBar}>
                  <View style={[styles.stackedSeg, { width: `${orderStatusStats.completedPct}%`, backgroundColor: '#10b981' }]} />
                  <View style={[styles.stackedSeg, { width: `${orderStatusStats.shippingPct}%`, backgroundColor: '#7c3aed' }]} />
                  <View style={[styles.stackedSeg, { width: `${orderStatusStats.pendingPct}%`, backgroundColor: '#f59e0b' }]} />
                  <View style={[styles.stackedSeg, { width: `${orderStatusStats.cancelledPct}%`, backgroundColor: '#ef4444' }]} />
                </View>

                <View style={styles.orderLegendGrid}>
                  <View style={styles.orderLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                    <Text style={[styles.legendLabel, isDark && styles.textMutedDark]}>Hoàn thành: </Text>
                    <Text style={[styles.legendVal, isDark && styles.textDark]}>
                      {orderStatusStats.completed} ({orderStatusStats.completedPct}%)
                    </Text>
                  </View>
                  <View style={styles.orderLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#7c3aed' }]} />
                    <Text style={[styles.legendLabel, isDark && styles.textMutedDark]}>Đang giao: </Text>
                    <Text style={[styles.legendVal, isDark && styles.textDark]}>
                      {orderStatusStats.shipping} ({orderStatusStats.shippingPct}%)
                    </Text>
                  </View>
                  <View style={styles.orderLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                    <Text style={[styles.legendLabel, isDark && styles.textMutedDark]}>Chờ duyệt: </Text>
                    <Text style={[styles.legendVal, isDark && styles.textDark]}>
                      {orderStatusStats.pending} ({orderStatusStats.pendingPct}%)
                    </Text>
                  </View>
                  <View style={styles.orderLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                    <Text style={[styles.legendLabel, isDark && styles.textMutedDark]}>Đã hủy: </Text>
                    <Text style={[styles.legendVal, isDark && styles.textDark]}>
                      {orderStatusStats.cancelled} ({orderStatusStats.cancelledPct}%)
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tồn kho cần chú ý */}
              <View style={[styles.dashCard, isDark && styles.cardDark]}>
                <View style={styles.dashCardHeader}>
                  <View>
                    <Text style={[styles.dashCardTitle, isDark && styles.textDark]}>Cảnh báo tồn kho thấp</Text>
                    <Text style={[styles.dashCardSubtitle, isDark && styles.textMutedDark]}>Sản phẩm còn ≤ 5 cái cần nhập thêm</Text>
                  </View>
                  <Ionicons name="warning-outline" size={20} color="#dc2626" />
                </View>

                {lowStockProducts.length === 0 ? (
                  <View style={styles.emptyInline}>
                    <Ionicons name="checkmark-circle-outline" size={28} color="#10b981" />
                    <Text style={[styles.emptyInlineText, isDark && styles.textMutedDark]}>Kho hàng đang ở trạng thái an toàn!</Text>
                  </View>
                ) : (
                  lowStockProducts.slice(0, 4).map((p) => (
                    <View key={p.id} style={styles.lowStockRow}>
                      <AdminProductThumb
                        image={p.image}
                        product={p}
                        style={styles.lowStockThumb}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.lowStockTitle, isDark && styles.textDark]} numberOfLines={1}>{p.name}</Text>
                        <Text style={styles.lowStockPrice}>{formatPrice(p.price)}</Text>
                      </View>
                      <View style={styles.lowStockBadge}>
                        <Text style={styles.lowStockBadgeText}>Còn: {p.stock ?? 0} sp</Text>
                      </View>
                    </View>
                  ))
                )}
                {lowStockProducts.length > 4 && (
                  <Pressable style={styles.viewMoreLink} onPress={() => { setActiveTab('products'); setProductStockFilter('low_stock'); }}>
                    <Text style={styles.viewMoreLinkText}>Xem tất cả {lowStockProducts.length} sản phẩm sắp hết ➔</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* DANH SÁCH ĐƠN HÀNG MỚI NHẤT */}
            <View style={[styles.dashCard, isDark && styles.cardDark, { marginTop: 14 }]}>
              <View style={styles.dashCardHeader}>
                <View>
                  <Text style={[styles.dashCardTitle, isDark && styles.textDark]}>Đơn hàng gần đây</Text>
                  <Text style={[styles.dashCardSubtitle, isDark && styles.textMutedDark]}>Xử lý kịp thời để đảm bảo uy tín giao hàng</Text>
                </View>
                <Pressable style={styles.viewAllBtn} onPress={() => setActiveTab('orders')}>
                  <Text style={styles.viewAllBtnText}>Xem toàn bộ đơn</Text>
                  <Ionicons name="arrow-forward" size={14} color="#2563eb" />
                </Pressable>
              </View>

              {orderList.length === 0 ? (
                <Text style={[styles.emptyText, isDark && styles.textMutedDark]}>Chưa có đơn hàng nào phát sinh</Text>
              ) : (
                orderList.slice(0, 5).map((order) => {
                  const badge = getStatusBadgeStyle(order.status);
                  return (
                    <View key={order.id} style={styles.recentOrderRow}>
                      <View style={[styles.recentOrderIcon, { backgroundColor: badge.bg }]}>
                        <Ionicons name="cart" size={18} color={badge.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.recentOrderNum, isDark && styles.textDark]}>
                            {order.orderNumber || `#ORD-${order.id}`}
                          </Text>
                          <View style={[styles.recentStatusTag, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                            <Text style={[styles.recentStatusTagText, { color: badge.color }]}>
                              {getStatusLabel(order.status)}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.recentOrderMeta, isDark && styles.textMutedDark]} numberOfLines={1}>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')} • {order.items?.length || 1} sản phẩm • {order.shippingAddress}
                        </Text>
                      </View>
                      <Text style={[styles.recentOrderTotal, isDark && styles.textDark]}>
                        {formatPrice(order.totalAmount)}
                      </Text>
                      <Pressable style={styles.recentOrderViewBtn} onPress={() => setViewingOrder(order)}>
                        <Ionicons name="eye-outline" size={16} color="#2563eb" />
                      </Pressable>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB 2: QUẢN LÝ ĐƠN HÀNG (ORDERS)                         */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <View style={[styles.sectionCard, isMobile && styles.sectionCardMobile, isDark && styles.cardDark]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  Quản lý Đơn hàng ({filteredOrders.length})
                </Text>
                <Text style={[styles.sectionSubtitle, isDark && styles.textMutedDark]}>
                  Theo dõi trạng thái giao vận và thanh toán của khách mua hàng
                </Text>
              </View>
            </View>

            {/* STATUS FILTER TABS */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {[
                { key: 'all', label: 'Tất cả đơn', count: orderList.length },
                { key: 'pending', label: 'Chờ duyệt', count: orderList.filter((o) => o.status === 'pending').length },
                { key: 'returns', label: 'Đổi trả / Bảo hành', count: allWarrantyOrdersCount, isReturn: true },
                { key: 'confirmed', label: 'Đã xác nhận', count: orderList.filter((o) => o.status === 'confirmed').length },
                { key: 'shipping', label: 'Đang giao', count: orderList.filter((o) => o.status === 'shipping' || o.status === 'delivered').length },
                { key: 'completed', label: 'Hoàn thành', count: orderList.filter((o) => o.status === 'completed').length },
                { key: 'cancelled', label: 'Đã hủy', count: orderList.filter((o) => o.status === 'cancelled').length },
              ].map((chip) => {
                const isSelected = orderStatusFilter === chip.key;
                return (
                  <Pressable
                    key={chip.key}
                    style={[
                      styles.filterChip,
                      isDark && styles.filterChipDark,
                      isSelected && styles.filterChipActive,
                      chip.isReturn && pendingReturnOrdersCount > 0 && !isSelected && styles.filterChipReturnAlert,
                    ]}
                    onPress={() => setOrderStatusFilter(chip.key)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isDark && styles.textMutedDark,
                        isSelected && styles.filterChipTextActive,
                        chip.isReturn && pendingReturnOrdersCount > 0 && !isSelected && { color: '#b45309', fontWeight: '800' },
                      ]}
                    >
                      {chip.isReturn && pendingReturnOrdersCount > 0 ? '⚠️ ' : ''}
                      {chip.label} ({chip.count})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* SUB-FILTER FOR RETURNS / WARRANTY */}
            {orderStatusFilter === 'returns' && (
              <View style={[styles.returnSubFilterBar, isDark && styles.returnSubFilterBarDark]}>
                <Text style={[styles.returnSubFilterTitle, isDark && styles.textDark]}>
                  Lọc hồ sơ bảo hành:
                </Text>
                {[
                  { key: 'all', label: 'Tất cả hồ sơ', count: allWarrantyOrdersCount },
                  { key: 'pending', label: 'Chờ duyệt', count: pendingReturnOrdersCount, alert: pendingReturnOrdersCount > 0 },
                  { key: 'approved', label: 'Đã duyệt đổi mới', count: approvedReturnOrdersCount },
                  { key: 'rejected', label: 'Từ chối', count: rejectedReturnOrdersCount },
                ].map((sf) => {
                  const isSel = returnSubFilter === sf.key;
                  return (
                    <Pressable
                      key={sf.key}
                      style={[
                        styles.returnSubPill,
                        isDark && styles.returnSubPillDark,
                        isSel && styles.returnSubPillActive,
                        sf.alert && !isSel && { borderColor: '#fde047', backgroundColor: '#fffbeb' },
                      ]}
                      onPress={() => setReturnSubFilter(sf.key as any)}
                    >
                      <Text
                        style={[
                          styles.returnSubPillText,
                          isDark && styles.textMutedDark,
                          isSel && styles.returnSubPillTextActive,
                          sf.alert && !isSel && { color: '#b45309', fontWeight: '800' },
                        ]}
                      >
                        {sf.alert ? '⏳ ' : ''}{sf.label} ({sf.count})
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {loading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 40 }} />
            ) : filteredOrders.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="file-tray-outline" size={44} color="#94a3b8" />
                <Text style={[styles.emptyText, isDark && styles.textMutedDark]}>Không tìm thấy đơn hàng nào phù hợp</Text>
              </View>
            ) : (
              <View style={styles.ordersListWrap}>
                {filteredOrders.map((order) => {
                  const badge = getStatusBadgeStyle(order.status);
                  return (
                    <View key={order.id} style={[styles.orderItemCard, isMobile && styles.orderItemCardMobile, isDark && styles.cardDark]}>
                      <View style={styles.orderItemTopRow}>
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={[styles.orderNumberTitle, isDark && styles.textDark]}>
                              {order.orderNumber || `#ORD-${order.id}`}
                            </Text>
                            <View style={[styles.statusTag, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                              <Text style={[styles.statusTagText, { color: badge.color }]}>{getStatusLabel(order.status)}</Text>
                            </View>
                          </View>
                          <Text style={[styles.orderDateSub, isDark && styles.textMutedDark]}>
                            Đặt ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}
                          </Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={[styles.orderGrandTotal, isDark && styles.textDark]}>
                            {formatPrice(order.totalAmount)}
                          </Text>
                          <Text style={styles.orderPaymentTag}>
                            {order.paymentMethod === 'cod' ? 'Thanh toán COD' : order.paymentMethod?.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      {/* Địa chỉ & Danh sách hàng hóa tóm tắt */}
                      <View style={styles.orderAddressBox}>
                        <Ionicons name="location-outline" size={15} color="#64748b" style={{ marginRight: 6 }} />
                        <Text style={[styles.orderAddressCopy, isDark && styles.textMutedDark]} numberOfLines={1}>
                          {order.shippingAddress || 'Chưa cung cấp địa chỉ cụ thể'}
                        </Text>
                      </View>

                      {order.items?.length ? (
                        <View style={styles.orderItemsPreviewBox}>
                          <Text style={[styles.orderItemsPreviewText, isDark && styles.textMutedDark]} numberOfLines={2}>
                            🛒 {order.items.map((it) => `${it.name} (x${it.quantity})`).join(' • ')}
                          </Text>
                        </View>
                      ) : null}

                      {/* CẢNH BÁO YÊU CẦU ĐỔI TRẢ / BẢO HÀNH TỪ KHÁCH */}
                      {order.returnStatus ? (
                        <View
                          style={[
                            styles.adminReturnBanner,
                            order.returnStatus === 'pending'
                              ? styles.adminReturnPending
                              : order.returnStatus === 'approved'
                              ? styles.adminReturnApproved
                              : styles.adminReturnRejected,
                            isDark && styles.adminReturnDark,
                          ]}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                            <Ionicons
                              name={
                                order.returnStatus === 'pending'
                                  ? 'alert-circle'
                                  : order.returnStatus === 'approved'
                                  ? 'checkmark-circle'
                                  : 'close-circle'
                              }
                              size={20}
                              color={
                                order.returnStatus === 'pending'
                                  ? '#b45309'
                                  : order.returnStatus === 'approved'
                                  ? '#15803d'
                                  : '#b91c1c'
                              }
                              style={{ marginTop: 2 }}
                            />
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <Text
                                  style={[
                                    styles.adminReturnTitle,
                                    {
                                      color:
                                        order.returnStatus === 'pending'
                                          ? '#b45309'
                                          : order.returnStatus === 'approved'
                                          ? '#15803d'
                                          : '#b91c1c',
                                    },
                                  ]}
                                >
                                  {order.returnStatus === 'pending'
                                    ? 'Khách gửi yêu cầu Đổi trả / Bảo hành'
                                    : order.returnStatus === 'approved'
                                    ? 'Đã duyệt yêu cầu Đổi mới / Bảo hành'
                                    : 'Đã từ chối yêu cầu đổi trả'}
                                </Text>
                                <View
                                  style={[
                                    styles.returnBadgeMini,
                                    order.returnStatus === 'pending'
                                      ? { backgroundColor: '#fef3c7', borderColor: '#fde047' }
                                      : order.returnStatus === 'approved'
                                      ? { backgroundColor: '#dcfce7', borderColor: '#86efac' }
                                      : { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.returnBadgeMiniText,
                                      {
                                        color:
                                          order.returnStatus === 'pending'
                                            ? '#b45309'
                                            : order.returnStatus === 'approved'
                                            ? '#15803d'
                                            : '#b91c1c',
                                      },
                                    ]}
                                  >
                                    {order.returnStatus === 'pending' ? '⏳ Chờ duyệt' : order.returnStatus === 'approved' ? '✅ Đã duyệt' : '❌ Từ chối'}
                                  </Text>
                                </View>
                              </View>
                              <Text style={[styles.adminReturnReason, isDark && styles.textMutedDark]}>
                                Lý do: <Text style={{ fontWeight: '700' }}>{order.returnReason || 'Sản phẩm lỗi nứt vỡ / kỹ thuật'}</Text>
                              </Text>

                              {/* Minh chứng ảnh/video nếu có */}
                              {order.returnMedia && order.returnMedia.length > 0 && (
                                <View style={{ marginTop: 8 }}>
                                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748b', marginBottom: 4 }}>
                                    📸 Minh chứng từ khách ({order.returnMedia.length} file - nhấn ảnh để xem):
                                  </Text>
                                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 6 }}>
                                    {order.returnMedia.map((mediaUrl: string, idx: number) => {
                                      const isVideo = mediaUrl.includes('video') || mediaUrl.endsWith('.mp4');
                                      return (
                                        <Pressable
                                          key={idx}
                                          style={styles.adminProofThumb}
                                          onPress={() => setPreviewMediaUrl(mediaUrl)}
                                        >
                                          {isVideo ? (
                                            <View style={styles.adminVideoBox}>
                                              <Ionicons name="videocam" size={18} color="#ffffff" />
                                              <Text style={styles.adminVideoText}>Video</Text>
                                            </View>
                                          ) : (
                                            <>
                                              <Image source={{ uri: mediaUrl }} style={styles.adminProofImg} resizeMode="cover" />
                                              <View style={styles.adminProofZoomIcon}>
                                                <Ionicons name="scan-outline" size={12} color="#ffffff" />
                                              </View>
                                            </>
                                          )}
                                        </Pressable>
                                      );
                                    })}
                                  </ScrollView>
                                </View>
                              )}
                            </View>
                          </View>

                          {order.returnStatus === 'pending' && (
                            <View style={styles.adminReturnActions}>
                              <Pressable
                                style={styles.btnAdminApproveReturn}
                                onPress={() => handleUpdateReturnStatus(order.id || order.orderNumber, 'approved')}
                              >
                                <Ionicons name="checkmark-circle" size={15} color="#ffffff" style={{ marginRight: 4 }} />
                                <Text style={styles.btnAdminApproveReturnText}>Duyệt đổi hàng</Text>
                              </Pressable>
                              <Pressable
                                style={styles.btnAdminRejectReturn}
                                onPress={() => handleUpdateReturnStatus(order.id || order.orderNumber, 'rejected')}
                              >
                                <Ionicons name="close-circle" size={15} color="#b91c1c" style={{ marginRight: 4 }} />
                                <Text style={styles.btnAdminRejectReturnText}>Từ chối</Text>
                              </Pressable>
                            </View>
                          )}
                        </View>
                      ) : null}

                      {/* ACTIONS ROW: STATUS CHIPS & BUTTONS */}
                      <View style={styles.orderBottomBar}>
                        {order.status === 'completed' || order.status === 'cancelled' ? (
                          <View
                            style={[
                              styles.terminalStatusBox,
                              order.status === 'completed' ? styles.terminalStatusCompleted : styles.terminalStatusCancelled,
                              isDark && (order.status === 'completed' ? styles.terminalStatusCompletedDark : styles.terminalStatusCancelledDark),
                            ]}
                          >
                            <Ionicons
                              name={order.status === 'completed' ? 'checkmark-done-circle' : 'close-circle'}
                              size={16}
                              color={order.status === 'completed' ? '#16a34a' : '#dc2626'}
                            />
                            <Text
                              style={[
                                styles.terminalStatusText,
                                {
                                  color:
                                    order.status === 'completed'
                                      ? (isDark ? '#4ade80' : '#15803d')
                                      : (isDark ? '#f87171' : '#b91c1c'),
                                },
                              ]}
                            >
                              {order.status === 'completed'
                                ? 'Đã giao thành công • Đã khóa trạng thái'
                                : 'Đơn hàng đã hủy • Đóng giao dịch (Đã khóa)'}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.statusChangerWrap}>
                            <Text style={[styles.statusChangerLabel, isDark && styles.textMutedDark]}>Đổi trạng thái:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                              {[order.status, ...(ALLOWED_ORDER_TRANSITIONS[order.status] || [])].map((st) => {
                                const isCurrent = order.status === st;
                                const stInfo = getStatusBadgeStyle(st);
                                return (
                                  <Pressable
                                    key={st}
                                    style={[
                                      styles.quickStatusBtn,
                                      { borderColor: stInfo.border },
                                      isCurrent && { backgroundColor: stInfo.color, borderColor: stInfo.color },
                                    ]}
                                    onPress={() => handleUpdateOrderStatus(order.id, st)}
                                    disabled={isCurrent || updatingOrderId !== null}
                                  >
                                    <Text style={[styles.quickStatusBtnText, { color: isCurrent ? '#ffffff' : stInfo.color }]}>
                                      {getStatusLabel(st)}
                                    </Text>
                                  </Pressable>
                                );
                              })}
                            </ScrollView>
                          </View>
                        )}

                        <View style={styles.orderActionButtons}>
                          {order.returnStatus ? (
                            <Pressable
                              style={styles.btnPrintWarrantyCardBtn}
                              onPress={() => handlePrintWarrantyReceipt(order)}
                            >
                              <Ionicons name="shield-checkmark" size={13} color="#15803d" />
                              <Text style={styles.btnPrintWarrantyCardBtnText}>In Phiếu BH</Text>
                            </Pressable>
                          ) : null}

                          <Pressable style={styles.viewDetailBtn} onPress={() => setViewingOrder(order)}>
                            <Ionicons name="eye-outline" size={15} color="#2563eb" />
                            <Text style={styles.viewDetailBtnText}>Chi tiết / In</Text>
                          </Pressable>

                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB 3: QUẢN LÝ SẢN PHẨM (PRODUCTS)                       */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <View style={[styles.sectionCard, isMobile && styles.sectionCardMobile, isDark && styles.cardDark]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  Danh mục Sản phẩm ({filteredProducts.length}/{productList.length})
                </Text>
                <Text style={[styles.sectionSubtitle, isDark && styles.textMutedDark]}>
                  Quản lý giá bán, hình ảnh, thông số kỹ thuật và độ hiển thị
                </Text>
              </View>
              <Pressable style={styles.miniBtnPrimary} onPress={handleOpenAddProduct}>
                <Ionicons name="add" size={17} color="#ffffff" />
                <Text style={styles.miniBtnPrimaryText}>Thêm sản phẩm</Text>
              </Pressable>
            </View>

            {/* BỘ LỌC ĐA NĂNG CHO SẢN PHẨM */}
            <View style={styles.productFiltersBar}>
              {/* Lọc theo Danh mục */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Pressable
                    style={[styles.filterChip, productCategoryFilter === 'all' && styles.filterChipActive]}
                    onPress={() => setProductCategoryFilter('all')}
                  >
                    <Text style={[styles.filterChipText, productCategoryFilter === 'all' && styles.filterChipTextActive]}>
                      Tất cả danh mục
                    </Text>
                  </Pressable>
                  {categoryList.map((c) => (
                    <Pressable
                      key={c.id}
                      style={[styles.filterChip, productCategoryFilter === c.id && styles.filterChipActive]}
                      onPress={() => setProductCategoryFilter(c.id)}
                    >
                      <Text style={{ marginRight: 4 }}>{c.icon || '📁'}</Text>
                      <Text style={[styles.filterChipText, productCategoryFilter === c.id && styles.filterChipTextActive]}>
                        {c.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              {/* Lọc tình trạng kho & Sắp xếp */}
              <View style={styles.subFilterRow}>
                <View style={styles.stockFilterChips}>
                  {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'in_stock', label: 'Còn hàng' },
                    { key: 'low_stock', label: 'Sắp hết (≤5)' },
                    { key: 'out_of_stock', label: 'Hết hàng (0)' },
                    { key: 'hidden', label: 'Đang ẩn' },
                  ].map((filter) => (
                    <Pressable
                      key={filter.key}
                      style={[styles.stockFilterPill, productStockFilter === filter.key && styles.stockFilterPillActive]}
                      onPress={() => setProductStockFilter(filter.key as any)}
                    >
                      <Text style={[styles.stockFilterPillText, productStockFilter === filter.key && styles.stockFilterPillTextActive]}>
                        {filter.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Sắp xếp */}
                <View style={styles.sortSelector}>
                  <Ionicons name="funnel-outline" size={14} color="#64748b" style={{ marginRight: 4 }} />
                  {[
                    { key: 'default', label: 'Mặc định' },
                    { key: 'price_asc', label: 'Giá tăng' },
                    { key: 'price_desc', label: 'Giá giảm' },
                    { key: 'stock_desc', label: 'Kho nhiều' },
                  ].map((s) => (
                    <Pressable
                      key={s.key}
                      style={[styles.sortPill, productSortBy === s.key && styles.sortPillActive]}
                      onPress={() => setProductSortBy(s.key as any)}
                    >
                      <Text style={[styles.sortPillText, productSortBy === s.key && styles.sortPillTextActive]}>
                        {s.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 40 }} />
            ) : filteredProducts.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="hardware-chip-outline" size={44} color="#94a3b8" />
                <Text style={[styles.emptyText, isDark && styles.textMutedDark]}>Không có sản phẩm nào khớp bộ lọc</Text>
              </View>
            ) : (
              <View style={styles.productsListWrap}>
                {filteredProducts.map((p) => {
                  const stockNum = p.stock ?? 0;
                  const isOutOfStock = stockNum <= 0;
                  const isLowStock = stockNum > 0 && stockNum <= 5;
                  return (
                    <View key={p.id} style={[styles.productCardRow, isMobile && styles.productCardRowMobile, isDark && styles.cardDark, p.isHidden && { opacity: 0.65 }]}>
                      <AdminProductThumb
                        image={p.image}
                        product={p}
                        style={styles.productCardThumb}
                      />
                      <View style={[styles.productCardDetails, isMobile && { minWidth: 0 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Text style={styles.productIdBadge}>[{p.id}]</Text>
                          <Text style={styles.productCatBadge}>{p.category_id || p.category || 'Khác'}</Text>
                          {p.isHidden && (
                            <View style={[styles.productStatusBadge, { backgroundColor: '#fef3c7' }]}>
                              <Text style={[styles.productStatusBadgeText, { color: '#b45309' }]}>Đang ẩn</Text>
                            </View>
                          )}
                          {isOutOfStock && (
                            <View style={[styles.productStatusBadge, { backgroundColor: '#fee2e2' }]}>
                              <Text style={[styles.productStatusBadgeText, { color: '#dc2626' }]}>Hết hàng</Text>
                            </View>
                          )}
                          {isLowStock && (
                            <View style={[styles.productStatusBadge, { backgroundColor: '#ffedd5' }]}>
                              <Text style={[styles.productStatusBadgeText, { color: '#ea580c' }]}>Sắp hết</Text>
                            </View>
                          )}
                          {!!p.discount && p.discount > 0 && (
                            <View style={[styles.productStatusBadge, { backgroundColor: '#dcfce7' }]}>
                              <Text style={[styles.productStatusBadgeText, { color: '#15803d' }]}>-{p.discount}%</Text>
                            </View>
                          )}
                        </View>

                        <Text style={[styles.productCardName, isDark && styles.textDark]}>{p.name}</Text>

                        <View style={styles.productCardPricing}>
                          <Text style={styles.productCardPrice}>{formatPrice(p.price)}</Text>
                          {!!p.oldPrice && p.oldPrice > p.price && (
                            <Text style={styles.productCardOldPrice}>{formatPrice(p.oldPrice)}</Text>
                          )}
                          <Text style={[styles.productCardStock, isDark && styles.textMutedDark]}>
                            Kho: <Text style={{ fontWeight: '800', color: isOutOfStock ? '#dc2626' : isLowStock ? '#d97706' : '#16a34a' }}>{stockNum}</Text> sp
                          </Text>
                        </View>
                      </View>

                      {/* HÀNH ĐỘNG SẢN PHẨM: ẨN, SAO CHÉP, SỬA, XÓA */}
                      <View style={[styles.productCardActions, isMobile && { width: '100%', justifyContent: 'flex-end', paddingTop: 6, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#f1f5f9' }]}>
                        {/* Ẩn / Hiện */}
                        <Pressable
                          style={[styles.actionSquareBtn, { backgroundColor: p.isHidden ? '#fffbeb' : '#f0fdf4' }]}
                          onPress={() => toggleProductVisibility(p)}
                          accessibilityLabel={p.isHidden ? 'Hiện sản phẩm' : 'Ẩn sản phẩm'}
                        >
                          <Ionicons
                            name={p.isHidden ? 'eye-off' : 'eye'}
                            size={16}
                            color={p.isHidden ? '#d97706' : '#16a34a'}
                          />
                        </Pressable>

                        {/* Nhân bản cấu hình */}
                        <Pressable
                          style={[styles.actionSquareBtn, { backgroundColor: '#f5f3ff' }]}
                          onPress={() => handleDuplicateProduct(p)}
                          accessibilityLabel="Nhân bản sản phẩm"
                        >
                          <Ionicons name="copy-outline" size={16} color="#7c3aed" />
                        </Pressable>

                        {/* Quản lý IMEI / S/N máy trong kho */}
                        <Pressable
                          style={[styles.actionSquareBtn, { backgroundColor: '#f0fdf4' }]}
                          onPress={() => {
                            setUnitCodes(undefined);
                            setUnitProduct({ id: p.id, name: p.name });
                          }}
                          accessibilityLabel="Quản lý IMEI và mã bảo hành"
                        >
                          <Ionicons name="barcode-outline" size={16} color="#059669" />
                        </Pressable>

                        {/* Chỉnh sửa */}
                        <Pressable
                          style={[styles.actionSquareBtn, { backgroundColor: '#eff6ff' }]}
                          onPress={() => handleOpenEditProduct(p)}
                          accessibilityLabel="Sửa sản phẩm"
                        >
                          <Ionicons name="pencil" size={16} color="#2563eb" />
                        </Pressable>

                        {/* Xóa */}
                        <Pressable
                          style={[styles.actionSquareBtn, { backgroundColor: '#fef2f2' }]}
                          onPress={() => setDeleteConfirm({ type: 'product', id: p.id, title: p.name })}
                          accessibilityLabel="Xóa sản phẩm"
                        >
                          <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MÃ GIẢM GIÁ (VOUCHERS) - MỚI                      */}
        {/* ======================================================== */}
        {activeTab === 'vouchers' && (
          <View style={[styles.sectionCard, isMobile && styles.sectionCardMobile, isDark && styles.cardDark]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  Mã Giảm Giá & Khuyến Mãi ({filteredVouchers.length})
                </Text>
                <Text style={[styles.sectionSubtitle, isDark && styles.textMutedDark]}>
                  Tạo voucher ưu đãi kích cầu người mua khi thanh toán giỏ hàng
                </Text>
              </View>
              <Pressable style={styles.miniBtnPrimary} onPress={handleOpenAddVoucher}>
                <Ionicons name="add" size={17} color="#ffffff" />
                <Text style={styles.miniBtnPrimaryText}>Tạo voucher mới</Text>
              </Pressable>
            </View>

            {filteredVouchers.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="ticket-outline" size={44} color="#94a3b8" />
                <Text style={[styles.emptyText, isDark && styles.textMutedDark]}>Chưa có mã khuyến mãi nào</Text>
              </View>
            ) : (
              <View style={styles.vouchersGrid}>
                {filteredVouchers.map((v) => (
                  <View key={v.code} style={[styles.voucherCard, isDark && styles.cardDark]}>
                    <View style={styles.voucherLeftTicket}>
                      <Ionicons name="gift-outline" size={26} color="#2563eb" />
                      <Text style={styles.voucherDiscountNum}>-{(v.discount / 1000).toLocaleString('vi-VN')}K</Text>
                    </View>

                    <View style={styles.voucherRightContent}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={styles.voucherCodeBadge}>
                          <Text style={styles.voucherCodeText}>{v.code}</Text>
                        </View>
                        <Pressable
                          style={styles.voucherDeleteBtn}
                          onPress={() => setDeleteConfirm({ type: 'voucher', id: v.code, title: v.code })}
                        >
                          <Ionicons name="trash-outline" size={15} color="#ef4444" />
                        </Pressable>
                      </View>

                      <Text style={[styles.voucherLabelTitle, isDark && styles.textDark]}>{v.label}</Text>
                      <Text style={[styles.voucherMinOrder, isDark && styles.textMutedDark]}>
                        Đơn tối thiểu: {v.minOrder > 0 ? `${formatPrice(v.minOrder)}` : 'Không giới hạn'}
                      </Text>
                      <Text style={styles.voucherExpiryText}>Hạn dùng: {v.expiryDate || 'Vô thời hạn'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB 5: QUẢN LÝ NHẬP / XUẤT KHO (INVENTORY)               */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <View style={[styles.sectionCard, isMobile && styles.sectionCardMobile, isDark && styles.cardDark]}>
            <View style={styles.inventoryHeroBanner}>
              <View style={styles.inventoryHeroIconWrap}>
                <Ionicons name="cube" size={28} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inventoryHeroTitle}>Điều Phối Tồn Kho Theo Thương Hiệu</Text>
                <Text style={styles.inventoryHeroSub}>
                  Nhập thêm linh kiện khi nhà phân phối giao hàng hoặc xuất kho bán trực tiếp tại cửa hàng
                </Text>
              </View>
              <View style={styles.inventoryTotalStats}>
                <Text style={styles.inventoryTotalVal}>{totalStockCount}</Text>
                <Text style={styles.inventoryTotalLabel}>Tổng tồn kho</Text>
              </View>
            </View>

            {brandInventory.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyText, isDark && styles.textMutedDark]}>Chưa có thông tin thương hiệu</Text>
              </View>
            ) : (
              <View style={styles.brandInventoryContainer}>
                {brandInventory.map((group) => (
                  <View key={group.brand} style={[styles.brandCardWrapper, isDark && styles.cardDark]}>
                    <View style={styles.brandCardTop}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={styles.brandAvatarBox}>
                          <Text style={styles.brandAvatarBoxText}>{group.brand.slice(0, 2).toUpperCase()}</Text>
                        </View>
                        <View>
                          <Text style={[styles.brandTitleText, isDark && styles.textDark]}>{group.brand}</Text>
                          <Text style={[styles.brandSubtitleText, isDark && styles.textMutedDark]}>
                            {group.products.length} dòng linh kiện
                          </Text>
                        </View>
                      </View>
                      <View style={styles.brandTotalStockTag}>
                        <Text style={styles.brandTotalStockVal}>{group.stock}</Text>
                        <Text style={styles.brandTotalStockLabel}>cái trong kho</Text>
                      </View>
                    </View>

                    {/* Danh sách linh kiện của thương hiệu */}
                    <View style={styles.brandProductsTable}>
                      {group.products.map((p) => (
                        <View key={p.id} style={styles.brandProductRow}>
                          <AdminProductThumb
                            image={p.image}
                            product={p}
                            style={styles.brandProductThumb}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.brandProductName, isDark && styles.textDark]} numberOfLines={1}>{p.name}</Text>
                            <Text style={[styles.brandProductMeta, isDark && styles.textMutedDark]}>
                              Mã: {p.id} • Hiện còn: <Text style={{ fontWeight: '800', color: (p.stock ?? 0) <= 5 ? '#dc2626' : '#059669' }}>{p.stock ?? 0}</Text> sp
                            </Text>
                          </View>

                          <View style={styles.inventoryAdjustGroup}>
                            <TextInput
                              value={inventoryQuantities[p.id] || ''}
                              onChangeText={(v) => setInventoryQuantities((prev) => ({ ...prev, [p.id]: v.replace(/[^0-9]/g, '') }))}
                              keyboardType="numeric"
                              placeholder="SL"
                              placeholderTextColor="#94a3b8"
                              style={[styles.inventoryInput, isDark && styles.inventoryInputDark]}
                            />
                            <Pressable style={styles.btnStockIn} onPress={() => handleInventoryAdjustment(p, 'in')}>
                              <Ionicons name="add" size={15} color="#059669" />
                              <Text style={styles.btnStockInText}>Nhập</Text>
                            </Pressable>
                            <Pressable style={styles.btnStockOut} onPress={() => handleInventoryAdjustment(p, 'out')}>
                              <Ionicons name="remove" size={15} color="#dc2626" />
                              <Text style={styles.btnStockOutText}>Xuất</Text>
                            </Pressable>
                            <Pressable
                              style={[styles.btnManageUnits, isDark && styles.btnManageUnitsDark]}
                              onPress={() => {
                                setUnitCodes(undefined);
                                setUnitProduct({ id: p.id, name: p.name });
                              }}
                            >
                              <Ionicons name="barcode-outline" size={13} color="#2563eb" />
                              <Text style={styles.btnManageUnitsText}>Mã máy / IMEI</Text>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB 6: QUẢN LÝ DANH MỤC (CATEGORIES)                     */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <View style={[styles.sectionCard, isMobile && styles.sectionCardMobile, isDark && styles.cardDark]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  Danh mục Linh kiện ({filteredCategories.length})
                </Text>
                <Text style={[styles.sectionSubtitle, isDark && styles.textMutedDark]}>
                  Phân loại hệ thống sản phẩm phục vụ tìm kiếm và điều hướng
                </Text>
              </View>
              <Pressable
                style={styles.miniBtnPrimary}
                onPress={() => {
                  setEditingCategory(null);
                  setCategoryForm({ id: '', name: '', count: '0', icon: '💻' });
                  setIsCategoryModalOpen(true);
                }}
              >
                <Ionicons name="add" size={17} color="#ffffff" />
                <Text style={styles.miniBtnPrimaryText}>Thêm danh mục</Text>
              </Pressable>
            </View>

            {filteredCategories.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyText, isDark && styles.textMutedDark]}>Không có danh mục nào</Text>
              </View>
            ) : (
              <View style={styles.categoriesGrid}>
                {filteredCategories.map((cat) => {
                  const prodCount = productList.filter((p) => (p.category_id || p.category) === cat.id).length;
                  return (
                    <View key={cat.id} style={[styles.categoryCardItem, isDark && styles.cardDark]}>
                      <View style={styles.catEmojiWrap}>
                        <Text style={{ fontSize: 26 }}>{cat.icon || '📁'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.catItemName, isDark && styles.textDark]}>{cat.name}</Text>
                        <Text style={[styles.catItemId, isDark && styles.textMutedDark]}>Mã: {cat.id}</Text>
                        <Text style={styles.catItemCount}>{prodCount} sản phẩm</Text>
                      </View>
                      <View style={styles.catActions}>
                        <Pressable
                          style={styles.catBtnEdit}
                          onPress={() => {
                            setEditingCategory(cat);
                            setCategoryForm({ id: cat.id, name: cat.name, count: String(cat.count), icon: cat.icon || '💻' });
                            setIsCategoryModalOpen(true);
                          }}
                        >
                          <Ionicons name="pencil" size={16} color="#2563eb" />
                        </Pressable>
                        <Pressable
                          style={styles.catBtnDelete}
                          onPress={() => setDeleteConfirm({ type: 'category', id: cat.id, title: cat.name })}
                        >
                          <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB 7: QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN (USERS)            */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <View style={[styles.sectionCard, isMobile && styles.sectionCardMobile, isDark && styles.cardDark]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  Quản lý Tài khoản & Phân quyền ({filteredUsers.length})
                </Text>
                <Text style={[styles.sectionSubtitle, isDark && styles.textMutedDark]}>
                  Phân cấp quyền truy cập: Quản trị viên (Admin) • Nhân viên cửa hàng (Staff) • Khách hàng (Customer)
                </Text>
              </View>

              <Pressable
                style={[styles.miniBtnPrimary, { backgroundColor: '#7c3aed' }]}
                onPress={() => {
                  setNewUserForm({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    role: 'staff',
                    address: '',
                    city: '',
                  });
                  setIsCreateUserModalOpen(true);
                }}
              >
                <Ionicons name="person-add" size={16} color="#ffffff" />
                <Text style={styles.miniBtnPrimaryText}>Thêm tài khoản / Nhân viên</Text>
              </Pressable>
            </View>

            {/* BỘ LỌC VAI TRÒ CHUYÊN NGHIỆP */}
            <View style={styles.roleFilterRow}>
              {[
                { id: 'all', label: 'Tất cả', count: userList.length, icon: 'people-outline', color: '#64748b' },
                { id: 'admin', label: 'Quản trị viên', count: adminCount, icon: 'shield-checkmark', color: '#7c3aed' },
                { id: 'staff', label: 'Nhân viên', count: staffCount, icon: 'id-card', color: '#059669' },
                { id: 'customer', label: 'Khách hàng', count: customerCount, icon: 'person', color: '#2563eb' },
              ].map((rf) => {
                const isSelected = userRoleFilter === rf.id;
                return (
                  <Pressable
                    key={rf.id}
                    style={[
                      styles.roleFilterChip,
                      isDark && styles.roleFilterChipDark,
                      isSelected && { borderColor: rf.color, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff' },
                    ]}
                    onPress={() => setUserRoleFilter(rf.id as any)}
                  >
                    <Ionicons name={rf.icon as any} size={15} color={isSelected ? rf.color : '#94a3b8'} />
                    <Text
                      style={[
                        styles.roleFilterChipText,
                        isDark && styles.textMutedDark,
                        isSelected && { color: rf.color, fontWeight: '800' },
                      ]}
                    >
                      {rf.label} ({rf.count})
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {filteredUsers.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="people-outline" size={44} color="#94a3b8" />
                <Text style={[styles.emptyText, isDark && styles.textMutedDark]}>Không tìm thấy tài khoản nào phù hợp</Text>
              </View>
            ) : (
              <View style={styles.usersList}>
                {filteredUsers.map((u) => {
                  const userRole = u.role || 'customer';
                  const isUserAdmin = userRole === 'admin';
                  const isUserStaff = userRole === 'staff';
                  const isCurrentLoggedUser = Number(u.id) === Number(user?.id);
                  const isSuperAdmin = u.email === 'admin@promart.vn';

                  const badgeColor = isUserAdmin ? '#7c3aed' : isUserStaff ? '#059669' : '#2563eb';
                  const badgeBg = isUserAdmin ? '#f5f3ff' : isUserStaff ? '#ecfdf5' : '#eff6ff';
                  const badgeBorder = isUserAdmin ? '#ddd6fe' : isUserStaff ? '#a7f3d0' : '#bfdbfe';

                  return (
                    <View
                      key={u.id}
                      style={[
                        styles.userCardRow,
                        !isDesktop && styles.userCardRowMobile,
                        isDark && styles.cardDark,
                      ]}
                    >
                      {/* USER HEADER INFO (AVATAR + TEXT) */}
                      <View style={[styles.userCardMain, !isDesktop && styles.userCardMainMobile]}>
                        {/* AVATAR BADGE */}
                        <View style={[styles.userAvatarBadge, { backgroundColor: badgeColor }]}>
                          <Text style={styles.userAvatarBadgeText}>{(u.name ? u.name[0] : 'U').toUpperCase()}</Text>
                        </View>

                        {/* USER INFO */}
                        <View style={styles.userInfoWrap}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <Text style={[styles.userCardName, isDark && styles.textDark]}>{u.name || 'Chưa đặt tên'}</Text>

                            {/* ROLE BADGE */}
                            <View style={[styles.userRoleTag, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
                              <Text style={[styles.userRoleTagText, { color: badgeColor }]}>
                                {isUserAdmin ? '⭐ Quản Trị Viên (Admin)' : isUserStaff ? '👔 Nhân Viên Cửa Hàng (Staff)' : '👤 Khách Hàng (Customer)'}
                              </Text>
                            </View>

                            {isSuperAdmin && (
                              <View style={[styles.userRoleTag, { backgroundColor: '#fef3c7', borderColor: '#fde68a' }]}>
                                <Text style={[styles.userRoleTagText, { color: '#b45309' }]}>👑 Super Admin</Text>
                              </View>
                            )}

                            {isCurrentLoggedUser && (
                              <View style={[styles.userRoleTag, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                                <Text style={[styles.userRoleTagText, { color: '#16a34a' }]}>Đang đăng nhập</Text>
                              </View>
                            )}
                          </View>

                          <Text style={[styles.userCardContact, isDark && styles.textMutedDark]}>
                            ✉️ {u.email} • 📞 {u.phone || 'Chưa cập nhật SĐT'}
                          </Text>
                          {u.address ? (
                            <Text style={[styles.userCardAddress, isDark && styles.textMutedDark]}>📍 {u.address}</Text>
                          ) : null}
                        </View>
                      </View>

                      {/* ROLE SWITCHER BUTTONS & ACTIONS */}
                      <View style={[styles.userActionsGroup, !isDesktop && styles.userActionsGroupMobile]}>
                        <View style={[styles.roleSwitcherGroup, !isDesktop && styles.roleSwitcherGroupMobile]}>
                          <Text style={[styles.roleSwitcherLabel, isDark && styles.textMutedDark]}>Phân quyền:</Text>
                          <View style={styles.roleChipsWrap}>
                            {/* Nút Admin */}
                            <Pressable
                              style={[
                                styles.roleBtnSmall,
                                isUserAdmin && styles.roleBtnAdminActive,
                                (isCurrentLoggedUser || isSuperAdmin) && { opacity: 0.6 },
                              ]}
                              onPress={() => handleSetUserRole(u, 'admin')}
                              disabled={isCurrentLoggedUser || isSuperAdmin}
                            >
                              <Ionicons name="shield-checkmark" size={13} color={isUserAdmin ? '#ffffff' : '#7c3aed'} />
                              <Text style={[styles.roleBtnTextSmall, isUserAdmin && { color: '#ffffff' }]}>Admin</Text>
                            </Pressable>

                            {/* Nút Nhân viên */}
                            <Pressable
                              style={[
                                styles.roleBtnSmall,
                                isUserStaff && styles.roleBtnStaffActive,
                                (isCurrentLoggedUser || isSuperAdmin) && { opacity: 0.6 },
                              ]}
                              onPress={() => handleSetUserRole(u, 'staff')}
                              disabled={isCurrentLoggedUser || isSuperAdmin}
                            >
                              <Ionicons name="id-card" size={13} color={isUserStaff ? '#ffffff' : '#059669'} />
                              <Text style={[styles.roleBtnTextSmall, isUserStaff && { color: '#ffffff' }]}>Nhân viên</Text>
                            </Pressable>

                            {/* Nút Khách hàng */}
                            <Pressable
                              style={[
                                styles.roleBtnSmall,
                                !isUserAdmin && !isUserStaff && styles.roleBtnCustomerActive,
                                (isCurrentLoggedUser || isSuperAdmin) && { opacity: 0.6 },
                              ]}
                              onPress={() => handleSetUserRole(u, 'customer')}
                              disabled={isCurrentLoggedUser || isSuperAdmin}
                            >
                              <Ionicons name="person" size={13} color={!isUserAdmin && !isUserStaff ? '#ffffff' : '#2563eb'} />
                              <Text style={[styles.roleBtnTextSmall, !isUserAdmin && !isUserStaff && { color: '#ffffff' }]}>Khách</Text>
                            </Pressable>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          {/* Nút Xem chi tiết tài khoản */}
                          <Pressable
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 4,
                              backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff',
                              paddingHorizontal: 10,
                              paddingVertical: 7,
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor: isDark ? 'rgba(37, 99, 235, 0.3)' : '#bfdbfe',
                            }}
                            onPress={() => setViewingUser(u)}
                          >
                            <Ionicons name="eye-outline" size={15} color="#2563eb" />
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#2563eb' }}>Chi tiết</Text>
                          </Pressable>

                          {/* Nút xóa người dùng */}
                          <Pressable
                            style={[styles.btnDeleteUser, (isCurrentLoggedUser || isSuperAdmin) && { opacity: 0.3 }]}
                            onPress={() => setDeleteConfirm({ type: 'user', id: u.id, title: u.name || u.email })}
                            disabled={isCurrentLoggedUser || isSuperAdmin}
                          >
                            <Ionicons name="trash-outline" size={16} color="#ef4444" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB: HỖ TRỢ KHÁCH HÀNG (CHATBOT -> ADMIN)                  */}
        {/* ======================================================== */}
        {activeTab === 'support' && (
          <AdminSupportPanel
            isDark={isDark}
            isDesktop={isDesktop}
            searchTerm={searchTerm}
            showToast={showToast}
            onPendingChange={setSupportPendingCount}
          />
        )}
      </ScrollView>

      {/* ======================================================== */}
      {/* MODAL 1: XEM CHI TIẾT ĐƠN HÀNG & IN HÓA ĐƠN               */}
      {/* ======================================================== */}
      <Modal visible={!!viewingOrder} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxLarge, isMobile && styles.modalBoxLargeMobile, isDark && styles.cardDark]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Text style={[styles.modalOrderTitle, isDark && styles.textDark, { flexShrink: 1 }]}>
                    Hóa Đơn {viewingOrder?.orderNumber || `#ORD-${viewingOrder?.id}`}
                  </Text>
                  {viewingOrder && (
                    <View style={[styles.statusTag, { backgroundColor: getStatusBadgeStyle(viewingOrder.status).bg }]}>
                      <Text style={[styles.statusTagText, { color: getStatusBadgeStyle(viewingOrder.status).color }]}>
                        {getStatusLabel(viewingOrder.status)}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.modalOrderSubtitle, isDark && styles.textMutedDark]}>
                  Thời gian đặt: {viewingOrder?.createdAt ? new Date(viewingOrder.createdAt).toLocaleString('vi-VN') : ''}
                </Text>
              </View>
              <Pressable onPress={() => { setViewingOrder(null); setInvoicePreview(false); }}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView
              style={{ flexGrow: 1, flexShrink: 1 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {/* THÔNG TIN KHÁCH HÀNG & GIAO HÀNG */}
              <View style={[styles.orderDetailInfoCard, isMobile && { padding: 10, gap: 10 }]}>
                <Text style={styles.infoCardHeading}>Thông tin nhận hàng</Text>
                <View style={[styles.infoRow, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 2 }]}>
                  <Text style={[styles.infoLabel, isMobile && { width: 'auto', fontSize: 11 }]}>📍 Địa chỉ giao hàng:</Text>
                  <Text style={[styles.infoValue, isDark && styles.textDark, isMobile && { textAlign: 'left', width: '100%', lineHeight: 18 }]} selectable>
                    {viewingOrder?.shippingAddress}
                  </Text>
                </View>
                <View style={[styles.infoRow, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 2, marginTop: isMobile ? 2 : 0 }]}>
                  <Text style={[styles.infoLabel, isMobile && { width: 'auto', fontSize: 11 }]}>💳 Phương thức thanh toán:</Text>
                  <Text style={[styles.infoValue, isDark && styles.textDark, isMobile && { textAlign: 'left', width: '100%' }]}>
                    {viewingOrder?.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : viewingOrder?.paymentMethod?.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* THÔNG TIN YÊU CẦU ĐỔI TRẢ NẾU CÓ */}
              {viewingOrder?.returnStatus ? (
                <View
                  style={[
                    styles.adminReturnBanner,
                    viewingOrder.returnStatus === 'pending'
                      ? styles.adminReturnPending
                      : viewingOrder.returnStatus === 'approved'
                      ? styles.adminReturnApproved
                      : styles.adminReturnRejected,
                    { marginHorizontal: 0, marginTop: 12 },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                    <Ionicons
                      name={
                        viewingOrder.returnStatus === 'pending'
                          ? 'alert-circle'
                          : viewingOrder.returnStatus === 'approved'
                          ? 'checkmark-circle'
                          : 'close-circle'
                      }
                      size={20}
                      color={
                        viewingOrder.returnStatus === 'pending'
                          ? '#b45309'
                          : viewingOrder.returnStatus === 'approved'
                          ? '#15803d'
                          : '#b91c1c'
                      }
                      style={{ marginTop: 2 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.adminReturnTitle,
                          {
                            color:
                              viewingOrder.returnStatus === 'pending'
                                ? '#b45309'
                                : viewingOrder.returnStatus === 'approved'
                                ? '#15803d'
                                : '#b91c1c',
                          },
                        ]}
                      >
                        {viewingOrder.returnStatus === 'pending'
                          ? 'Khách hàng yêu cầu Đổi trả / Bảo hành'
                          : viewingOrder.returnStatus === 'approved'
                          ? 'Đã duyệt yêu cầu Đổi mới / Bảo hành'
                          : 'Đã từ chối yêu cầu đổi trả'}
                      </Text>
                      <Text style={[styles.adminReturnReason, isDark && styles.textMutedDark]}>
                        Lý do: <Text style={{ fontWeight: '700' }}>{viewingOrder.returnReason || 'Sản phẩm lỗi kỹ thuật / nứt vỡ'}</Text>
                      </Text>

                      {viewingOrder.returnMedia && viewingOrder.returnMedia.length > 0 && (
                        <View style={{ marginTop: 8 }}>
                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748b', marginBottom: 4 }}>
                            Minh chứng ảnh/video từ khách (nhấn để phóng to):
                          </Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 6 }}>
                            {viewingOrder.returnMedia.map((mediaUrl: string, idx: number) => (
                              <Pressable
                                key={idx}
                                style={styles.adminProofThumb}
                                onPress={() => setPreviewMediaUrl(mediaUrl)}
                              >
                                <Image source={{ uri: mediaUrl }} style={styles.adminProofImg} resizeMode="cover" />
                                <View style={styles.adminProofZoomIcon}>
                                  <Ionicons name="scan-outline" size={12} color="#ffffff" />
                                </View>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>

                  {viewingOrder.returnStatus === 'pending' && (
                    <View style={styles.adminReturnActions}>
                      <Pressable
                        style={styles.btnAdminApproveReturn}
                        onPress={() => handleUpdateReturnStatus(viewingOrder.id || viewingOrder.orderNumber, 'approved')}
                      >
                        <Ionicons name="checkmark-circle" size={15} color="#ffffff" style={{ marginRight: 4 }} />
                        <Text style={styles.btnAdminApproveReturnText}>Duyệt đổi hàng</Text>
                      </Pressable>
                      <Pressable
                        style={styles.btnAdminRejectReturn}
                        onPress={() => handleUpdateReturnStatus(viewingOrder.id || viewingOrder.orderNumber, 'rejected')}
                      >
                        <Ionicons name="close-circle" size={15} color="#b91c1c" style={{ marginRight: 4 }} />
                        <Text style={styles.btnAdminRejectReturnText}>Từ chối</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ) : null}

              {/* DANH SÁCH SẢN PHẨM TRONG ĐƠN */}
              <Text style={[styles.itemsTableHeading, isDark && styles.textDark]}>Danh sách linh kiện đặt mua:</Text>
              <View style={styles.itemsTableWrap}>
                {viewingOrder?.items?.map((item, idx) => (
                  <View key={idx} style={[styles.itemTableRow, isMobile && { padding: 8, gap: 8 }]}>
                    <AdminProductThumb
                      image={item.image}
                      product={item}
                      style={[styles.itemTableThumb, isMobile && { width: 38, height: 38 }]}
                    />
                    <View style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
                      <Text style={[styles.itemTableName, isDark && styles.textDark, isMobile && { fontSize: 12, lineHeight: 16 }]} numberOfLines={2}>{item.name}</Text>
                      <Text style={[styles.itemTableSub, isDark && styles.textMutedDark, isMobile && { fontSize: 11 }]}>
                        Đơn giá: {formatPrice(item.price)}
                      </Text>

                      {/* Mã BH / IMEI máy đã cấp cho đơn hàng */}
                      <View style={styles.orderItemUnitsBox}>
                        {(() => {
                          const units = ensureDeviceUnits(item);
                          return (
                            <>
                              {units.map((u, uIdx) => (
                                <View key={uIdx} style={{ gap: 2, paddingBottom: uIdx < units.length - 1 ? 4 : 0, borderBottomWidth: uIdx < units.length - 1 ? 1 : 0, borderBottomColor: isDark ? '#334155' : '#e2e8f0' }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                    <Text style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', fontWeight: '600' }}>Mã BH nội bộ:</Text>
                                    <Text selectable style={[styles.orderItemUnitsCode, isDark && { color: '#93c5fd' }]}>{u.code}</Text>
                                  </View>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                    <Text style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', fontWeight: '600' }}>IMEI / Serial hãng:</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                      <Ionicons name="lock-closed" size={11} color="#059669" />
                                      <Text selectable style={{ fontSize: 11, fontWeight: '800', color: '#059669', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
                                        {u.manufacturerSerial}
                                      </Text>
                                      <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                                        <Text style={{ fontSize: 9, fontWeight: '700', color: '#059669' }}>Cố định</Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              ))}

                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 4 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                                  <Ionicons name="lock-closed" size={12} color="#059669" />
                                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#059669' }}>
                                    IMEI máy đã cố định & niêm phong theo đơn
                                  </Text>
                                </View>
                                <Pressable
                                  style={[styles.btnInputOrderSerial, { paddingHorizontal: 6, paddingVertical: 3, marginTop: 0 }]}
                                  onPress={() => {
                                    setUnitCodes(units.map(u => u.code));
                                    setUnitProduct({ id: item.productId, name: item.name });
                                  }}
                                >
                                  <Ionicons name="pencil-outline" size={11} color="#2563eb" />
                                  <Text style={[styles.btnInputOrderSerialText, { fontSize: 10 }]}>
                                    Đổi tem
                                  </Text>
                                </Pressable>
                              </View>
                            </>
                          );
                        })()}
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                      <Text style={[styles.itemTableQty, isDark && styles.textDark, isMobile && { fontSize: 11 }]}>x{item.quantity}</Text>
                      <Text style={[styles.itemTableTotal, isMobile && { fontSize: 12 }]}>{formatPrice(item.price * item.quantity)}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* TỔNG CỘNG TIỀN */}
              <View style={[styles.orderSummaryCard, isMobile && { padding: 10 }]}>
                <View style={styles.summaryLine}>
                  <Text style={styles.summaryLabel}>Tiền hàng:</Text>
                  <Text style={[styles.summaryVal, isDark && styles.textDark]}>{formatPrice(viewingOrder?.totalAmount || 0)}</Text>
                </View>
                <View style={styles.summaryLine}>
                  <Text style={styles.summaryLabel}>Phí giao hàng:</Text>
                  <Text style={styles.summaryValFree}>Miễn phí</Text>
                </View>
                <View style={[styles.summaryLine, styles.summaryTotalLine]}>
                  <Text style={[styles.grandTotalLabel, isMobile && { fontSize: 13 }]}>Tổng thu của khách:</Text>
                  <Text style={[styles.grandTotalVal, isMobile && { fontSize: 15 }]}>{formatPrice(viewingOrder?.totalAmount || 0)}</Text>
                </View>
              </View>
            </ScrollView>

            <View style={[styles.modalFooterActions, isMobile && { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between' }, isDark && { borderTopColor: '#334155' }]}>
              {viewingOrder?.returnStatus ? (
                <Pressable
                  style={[styles.btnPrintInvoice, isMobile && { flex: 1, minWidth: 120, paddingHorizontal: 8, paddingVertical: 8, justifyContent: 'center' }, { backgroundColor: '#f0fdf4', borderColor: '#86efac' }]}
                  onPress={() => viewingOrder && handlePrintWarrantyReceipt(viewingOrder)}
                >
                  <Ionicons name="shield-checkmark" size={15} color="#15803d" />
                  <Text style={[styles.btnPrintInvoiceText, { color: '#15803d', fontWeight: '800', fontSize: isMobile ? 11 : 13 }]}>
                    Phiếu BH
                  </Text>
                </Pressable>
              ) : null}

              <Pressable
                style={[styles.btnPrintInvoice, isMobile && { flex: 1, minWidth: 110, paddingHorizontal: 8, paddingVertical: 8, justifyContent: 'center' }]}
                onPress={() => {
                  if (viewingOrder) {
                    setInvoiceOrder(viewingOrder);
                    setInvoiceModalVisible(true);
                  }
                }}
              >
                <Ionicons name="receipt-outline" size={15} color="#2563eb" />
                <Text style={[styles.btnPrintInvoiceText, { fontSize: isMobile ? 11 : 13 }]}>Xuất / In Hóa Đơn</Text>
              </Pressable>

              <Pressable style={[styles.btnCloseModal, isMobile && { minWidth: 65, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setViewingOrder(null)}>
                <Text style={styles.btnCloseModalText}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: THÊM / CHỈNH SỬA SẢN PHẨM (5 TABS CHUYÊN NGHIỆP) */}
      {/* ======================================================== */}
      <Modal visible={isProductModalOpen} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxLarge, isMobile && styles.modalBoxLargeMobile, isDark && styles.cardDark]}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name={editingProduct ? 'create-outline' : 'add-circle-outline'} size={18} color="#2563eb" />
                </View>
                <View>
                  <Text style={[styles.modalMainTitle, isDark && styles.textDark]}>
                    {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Đăng sản phẩm mới'}
                  </Text>
                  <Text style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>
                    {editingProduct ? `Mã: ${editingProduct.id}` : 'Điền thông tin và cấu hình chi tiết theo từng ô riêng'}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => setIsProductModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            {/* THANH 5 TAB PHÂN BƯỚC ĐẲNG CẤP */}
            <View style={styles.productTabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', gap: 6, paddingRight: 8 }}>
                  {PRODUCT_MODAL_TABS.map((tab) => {
                    const isActive = productModalTab === tab.id;
                    const specCount = Object.values(productSpecsForm).filter((v) => v && v.trim()).length + customSpecsList.filter((c) => c.key && c.value).length;
                    return (
                      <Pressable
                        key={tab.id}
                        style={[styles.productTabBtn, isActive && styles.productTabBtnActive]}
                        onPress={() => setProductModalTab(tab.id)}
                      >
                        <Ionicons name={tab.icon} size={14} color={isActive ? '#ffffff' : '#64748b'} />
                        <Text style={[styles.productTabBtnText, isActive && styles.productTabBtnTextActive]}>
                          {tab.label}
                        </Text>
                        {tab.id === 'specs' && specCount > 0 && (
                          <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                            <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                              {specCount}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* NỘI DUNG SCROLL VIEW THEO TAB */}
            <ScrollView
              style={{ flex: 1, minHeight: 0, width: '100%' }}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {/* ==================== TAB 1: CƠ BẢN ==================== */}
              {productModalTab === 'basic' && (
                <View style={{ gap: 14 }}>
                  {!editingProduct && (
                    <View style={styles.formGroup}>
                      <View style={[styles.formGroupHeader, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 4 }]}>
                        <Text style={[styles.fieldLabel, isDark && styles.textDark, isMobile && { marginBottom: 0 }]}>Mã định danh (ID):</Text>
                        <Pressable onPress={regenerateId} style={styles.regenBtn}>
                          <Ionicons name="refresh" size={12} color="#2563eb" />
                          <Text style={styles.regenBtnText}>Tạo mã ngẫu nhiên</Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={[styles.inputControl, isDark && styles.inputControlDark]}
                        value={productForm.id}
                        onChangeText={(t) => setProductForm({ ...productForm, id: t })}
                        placeholder="VD: lap-005, rtx-4080, cpu-i7"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>
                  )}

                  <View style={styles.formGroup}>
                    <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Tên sản phẩm *:</Text>
                    <TextInput
                      style={[styles.inputControl, { fontWeight: '700', fontSize: 15 }, isDark && styles.inputControlDark]}
                      value={productForm.name}
                      onChangeText={(t) => setProductForm({ ...productForm, name: t })}
                      placeholder="VD: ASUS ROG Strix SCAR 16 RTX 4080 hoặc Dell Latitude 5480"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  {/* CHỌN DANH MỤC LINH KIỆN */}
                  <View style={styles.formGroup}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={[styles.fieldLabel, isDark && styles.textDark, { marginBottom: 0 }]}>Danh mục linh kiện:</Text>
                      <Text style={{ fontSize: 11, color: '#2563eb', fontWeight: '600' }}>
                        Tự động đổi bộ cấu hình ở Tab 2
                      </Text>
                    </View>
                    <View style={styles.categoryChipsWrap}>
                      {(categoryList.length > 0
                        ? categoryList.map((c) => ({ id: c.id, label: c.name, icon: c.icon }))
                        : PRESET_CATEGORIES
                      ).map((c) => {
                        const isSel = productForm.category_id === c.id;
                        return (
                          <Pressable
                            key={c.id}
                            onPress={() => setProductForm({ ...productForm, category_id: c.id })}
                            style={[styles.catPickChip, isSel && styles.catPickChipActive]}
                          >
                            <Text style={{ fontSize: 13 }}>{c.icon}</Text>
                            <Text style={[styles.catPickChipText, isSel && styles.catPickChipTextActive]}>{c.label}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </View>
              )}

              {/* ==================== TAB 2: CẤU HÌNH (THÔNG SỐ KỸ THUẬT THEO Ô RIÊNG) ==================== */}
              {productModalTab === 'specs' && (
                <View>
                  {/* BANNER TIÊU ĐỀ & NÚT VÍ DỤ / XÓA TRẮNG */}
                  {(() => {
                    const template = getCategorySpecsTemplate(productForm.category_id);
                    return (
                      <View style={styles.specsHeaderBanner}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ fontSize: 16 }}>{template.icon}</Text>
                            <Text style={styles.specsBannerTitle}>{template.title}</Text>
                          </View>
                          <Text style={styles.specsBannerSubtitle}>
                            Nhập chi tiết từng ô để hiển thị bảng cấu hình chuyên nghiệp cho khách hàng
                          </Text>
                        </View>

                        <View style={styles.specsActionGroup}>
                          <Pressable
                            style={styles.btnSpecsExample}
                            onPress={handleDemoFillSpecs}
                            accessibilityLabel="Bấm để điền nhanh thông số mẫu"
                          >
                            <Ionicons name="sparkles" size={13} color="#2563eb" />
                            <Text style={styles.btnSpecsExampleText}>Ví dụ</Text>
                          </Pressable>
                          <Pressable style={styles.btnSpecsClear} onPress={handleClearSpecs}>
                            <Text style={styles.btnSpecsClearText}>Xóa trắng</Text>
                          </Pressable>
                        </View>
                      </View>
                    );
                  })()}

                  {/* GRID THÔNG SỐ KỸ THUẬT 2 CỘT */}
                  {(() => {
                    const template = getCategorySpecsTemplate(productForm.category_id);
                    return (
                      <View style={styles.specsGrid}>
                        {template.fields.map((f) => (
                          <View key={f.key} style={[styles.specGridItem, isMobile && { minWidth: '100%' }]}>
                            <View style={styles.specItemHeader}>
                              <Text style={[styles.fieldLabel, isDark && styles.textDark, { marginBottom: 0 }]}>
                                {f.label}:
                              </Text>
                              <Pressable
                                style={styles.specQuickFillBtn}
                                onPress={() => handleQuickFillSingleSpec(f.key, f.example)}
                              >
                                <Text style={styles.specQuickFillText} numberOfLines={1}>
                                  Mẫu: {f.example.slice(0, 18)}...
                                </Text>
                              </Pressable>
                            </View>
                            <TextInput
                              style={[styles.inputControl, isDark && styles.inputControlDark]}
                              value={productSpecsForm[f.key] || ''}
                              onChangeText={(t) => setProductSpecsForm((prev) => ({ ...prev, [f.key]: t }))}
                              placeholder={f.placeholder}
                              placeholderTextColor="#94a3b8"
                            />
                          </View>
                        ))}
                      </View>
                    );
                  })()}

                  {/* THÔNG SỐ TÙY CHỈNH THÊM (NẾU CÓ) */}
                  <View style={styles.customSpecsBox}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#f8fafc' : '#0f172a' }}>
                        Thông số kỹ thuật bổ sung (Tùy chọn):
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748b' }}>
                        Thêm bất kỳ thông số nào khác
                      </Text>
                    </View>

                    {customSpecsList.map((item) => (
                      <View key={item.id} style={styles.customSpecRow}>
                        <TextInput
                          style={[styles.inputControl, { flex: 1 }, isDark && styles.inputControlDark]}
                          value={item.key}
                          onChangeText={(t) => handleUpdateCustomSpec(item.id, 'key', t)}
                          placeholder="Tên thông số (VD: Socket, Tản nhiệt)"
                          placeholderTextColor="#94a3b8"
                        />
                        <TextInput
                          style={[styles.inputControl, { flex: 1.5 }, isDark && styles.inputControlDark]}
                          value={item.value}
                          onChangeText={(t) => handleUpdateCustomSpec(item.id, 'value', t)}
                          placeholder="Giá trị (VD: LGA1700, Đồng nguyên khối)"
                          placeholderTextColor="#94a3b8"
                        />
                        <Pressable
                          style={{ padding: 8 }}
                          onPress={() => handleRemoveCustomSpec(item.id)}
                          accessibilityLabel="Xóa dòng thông số"
                        >
                          <Ionicons name="trash-outline" size={17} color="#dc2626" />
                        </Pressable>
                      </View>
                    ))}

                    <Pressable style={styles.btnAddCustomSpec} onPress={handleAddCustomSpec}>
                      <Ionicons name="add" size={16} color="#2563eb" />
                      <Text style={styles.btnAddCustomSpecText}>+ Thêm thông số khác</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* ==================== TAB 3: GIÁ & KHO ==================== */}
              {productModalTab === 'pricing' && (
                <View style={{ gap: 14 }}>
                  {/* GIÁ BÁN THỰC TẾ */}
                  <View style={styles.formGroup}>
                    <View style={[styles.formGroupHeader, isMobile && { flexWrap: 'wrap', gap: 4 }]}>
                      <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Giá bán thực tế (VNĐ) *:</Text>
                      {!!productForm.price && (
                        <Text style={styles.previewPriceLive}>{formatPrice(parseInt(productForm.price, 10) || 0)}</Text>
                      )}
                    </View>
                    <View style={styles.stepperContainer}>
                      <Pressable style={styles.stepperBtn} onPress={() => adjustPrice('price', -500000)}>
                        <Ionicons name="remove" size={17} color="#475569" />
                      </Pressable>
                      <TextInput
                        style={[styles.stepperInput, isDark && styles.textDark]}
                        keyboardType="numeric"
                        value={productForm.price}
                        onChangeText={(t) => setProductForm({ ...productForm, price: t.replace(/[^0-9]/g, '') })}
                        placeholder="25990000"
                        placeholderTextColor="#94a3b8"
                      />
                      <Pressable style={[styles.stepperBtn, styles.stepperBtnPlus]} onPress={() => adjustPrice('price', 500000)}>
                        <Ionicons name="add" size={17} color="#2563eb" />
                      </Pressable>
                    </View>
                    <View style={styles.quickAddRow}>
                      {[
                        { label: '+500k', val: 500000 },
                        { label: '+1tr', val: 1000000 },
                        { label: '+2tr', val: 2000000 },
                        { label: '+5tr', val: 5000000 },
                      ].map((chip) => (
                        <Pressable key={chip.label} style={styles.quickAddPill} onPress={() => adjustPrice('price', chip.val)}>
                          <Text style={styles.quickAddPillText}>{chip.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* GIÁ GỐC NIÊM YẾT */}
                  <View style={styles.formGroup}>
                    <View style={[styles.formGroupHeader, isMobile && { flexWrap: 'wrap', gap: 4 }]}>
                      <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Giá gốc niêm yết (nếu có giảm giá):</Text>
                      {!!productForm.oldPrice && (
                        <Text style={styles.previewOldPriceLive}>{formatPrice(parseInt(productForm.oldPrice, 10) || 0)}</Text>
                      )}
                    </View>
                    <TextInput
                      style={[styles.inputControl, isDark && styles.inputControlDark]}
                      keyboardType="numeric"
                      value={productForm.oldPrice}
                      onChangeText={(t) => setProductForm({ ...productForm, oldPrice: t.replace(/[^0-9]/g, '') })}
                      placeholder="Để trống nếu không có khuyến mãi"
                      placeholderTextColor="#94a3b8"
                    />
                    <View style={styles.quickAddRow}>
                      {[
                        { label: 'Tạo Sale +10%', val: 10 },
                        { label: 'Tạo Sale +15%', val: 15 },
                        { label: 'Tạo Sale +20%', val: 20 },
                      ].map((s) => (
                        <Pressable key={s.label} style={[styles.quickAddPill, { backgroundColor: '#fef2f2' }]} onPress={() => setMarkupOldPrice(s.val)}>
                          <Text style={[styles.quickAddPillText, { color: '#dc2626' }]}>{s.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* SỐ LƯỢNG TRONG KHO */}
                  <View style={styles.formGroup}>
                    <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Số lượng trong kho:</Text>
                    <View style={styles.stepperContainer}>
                      <Pressable style={styles.stepperBtn} onPress={() => adjustStock(-1)}>
                        <Ionicons name="remove" size={17} color="#475569" />
                      </Pressable>
                      <TextInput
                        style={[styles.stepperInput, isDark && styles.textDark]}
                        keyboardType="numeric"
                        value={productForm.stock}
                        onChangeText={(t) => setProductForm({ ...productForm, stock: t.replace(/[^0-9]/g, '') })}
                      />
                      <Pressable style={[styles.stepperBtn, styles.stepperBtnPlus]} onPress={() => adjustStock(1)}>
                        <Ionicons name="add" size={17} color="#2563eb" />
                      </Pressable>
                    </View>
                    <View style={styles.quickAddRow}>
                      {[+5, +10, +20, +50].map((num) => (
                        <Pressable key={num} style={styles.quickAddPill} onPress={() => adjustStock(num)}>
                          <Text style={styles.quickAddPillText}>+{num}</Text>
                        </Pressable>
                      ))}
                      <Pressable
                        style={[styles.quickAddPill, { backgroundColor: '#fee2e2' }]}
                        onPress={() => setProductForm({ ...productForm, stock: '0' })}
                      >
                        <Text style={[styles.quickAddPillText, { color: '#ef4444' }]}>Hết hàng (0)</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}

              {/* ==================== TAB 4: HÌNH ẢNH ==================== */}
              {productModalTab === 'media' && (
                <View style={{ gap: 14 }}>
                  <View style={styles.formGroup}>
                    <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: 8, gap: 6 }}>
                      <Text style={[styles.fieldLabel, isDark && styles.textDark, { marginBottom: 0 }]}>Hình ảnh sản phẩm:</Text>
                      <Pressable
                        style={[styles.uploadBtnHeader, isMobile && { width: '100%', justifyContent: 'center', paddingVertical: 8 }]}
                        onPress={handlePickProductImage}
                        disabled={isUploadingImage}
                      >
                        {isUploadingImage ? (
                          <ActivityIndicator size="small" color="#2563eb" style={{ marginRight: 6 }} />
                        ) : (
                          <Ionicons name="cloud-upload-outline" size={15} color="#2563eb" style={{ marginRight: 6 }} />
                        )}
                        <Text style={styles.uploadBtnHeaderText}>
                          {isUploadingImage ? 'Đang nén & tải ảnh...' : '📁 Tải ảnh từ máy tính / Điện thoại'}
                        </Text>
                      </Pressable>
                    </View>

                    {/* Preview ảnh và ô nhập Link */}
                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 12, alignItems: 'center' }}>
                      <Pressable
                        style={styles.imageThumbTouch}
                        onPress={handlePickProductImage}
                        accessibilityRole="button"
                        accessibilityLabel="Bấm vào để chọn ảnh từ máy tính"
                      >
                        <Image source={{ uri: productForm.image || DEFAULT_IMAGE }} style={[styles.imageInputThumb, { width: 80, height: 80, borderRadius: 12 }]} />
                        <View style={styles.imageThumbOverlay}>
                          <Ionicons name="camera" size={13} color="#ffffff" />
                        </View>
                      </Pressable>

                      <View style={{ flex: 1, gap: 6, width: '100%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <TextInput
                            style={[styles.inputControl, { flex: 1 }, isDark && styles.inputControlDark]}
                            value={productForm.image}
                            onChangeText={(t) => setProductForm({ ...productForm, image: t })}
                            placeholder="Dán đường dẫn ảnh https://... hoặc tải từ máy"
                            placeholderTextColor="#94a3b8"
                          />
                          {productForm.image ? (
                            <Pressable
                              style={styles.clearImgBtn}
                              onPress={() => setProductForm({ ...productForm, image: '' })}
                              accessibilityLabel="Xóa ảnh"
                            >
                              <Ionicons name="close" size={16} color="#64748b" />
                            </Pressable>
                          ) : null}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Pressable
                            style={[styles.uploadActionBtn, isUploadingImage && { opacity: 0.6 }]}
                            onPress={handlePickProductImage}
                            disabled={isUploadingImage}
                          >
                            <Ionicons name="folder-open-outline" size={13} color="#0f172a" />
                            <Text style={styles.uploadActionBtnText}>Chọn tệp từ máy</Text>
                          </Pressable>

                          {productForm.image && productForm.image.startsWith('data:image') && (
                            <View style={styles.localImgBadge}>
                              <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
                              <Text style={styles.localImgBadgeText}>Ảnh từ máy tính</Text>
                            </View>
                          )}
                          {productForm.image && productForm.image.includes('/uploads/') && (
                            <View style={styles.localImgBadge}>
                              <Ionicons name="cloud-done" size={12} color="#16a34a" />
                              <Text style={styles.localImgBadgeText}>Đã lưu trên máy chủ</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* GỢI Ý ẢNH MẪU CÓ SẴN */}
                    <View style={{ marginTop: 14 }}>
                      <Text style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 6 }}>
                        Hoặc chọn nhanh ảnh mẫu có sẵn theo linh kiện:
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
                        <View style={{ flexDirection: 'row', gap: 6, paddingRight: 10 }}>
                          {PRESET_PHOTOS.map((p, idx) => (
                            <Pressable key={idx} style={styles.presetPhotoChip} onPress={() => setProductForm({ ...productForm, image: p.url })}>
                              <Text style={{ fontSize: 13 }}>{p.icon}</Text>
                              <Text style={styles.presetPhotoText}>{p.label}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </View>
              )}

              {/* ==================== TAB 5: HIỂN THỊ & XEM TRƯỚC ==================== */}
              {productModalTab === 'display' && (
                <View style={{ gap: 16 }}>
                  {/* MÔ TẢ SẢN PHẨM */}
                  <View style={styles.formGroup}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={[styles.fieldLabel, isDark && styles.textDark, { marginBottom: 0 }]}>
                        Mô tả tóm tắt sản phẩm:
                      </Text>
                      <Pressable style={styles.autoGenDescBtn} onPress={handleGenerateDescriptionFromSpecs}>
                        <Ionicons name="sparkles" size={12} color="#2563eb" />
                        <Text style={styles.autoGenDescText}>Tự động tạo từ cấu hình</Text>
                      </Pressable>
                    </View>
                    <TextInput
                      style={[styles.inputControl, { height: 80, textAlignVertical: 'top' }, isDark && styles.inputControlDark]}
                      multiline
                      value={productForm.description}
                      onChangeText={(t) => setProductForm({ ...productForm, description: t })}
                      placeholder="Mô tả nổi bật CPU, RAM, VGA, Tính năng, Chế độ bảo hành..."
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  {/* CHECKBOXES TRẠNG THÁI & HUY HIỆU */}
                  <View style={styles.formGroup}>
                    <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Trạng thái kinh doanh & Nhãn nổi bật:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      <Pressable
                        style={[styles.catPickChip, productFlags.isHot && styles.catPickChipActive]}
                        onPress={() => setProductFlags((prev) => ({ ...prev, isHot: !prev.isHot }))}
                      >
                        <Text style={{ fontSize: 13 }}>🔥</Text>
                        <Text style={[styles.catPickChipText, productFlags.isHot && styles.catPickChipTextActive]}>Bán chạy (Hot)</Text>
                      </Pressable>

                      <Pressable
                        style={[styles.catPickChip, productFlags.isNew && styles.catPickChipActive]}
                        onPress={() => setProductFlags((prev) => ({ ...prev, isNew: !prev.isNew }))}
                      >
                        <Text style={{ fontSize: 13 }}>✨</Text>
                        <Text style={[styles.catPickChipText, productFlags.isNew && styles.catPickChipTextActive]}>Hàng mới (New)</Text>
                      </Pressable>

                      <Pressable
                        style={[styles.catPickChip, productFlags.isFeatured && styles.catPickChipActive]}
                        onPress={() => setProductFlags((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                      >
                        <Text style={{ fontSize: 13 }}>⭐</Text>
                        <Text style={[styles.catPickChipText, productFlags.isFeatured && styles.catPickChipTextActive]}>Nổi bật (Featured)</Text>
                      </Pressable>

                      <Pressable
                        style={[styles.catPickChip, productFlags.isHidden && { backgroundColor: '#fee2e2', borderColor: '#f87171' }]}
                        onPress={() => setProductFlags((prev) => ({ ...prev, isHidden: !prev.isHidden }))}
                      >
                        <Ionicons name={productFlags.isHidden ? 'eye-off' : 'eye'} size={14} color={productFlags.isHidden ? '#dc2626' : '#64748b'} />
                        <Text style={[styles.catPickChipText, productFlags.isHidden && { color: '#dc2626', fontWeight: '700' }]}>
                          {productFlags.isHidden ? 'Tạm ẩn bán' : 'Đang mở bán'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* THẺ XEM TRƯỚC SẢN PHẨM THỰC TẾ & BẢNG CẤU HÌNH */}
                  <View style={styles.livePreviewCardWrap}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: '#0f172a' }}>
                        👁️ Xem trước giao diện người dùng (Live Preview):
                      </Text>
                      <View style={{ backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#2563eb' }}>Khách hàng nhìn thấy</Text>
                      </View>
                    </View>

                    {/* Preview Card */}
                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 12, backgroundColor: '#ffffff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' }}>
                      <Image source={{ uri: productForm.image || DEFAULT_IMAGE }} style={{ width: isMobile ? '100%' : 100, height: 100, borderRadius: 10 }} resizeMode="cover" />
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }} numberOfLines={2}>
                          {productForm.name || 'Tên sản phẩm mẫu...'}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                          <Text style={{ fontSize: 16, fontWeight: '900', color: '#dc2626' }}>
                            {formatPrice(parseInt(productForm.price, 10) || 0)}
                          </Text>
                          {!!productForm.oldPrice && parseInt(productForm.oldPrice, 10) > (parseInt(productForm.price, 10) || 0) && (
                            <Text style={{ fontSize: 12, color: '#94a3b8', textDecorationLine: 'line-through' }}>
                              {formatPrice(parseInt(productForm.oldPrice, 10))}
                            </Text>
                          )}
                        </View>
                        <Text style={{ fontSize: 11, color: '#64748b' }} numberOfLines={2}>
                          {productForm.description || 'Chưa có mô tả tóm tắt'}
                        </Text>
                      </View>
                    </View>

                    {/* Mini Bảng Thông Số Kỹ Thuật */}
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#334155', marginTop: 4 }}>
                      Bảng thông số kỹ thuật chi tiết:
                    </Text>
                    {(() => {
                      const allSpecs = { ...productSpecsForm };
                      customSpecsList.forEach((c) => {
                        if (c.key && c.value) allSpecs[c.key] = c.value;
                      });
                      const entries = Object.entries(allSpecs).filter(([_, v]) => v && v.trim());
                      if (entries.length === 0) {
                        return (
                          <View style={{ padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8, alignItems: 'center' }}>
                            <Text style={{ fontSize: 11, color: '#64748b' }}>
                              Chưa nhập thông số nào. Vào Tab 2 "Cấu hình" hoặc bấm nút [Ví dụ] để điền mẫu.
                            </Text>
                          </View>
                        );
                      }
                      return (
                        <View style={styles.miniSpecsTable}>
                          {entries.map(([k, v], idx) => (
                            <View key={k} style={[styles.miniSpecRow, idx % 2 === 1 && { backgroundColor: '#f8fafc' }]}>
                              <Text style={styles.miniSpecKey}>{k}</Text>
                              <Text style={styles.miniSpecVal}>{v}</Text>
                            </View>
                          ))}
                        </View>
                      );
                    })()}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* MODAL FOOTER ACTIONS */}
            <View style={[styles.modalFooterActions, isMobile && styles.modalFooterActionsMobile, isDark && { borderTopColor: '#334155' }]}>
              {productModalTab !== 'basic' ? (
                <Pressable
                  style={[styles.btnSecondary, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                  onPress={() => handleNavigateModalTab('prev')}
                >
                  <Ionicons name="arrow-back" size={14} color="#475569" />
                  <Text style={styles.btnSecondaryText}>Quay lại</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.btnSecondary} onPress={() => setIsProductModalOpen(false)}>
                  <Text style={styles.btnSecondaryText}>Hủy bỏ</Text>
                </Pressable>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {productModalTab !== 'display' && (
                  <Pressable
                    style={[styles.btnSecondary, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                    onPress={() => handleNavigateModalTab('next')}
                  >
                    <Text style={[styles.btnSecondaryText, { color: '#2563eb', fontWeight: '800' }]}>Tiếp theo</Text>
                    <Ionicons name="arrow-forward" size={14} color="#2563eb" />
                  </Pressable>
                )}

                <Pressable
                  style={[styles.btnPrimary, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}
                  onPress={handleSaveProduct}
                  disabled={isSavingProduct}
                >
                  {isSavingProduct ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
                      <Text style={styles.btnPrimaryText}>{editingProduct ? 'Cập nhật' : 'Lưu sản phẩm'}</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 3: THÊM / SỬA DANH MỤC                              */}
      {/* ======================================================== */}
      <Modal visible={isCategoryModalOpen} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxSmall, isMobile && styles.modalBoxSmallMobile, isDark && styles.cardDark]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalMainTitle, isDark && styles.textDark]}>
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </Text>
              <Pressable onPress={() => setIsCategoryModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Mã ID danh mục (không dấu):</Text>
              <TextInput
                style={[styles.inputControl, editingCategory && styles.inputDisabled, isDark && styles.inputControlDark]}
                value={categoryForm.id}
                onChangeText={(t) => setCategoryForm({ ...categoryForm, id: t })}
                editable={!editingCategory}
                placeholder="VD: psu, cooler, mainboard"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Tên danh mục:</Text>
              <TextInput
                style={[styles.inputControl, isDark && styles.inputControlDark]}
                value={categoryForm.name}
                onChangeText={(t) => setCategoryForm({ ...categoryForm, name: t })}
                placeholder="VD: Nguồn máy tính, Tản nhiệt nước"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Biểu tượng Icon (Emoji):</Text>
              <TextInput
                style={[styles.inputControl, isDark && styles.inputControlDark]}
                value={categoryForm.icon}
                onChangeText={(t) => setCategoryForm({ ...categoryForm, icon: t })}
                placeholder="VD: ⚡, ❄️, 🖥️"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={[styles.modalFooterActions, isMobile && styles.modalFooterActionsMobile, isDark && { borderTopColor: '#334155' }]}>
              <Pressable style={[styles.btnSecondary, isMobile && { flex: 1, justifyContent: 'center' }]} onPress={() => setIsCategoryModalOpen(false)}>
                <Text style={styles.btnSecondaryText}>Hủy</Text>
              </Pressable>
              <Pressable style={[styles.btnPrimary, isMobile && { flex: 1.6, justifyContent: 'center' }]} onPress={handleSaveCategory} disabled={isSavingCategory}>
                {isSavingCategory ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.btnPrimaryText}>{editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục'}</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 4: TẠO MÃ GIẢM GIÁ (VOUCHER)                       */}
      {/* ======================================================== */}
      <Modal visible={isVoucherModalOpen} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxSmall, isMobile && styles.modalBoxSmallMobile, isDark && styles.cardDark]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalMainTitle, isDark && styles.textDark]}>Tạo Mã Giảm Giá Mới</Text>
              <Pressable onPress={() => setIsVoucherModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Mã Code (Tự động viết hoa):</Text>
              <TextInput
                style={[styles.inputControl, isDark && styles.inputControlDark]}
                value={voucherForm.code}
                onChangeText={(t) => setVoucherForm({ ...voucherForm, code: t.toUpperCase() })}
                placeholder="VD: SALE100K, NEWGAMER"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Mức giảm tiền (VNĐ):</Text>
              <TextInput
                style={[styles.inputControl, isDark && styles.inputControlDark]}
                keyboardType="numeric"
                value={voucherForm.discount}
                onChangeText={(t) => setVoucherForm({ ...voucherForm, discount: t.replace(/[^0-9]/g, '') })}
                placeholder="100000"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Đơn hàng tối thiểu (VNĐ):</Text>
              <TextInput
                style={[styles.inputControl, isDark && styles.inputControlDark]}
                keyboardType="numeric"
                value={voucherForm.minOrder}
                onChangeText={(t) => setVoucherForm({ ...voucherForm, minOrder: t.replace(/[^0-9]/g, '') })}
                placeholder="2000000"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Mô tả hiển thị cho khách:</Text>
              <TextInput
                style={[styles.inputControl, isDark && styles.inputControlDark]}
                value={voucherForm.label}
                onChangeText={(t) => setVoucherForm({ ...voucherForm, label: t })}
                placeholder="Giảm 100.000₫ cho đơn từ 2 triệu"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={[styles.modalFooterActions, isMobile && styles.modalFooterActionsMobile, isDark && { borderTopColor: '#334155' }]}>
              <Pressable style={[styles.btnSecondary, isMobile && { flex: 1, justifyContent: 'center' }]} onPress={() => setIsVoucherModalOpen(false)}>
                <Text style={styles.btnSecondaryText}>Hủy</Text>
              </Pressable>
              <Pressable style={[styles.btnPrimary, isMobile && { flex: 1.6, justifyContent: 'center' }]} onPress={handleSaveVoucher} disabled={isSavingVoucher}>
                {isSavingVoucher ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.btnPrimaryText}>Kích hoạt voucher</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 5: XÁC NHẬN XÓA                                    */}
      {/* ======================================================== */}
      <Modal visible={!!deleteConfirm} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxSmall, isMobile && styles.modalBoxSmallMobile, { alignItems: 'center', padding: isMobile ? 18 : 24 }, isDark && styles.cardDark]}>
            <View style={styles.dangerCircle}>
              <Ionicons name="trash" size={26} color="#ef4444" />
            </View>
            <Text style={[styles.modalDangerTitle, isDark && styles.textDark]}>Xác nhận xóa dữ liệu?</Text>
            <Text style={[styles.modalDangerSub, isDark && styles.textMutedDark]}>
              Bạn có chắc chắn muốn xóa vĩnh viễn{' '}
              {deleteConfirm?.type === 'product'
                ? 'sản phẩm'
                : deleteConfirm?.type === 'order'
                ? 'đơn hàng'
                : deleteConfirm?.type === 'category'
                ? 'danh mục'
                : deleteConfirm?.type === 'voucher'
                ? 'mã voucher'
                : 'người dùng'}:
            </Text>
            <Text style={[styles.modalDangerTarget, isDark && styles.textDark]}>“{deleteConfirm?.title}”</Text>

            <View style={[styles.modalFooterActions, { width: '100%', marginTop: 20 }]}>
              <Pressable style={[styles.btnSecondary, { flex: 1 }]} onPress={() => setDeleteConfirm(null)}>
                <Text style={styles.btnSecondaryText}>Hủy bỏ</Text>
              </Pressable>
              <Pressable style={[styles.btnDanger, { flex: 1 }]} onPress={handleDeleteExecute}>
                <Text style={styles.btnDangerText}>Xác nhận xóa</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 6: THÊM TÀI KHOẢN / NHÂN VIÊN MỚI                 */}
      {/* ======================================================== */}
      <Modal visible={isCreateUserModalOpen} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxSmall, isMobile && styles.modalBoxSmallMobile, isDark && styles.cardDark]}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={[styles.modalMainTitle, isDark && styles.textDark]}>Thêm Tài khoản / Nhân viên mới</Text>
                <Text style={[{ fontSize: 12, color: '#64748b', marginTop: 2 }, isDark && styles.textMutedDark]}>
                  Tạo tài khoản phân quyền làm việc hoặc khách hàng
                </Text>
              </View>
              <Pressable onPress={() => setIsCreateUserModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={true}
              style={{ flexGrow: 1, flexShrink: 1 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* VAI TRÒ */}
              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Vai trò phân quyền:</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { id: 'staff', label: '👔 Nhân viên (Staff)', desc: 'Xử lý đơn & kho', color: '#059669' },
                    { id: 'admin', label: '👑 Quản trị viên (Admin)', desc: 'Toàn quyền', color: '#7c3aed' },
                    { id: 'customer', label: '👤 Khách hàng', desc: 'Mua sắm', color: '#2563eb' },
                  ].map((r) => {
                    const isSelected = newUserForm.role === r.id;
                    return (
                      <Pressable
                        key={r.id}
                        style={[
                          styles.roleSelectCard,
                          isDark && styles.roleSelectCardDark,
                          isSelected && { borderColor: r.color, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f8fafc' },
                        ]}
                        onPress={() => setNewUserForm({ ...newUserForm, role: r.id as any })}
                      >
                        <Text style={[{ fontSize: 12, fontWeight: '700', color: isSelected ? r.color : '#64748b' }]}>
                          {r.label}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{r.desc}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* HỌ VÀ TÊN */}
              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Họ và tên *:</Text>
                <TextInput
                  style={[styles.inputControl, isDark && styles.inputControlDark]}
                  value={newUserForm.name}
                  onChangeText={(t) => setNewUserForm({ ...newUserForm, name: t })}
                  placeholder="VD: Nguyễn Văn Hoàng"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* EMAIL */}
              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Email đăng nhập *:</Text>
                <TextInput
                  style={[styles.inputControl, isDark && styles.inputControlDark]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={newUserForm.email}
                  onChangeText={(t) => setNewUserForm({ ...newUserForm, email: t })}
                  placeholder="VD: hoang.nv@dangvinhpc.vn"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* MẬT KHẨU */}
              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Mật khẩu khởi tạo *:</Text>
                <TextInput
                  style={[styles.inputControl, isDark && styles.inputControlDark]}
                  value={newUserForm.password}
                  onChangeText={(t) => setNewUserForm({ ...newUserForm, password: t })}
                  placeholder="Nhập mật khẩu (VD: 123456)"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry
                />
              </View>

              {/* SỐ ĐIỆN THOẠI */}
              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Số điện thoại:</Text>
                <TextInput
                  style={[styles.inputControl, isDark && styles.inputControlDark]}
                  keyboardType="phone-pad"
                  value={newUserForm.phone}
                  onChangeText={(t) => setNewUserForm({ ...newUserForm, phone: t })}
                  placeholder="0988 123 456"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </ScrollView>

            <View style={[styles.modalFooterActions, isMobile && styles.modalFooterActionsMobile, isDark && { borderTopColor: '#334155' }]}>
              <Pressable style={[styles.btnSecondary, isMobile && { flex: 1, justifyContent: 'center' }]} onPress={() => setIsCreateUserModalOpen(false)}>
                <Text style={styles.btnSecondaryText}>Hủy bỏ</Text>
              </Pressable>
              <Pressable style={[styles.btnPrimary, { backgroundColor: '#7c3aed' }, isMobile && { flex: 1.6, justifyContent: 'center' }]} onPress={handleCreateUser} disabled={isSavingUser}>
                {isSavingUser ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.btnPrimaryText}>Tạo tài khoản</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 7: XEM CHI TIẾT THÔNG TIN TÀI KHOẢN */}
      <Modal visible={!!viewingUser} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxSmall, isMobile && styles.modalBoxSmallMobile, isDark && styles.cardDark, { maxWidth: 540 }]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <View style={[styles.userAvatarBadge, { width: 38, height: 38, borderRadius: 19, backgroundColor: viewingUser?.role === 'admin' ? '#7c3aed' : viewingUser?.role === 'staff' ? '#059669' : '#2563eb', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={[styles.userAvatarBadgeText, { fontSize: 16 }]}>{(viewingUser?.name ? viewingUser.name[0] : 'U').toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.modalMainTitle, isDark && styles.textDark, isMobile && { fontSize: 16 }]} numberOfLines={1}>
                    Hồ Sơ Tài Khoản #{viewingUser?.id}
                  </Text>
                  <Text style={[{ fontSize: 11, color: '#64748b', marginTop: 1 }, isDark && styles.textMutedDark]} numberOfLines={1}>
                    Thông tin chi tiết tài khoản DANGVINHPC
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => setViewingUser(null)} hitSlop={10}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            {viewingUser && (
              <ScrollView
                style={{ flex: 1, minHeight: 0, width: '100%' }}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                {/* Thông tin chính */}
                <View style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: isMobile ? 12 : 16, borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#334155' : '#e2e8f0', marginBottom: 14 }}>
                  <View style={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 12, gap: 6 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: isDark ? '#f8fafc' : '#0f172a' }}>
                      {viewingUser.name || 'Chưa cập nhật họ tên'}
                    </Text>
                    <View style={[styles.userRoleTag, {
                      backgroundColor: viewingUser.role === 'admin' ? '#f5f3ff' : viewingUser.role === 'staff' ? '#ecfdf5' : '#eff6ff',
                      borderColor: viewingUser.role === 'admin' ? '#ddd6fe' : viewingUser.role === 'staff' ? '#a7f3d0' : '#bfdbfe',
                    }]}>
                      <Text style={[styles.userRoleTagText, {
                        color: viewingUser.role === 'admin' ? '#7c3aed' : viewingUser.role === 'staff' ? '#059669' : '#2563eb'
                      }]}>
                        {viewingUser.role === 'admin' ? '👑 Quản Trị Viên (Admin)' : viewingUser.role === 'staff' ? '👔 Nhân Viên (Staff)' : '👤 Khách Hàng (Customer)'}
                      </Text>
                    </View>
                  </View>

                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 2 : 0 }}>
                      <Text style={{ width: isMobile ? 'auto' : 110, fontSize: 12, color: '#64748b' }}>✉️ Email:</Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#f8fafc' : '#1e293b' }} selectable>{viewingUser.email}</Text>
                    </View>
                    <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 2 : 0 }}>
                      <Text style={{ width: isMobile ? 'auto' : 110, fontSize: 12, color: '#64748b' }}>📞 Điện thoại:</Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#f8fafc' : '#1e293b' }} selectable>{viewingUser.phone || 'Chưa cập nhật'}</Text>
                    </View>
                    <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-start', gap: isMobile ? 2 : 0 }}>
                      <Text style={{ width: isMobile ? 'auto' : 110, fontSize: 12, color: '#64748b' }}>📍 Địa chỉ:</Text>
                      <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: isDark ? '#f8fafc' : '#1e293b', lineHeight: 18 }} selectable>{viewingUser.address || 'Chưa cập nhật'}</Text>
                    </View>
                    <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 2 : 0 }}>
                      <Text style={{ width: isMobile ? 'auto' : 110, fontSize: 12, color: '#64748b' }}>🏙️ Khu vực:</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? '#f8fafc' : '#1e293b' }}>{viewingUser.city || 'Chưa cập nhật'}</Text>
                    </View>
                    <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 2 : 0 }}>
                      <Text style={{ width: isMobile ? 'auto' : 110, fontSize: 12, color: '#64748b' }}>📅 Trạng thái:</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: isMobile ? 2 : 0 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' }} />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#16a34a' }}>Đang hoạt động (Active)</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Thống kê mua hàng của user */}
                <View style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: isMobile ? 12 : 16, borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#334155' : '#e2e8f0', marginBottom: 14 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#f8fafc' : '#0f172a', marginBottom: 10 }}>
                    📊 Thống kê hoạt động & Giao dịch
                  </Text>
                  {(() => {
                    const userOrders = orderList.filter((o) => Number(o.userId) === Number(viewingUser.id));
                    const totalSpent = userOrders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
                    return (
                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
                        <View style={{ flex: 1, backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#334155' : '#e2e8f0', alignItems: 'center' }}>
                          <Text style={{ fontSize: 12, color: '#64748b' }}>Tổng đơn đã đặt</Text>
                          <Text style={{ fontSize: 18, fontWeight: '800', color: '#2563eb', marginTop: 4 }}>{userOrders.length} đơn</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#334155' : '#e2e8f0', alignItems: 'center' }}>
                          <Text style={{ fontSize: 12, color: '#64748b' }}>Tổng chi tiêu (hoàn tất)</Text>
                          <Text style={{ fontSize: 16, fontWeight: '800', color: '#16a34a', marginTop: 4 }}>{formatPrice(totalSpent)}</Text>
                        </View>
                      </View>
                    );
                  })()}
                </View>
              </ScrollView>
            )}

            <View style={[styles.modalFooterActions, isDark && { borderTopColor: '#334155' }]}>
              <Pressable
                style={[styles.btnPrimary, { minWidth: 90, justifyContent: 'center', alignItems: 'center', width: isMobile ? '100%' : 'auto' }]}
                onPress={() => setViewingUser(null)}
              >
                <Text style={styles.btnPrimaryText}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 8: XÁC NHẬN ĐĂNG XUẤT ADMIN */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxSmall, isMobile && styles.modalBoxSmallMobile, { alignItems: 'center', padding: isMobile ? 18 : 24 }, isDark && styles.cardDark]}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Ionicons name="log-out-outline" size={26} color="#dc2626" />
            </View>
            <Text style={[styles.modalDangerTitle, isDark && styles.textDark, { textAlign: 'center', fontSize: 18 }]}>
              Đăng xuất khỏi Trang Quản Trị
            </Text>
            <Text style={[{ textAlign: 'center', color: '#64748b', fontSize: 13, marginTop: 8, lineHeight: 20 }, isDark && styles.textMutedDark]}>
              Bạn có chắc chắn muốn đăng xuất phiên làm việc của Quản trị viên <Text style={{ fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}>{user?.name || user?.email || 'Admin'}</Text> không?
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 22, width: '100%' }}>
              <Pressable
                style={[styles.btnSecondary, { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 10 }]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.btnSecondaryText}>Hủy bỏ</Text>
              </Pressable>
              <Pressable
                style={[styles.btnDanger, { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 10 }]}
                onPress={handleLogout}
              >
                <Text style={styles.btnDangerText}>Đăng xuất</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 9: XEM ẢNH / VIDEO MINH CHỨNG LỖI CỦA KHÁCH          */}
      {/* ======================================================== */}
      <Modal visible={!!previewMediaUrl} transparent animationType="fade">
        <View style={styles.lightboxBackdrop}>
          <View style={[styles.lightboxContainer, isDark && styles.lightboxContainerDark]}>
            {/* Header toolbar */}
            <View style={styles.lightboxHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="image" size={20} color="#ffffff" />
                <Text style={styles.lightboxTitle}>Ảnh minh chứng lỗi từ khách hàng</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {previewMediaUrl && typeof window !== 'undefined' && (
                  <Pressable
                    style={styles.lightboxOpenTabBtn}
                    onPress={() => window.open(previewMediaUrl!, '_blank')}
                  >
                    <Ionicons name="open-outline" size={15} color="#ffffff" style={{ marginRight: 4 }} />
                    <Text style={styles.lightboxOpenTabText}>Mở ảnh gốc</Text>
                  </Pressable>
                )}
                <Pressable
                  style={styles.lightboxCloseBtn}
                  onPress={() => setPreviewMediaUrl(null)}
                >
                  <Ionicons name="close" size={22} color="#ffffff" />
                </Pressable>
              </View>
            </View>

            {/* Media Body */}
            <Pressable
              style={styles.lightboxImageWrap}
              onPress={() => setPreviewMediaUrl(null)}
            >
              {previewMediaUrl ? (
                previewMediaUrl.includes('video') || previewMediaUrl.endsWith('.mp4') ? (
                  <View style={{ alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <Ionicons name="videocam" size={64} color="#ffffff" style={{ marginBottom: 16 }} />
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
                      Video minh chứng lỗi từ khách
                    </Text>
                    {typeof window !== 'undefined' && (
                      <Pressable
                        style={[styles.btnPrimary, { paddingHorizontal: 20 }]}
                        onPress={() => window.open(previewMediaUrl!, '_blank')}
                      >
                        <Text style={styles.btnPrimaryText}>Mở xem video trên tab mới</Text>
                      </Pressable>
                    )}
                  </View>
                ) : (
                  <Image
                    source={{ uri: previewMediaUrl }}
                    style={styles.lightboxImage}
                    resizeMode="contain"
                  />
                )
              ) : null}
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* ======================================================== */}
      {/* MODAL 10: XUẤT & IN HÓA ĐƠN BÁN HÀNG CHO QUẢN TRỊ VIÊN    */}
      {/* ======================================================== */}
      <InvoiceModal
        visible={invoiceModalVisible}
        onClose={() => setInvoiceModalVisible(false)}
        order={invoiceOrder}
      />

      {/* ======================================================== */}
      {/* MODAL 11: QUẢN LÝ MÃ MÁY & IMEI / SERIAL BẢO HÀNH        */}
      {/* ======================================================== */}
      <ProductUnitsModal
        product={unitProduct}
        codes={unitCodes}
        isDark={isDark}
        onClose={() => setUnitProduct(null)}
        onSaved={() => {
          loadData();
          if (viewingOrder) {
            apiService.getOrderById(viewingOrder.id).then(setViewingOrder).catch(() => {});
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0b1120',
  },
  cardDark: {
    backgroundColor: '#111827',
    borderColor: '#1f293d',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
  },
  textDark: {
    color: '#f8fafc',
  },
  textMutedDark: {
    color: '#94a3b8',
  },

  /* REVENUE PERIOD PILLS & ANALYTICS */
  revenuePeriodPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  revenuePeriodPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  revenuePeriodPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  revenuePeriodPillTextActive: {
    color: '#ffffff',
  },

  inlineDateSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  webDatePickerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  quickDatePill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickDatePillDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  quickDatePillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  quickDatePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  quickDatePillTextActive: {
    color: '#ffffff',
  },
  dateScrollNavBtn: {
    width: 20,
    height: 22,
    borderRadius: 5,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateScrollNavBtnDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },

  revenueAnalyticsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  revenueAnalyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  revenueAnalyticsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  revenueAnalyticsSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  revenueIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartModeSelector: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  chartModeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartModeBtnDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  chartModeBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chartModeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  chartModeBtnTextActive: {
    color: '#ffffff',
  },

  revenueKpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  revenueKpiTile: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  revenueKpiTileDark: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
  },
  revenueKpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  revenueKpiValue: {
    fontSize: 16,
    fontWeight: '900',
  },

  barChartContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  barChartContainerDark: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
  },
  barChartScrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    minWidth: '100%',
    paddingTop: 20,
    paddingBottom: 6,
    justifyContent: 'space-around',
  },
  barColumnWrap: {
    alignItems: 'center',
    minWidth: 46,
  },
  barAmountText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 6,
  },
  barTrack: {
    width: 24,
    height: 140,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barFillActive: {
    backgroundColor: '#3b82f6',
  },
  barFillPeak: {
    backgroundColor: '#16a34a',
  },
  barFillZero: {
    backgroundColor: '#cbd5e1',
  },
  barLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
  barSubCountText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },

  revenueTableWrap: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  revenueTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  revTh: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  revenueTableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  revenueTableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  revenueTableRowAltDark: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  revTdTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  revTd: {
    fontSize: 12,
    color: '#334155',
  },
  shareBarTrack: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  shareBarFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  sharePctText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    width: 32,
    textAlign: 'right',
  },

  revenueModePillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  revenueModePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  revenueModePillBtnDark: {
    backgroundColor: '#1f293d',
    borderColor: '#334155',
  },
  revenueModePillBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  revenueModePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  revenueModePillTextActive: {
    color: '#ffffff',
  },

  chartSubFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  chartSubFilterRowDark: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chartSubNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartSubNavBtnDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  chartSubNavBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  chartSubNavBtnTextDark: {
    color: '#cbd5e1',
  },
  chartMonthPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartMonthPillDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  chartMonthPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chartMonthPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  chartMonthPillTextActive: {
    color: '#ffffff',
  },
  tableFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tableFilterPillDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  tableFilterPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  tableFilterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  tableFilterPillTextActive: {
    color: '#ffffff',
  },

  /* REVENUE DASHBOARD CARDS (CONTAINER FIT - NO FLEX:1 STRETCH) */
  revenueDashCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },

  /* 4 PASTEL KPI SUMMARY CARDS (UI PRO MAX) */
  kpiPastelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  kpiPastelCard: {
    flex: 1,
    minWidth: 190,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  kpiPastelBlue: {
    backgroundColor: '#f0f7ff',
    borderColor: '#dbeafe',
  },
  kpiPastelBlueDark: {
    backgroundColor: '#0f1d33',
    borderColor: '#1e3a5f',
  },
  kpiPastelEmerald: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  kpiPastelEmeraldDark: {
    backgroundColor: '#0d2818',
    borderColor: '#16532d',
  },
  kpiPastelPurple: {
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
  },
  kpiPastelPurpleDark: {
    backgroundColor: '#22123a',
    borderColor: '#4c1d95',
  },
  kpiPastelAmber: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  kpiPastelAmberDark: {
    backgroundColor: '#2d2008',
    borderColor: '#5c400d',
  },
  kpiPastelWatermark: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  kpiPastelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  kpiPastelIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiPastelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  kpiPastelValue: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  kpiPastelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  kpiGrowthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  kpiGrowthUp: {
    backgroundColor: '#dcfce7',
  },
  kpiGrowthDown: {
    backgroundColor: '#fee2e2',
  },
  kpiGrowthText: {
    fontSize: 11,
    fontWeight: '800',
  },
  kpiPastelSubtext: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },

  /* CHART VIEW SWITCHER & LEGEND */
  chartViewToggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartViewToggleWrapDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  chartViewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  chartViewToggleBtnActive: {
    backgroundColor: '#2563eb',
  },
  chartViewToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  chartViewToggleTextActive: {
    color: '#ffffff',
  },
  chartLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chartLegendPill: {
    width: 14,
    height: 10,
    borderRadius: 3,
  },
  chartLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartLegendLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },

  /* YEAR DROPDOWN & CHECKBOX */
  yearDropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 4,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 4,
    zIndex: 100,
    minWidth: 120,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  yearDropdownMenuDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  yearDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  yearDropdownItemActive: {
    backgroundColor: '#eff6ff',
  },
  yearDropdownItemActiveDark: {
    backgroundColor: '#2563eb25',
  },
  yearDropdownItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  checkboxNoticeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginLeft: 'auto',
  },
  checkboxNoticeWrapDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  checkboxBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxBoxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkboxNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },

  /* CHART CANVAS WITH Y-AXIS AND GRID */
  chartCanvasRow: {
    flexDirection: 'row',
    minHeight: 230,
    position: 'relative',
    marginTop: 8,
    marginBottom: 8,
  },
  chartYAxisCol: {
    width: 58,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingBottom: 38,
    paddingTop: 6,
  },
  chartYTickText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  chartPlotArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  /* ACCESS GUARD */
  guardContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  guardCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    maxWidth: 460,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  guardIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  guardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  guardText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  guardActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  guardBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    borderRadius: 12,
  },
  guardBtnSecondaryText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 14,
  },
  guardBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 12,
  },
  guardBtnPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  /* TOAST */
  toast: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexWrap: 'wrap',
    gap: 12,
  },
  headerDark: {
    backgroundColor: '#111827',
    borderBottomColor: '#1f293d',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
  },
  backBtnDark: {
    backgroundColor: '#1e293b',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  brandGroup: {
    gap: 2,
  },
  headerBrand: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#0f172a',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  adminBadgeText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerMobile: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  headerLeftMobile: {
    width: '100%',
    justifyContent: 'space-between',
  },
  headerActionsMobile: {
    width: '100%',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
  },
  headerActionBtnMobile: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refreshBtnDark: {
    backgroundColor: '#1e293b',
  },
  refreshBtnText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  addPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutBtnDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
  },

  /* CONTENT WRAPPER */
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 80,
    maxWidth: 1340,
    width: '100%',
    alignSelf: 'center',
  },
  contentContainerMobile: {
    padding: 12,
    paddingBottom: 80,
  },

  /* LOAD ERROR BANNER */
  loadErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  loadErrorBannerDark: {
    backgroundColor: '#27191d',
    borderColor: '#7f1d1d',
  },
  loadErrorTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991b1b',
  },
  loadErrorText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  loadErrorRetry: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loadErrorRetryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  /* STATS CARDS */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statsGridMobile: {
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    minWidth: 230,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  statCardMobile: {
    minWidth: '100%',
    padding: 14,
    borderRadius: 14,
  },
  statHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statHeaderRowMobile: {
    flexWrap: 'wrap',
    gap: 8,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTrendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statTrendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  statValueMobile: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 3,
  },

  /* SEGMENTED NAVBAR */
  navBarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  tabButtonsScroll: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabPillDark: {
    backgroundColor: '#111827',
    borderColor: '#1f293d',
  },
  tabPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  tabBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    minWidth: 260,
    flex: 1,
    maxWidth: 420,
  },
  searchBoxDark: {
    backgroundColor: '#111827',
    borderColor: '#1f293d',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },

  /* OVERVIEW SECTION */
  overviewContainer: {
    gap: 16,
  },
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 22,
    flexWrap: 'wrap',
    gap: 16,
  },
  welcomeCardMobile: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  welcomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 280,
  },
  welcomeLeftMobile: {
    minWidth: 0,
    width: '100%',
    gap: 12,
  },
  welcomeAvatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeGreeting: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  welcomeDesc: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 19,
  },
  welcomeRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  welcomeRightActionsMobile: {
    width: '100%',
    justifyContent: 'stretch',
  },
  welcomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  welcomeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  dashGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  dashGridMobile: {
    flexDirection: 'column',
  },
  dashCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  dashCardMobile: {
    padding: 12,
    borderRadius: 14,
  },
  dashCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dashCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  dashCardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  stackedBar: {
    height: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  stackedSeg: {
    height: '100%',
  },
  orderLegendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  orderLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '46%',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  legendVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyInline: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  emptyInlineText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  lowStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lowStockThumb: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  lowStockTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  lowStockPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
    marginTop: 2,
  },
  lowStockBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lowStockBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#dc2626',
  },
  viewMoreLink: {
    paddingTop: 12,
    alignItems: 'center',
  },
  viewMoreLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  recentOrderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentOrderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentOrderNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  recentStatusTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  recentStatusTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  recentOrderMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
  },
  recentOrderTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563eb',
  },
  recentOrderViewBtn: {
    padding: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },

  /* GENERIC SECTION CARD */
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionCardMobile: {
    padding: 12,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },
  miniBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
  },
  miniBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  /* ORDERS TAB STYLES */
  filterChipScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  filterChipDark: {
    backgroundColor: '#1f293d',
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  ordersListWrap: {
    gap: 12,
  },
  orderItemCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  orderItemCardMobile: {
    padding: 12,
    borderRadius: 14,
  },
  orderItemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  orderNumberTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  orderDateSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  orderGrandTotal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2563eb',
  },
  orderPaymentTag: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  orderAddressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  orderAddressCopy: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  orderItemsPreviewBox: {
    marginBottom: 12,
  },
  orderItemsPreviewText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  orderBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexWrap: 'wrap',
    gap: 10,
  },
  terminalStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: 160,
  },
  terminalStatusCompleted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  terminalStatusCompletedDark: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  terminalStatusCancelled: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  terminalStatusCancelledDark: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  terminalStatusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  statusChangerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 160,
  },
  statusChangerLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
  },
  quickStatusBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  quickStatusBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderActionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  viewDetailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  deleteOrderIconBtn: {
    padding: 7,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },

  /* SUB-FILTER FOR RETURNS / WARRANTY */
  returnSubFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  returnSubFilterBarDark: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
  },
  returnSubFilterTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginRight: 4,
  },
  returnSubPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  returnSubPillDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  returnSubPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  returnSubPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  returnSubPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  btnPrintWarrantyCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  btnPrintWarrantyCardBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },

  /* RETURN / WARRANTY BANNER & ACTIONS */
  filterChipReturnAlert: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde047',
    borderWidth: 1,
  },
  adminReturnBanner: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  adminReturnPending: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde047',
  },
  adminReturnApproved: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  adminReturnRejected: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  adminReturnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  adminReturnTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  adminReturnReason: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  returnBadgeMini: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
  },
  returnBadgeMiniText: {
    fontSize: 10,
    fontWeight: '800',
  },
  adminProofThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  adminProofImg: {
    width: '100%',
    height: '100%',
  },
  adminVideoBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminVideoText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 2,
  },
  adminReturnActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  btnAdminApproveReturn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnAdminApproveReturnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  btnAdminRejectReturn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnAdminRejectReturnText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '700',
  },
  adminProofZoomIcon: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 4,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* LIGHTBOX MODAL STYLES */
  lightboxBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  lightboxContainer: {
    width: '100%',
    maxWidth: 820,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  lightboxContainerDark: {
    backgroundColor: '#020617',
    borderColor: '#1e293b',
  },
  lightboxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  lightboxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  lightboxOpenTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  lightboxOpenTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  lightboxCloseBtn: {
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 6,
  },
  lightboxImageWrap: {
    width: '100%',
    height: 520,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
    padding: 8,
  },
  lightboxImage: {
    width: '100%',
    height: '100%',
  },

  /* PRODUCTS TAB STYLES */
  productFiltersBar: {
    marginBottom: 16,
    gap: 8,
  },
  subFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  stockFilterChips: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  stockFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  stockFilterPillActive: {
    backgroundColor: '#0f172a',
  },
  stockFilterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  stockFilterPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  sortSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sortPillActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  sortPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  sortPillTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  productsListWrap: {
    gap: 10,
  },
  productCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 12,
  },
  productCardRowMobile: {
    flexWrap: 'wrap',
    gap: 10,
    padding: 10,
  },
  productCardThumb: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
  },
  productCardDetails: {
    flex: 1,
  },
  productIdBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  productCatBadge: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#e2e8f0',
    color: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  productStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  productStatusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  productCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 3,
  },
  productCardPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  productCardPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2563eb',
  },
  productCardOldPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  productCardStock: {
    fontSize: 11,
    color: '#64748b',
  },
  productCardActions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  actionSquareBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* VOUCHER STYLES */
  vouchersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  voucherCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: 380,
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  voucherLeftTicket: {
    width: 78,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#bfdbfe',
    borderStyle: 'dashed',
  },
  voucherDiscountNum: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2563eb',
    marginTop: 4,
  },
  voucherRightContent: {
    flex: 1,
    padding: 12,
  },
  voucherCodeBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  voucherCodeText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  voucherDeleteBtn: {
    padding: 4,
  },
  voucherLabelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 6,
  },
  voucherMinOrder: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  voucherExpiryText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },

  /* INVENTORY STYLES */
  inventoryHeroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#1e293b',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  inventoryHeroIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryHeroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  inventoryHeroSub: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 3,
  },
  inventoryTotalStats: {
    alignItems: 'flex-end',
  },
  inventoryTotalVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#38bdf8',
  },
  inventoryTotalLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  brandInventoryContainer: {
    gap: 14,
  },
  brandCardWrapper: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  brandCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandAvatarBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandAvatarBoxText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '900',
  },
  brandTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  brandSubtitleText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  brandTotalStockTag: {
    alignItems: 'flex-end',
  },
  brandTotalStockVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  brandTotalStockLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  brandProductsTable: {
    gap: 8,
  },
  brandProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexWrap: 'wrap',
  },
  brandProductThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  brandProductName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  brandProductMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  inventoryAdjustGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inventoryInput: {
    width: 50,
    height: 34,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  inventoryInputDark: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    color: '#f8fafc',
  },
  btnStockIn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnStockInText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
  },
  btnStockOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnStockOutText: {
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: '800',
  },
  btnManageUnits: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  btnManageUnitsDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  btnManageUnitsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  orderItemUnitsBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 3,
  },
  orderItemUnitsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  orderItemUnitsCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 16,
  },
  btnInputOrderSerial: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 3,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnInputOrderSerialText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },

  /* CATEGORIES STYLES */
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCardItem: {
    flex: 1,
    minWidth: 220,
    maxWidth: 320,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  catEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catItemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  catItemId: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  catItemCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 3,
  },
  catActions: {
    flexDirection: 'row',
    gap: 4,
  },
  catBtnEdit: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
  },
  catBtnDelete: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },

  /* USERS STYLES */
  usersList: {
    gap: 10,
  },
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 12,
  },
  userAvatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarBadgeText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  userCardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  userRoleTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  userRoleTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  userCardContact: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },
  userCardAddress: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  userActionsGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  userCardRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
  },
  userCardMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  userCardMainMobile: {
    width: '100%',
  },
  userInfoWrap: {
    flex: 1,
    minWidth: 0,
  },
  userActionsGroupMobile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    width: '100%',
  },
  roleSwitcherGroupMobile: {
    alignItems: 'flex-start',
    gap: 4,
  },
  roleFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  roleFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  roleFilterChipDark: {
    backgroundColor: '#1e293b',
  },
  roleFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  roleSwitcherGroup: {
    alignItems: 'flex-end',
    gap: 4,
  },
  roleSwitcherLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  roleChipsWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  roleBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  roleBtnAdminActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#6d28d9',
  },
  roleBtnStaffActive: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  roleBtnCustomerActive: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  roleBtnTextSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  roleSelectCard: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  roleSelectCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  btnChangeRole: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnChangeRoleText: {
    fontSize: 11,
    fontWeight: '800',
  },
  btnDeleteUser: {
    padding: 7,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },

  /* MODALS */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBackdropMobile: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalBoxLarge: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 24,
    width: '100%',
    maxWidth: 820,
    maxHeight: '92%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  modalBoxLargeMobile: {
    borderRadius: 18,
    padding: 14,
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'stretch',
    height: '92%',
    maxHeight: '92%',
  },
  modalBoxSmall: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  modalBoxSmallMobile: {
    borderRadius: 18,
    padding: 14,
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'stretch',
    maxHeight: '92%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  formGroup: {
    marginBottom: 14,
  },
  formGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputControl: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0f172a',
  },
  inputControlDark: {
    backgroundColor: '#172033',
    borderColor: '#334155',
    color: '#f8fafc',
  },
  inputDisabled: {
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
  },
  regenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  regenBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  categoryChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catPickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catPickChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  catPickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  catPickChipTextActive: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  stepperBtnPlus: {
    backgroundColor: '#eff6ff',
  },
  stepperInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    paddingVertical: 6,
  },
  quickAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  quickAddPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quickAddPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  previewPriceLive: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  previewOldPriceLive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
    textDecorationLine: 'line-through',
  },
  imageInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  imageInputThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  uploadBtnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  uploadBtnHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  imageThumbTouch: {
    position: 'relative',
  },
  imageThumbOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearImgBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  uploadActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  uploadActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  localImgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  localImgBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803d',
  },
  presetPhotoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetPhotoText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  modalFooterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  modalFooterActionsMobile: {
    justifyContent: 'space-between',
    gap: 8,
  },
  btnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  btnPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* PRODUCT 5-TAB STYLES */
  productTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 16,
  },
  productTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productTabBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
    shadowColor: '#2563eb',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  productTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  productTabBtnTextActive: {
    color: '#ffffff',
  },
  tabBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 999,
  },
  tabBadgeActive: {
    backgroundColor: '#1d4ed8',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  tabBadgeTextActive: {
    color: '#ffffff',
  },
  specsHeaderBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },
  specsBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e40af',
  },
  specsBannerSubtitle: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 2,
  },
  specsActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnSpecsExample: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  btnSpecsExampleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
  },
  btnSpecsClear: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  btnSpecsClearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  specGridItem: {
    flex: 1,
    minWidth: 280,
  },
  specItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  specQuickFillBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  specQuickFillText: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: '600',
  },
  customSpecsBox: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 10,
    marginBottom: 16,
  },
  customSpecRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  btnAddCustomSpec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderStyle: 'dashed',
    marginTop: 4,
  },
  btnAddCustomSpecText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  autoGenDescBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  autoGenDescText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  livePreviewCardWrap: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginTop: 14,
    gap: 12,
  },
  miniSpecsTable: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  miniSpecRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  miniSpecKey: {
    width: 120,
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  miniSpecVal: {
    flex: 1,
    fontSize: 11,
    color: '#0f172a',
  },

  /* ORDER DETAIL MODAL SPECIFIC */
  modalOrderTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
  },
  modalOrderSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  orderDetailInfoCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    gap: 6,
  },
  infoCardHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    width: 140,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    textAlign: 'right',
  },
  itemsTableHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  itemsTableWrap: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 14,
  },
  itemTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemTableThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#cbd5e1',
  },
  itemTableName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  itemTableSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  itemTableQty: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  itemTableTotal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
    marginTop: 2,
  },
  orderSummaryCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  summaryValFree: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16a34a',
  },
  summaryTotalLine: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  grandTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2563eb',
  },
  btnPrintInvoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  btnPrintInvoiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  btnCloseModal: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563eb',
  },
  btnCloseModalText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* DANGER CONFIRM MODAL */
  dangerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalDangerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalDangerSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
  modalDangerTarget: {
    fontSize: 15,
    fontWeight: '800',
    color: '#dc2626',
    marginTop: 4,
    textAlign: 'center',
  },
  btnDanger: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDangerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
