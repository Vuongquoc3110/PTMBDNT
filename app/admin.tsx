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
import { formatUnitCodes } from '@/utils/deviceUnits';
import { useAppContext } from '@/context/AppContext';
import { formatPrice, getProductFallbackImage, isInvalidOrBlockedImageUrl } from '@/data/products';
import { apiService, type Order, type User, type Voucher } from '@/services/api';

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
  const [revenueChartMode, setRevenueChartMode] = useState<'day' | 'month' | 'year'>('day');
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

      const validOrders: Order[] = Array.isArray(ordersData)
        ? ordersData
        : await apiService.getOrders().catch(() => []);

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
        totalOrders: statsData?.totalOrders ?? validOrders.length,
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
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (prod: ProductItem) => {
    const newId = `prod-${Date.now().toString().slice(-6)}`;
    setEditingProduct(null);
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
    setIsProductModalOpen(true);
    showToast('Đã sao chép cấu hình sản phẩm');
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
      return;
    }
    if (!editingProduct && !productForm.id.trim()) {
      showToast('Vui lòng nhập mã sản phẩm');
      return;
    }
    if (!editingProduct && productList.some((product) => product.id === productForm.id.trim())) {
      showToast('Mã sản phẩm đã tồn tại. Vui lòng tạo mã khác.');
      return;
    }
    if (!Number.isSafeInteger(priceNum) || priceNum <= 0) {
      showToast('Giá bán phải lớn hơn 0');
      return;
    }
    if (productForm.oldPrice && (!Number.isSafeInteger(oldPriceNum) || oldPriceNum <= priceNum)) {
      showToast('Giá gốc phải lớn hơn giá bán để tạo khuyến mãi');
      return;
    }
    if (!Number.isSafeInteger(stockNum) || stockNum < 0) {
      showToast('Số lượng tồn kho không được âm');
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      category_id: categoryId,
      price: priceNum,
      oldPrice: oldPriceNum || null,
      discount: oldPriceNum > priceNum ? Math.round((1 - priceNum / oldPriceNum) * 100) : 0,
      isSale: oldPriceNum > priceNum,
      isNew: true,
      isHot: true,
      stock: stockNum,
      image: productForm.image.trim() || DEFAULT_IMAGE,
      description: productForm.description.trim(),
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
          isNew: true,
          rating: 5,
          reviewCount: 1,
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
      const oDate = o.createdAt ? new Date(o.createdAt) : new Date();
      const dStr = `${oDate.getFullYear()}-${pad(oDate.getMonth() + 1)}-${pad(oDate.getDate())}`;
      const mStr = `${oDate.getFullYear()}-${pad(oDate.getMonth() + 1)}`;
      const yStr = String(oDate.getFullYear());

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
      if (oDate.getFullYear() === thisYear) {
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
    const pad = (n: number) => String(n).padStart(2, '0');
    const map = new Map<string, { dateStr: string; label: string; fullDate: string; count: number }>();
    orderList.forEach((o) => {
      const d = o.createdAt ? new Date(o.createdAt) : new Date();
      const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const label = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
      const fullDate = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      const existing = map.get(dStr);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(dStr, { dateStr: dStr, label, fullDate, count: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  }, [orderList]);

  const currentPeriodRevenue = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const targetOrders = orderList.filter((o) => {
      if (revenueStatusMode === 'completed') {
        return o.status === 'completed';
      }
      return o.status !== 'cancelled';
    });

    if (revenuePeriod === 'day') {
      const dayOrders = targetOrders.filter((o) => {
        const d = o.createdAt ? new Date(o.createdAt) : new Date();
        const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        return dStr === selectedSpecificDate;
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
        const d = o.createdAt ? new Date(o.createdAt) : new Date();
        return (d.getMonth() + 1) === selectedSpecificMonth && d.getFullYear() === selectedSpecificYear;
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
        const d = o.createdAt ? new Date(o.createdAt) : new Date();
        return d.getFullYear() === selectedSpecificYear;
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
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.headerLeft}>
          <Pressable style={[styles.backBtn, isDark && styles.backBtnDark]} onPress={() => router.push('/(tabs)' as any)}>
            <Ionicons name="storefront-outline" size={19} color={isDark ? '#38bdf8' : '#2563eb'} />
            {isDesktop && <Text style={[styles.backBtnText, isDark && { color: '#38bdf8' }]}>Cửa hàng</Text>}
          </Pressable>

          <View style={styles.brandGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[styles.headerBrand, isDark && styles.textDark]}>DANGVINHPC</Text>
              <View style={styles.adminBadge}>
                <View style={styles.badgePulseDot} />
                <Text style={styles.adminBadgeText}>ADMIN PORTAL</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, isDark && styles.textMutedDark]}>
              Hệ thống quản trị kinh doanh linh kiện máy tính cao cấp
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={[styles.refreshBtn, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}
            onPress={() => router.push('/staff' as any)}
          >
            <Ionicons name="id-card-outline" size={17} color="#16a34a" />
            <Text style={[styles.refreshBtnText, { color: '#16a34a' }]}>Cổng Nhân viên</Text>
          </Pressable>

          <Pressable style={[styles.refreshBtn, isDark && styles.refreshBtnDark]} onPress={loadData} disabled={loading}>
            <Ionicons name="sync-outline" size={17} color={isDark ? '#38bdf8' : '#2563eb'} />
            <Text style={[styles.refreshBtnText, isDark && { color: '#38bdf8' }]}>Làm mới</Text>
          </Pressable>

          <Pressable style={styles.addPrimaryBtn} onPress={handleOpenAddProduct}>
            <Ionicons name="add-circle" size={19} color="#ffffff" />
            <Text style={styles.addPrimaryBtnText}>Thêm sản phẩm</Text>
          </Pressable>

          <Pressable
            style={[styles.logoutBtn, isDark && styles.logoutBtnDark]}
            onPress={() => setLogoutModalVisible(true)}
            accessibilityLabel="Đăng xuất tài khoản Admin"
          >
            <Ionicons name="log-out-outline" size={17} color="#dc2626" />
            {isDesktop && <Text style={styles.logoutBtnText}>Đăng xuất</Text>}
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
        <View style={styles.statsGrid}>
          {/* Doanh thu */}
          <View style={[styles.statCard, isDark && styles.cardDark, { borderLeftColor: '#2563eb' }]}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrap, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="wallet-outline" size={22} color="#2563eb" />
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
            <Text style={[styles.statValue, isDark && styles.textDark]}>
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
                <View style={{ flex: 1, minWidth: 140, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
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
          <View style={[styles.statCard, isDark && styles.cardDark, { borderLeftColor: '#059669' }]}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrap, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="receipt-outline" size={22} color="#059669" />
              </View>
              {pendingOrdersCount > 0 ? (
                <View style={[styles.statTrendBadge, { backgroundColor: '#fee2e2' }]}>
                  <Text style={[styles.statTrendText, { color: '#b91c1c' }]}>{pendingOrdersCount} chờ duyệt</Text>
                </View>
              ) : (
                <View style={[styles.statTrendBadge, { backgroundColor: '#f0fdf4' }]}>
                  <Text style={[styles.statTrendText, { color: '#15803d' }]}>Đã xử lý tốt</Text>
                </View>
              )}
            </View>
            <Text style={[styles.statValue, isDark && styles.textDark]}>{orderList.filter(o => o.status !== 'cancelled').length} đơn hàng</Text>
            <Text style={[styles.statLabel, isDark && styles.textMutedDark]}>Tổng giao dịch phát sinh</Text>
          </View>

          {/* Sản phẩm trong kho */}
          <View style={[styles.statCard, isDark && styles.cardDark, { borderLeftColor: '#d97706' }]}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrap, { backgroundColor: '#fffbeb' }]}>
                <Ionicons name="cube-outline" size={22} color="#d97706" />
              </View>
              <View style={[styles.statTrendBadge, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.statTrendText, { color: '#b45309' }]}>Tồn: {totalStockCount} sp</Text>
              </View>
            </View>
            <Text style={[styles.statValue, isDark && styles.textDark]}>{productList.length} mặt hàng</Text>
            <Text style={[styles.statLabel, isDark && styles.textMutedDark]}>
              Giá trị kho: {(totalInventoryValue / 1000000).toFixed(1)} tr ₫
            </Text>
          </View>

          {/* Khách hàng & Phân quyền */}
          <View style={[styles.statCard, isDark && styles.cardDark, { borderLeftColor: '#7c3aed' }]}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrap, { backgroundColor: '#faf5ff' }]}>
                <Ionicons name="people-outline" size={22} color="#7c3aed" />
              </View>
              <View style={[styles.statTrendBadge, { backgroundColor: '#f3e8ff' }]}>
                <Text style={[styles.statTrendText, { color: '#6b21a8' }]}>
                  {adminCount} Quản trị • {staffCount} Nhân viên
                </Text>
              </View>
            </View>
            <Text style={[styles.statValue, isDark && styles.textDark]}>{userList.length} tài khoản</Text>
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
            <View style={[styles.searchBox, isDark && styles.searchBoxDark]}>
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
            <View style={styles.welcomeCard}>
              <View style={styles.welcomeLeft}>
                <View style={styles.welcomeAvatar}>
                  <Ionicons name="shield-checkmark" size={28} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.welcomeGreeting}>
                    Xin chào, {user?.name || 'Quản trị viên DANGVINHPC'} 👋
                  </Text>
                  <Text style={styles.welcomeDesc}>
                    Cửa hàng đang hoạt động bình thường. Hôm nay bạn có {pendingOrdersCount} đơn hàng mới cần duyệt
                    {returnOrdersCount > 0 ? ` và ${returnOrdersCount} yêu cầu đổi trả / bảo hành chờ xử lý.` : '.'}
                  </Text>
                </View>
              </View>
              <View style={styles.welcomeRightActions}>
                <Pressable style={styles.welcomeBtn} onPress={() => setActiveTab('orders')}>
                  <Ionicons name="receipt" size={16} color="#2563eb" />
                  <Text style={styles.welcomeBtnText}>Xử lý đơn hàng</Text>
                </Pressable>
                <Pressable style={[styles.welcomeBtn, { backgroundColor: '#10b981' }]} onPress={handleOpenAddProduct}>
                  <Ionicons name="add-circle" size={16} color="#ffffff" />
                  <Text style={[styles.welcomeBtnText, { color: '#ffffff' }]}>Đăng sản phẩm</Text>
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
                const d = o.createdAt ? new Date(o.createdAt) : new Date();
                const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                return dStr === targetDateStr;
              });

              // Đếm số đơn hôm nay và hôm qua để hiển thị badge trên nút
              const todayCount = orderList.filter((o) => {
                const d = o.createdAt ? new Date(o.createdAt) : new Date();
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` === todayStr;
              }).length;

              const yesterdayCount = orderList.filter((o) => {
                const d = o.createdAt ? new Date(o.createdAt) : new Date();
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` === yesterdayStr;
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
                <View style={[styles.dashCard, isDark && styles.cardDark, { marginBottom: 16 }]}>
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
                              <View style={{ flex: 1, minWidth: 240 }}>
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
              const chartList =
                revenueChartMode === 'day'
                  ? revenueAnalytics.dailyList
                  : revenueChartMode === 'month'
                  ? revenueAnalytics.monthlyList
                  : revenueAnalytics.yearlyList;

              const maxRevenue = Math.max(...chartList.map((c) => c.revenue), 1);
              const totalPeriodRev = chartList.reduce((sum, c) => sum + c.revenue, 0);
              const totalPeriodOrders = chartList.reduce((sum, c) => sum + c.count, 0);
              const aovPeriod = totalPeriodOrders > 0 ? Math.round(totalPeriodRev / totalPeriodOrders) : 0;

              return (
                <View style={[styles.dashCard, isDark && styles.cardDark, { marginBottom: 16 }]}>
                  {/* HEADER BÁO CÁO */}
                  <View style={[styles.dashCardHeader, { flexWrap: 'wrap', gap: 12 }]}>
                    <View style={{ flex: 1, minWidth: 220 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="bar-chart" size={17} color="#2563eb" />
                        </View>
                        <Text style={[styles.dashCardTitle, isDark && styles.textDark]}>
                          Báo cáo doanh thu bán hàng
                        </Text>
                      </View>
                      <Text style={[styles.dashCardSubtitle, isDark && styles.textMutedDark]}>
                        Thống kê chi tiết & biểu đồ tăng trưởng doanh số thực thu theo Ngày, Tháng và Năm
                      </Text>
                    </View>

                    {/* SELECTOR CHẾ ĐỘ BIỂU ĐỒ: NGÀY / THÁNG / NĂM */}
                    <View style={styles.revenueModePillsRow}>
                      {[
                        { id: 'day', label: '7 Ngày gần nhất', icon: 'calendar-outline' },
                        { id: 'month', label: `12 Tháng (${new Date().getFullYear()})`, icon: 'calendar' },
                        { id: 'year', label: 'Theo Năm', icon: 'time-outline' },
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
                              size={14}
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

                  {/* 4 TILE CHỈ SỐ NHANH */}
                  <View style={styles.revenueKpiGrid}>
                    <View style={[styles.revenueKpiTile, isDark && styles.revenueKpiTileDark]}>
                      <Text style={[styles.revenueKpiLabel, isDark && styles.textMutedDark]}>Tổng thực thu trong kỳ</Text>
                      <Text style={[styles.revenueKpiValue, { color: '#2563eb' }]} numberOfLines={1}>
                        {formatPrice(totalPeriodRev)}
                      </Text>
                    </View>

                    <View style={[styles.revenueKpiTile, isDark && styles.revenueKpiTileDark]}>
                      <Text style={[styles.revenueKpiLabel, isDark && styles.textMutedDark]}>Đơn hàng hoàn tất</Text>
                      <Text style={[styles.revenueKpiValue, { color: '#16a34a' }]}>
                        {totalPeriodOrders} đơn
                      </Text>
                    </View>

                    <View style={[styles.revenueKpiTile, isDark && styles.revenueKpiTileDark]}>
                      <Text style={[styles.revenueKpiLabel, isDark && styles.textMutedDark]}>Giá trị TB / đơn (AOV)</Text>
                      <Text style={[styles.revenueKpiValue, { color: '#0f172a' }, isDark && styles.textDark]} numberOfLines={1}>
                        {formatPrice(aovPeriod)}
                      </Text>
                    </View>

                    <View style={[styles.revenueKpiTile, isDark && styles.revenueKpiTileDark]}>
                      <Text style={[styles.revenueKpiLabel, isDark && styles.textMutedDark]}>Doanh thu cao nhất kỳ</Text>
                      <Text style={[styles.revenueKpiValue, { color: '#d97706' }]} numberOfLines={1}>
                        {formatPrice(maxRevenue === 1 ? 0 : maxRevenue)}
                      </Text>
                    </View>
                  </View>

                  {/* KHUNG BIỂU ĐỒ CỘT THANH LỊCH (BAR CHART) */}
                  <View style={[styles.barChartContainer, isDark && styles.barChartContainerDark]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.barChartScrollContent}>
                      {chartList.map((item, idx) => {
                        const pct = Math.round((item.revenue / maxRevenue) * 100);
                        const isPeak = item.revenue === maxRevenue && maxRevenue > 1;
                        return (
                          <View key={idx} style={styles.barColumnWrap}>
                            {/* Số tiền vắn tắt trên đỉnh cột */}
                            <Text style={[styles.barAmountText, isPeak && { color: '#2563eb', fontWeight: '800' }]} numberOfLines={1}>
                              {item.revenue >= 1000000
                                ? `${(item.revenue / 1000000).toFixed(1)} tr`
                                : item.revenue > 0
                                ? `${Math.round(item.revenue / 1000)}k`
                                : '0 ₫'}
                            </Text>

                            {/* Cột biểu đồ */}
                            <View style={styles.barTrack}>
                              <View
                                style={[
                                  styles.barFill,
                                  { height: `${Math.max(item.revenue > 0 ? 12 : 3, pct)}%` },
                                  item.revenue > 0 ? (isPeak ? styles.barFillPeak : styles.barFillActive) : styles.barFillZero,
                                ]}
                              />
                            </View>

                            {/* Nhãn ngày/tháng bên dưới */}
                            <Text style={[styles.barLabelText, isDark && styles.textMutedDark, isPeak && { fontWeight: '800', color: '#2563eb' }]}>
                              {item.label}
                            </Text>
                            <Text style={styles.barSubCountText}>
                              {item.count > 0 ? `${item.count} đơn` : '-'}
                            </Text>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* BẢNG KÊ CHI TIẾT THEO MỐC */}
                  <View style={styles.revenueTableWrap}>
                    <View style={styles.revenueTableHeader}>
                      <Text style={[styles.revTh, { flex: 2 }]}>Mốc thời gian</Text>
                      <Text style={[styles.revTh, { flex: 1.5, textAlign: 'center' }]}>Đơn hoàn tất</Text>
                      <Text style={[styles.revTh, { flex: 2, textAlign: 'right' }]}>Doanh thu thực thu</Text>
                      <Text style={[styles.revTh, { flex: 2, textAlign: 'right' }]}>Tỷ trọng %</Text>
                    </View>
                    {chartList.map((item, i) => {
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
                    })}
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
          <View style={[styles.sectionCard, isDark && styles.cardDark]}>
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
                    <View key={order.id} style={[styles.orderItemCard, isDark && styles.cardDark]}>
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
          <View style={[styles.sectionCard, isDark && styles.cardDark]}>
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
                    <View key={p.id} style={[styles.productCardRow, isDark && styles.cardDark, p.isHidden && { opacity: 0.65 }]}>
                      <AdminProductThumb
                        image={p.image}
                        product={p}
                        style={styles.productCardThumb}
                      />
                      <View style={styles.productCardDetails}>
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
                      <View style={styles.productCardActions}>
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
          <View style={[styles.sectionCard, isDark && styles.cardDark]}>
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
          <View style={[styles.sectionCard, isDark && styles.cardDark]}>
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
          <View style={[styles.sectionCard, isDark && styles.cardDark]}>
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
          <View style={[styles.sectionCard, isDark && styles.cardDark]}>
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
                        {item.deviceUnits && item.deviceUnits.length > 0 ? (
                          item.deviceUnits.map((u: any, uIdx: number) => (
                            <View key={uIdx} style={{ gap: 2, paddingBottom: uIdx < (item.deviceUnits?.length || 0) - 1 ? 4 : 0, borderBottomWidth: uIdx < (item.deviceUnits?.length || 0) - 1 ? 1 : 0, borderBottomColor: isDark ? '#334155' : '#e2e8f0' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <Text style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', fontWeight: '600' }}>Mã BH nội bộ:</Text>
                                <Text selectable style={[styles.orderItemUnitsCode, isDark && { color: '#93c5fd' }]}>{u.code}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <Text style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', fontWeight: '600' }}>IMEI / Serial hãng:</Text>
                                {u.manufacturerSerial ? (
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <Ionicons name="lock-closed" size={11} color="#059669" />
                                    <Text selectable style={{ fontSize: 11, fontWeight: '800', color: '#059669', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
                                      {u.manufacturerSerial}
                                    </Text>
                                    <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#059669' }}>Cố định</Text>
                                    </View>
                                  </View>
                                ) : (
                                  <Text style={{ fontSize: 11, fontStyle: 'italic', color: '#d97706' }}>
                                    Chưa nhập tem máy
                                  </Text>
                                )}
                              </View>
                            </View>
                          ))
                        ) : (
                          <View style={{ gap: 2 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', fontWeight: '600' }}>Mã BH nội bộ:</Text>
                              <Text selectable style={[styles.orderItemUnitsCode, isDark && { color: '#93c5fd' }]}>{formatUnitCodes(item)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', fontWeight: '600' }}>IMEI / Serial hãng:</Text>
                              <Text style={{ fontSize: 11, fontStyle: 'italic', color: '#d97706' }}>
                                Chưa nhập tem máy
                              </Text>
                            </View>
                          </View>
                        )}

                        {item.deviceUnits && item.deviceUnits.length > 0 && item.deviceUnits.every((u: any) => !!u.manufacturerSerial) ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' }}>
                            <Ionicons name="lock-closed" size={12} color="#059669" />
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#059669' }}>
                              IMEI máy đã cố định & niêm phong theo đơn
                            </Text>
                          </View>
                        ) : (
                          <Pressable
                            style={styles.btnInputOrderSerial}
                            onPress={() => {
                              setUnitCodes(item.serialNumbers);
                              setUnitProduct({ id: item.productId, name: item.name });
                            }}
                          >
                            <Ionicons name="barcode-outline" size={13} color="#2563eb" />
                            <Text style={styles.btnInputOrderSerialText}>
                              Gán IMEI/Serial từ tem máy (còn thiếu)
                            </Text>
                          </Pressable>
                        )}
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
      {/* MODAL 2: THÊM / CHỈNH SỬA SẢN PHẨM                       */}
      {/* ======================================================== */}
      <Modal visible={isProductModalOpen} transparent animationType="fade">
        <View style={[styles.modalBackdrop, isMobile && styles.modalBackdropMobile]}>
          <View style={[styles.modalBoxLarge, isMobile && styles.modalBoxLargeMobile, isDark && styles.cardDark]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalMainTitle, isDark && styles.textDark]}>
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Đăng sản phẩm mới'}
              </Text>
              <Pressable onPress={() => setIsProductModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView
              style={{ flex: 1, minHeight: 0, width: '100%' }}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
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
                    placeholder="VD: lap-005, rtx-4080"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Tên sản phẩm *:</Text>
                <TextInput
                  style={[styles.inputControl, isDark && styles.inputControlDark]}
                  value={productForm.name}
                  onChangeText={(t) => setProductForm({ ...productForm, name: t })}
                  placeholder="VD: ASUS ROG Strix SCAR 16 RTX 4080"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* CHỌN NHANH DANH MỤC */}
              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Danh mục linh kiện:</Text>
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

              {/* TỒN KHO & STEPPER */}
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

              {/* GIÁ BÁN & GIÁ GỐC */}
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

              {/* ẢNH SẢN PHẨM & TẢI ẢNH TỪ MÁY TÍNH */}
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

                {isMobile ? (
                  // Giao diện chọn ảnh tối ưu cho Màn hình điện thoại
                  <View style={{ gap: 10, width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Pressable
                        style={styles.imageThumbTouch}
                        onPress={handlePickProductImage}
                        accessibilityRole="button"
                        accessibilityLabel="Bấm vào để chọn ảnh từ máy tính"
                      >
                        <Image source={{ uri: productForm.image || DEFAULT_IMAGE }} style={[styles.imageInputThumb, { width: 56, height: 56 }]} />
                        <View style={styles.imageThumbOverlay}>
                          <Ionicons name="camera" size={12} color="#ffffff" />
                        </View>
                      </Pressable>

                      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                        <Pressable
                          style={[styles.uploadActionBtn, isUploadingImage && { opacity: 0.6 }]}
                          onPress={handlePickProductImage}
                          disabled={isUploadingImage}
                        >
                          <Ionicons name="folder-open-outline" size={14} color="#0f172a" />
                          <Text style={styles.uploadActionBtnText} numberOfLines={1}>
                            {isUploadingImage ? 'Đang xử lý...' : 'Chọn từ tệp tin'}
                          </Text>
                        </Pressable>

                        {productForm.image && productForm.image.startsWith('data:image') && (
                          <View style={styles.localImgBadge}>
                            <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
                            <Text style={styles.localImgBadgeText}>Ảnh từ thiết bị</Text>
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

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, width: '100%' }}>
                      <TextInput
                        style={[styles.inputControl, { flex: 1, minWidth: 0, fontSize: 13 }, isDark && styles.inputControlDark]}
                        value={productForm.image}
                        onChangeText={(t) => setProductForm({ ...productForm, image: t })}
                        placeholder="Hoặc dán URL: https://..."
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
                  </View>
                ) : (
                  // Giao diện màn hình máy tính (Desktop)
                  <View style={styles.imageInputRow}>
                    <Pressable
                      style={styles.imageThumbTouch}
                      onPress={handlePickProductImage}
                      accessibilityRole="button"
                      accessibilityLabel="Bấm vào để chọn ảnh từ máy tính"
                    >
                      <Image source={{ uri: productForm.image || DEFAULT_IMAGE }} style={styles.imageInputThumb} />
                      <View style={styles.imageThumbOverlay}>
                        <Ionicons name="camera" size={13} color="#ffffff" />
                      </View>
                    </Pressable>

                    <View style={{ flex: 1, gap: 6, minWidth: 0 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <TextInput
                          style={[styles.inputControl, { flex: 1, minWidth: 0 }, isDark && styles.inputControlDark]}
                          value={productForm.image}
                          onChangeText={(t) => setProductForm({ ...productForm, image: t })}
                          placeholder="Dán link ảnh https://... hoặc chọn ảnh từ máy tính"
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

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Pressable
                          style={[styles.uploadActionBtn, isUploadingImage && { opacity: 0.6 }]}
                          onPress={handlePickProductImage}
                          disabled={isUploadingImage}
                        >
                          <Ionicons name="folder-open-outline" size={13} color="#0f172a" />
                          <Text style={styles.uploadActionBtnText}>
                            {isUploadingImage ? 'Đang xử lý...' : 'Chọn từ máy tính / Điện thoại'}
                          </Text>
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
                )}

                {/* Gợi ý ảnh nhanh */}
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 5 }}>
                    Hoặc chọn nhanh ảnh mẫu có sẵn:
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

              {/* MÔ TẢ */}
              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, isDark && styles.textDark]}>Mô tả cấu hình nổi bật:</Text>
                <TextInput
                  style={[styles.inputControl, { height: 75, textAlignVertical: 'top' }, isDark && styles.inputControlDark]}
                  multiline
                  value={productForm.description}
                  onChangeText={(t) => setProductForm({ ...productForm, description: t })}
                  placeholder="Mô tả CPU, RAM, VGA, Bảo hành..."
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </ScrollView>

            <View style={[styles.modalFooterActions, isMobile && styles.modalFooterActionsMobile, isDark && { borderTopColor: '#334155' }]}>
              <Pressable style={[styles.btnSecondary, isMobile && { flex: 1, justifyContent: 'center' }]} onPress={() => setIsProductModalOpen(false)}>
                <Text style={styles.btnSecondaryText}>Hủy bỏ</Text>
              </Pressable>
              <Pressable style={[styles.btnPrimary, isMobile && { flex: 1.6, justifyContent: 'center' }]} onPress={handleSaveProduct} disabled={isSavingProduct}>
                {isSavingProduct ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.btnPrimaryText}>{editingProduct ? 'Cập nhật' : 'Lưu sản phẩm'}</Text>
                )}
              </Pressable>
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
  statHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  welcomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 280,
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
  orderItemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
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
    minWidth: 260,
  },
  terminalStatusCompleted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  terminalStatusCompletedDark: {
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
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
    minWidth: 260,
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
    maxWidth: 640,
    maxHeight: '90%',
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
