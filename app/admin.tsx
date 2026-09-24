import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { formatPrice } from '@/data/products';
import { apiService, type Order, type User } from '@/services/api';

type AdminTab = 'overview' | 'products' | 'orders' | 'categories' | 'users';

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
}

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  icon: string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

const PRESET_CATEGORIES = [
  { id: 'laptop', label: 'Laptop', icon: '💻' },
  { id: 'pc', label: 'PC Gaming', icon: '🖥️' },
  { id: 'gpu', label: 'Card RTX', icon: '🎮' },
  { id: 'cpu', label: 'CPU Intel/AMD', icon: '⚡' },
  { id: 'ram', label: 'RAM', icon: '🧠' },
  { id: 'ssd', label: 'Ổ SSD', icon: '💾' },
  { id: 'monitor', label: 'Màn hình', icon: '📺' },
  { id: 'gear', label: 'Gaming Gear', icon: '⌨️' },
];

const PRESET_PHOTOS = [
  {
    label: 'Laptop ROG',
    icon: '💻',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'PC Gaming LED',
    icon: '🖥️',
    url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Card RTX 4090',
    icon: '🎮',
    url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'CPU Intel Core i9',
    icon: '⚡',
    url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Màn hình 4K',
    icon: '📺',
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Bàn phím cơ',
    icon: '⌨️',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Chuột Gaming',
    icon: '🖱️',
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Tai nghe gaming',
    icon: '🎧',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
  },
];

export default function AdminScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;
  const { user, isAdmin } = useAppContext();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

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

  // Search in tabs
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
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

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', count: '0', icon: '💻' });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'product' | 'order' | 'category' | 'user';
    id: string | number;
    title: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Stepper and quick adjustment helpers
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
    const autoId = `prod-${Date.now().toString().slice(-4)}`;
    setProductForm((prev) => ({ ...prev, id: autoId }));
  };

  // Load all admin data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, productsData, ordersData, categoriesData, usersData] = await Promise.all([
        apiService.getAdminStats().catch(() => null),
        apiService.getProducts({ admin: 'true' }).catch(() => []),
        apiService.getOrders().catch(() => []),
        apiService.getCategories().catch(() => []),
        apiService.getAllUsers().catch(() => []),
      ]);

      if (statsData) {
        setStats({
          totalProducts: statsData.totalProducts || 0,
          totalOrders: statsData.totalOrders || 0,
          totalUsers: statsData.totalUsers || 0,
          totalRevenue: statsData.totalRevenue || '0',
        });
      }

      setProductList(Array.isArray(productsData) ? (productsData as ProductItem[]) : []);
      setOrderList(Array.isArray(ordersData) ? (ordersData as Order[]) : []);
      setCategoryList(Array.isArray(categoriesData) ? (categoriesData as CategoryItem[]) : []);
      setUserList(Array.isArray(usersData) ? (usersData as User[]) : []);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showToast('Không thể tải dữ liệu admin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, loadData]);

  const handleOpenAddProduct = () => {
    const autoId = `prod-${Date.now().toString().slice(-4)}`;
    setEditingProduct(null);
    setProductForm({
      id: autoId,
      name: '',
      category_id: 'laptop',
      price: '',
      oldPrice: '',
      stock: '20',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      description: '',
    });
    setIsProductModalOpen(true);
  };

  const toggleProductVisibility = async (prod: ProductItem) => {
    try {
      setLoading(true);
      // Wait for update
      await apiService.updateProduct(prod.id, { ...prod, isHidden: !prod.isHidden } as any);
      showToast(!prod.isHidden ? `Đã ẩn sản phẩm ${prod.id}` : `Đã hiển thị sản phẩm ${prod.id}`);
      await loadData();
    } catch (err) {
      showToast('Lỗi khi cập nhật trạng thái');
      setLoading(false);
    }
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProductForm({
      id: prod.id,
      name: prod.name,
      category_id: prod.category_id || prod.category || 'laptop',
      price: prod.price?.toString() || '',
      oldPrice: prod.oldPrice?.toString() || '',
      stock: prod.stock?.toString() || '15',
      image: prod.image || '',
      description: prod.description || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.price.trim()) {
      showToast('Vui lòng nhập tên và giá sản phẩm');
      return;
    }

    const priceNum = parseInt(productForm.price, 10);
    const oldPriceNum = productForm.oldPrice ? parseInt(productForm.oldPrice, 10) : 0;
    const stockNum = parseInt(productForm.stock || '10', 10);

    const payload = {
      name: productForm.name.trim(),
      category_id: productForm.category_id,
      price: priceNum,
      oldPrice: oldPriceNum || null,
      stock: stockNum,
      image: productForm.image.trim() || DEFAULT_IMAGE,
      description: productForm.description.trim(),
    };

    try {
      if (editingProduct) {
        // UPDATE
        await apiService.updateProduct(editingProduct.id, payload);
        setProductList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p))
        );
        showToast(`Đã cập nhật sản phẩm "${productForm.name}"!`);
      } else {
        // CREATE
        const newProduct = { id: productForm.id.trim(), ...payload, rating: 5, reviewCount: 1 };
        await apiService.createProduct(newProduct);
        setProductList((prev) => [newProduct as any, ...prev]);
        setStats((prev) => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
        showToast(`Đã thêm sản phẩm "${productForm.name}" thành công!`);
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      showToast('Lỗi khi lưu sản phẩm: ' + (err.message || 'Thất bại'));
    }
  };

  const handleDeleteExecute = async () => {
    if (!deleteConfirm) return;
    const { type, id, title } = deleteConfirm;

    try {
      if (type === 'product') {
        await apiService.deleteProduct(id.toString());
        setProductList((prev) => prev.filter((p) => p.id !== id));
        setStats((prev) => ({ ...prev, totalProducts: Math.max(0, prev.totalProducts - 1) }));
        showToast(`Đã xóa sản phẩm "${title}"`);
      } else if (type === 'order') {
        await apiService.deleteOrder(id);
        setOrderList((prev) => prev.filter((o) => o.id !== id));
        setStats((prev) => ({ ...prev, totalOrders: Math.max(0, prev.totalOrders - 1) }));
        showToast(`Đã xóa đơn hàng #${title}`);
      } else if (type === 'category') {
        await apiService.deleteCategory(id.toString());
        setCategoryList((prev) => prev.filter((c) => c.id !== id));
        showToast(`Đã xóa danh mục "${title}"`);
      } else if (type === 'user') {
        await apiService.deleteUser(id);
        setUserList((prev) => prev.filter((u) => u.id !== id));
        setStats((prev) => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
        showToast(`Đã xóa tài khoản "${title}"`);
      }
      setDeleteConfirm(null);
    } catch (err: any) {
      showToast('Lỗi khi xóa: ' + (err.message || 'Thất bại'));
      setDeleteConfirm(null);
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrderList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Đơn #${orderId} đã đổi sang "${newStatus}"!`);
    } catch (err: any) {
      showToast('Lỗi cập nhật trạng thái đơn: ' + err.message);
    }
  };

  // Category save
  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim() || !categoryForm.id.trim()) {
      showToast('Vui lòng nhập mã ID và tên danh mục');
      return;
    }

    try {
      const payload = {
        id: categoryForm.id.trim(),
        name: categoryForm.name.trim(),
        count: parseInt(categoryForm.count || '0', 10),
        icon: categoryForm.icon.trim() || '📁',
      };
      await apiService.createCategory(payload);
      setCategoryList((prev) => [...prev, payload]);
      setIsCategoryModalOpen(false);
      showToast(`Đã thêm danh mục "${categoryForm.name}"!`);
    } catch (err: any) {
      showToast('Lỗi lưu danh mục: ' + err.message);
    }
  };

  // Filter products / orders / users by search
  const filteredProducts = productList.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orderList.filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = userList.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentOrders = [...orderList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const lowStockProducts = productList.filter((product) => (product.stock ?? 0) <= 5).slice(0, 5);

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f8ff', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 32, maxWidth: 440, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 20 }}>
          <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', marginBottom: 18 }}>
            <Ionicons name="lock-closed" size={32} color="#dc2626" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>
            Quyền Truy Cập Bị Giới Hạn
          </Text>
          <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
            Tài khoản hiện tại ({user?.name || user?.email || 'Khách hàng'}) là tài khoản Khách hàng. Chỉ Quản Trị Viên (Admin) mới có quyền truy cập bảng điều khiển này.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            <Pressable
              style={{ flex: 1, backgroundColor: '#eff6ff', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
              onPress={() => router.push('/')}
            >
              <Text style={{ color: '#2563eb', fontWeight: '700', fontSize: 14 }}>Về trang chủ</Text>
            </Pressable>
            <Pressable
              style={{ flex: 1, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
              onPress={() => router.push('/login')}
            >
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>Đăng nhập Admin</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TOAST */}
      {toast ? (
        <View style={styles.toast}>
          <Ionicons name="information-circle" size={18} color="#22c55e" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {/* ADMIN HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backBtn} onPress={() => router.push('/(tabs)' as any)}>
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </Pressable>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.headerBrand}>DANGVINHPC</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN PORTAL</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>Quản lý hệ thống, sản phẩm và đơn hàng</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.refreshBtn} onPress={loadData}>
            <Ionicons name="refresh" size={18} color="#2563eb" />
            <Text style={styles.refreshBtnText}>Tải lại</Text>
          </Pressable>

          <Pressable style={styles.addPrimaryBtn} onPress={handleOpenAddProduct}>
            <Ionicons name="add" size={20} color="#ffffff" />
            <Text style={styles.addPrimaryBtnText}>Thêm sản phẩm</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentContainer}>
        {/* STATS OVERVIEW CARDS */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#2563eb' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="wallet-outline" size={22} color="#2563eb" />
            </View>
            <Text style={styles.statValue}>{parseInt(stats.totalRevenue, 10).toLocaleString('vi-VN')} ₫</Text>
            <Text style={styles.statLabel}>Tổng doanh thu bán hàng</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#059669' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="cube-outline" size={22} color="#059669" />
            </View>
            <Text style={styles.statValue}>{stats.totalOrders} đơn</Text>
            <Text style={styles.statLabel}>Tổng số đơn hàng</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#d97706' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#fffbeb' }]}>
              <Ionicons name="hardware-chip-outline" size={22} color="#d97706" />
            </View>
            <Text style={styles.statValue}>{productList.length} sản phẩm</Text>
            <Text style={styles.statLabel}>Sản phẩm trong kho</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#7c3aed' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#faf5ff' }]}>
              <Ionicons name="people-outline" size={22} color="#7c3aed" />
            </View>
            <Text style={styles.statValue}>{userList.length} tài khoản</Text>
            <Text style={styles.statLabel}>Khách hàng đã đăng ký</Text>
          </View>
        </View>

        {/* NAVIGATION TABS & SEARCH BAR */}
        <View style={styles.tabsRow}>
          <View style={styles.tabButtons}>
            {[
              { id: 'overview', label: 'Tổng quan', icon: 'home-outline', count: null },
              { id: 'products', label: 'Sản phẩm', icon: 'hardware-chip-outline', count: productList.length },
              { id: 'orders', label: 'Đơn hàng', icon: 'receipt-outline', count: orderList.length },
              { id: 'categories', label: 'Danh mục', icon: 'grid-outline', count: categoryList.length },
              { id: 'users', label: 'Khách hàng', icon: 'people-outline', count: userList.length },
            ].map((tab) => (
              <Pressable
                key={tab.id}
                style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
                onPress={() => {
                  setActiveTab(tab.id as AdminTab);
                  setSearchTerm('');
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={activeTab === tab.id ? '#2563eb' : '#64748b'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.tabBtnText, activeTab === tab.id && styles.tabBtnTextActive]}>
                  {tab.label}{tab.count === null ? '' : ` (${tab.count})`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* QUICK SEARCH */}
          {activeTab !== 'overview' && (
            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={16} color="#64748b" style={{ marginRight: 6 }} />
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Lọc nhanh danh sách..."
                placeholderTextColor="#94a3b8"
                style={styles.searchInput}
              />
            </View>
          )}
        </View>

        {activeTab === 'overview' && (
          <View style={styles.overviewWrap}>
            <View style={[styles.welcomePanel, !isDesktop && styles.welcomePanelMobile]}>
              <View style={styles.welcomeIconWrap}>
                <Ionicons name="shield-checkmark" size={28} color="#ffffff" />
              </View>
              <View style={styles.welcomeCopy}>
                <Text style={styles.welcomeTitle}>Xin chào, {user?.name || 'Quản trị viên'}!</Text>
                <Text style={styles.welcomeText}>Đây là trung tâm điều hành của DANGVINHPC. Theo dõi hoạt động cửa hàng và xử lý công việc nhanh chóng.</Text>
              </View>
              <Pressable style={styles.welcomeAction} onPress={loadData}>
                <Ionicons name="sync-outline" size={17} color="#2563eb" />
                <Text style={styles.welcomeActionText}>Cập nhật dữ liệu</Text>
              </Pressable>
            </View>

            <View style={[styles.dashboardColumns, !isDesktop && styles.dashboardColumnsMobile]}>
              <View style={[styles.dashboardCard, styles.quickActionsCard]}>
                <View style={styles.dashboardCardHeader}>
                  <View>
                    <Text style={styles.dashboardCardTitle}>Thao tác nhanh</Text>
                    <Text style={styles.dashboardCardSubtitle}>Các công việc thường dùng</Text>
                  </View>
                  <Ionicons name="flash-outline" size={22} color="#ea580c" />
                </View>
                <View style={styles.quickActionsGrid}>
                  {[
                    { label: 'Thêm sản phẩm', icon: 'add-circle-outline', color: '#2563eb', action: handleOpenAddProduct },
                    { label: 'Xem đơn hàng', icon: 'receipt-outline', color: '#059669', action: () => setActiveTab('orders') },
                    { label: 'Quản lý khách hàng', icon: 'people-outline', color: '#7c3aed', action: () => setActiveTab('users') },
                    { label: 'Quản lý danh mục', icon: 'grid-outline', color: '#d97706', action: () => setActiveTab('categories') },
                  ].map((action) => (
                    <Pressable key={action.label} style={styles.quickActionItem} onPress={action.action}>
                      <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                        <Ionicons name={action.icon as any} size={21} color={action.color} />
                      </View>
                      <Text style={styles.quickActionLabel}>{action.label}</Text>
                      <Ionicons name="arrow-forward" size={15} color="#94a3b8" />
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.dashboardCard}>
                <View style={styles.dashboardCardHeader}>
                  <View>
                    <Text style={styles.dashboardCardTitle}>Tồn kho cần chú ý</Text>
                    <Text style={styles.dashboardCardSubtitle}>Sản phẩm còn 5 hoặc ít hơn</Text>
                  </View>
                  <Ionicons name="alert-circle-outline" size={22} color="#dc2626" />
                </View>
                {lowStockProducts.length === 0 ? (
                  <Text style={styles.dashboardEmptyText}>Kho hàng đang ở trạng thái tốt.</Text>
                ) : (
                  lowStockProducts.map((product) => (
                    <Pressable key={product.id} style={styles.dashboardListRow} onPress={() => setActiveTab('products')}>
                      <View style={styles.dashboardListIcon}>
                        <Ionicons name="cube-outline" size={17} color="#dc2626" />
                      </View>
                      <Text style={styles.dashboardListName} numberOfLines={1}>{product.name}</Text>
                      <Text style={styles.stockWarningText}>{product.stock ?? 0} sp</Text>
                    </Pressable>
                  ))
                )}
              </View>
            </View>

            <View style={styles.dashboardCard}>
              <View style={styles.dashboardCardHeader}>
                <View>
                  <Text style={styles.dashboardCardTitle}>Đơn hàng gần đây</Text>
                  <Text style={styles.dashboardCardSubtitle}>Theo dõi các giao dịch mới nhất</Text>
                </View>
                <Pressable style={styles.dashboardLink} onPress={() => setActiveTab('orders')}>
                  <Text style={styles.dashboardLinkText}>Xem tất cả</Text>
                  <Ionicons name="arrow-forward" size={15} color="#2563eb" />
                </Pressable>
              </View>
              {recentOrders.length === 0 ? (
                <Text style={styles.dashboardEmptyText}>Chưa có đơn hàng nào.</Text>
              ) : (
                recentOrders.map((order) => (
                  <Pressable key={order.id} style={styles.dashboardOrderRow} onPress={() => setActiveTab('orders')}>
                    <View style={styles.dashboardOrderIcon}>
                      <Ionicons name="receipt-outline" size={18} color="#2563eb" />
                    </View>
                    <View style={styles.dashboardOrderInfo}>
                      <Text style={styles.dashboardOrderNumber}>{order.orderNumber || `#ORD-${order.id}`}</Text>
                      <Text style={styles.dashboardOrderDate}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</Text>
                    </View>
                    <Text style={styles.dashboardOrderTotal}>{formatPrice(order.totalAmount)}</Text>
                    <View style={styles.dashboardOrderStatus}>
                      <Text style={styles.dashboardOrderStatusText}>{order.status || 'pending'}</Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        )}

        {/* TAB 1: QUẢN LÝ SẢN PHẨM */}
        {activeTab === 'products' && (
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>Danh sách Sản phẩm ({filteredProducts.length})</Text>
              <Pressable style={styles.miniBtn} onPress={handleOpenAddProduct}>
                <Ionicons name="add" size={16} color="#2563eb" />
                <Text style={styles.miniBtnText}>Thêm mới</Text>
              </Pressable>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 40 }} />
            ) : filteredProducts.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
              </View>
            ) : (
              <View style={styles.productList}>
                {filteredProducts.map((p) => (
                  <View key={p.id} style={styles.productRow}>
                    <Image source={{ uri: p.image || DEFAULT_IMAGE }} style={styles.productThumb} />
                    <View style={styles.productInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.productCode}>[{p.id}]</Text>
                        <Text style={styles.productCatTag}>{p.category_id || p.category || 'Khác'}</Text>
                      </View>
                      <Text style={styles.productTitle}>{p.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
                        <Text style={styles.productPriceText}>{formatPrice(p.price)}</Text>
                        <Text style={styles.productStockText}>Kho: {p.stock ?? 10} sp</Text>
                      </View>
                    </View>

                    {/* ACTION BUTTONS: EDIT & DELETE */}
                    <View style={styles.actionsGroup}>
                      <Pressable 
                        style={[styles.actionBtnEdit, { borderColor: p.isHidden ? '#f59e0b' : '#10b981', backgroundColor: p.isHidden ? '#fffbeb' : '#ecfdf5' }]} 
                        onPress={() => toggleProductVisibility(p)}
                      >
                        <Ionicons name={p.isHidden ? 'eye-off-outline' : 'eye-outline'} size={16} color={p.isHidden ? '#f59e0b' : '#10b981'} />
                        <Text style={[styles.actionBtnEditText, { color: p.isHidden ? '#f59e0b' : '#10b981' }]}>
                          {p.isHidden ? 'Đang Ẩn' : 'Hiển thị'}
                        </Text>
                      </Pressable>

                      <Pressable style={styles.actionBtnEdit} onPress={() => handleOpenEditProduct(p)}>
                        <Ionicons name="pencil" size={16} color="#2563eb" />
                        <Text style={styles.actionBtnEditText}>Sửa</Text>
                      </Pressable>

                      <Pressable
                        style={styles.actionBtnDelete}
                        onPress={() =>
                          setDeleteConfirm({
                            type: 'product',
                            id: p.id,
                            title: p.name,
                          })
                        }
                      >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        <Text style={styles.actionBtnDeleteText}>Xóa</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* TAB 2: QUẢN LÝ ĐƠN HÀNG */}
        {activeTab === 'orders' && (
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>Danh sách Đơn hàng ({filteredOrders.length})</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 40 }} />
            ) : filteredOrders.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
              </View>
            ) : (
              <View style={styles.orderList}>
                {filteredOrders.map((order) => (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeaderRow}>
                      <View>
                        <Text style={styles.orderNumberText}>{order.orderNumber || `#ORD-${order.id}`}</Text>
                        <Text style={styles.orderDateText}>
                          Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.orderTotalText}>{formatPrice(order.totalAmount)}</Text>
                        <Text style={styles.orderPaymentText}>PTTT: {order.paymentMethod?.toUpperCase()}</Text>
                      </View>
                    </View>

                    <Text style={styles.orderAddressText}>📍 {order.shippingAddress}</Text>

                    {/* STATUS SELECTOR CHIPS */}
                    <View style={styles.orderStatusRow}>
                      <Text style={styles.orderStatusLabel}>Trạng thái đơn:</Text>
                      <View style={styles.statusChips}>
                        {[
                          { key: 'pending', label: 'Chờ duyệt', color: '#d97706', bg: '#fef3c7' },
                          { key: 'confirmed', label: 'Đã duyệt', color: '#2563eb', bg: '#dbeafe' },
                          { key: 'shipping', label: 'Đang giao', color: '#7c3aed', bg: '#f3e8ff' },
                          { key: 'completed', label: 'Hoàn thành', color: '#16a34a', bg: '#dcfce7' },
                          { key: 'cancelled', label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2' },
                        ].map((s) => {
                          const isActive = order.status === s.key;
                          return (
                            <Pressable
                              key={s.key}
                              style={[
                                styles.statusChip,
                                { borderColor: s.color },
                                isActive && { backgroundColor: s.color },
                              ]}
                              onPress={() => handleUpdateOrderStatus(order.id, s.key)}
                            >
                              <Text
                                style={[
                                  styles.statusChipText,
                                  { color: isActive ? '#ffffff' : s.color },
                                ]}
                              >
                                {s.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>

                      <Pressable
                        style={styles.orderDeleteBtn}
                        onPress={() =>
                          setDeleteConfirm({
                            type: 'order',
                            id: order.id,
                            title: order.orderNumber || order.id.toString(),
                          })
                        }
                      >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* TAB 3: QUẢN LÝ DANH MỤC */}
        {activeTab === 'categories' && (
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>Danh mục linh kiện ({categoryList.length})</Text>
              <Pressable
                style={styles.miniBtn}
                onPress={() => {
                  setCategoryForm({ id: '', name: '', count: '0', icon: '💻' });
                  setIsCategoryModalOpen(true);
                }}
              >
                <Ionicons name="add" size={16} color="#2563eb" />
                <Text style={styles.miniBtnText}>Thêm danh mục</Text>
              </Pressable>
            </View>

            <View style={styles.categoryGrid}>
              {categoryList.map((cat) => (
                <View key={cat.id} style={styles.categoryCard}>
                  <Text style={styles.catIcon}>{cat.icon || '📁'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catIdText}>Mã: {cat.id} • {cat.count} sản phẩm</Text>
                  </View>
                  <Pressable
                    style={styles.catDeleteBtn}
                    onPress={() =>
                      setDeleteConfirm({
                        type: 'category',
                        id: cat.id,
                        title: cat.name,
                      })
                    }
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: QUẢN LÝ KHÁCH HÀNG */}
        {activeTab === 'users' && (
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>Danh sách Khách hàng ({filteredUsers.length})</Text>
            </View>

            <View style={styles.userList}>
              {filteredUsers.map((user) => (
                <View key={user.id} style={styles.userRow}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>{user.name ? user.name[0] : 'U'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userNameText}>{user.name}</Text>
                    <Text style={styles.userSubText}>
                      📧 {user.email} • 📞 {user.phone || 'Chưa cập nhật'}
                    </Text>
                    {user.address ? <Text style={styles.userAddressText}>📍 {user.address}</Text> : null}
                  </View>
                  <Pressable
                    style={styles.userDeleteBtn}
                    onPress={() =>
                      setDeleteConfirm({
                        type: 'user',
                        id: user.id,
                        title: user.name || user.email,
                      })
                    }
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ==================== MODAL: ADD / EDIT PRODUCT ==================== */}
      <Modal visible={isProductModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </Text>
              <Pressable onPress={() => setIsProductModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
              {!editingProduct && (
                <View style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={styles.fieldLabelNoMargin}>Mã định danh (ID):</Text>
                    <Pressable onPress={regenerateId} style={styles.inlineActionBtn}>
                      <Ionicons name="refresh" size={13} color="#2563eb" />
                      <Text style={styles.inlineActionText}>Đổi mã mới</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    style={styles.inputField}
                    value={productForm.id}
                    onChangeText={(t) => setProductForm({ ...productForm, id: t })}
                    placeholder="VD: lap-005, gpu-002"
                  />
                </View>
              )}

              <View style={{ marginBottom: 12 }}>
                <Text style={styles.fieldLabel}>Tên sản phẩm *:</Text>
                <TextInput
                  style={styles.inputField}
                  value={productForm.name}
                  onChangeText={(t) => setProductForm({ ...productForm, name: t })}
                  placeholder="VD: ASUS ROG Strix G16 RTX 4070"
                />
              </View>

              {/* DANH MỤC: CHỌN NHANH 1 CHẠM */}
              <View style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={styles.fieldLabelNoMargin}>Danh mục (chọn nhanh 1 chạm):</Text>
                  <Text style={styles.badgeHelper}>
                    {productForm.category_id ? `Đã chọn: ${productForm.category_id}` : ''}
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {PRESET_CATEGORIES.map((cat) => {
                      const isSelected = productForm.category_id === cat.id;
                      return (
                        <Pressable
                          key={cat.id}
                          onPress={() => setProductForm({ ...productForm, category_id: cat.id })}
                          style={[
                            styles.categoryChip,
                            isSelected && styles.categoryChipActive,
                          ]}
                        >
                          <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
                          <Text
                            style={[
                              styles.categoryChipText,
                              isSelected && styles.categoryChipTextActive,
                            ]}
                          >
                            {cat.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
                <TextInput
                  style={[styles.inputField, { paddingVertical: 6, fontSize: 13 }]}
                  value={productForm.category_id}
                  onChangeText={(t) => setProductForm({ ...productForm, category_id: t })}
                  placeholder="Hoặc nhập mã danh mục tùy chỉnh..."
                />
              </View>

              {/* SỐ LƯỢNG TRONG KHO (STEPPER & CHIP CỘNG NHANH) */}
              <View style={{ marginBottom: 14 }}>
                <Text style={styles.fieldLabel}>Số lượng trong kho:</Text>
                <View style={styles.stepperContainer}>
                  <Pressable
                    style={styles.stepperBtn}
                    onPress={() => adjustStock(-1)}
                  >
                    <Ionicons name="remove" size={18} color="#475569" />
                  </Pressable>
                  <TextInput
                    style={styles.stepperInput}
                    keyboardType="numeric"
                    value={productForm.stock}
                    onChangeText={(t) => setProductForm({ ...productForm, stock: t })}
                    placeholder="0"
                  />
                  <Pressable
                    style={[styles.stepperBtn, styles.stepperBtnPlus]}
                    onPress={() => adjustStock(1)}
                  >
                    <Ionicons name="add" size={18} color="#2563eb" />
                  </Pressable>
                </View>

                {/* Phím bấm cộng số lượng nhanh */}
                <View style={styles.quickChipsRow}>
                  <Text style={styles.quickChipsLabel}>Cộng thêm:</Text>
                  {[+5, +10, +20, +50, +100].map((num) => (
                    <Pressable
                      key={num}
                      style={styles.quickChip}
                      onPress={() => adjustStock(num)}
                    >
                      <Text style={styles.quickChipText}>+{num}</Text>
                    </Pressable>
                  ))}
                  <Pressable
                    style={[styles.quickChip, { backgroundColor: '#fee2e2', borderColor: '#fecaca' }]}
                    onPress={() => setProductForm({ ...productForm, stock: '0' })}
                  >
                    <Text style={[styles.quickChipText, { color: '#ef4444' }]}>Hết hàng (0)</Text>
                  </Pressable>
                </View>
              </View>

              {/* GIÁ BÁN (VNĐ) (STEPPER, FORMAT TIỀN & CHIP CỘNG NHANH) */}
              <View style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.fieldLabelNoMargin}>Giá bán (VNĐ) *:</Text>
                  {!!productForm.price && (
                    <Text style={styles.pricePreviewLive}>
                      💵 {formatPrice(parseInt(productForm.price, 10) || 0)}
                    </Text>
                  )}
                </View>

                <View style={styles.stepperContainer}>
                  <Pressable
                    style={styles.stepperBtn}
                    onPress={() => adjustPrice('price', -500000)}
                  >
                    <Ionicons name="remove" size={18} color="#475569" />
                  </Pressable>
                  <TextInput
                    style={styles.stepperInput}
                    keyboardType="numeric"
                    value={productForm.price}
                    onChangeText={(t) => setProductForm({ ...productForm, price: t.replace(/[^0-9]/g, '') })}
                    placeholder="18990000"
                  />
                  <Pressable
                    style={[styles.stepperBtn, styles.stepperBtnPlus]}
                    onPress={() => adjustPrice('price', 500000)}
                  >
                    <Ionicons name="add" size={18} color="#2563eb" />
                  </Pressable>
                </View>

                {/* Phím cộng tiền nhanh */}
                <View style={styles.quickChipsRow}>
                  <Text style={styles.quickChipsLabel}>Cộng giá:</Text>
                  {[
                    { label: '+100k', val: 100000 },
                    { label: '+500k', val: 500000 },
                    { label: '+1tr', val: 1000000 },
                    { label: '+2tr', val: 2000000 },
                    { label: '+5tr', val: 5000000 },
                    { label: '+10tr', val: 10000000 },
                  ].map((chip) => (
                    <Pressable
                      key={chip.label}
                      style={styles.quickChip}
                      onPress={() => adjustPrice('price', chip.val)}
                    >
                      <Text style={styles.quickChipText}>{chip.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* GIÁ GỐC NIÊM YẾT & TÍNH NHANH % SALE */}
              <View style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.fieldLabelNoMargin}>Giá gốc (nếu có giảm giá):</Text>
                  {!!productForm.oldPrice && (
                    <Text style={styles.oldPricePreviewLive}>
                      🏷️ {formatPrice(parseInt(productForm.oldPrice, 10) || 0)}
                    </Text>
                  )}
                </View>

                <View style={styles.stepperContainer}>
                  <Pressable
                    style={styles.stepperBtn}
                    onPress={() => adjustPrice('oldPrice', -500000)}
                  >
                    <Ionicons name="remove" size={18} color="#475569" />
                  </Pressable>
                  <TextInput
                    style={styles.stepperInput}
                    keyboardType="numeric"
                    value={productForm.oldPrice}
                    onChangeText={(t) => setProductForm({ ...productForm, oldPrice: t.replace(/[^0-9]/g, '') })}
                    placeholder="20990000"
                  />
                  <Pressable
                    style={[styles.stepperBtn, styles.stepperBtnPlus]}
                    onPress={() => adjustPrice('oldPrice', 500000)}
                  >
                    <Ionicons name="add" size={18} color="#2563eb" />
                  </Pressable>
                </View>

                {/* Tạo Sale % tự động */}
                <View style={styles.quickChipsRow}>
                  <Text style={styles.quickChipsLabel}>Tạo Sale:</Text>
                  {[
                    { label: '+10% giá bán', val: 10 },
                    { label: '+15%', val: 15 },
                    { label: '+20%', val: 20 },
                    { label: '+30%', val: 30 },
                    { label: '= Bằng giá bán', val: 0 },
                  ].map((item) => (
                    <Pressable
                      key={item.label}
                      style={[styles.quickChip, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}
                      onPress={() => setMarkupOldPrice(item.val)}
                    >
                      <Text style={[styles.quickChipText, { color: '#dc2626' }]}>{item.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* HÌNH ẢNH SẢN PHẨM & MẪU ẢNH SẴN CÓ XEM TRƯỚC */}
              <View style={{ marginBottom: 14 }}>
                <Text style={styles.fieldLabel}>Link ảnh sản phẩm (Xem trước & Chọn mẫu):</Text>
                <View style={styles.imagePreviewRow}>
                  <Image
                    source={{ uri: productForm.image || DEFAULT_IMAGE }}
                    style={styles.imageBoxPreview}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={[styles.inputField, { fontSize: 13 }]}
                      value={productForm.image}
                      onChangeText={(t) => setProductForm({ ...productForm, image: t })}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                      Dán link hoặc bấm chọn nhanh ảnh mẫu có sẵn dưới đây 👇
                    </Text>
                  </View>
                </View>

                {/* Danh sách ảnh mẫu 1 chạm */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {PRESET_PHOTOS.map((p, idx) => (
                      <Pressable
                        key={idx}
                        style={styles.presetPhotoChip}
                        onPress={() => setProductForm({ ...productForm, image: p.url })}
                      >
                        <Text style={{ fontSize: 13 }}>{p.icon}</Text>
                        <Text style={styles.presetPhotoText}>{p.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* MÔ TẢ TÓM TẮT & GỢI Ý MẪU */}
              <View style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.fieldLabelNoMargin}>Mô tả tóm tắt:</Text>
                  <Text style={{ fontSize: 11, color: '#94a3b8' }}>Gợi ý mẫu nhanh</Text>
                </View>
                <TextInput
                  style={[styles.inputField, { height: 75, textAlignVertical: 'top' }]}
                  multiline
                  value={productForm.description}
                  onChangeText={(t) => setProductForm({ ...productForm, description: t })}
                  placeholder="Mô tả cấu hình và tính năng nổi bật..."
                />
                <View style={styles.quickChipsRow}>
                  {[
                    '🔥 Hàng chính hãng New 100%',
                    '⚡ Bảo hành 24-36 tháng chính hãng',
                    '🚀 Miễn phí ship toàn quốc',
                  ].map((desc, i) => (
                    <Pressable
                      key={i}
                      style={styles.descChip}
                      onPress={() => {
                        const current = productForm.description.trim();
                        setProductForm({
                          ...productForm,
                          description: current ? `${current}\n${desc}` : desc,
                        });
                      }}
                    >
                      <Text style={styles.descChipText}>{desc}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#f1f5f9' }]}
                onPress={() => setIsProductModalOpen(false)}
              >
                <Text style={[styles.modalBtnText, { color: '#475569' }]}>Hủy bỏ</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, { backgroundColor: '#2563eb' }]} onPress={handleSaveProduct}>
                <Text style={styles.modalBtnText}>
                  {editingProduct ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm mới'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: ADD CATEGORY ==================== */}
      <Modal visible={isCategoryModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm danh mục mới</Text>
              <Pressable onPress={() => setIsCategoryModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <Text style={styles.fieldLabel}>Mã ID danh mục (viết liền không dấu):</Text>
            <TextInput
              style={styles.inputField}
              value={categoryForm.id}
              onChangeText={(t) => setCategoryForm({ ...categoryForm, id: t })}
              placeholder="VD: cooling, psu, mainboard"
            />

            <Text style={styles.fieldLabel}>Tên hiển thị:</Text>
            <TextInput
              style={styles.inputField}
              value={categoryForm.name}
              onChangeText={(t) => setCategoryForm({ ...categoryForm, name: t })}
              placeholder="VD: Tản nhiệt, Nguồn máy tính"
            />

            <Text style={styles.fieldLabel}>Icon đại diện (Emoji hoặc biểu tượng):</Text>
            <TextInput
              style={styles.inputField}
              value={categoryForm.icon}
              onChangeText={(t) => setCategoryForm({ ...categoryForm, icon: t })}
              placeholder="❄️ hoặc ⚡"
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#f1f5f9' }]}
                onPress={() => setIsCategoryModalOpen(false)}
              >
                <Text style={[styles.modalBtnText, { color: '#475569' }]}>Hủy</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, { backgroundColor: '#2563eb' }]} onPress={handleSaveCategory}>
                <Text style={styles.modalBtnText}>Thêm danh mục</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: CONFIRM DELETE ==================== */}
      <Modal visible={!!deleteConfirm} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { alignItems: 'center' }]}>
            <View style={styles.dangerIconWrap}>
              <Ionicons name="trash" size={28} color="#ef4444" />
            </View>
            <Text style={styles.modalTitle}>Xác nhận xóa?</Text>
            <Text style={styles.confirmSubtext}>
              Bạn có chắc chắn muốn xóa {deleteConfirm?.type === 'product' ? 'sản phẩm' : deleteConfirm?.type === 'order' ? 'đơn hàng' : deleteConfirm?.type === 'category' ? 'danh mục' : 'khách hàng'}:
            </Text>
            <Text style={styles.confirmTargetText}>"{deleteConfirm?.title}"</Text>

            <View style={[styles.modalActions, { width: '100%', marginTop: 20 }]}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#f1f5f9', flex: 1 }]}
                onPress={() => setDeleteConfirm(null)}
              >
                <Text style={[styles.modalBtnText, { color: '#475569' }]}>Hủy</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#ef4444', flex: 1 }]}
                onPress={handleDeleteExecute}
              >
                <Text style={styles.modalBtnText}>Xác nhận xóa</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  toast: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 999,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  adminBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adminBadgeText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  refreshBtnText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
  addPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  addPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* CONTENT */
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 80,
    maxWidth: 1300,
    width: '100%',
    alignSelf: 'center',
  },

  /* STATS CARDS */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },

  /* TABS ROW */
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  tabButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabBtnActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 38,
    minWidth: 220,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },

  /* ADMIN OVERVIEW */
  overviewWrap: {
    gap: 16,
  },
  welcomePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  welcomePanelMobile: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  welcomeIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  welcomeCopy: {
    flex: 1,
    minWidth: 220,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '800',
  },
  welcomeText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  welcomeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  welcomeActionText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  dashboardColumns: {
    flexDirection: 'row',
    gap: 16,
  },
  dashboardColumnsMobile: {
    flexDirection: 'column',
  },
  dashboardCard: {
    flex: 1,
    minWidth: 320,
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
  quickActionsCard: {
    flex: 1.2,
  },
  dashboardCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dashboardCardTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  dashboardCardSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    width: '48%',
    minWidth: 170,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  quickActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    flex: 1,
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
  dashboardListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  dashboardListIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
  },
  dashboardListName: {
    flex: 1,
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  stockWarningText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '800',
  },
  dashboardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dashboardLinkText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  dashboardEmptyText: {
    color: '#94a3b8',
    fontSize: 13,
    paddingVertical: 12,
  },
  dashboardOrderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  dashboardOrderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
  },
  dashboardOrderInfo: {
    flex: 1,
  },
  dashboardOrderNumber: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  dashboardOrderDate: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  dashboardOrderTotal: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  dashboardOrderStatus: {
    backgroundColor: '#fef3c7',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dashboardOrderStatusText: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: '700',
  },

  /* TABLE CARD */
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 10,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  miniBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  emptyWrap: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },

  /* PRODUCT ROW */
  productList: {
    gap: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#cbd5e1',
    marginRight: 14,
  },
  productInfo: {
    flex: 1,
  },
  productCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  productCatTag: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#e2e8f0',
    color: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  productPriceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563eb',
  },
  productStockText: {
    fontSize: 12,
    color: '#64748b',
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionBtnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnEditText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  actionBtnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnDeleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
  },

  /* ORDER CARD */
  orderList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  orderDateText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  orderTotalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
  },
  orderPaymentText: {
    fontSize: 11,
    color: '#64748b',
  },
  orderAddressText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 10,
  },
  orderStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  orderStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  statusChips: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderDeleteBtn: {
    padding: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
  },

  /* CATEGORY GRID */
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: 200,
    maxWidth: 280,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
  },
  catIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  catIdText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  catDeleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },

  /* USER LIST */
  userList: {
    gap: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  userSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  userAddressText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  userDeleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },

  /* MODAL */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 540,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  inputField: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0f172a',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  dangerIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmSubtext: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },
  confirmTargetText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
    textAlign: 'center',
  },

  /* STEPPERS & QUICK CHIPS IN MODAL */
  fieldLabelNoMargin: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  inlineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  inlineActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  badgeHelper: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  stepperBtnPlus: {
    backgroundColor: '#eff6ff',
  },
  stepperInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    paddingVertical: 6,
  },
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  quickChipsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  quickChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  pricePreviewLive: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  oldPricePreviewLive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
    textDecorationLine: 'line-through',
  },
  imagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageBoxPreview: {
    width: 54,
    height: 54,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f1f5f9',
  },
  presetPhotoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetPhotoText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  descChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 4,
  },
  descChipText: {
    fontSize: 11,
    color: '#475569',
  },
});
