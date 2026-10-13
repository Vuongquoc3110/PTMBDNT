import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AdminSupportPanel } from '@/components/admin/AdminSupportPanel';
import { useAppContext } from '@/context/AppContext';
import { formatPrice, getProductFallbackImage } from '@/data/products';
import { apiService, type Order, type Product, type User } from '@/services/api';

type StaffTab = 'orders' | 'inventory' | 'support' | 'catalog';

export default function StaffScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;
  const { user, isAdmin, isStaff, canManage, isDark, logout } = useAppContext();

  const [activeTab, setActiveTab] = useState<StaffTab>('orders');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Data lists
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [supportPendingCount, setSupportPendingCount] = useState(0);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [inventoryQuantities, setInventoryQuantities] = useState<Record<string, string>>({});

  // Modals
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    logout();
    router.replace('/login');
  };

  // Load Data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersData, productsData] = await Promise.all([
        apiService.getOrders().catch(() => []),
        apiService.getProducts().catch(() => []),
      ]);
      setOrderList(ordersData || []);
      setProductList(productsData || []);
    } catch (err: any) {
      showToast('Lỗi tải dữ liệu: ' + (err.message || 'Thất bại'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    if (typeof window !== 'undefined') {
      const handleSync = () => loadData();
      window.addEventListener('focus', handleSync);
      window.addEventListener('dpc_order_updated', handleSync);
      let bc: BroadcastChannel | null = null;
      try {
        bc = new BroadcastChannel('dpc_order_sync');
        bc.onmessage = () => loadData();
      } catch {}
      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleSync);
        window.removeEventListener('dpc_order_updated', handleSync);
        if (bc) bc.close();
      };
    }
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle Order Status Transitions
  const handleUpdateOrderStatus = async (orderId: number | string, nextStatus: string, orderNumber?: string) => {
    try {
      setUpdatingOrderId(Number(orderId) || (orderId as any));
      const targetParam = orderId || orderNumber;
      await apiService.updateOrderStatus(targetParam, nextStatus);
      setOrderList((prev) =>
        prev.map((o) =>
          String(o.id) === String(orderId) || (orderNumber && o.orderNumber === orderNumber) || (o.orderNumber === String(orderId))
            ? { ...o, status: nextStatus }
            : o
        )
      );
      if (
        viewingOrder &&
        (String(viewingOrder.id) === String(orderId) || (orderNumber && viewingOrder.orderNumber === orderNumber) || (viewingOrder.orderNumber === String(orderId)))
      ) {
        setViewingOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }

      // Tự động chuyển tab lọc sang trạng thái kế tiếp để nhân viên nhìn thấy ngay đơn hàng với nút tiếp theo
      if (orderStatusFilter !== 'all') {
        const targetTab = nextStatus === 'delivered' ? 'shipping' : nextStatus;
        setOrderStatusFilter(targetTab);
      }

      const label =
        nextStatus === 'confirmed'
          ? 'Đã duyệt! Đơn chuyển sang [Đã xác nhận] (Sẵn sàng xuất kho)'
          : nextStatus === 'shipping'
          ? 'Đã xuất kho! Đơn chuyển sang [Đang giao hàng]'
          : nextStatus === 'delivered'
          ? 'Đã đến nơi! Chờ khách kiểm tra và nhận hàng'
          : nextStatus === 'completed'
          ? 'Thành công! Đơn hàng đã hoàn tất giao hàng'
          : 'Đã hủy đơn hàng';
      showToast(`${label} (#${orderNumber || orderId})`);
      setTimeout(() => loadData(), 400);
    } catch (err: any) {
      showToast('Lỗi đổi trạng thái đơn: ' + err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Handle Inventory Stock Adjustments
  const handleInventoryAdjustment = async (prod: Product, direction: 'in' | 'out') => {
    const qty = Number(inventoryQuantities[prod.id]);
    if (!Number.isSafeInteger(qty) || qty <= 0) {
      showToast('Vui lòng nhập số lượng hợp lệ (> 0)');
      return;
    }
    const currentStock = prod.stock ?? 0;
    const nextStock = direction === 'in' ? currentStock + qty : Math.max(0, currentStock - qty);
    if (direction === 'out' && qty > currentStock) {
      showToast(`Tồn kho chỉ còn ${currentStock}, không thể xuất ${qty}`);
      return;
    }
    try {
      setLoading(true);
      await apiService.updateProduct(prod.id, { ...prod, stock: nextStock });
      setInventoryQuantities((prev) => ({ ...prev, [prod.id]: '' }));
      setProductList((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, stock: nextStock } : p))
      );
      showToast(`${direction === 'in' ? 'Đã nhập' : 'Đã xuất'} ${qty} sản phẩm cho "${prod.name}"`);
    } catch (err: any) {
      showToast('Không thể cập nhật tồn kho: ' + (err.message || 'Lỗi'));
    } finally {
      setLoading(false);
    }
  };

  // Derived filtered orders
  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        order.orderNumber?.toLowerCase().includes(q) ||
        order.shippingAddress?.toLowerCase().includes(q) ||
        order.items?.some((i) => i.name?.toLowerCase().includes(q)) ||
        order.paymentMethod?.toLowerCase().includes(q);
      let matchStatus = true;
      if (orderStatusFilter === 'returns') {
        matchStatus = order.returnStatus === 'pending';
      } else if (orderStatusFilter === 'shipping') {
        matchStatus = order.status === 'shipping' || order.status === 'delivered';
      } else if (orderStatusFilter !== 'all') {
        matchStatus = order.status === orderStatusFilter;
      }
      return matchSearch && matchStatus;
    });
  }, [orderList, searchTerm, orderStatusFilter]);

  // Derived filtered products for inventory
  const filteredInventory = useMemo(() => {
    return productList.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        p.name?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.category_id?.toLowerCase().includes(q);
      const s = p.stock ?? 0;
      let matchStock = true;
      if (stockFilter === 'low') matchStock = s > 0 && s <= 5;
      if (stockFilter === 'out') matchStock = s <= 0;
      return matchSearch && matchStock;
    });
  }, [productList, searchTerm, stockFilter]);

  // Metrics
  const pendingOrders = useMemo(() => orderList.filter((o) => o.status === 'pending'), [orderList]);
  const confirmedOrders = useMemo(() => orderList.filter((o) => o.status === 'confirmed'), [orderList]);
  const shippingOrders = useMemo(() => orderList.filter((o) => o.status === 'shipping' || o.status === 'delivered'), [orderList]);
  const completedOrders = useMemo(() => orderList.filter((o) => o.status === 'completed'), [orderList]);
  const returnOrders = useMemo(() => orderList.filter((o) => o.returnStatus === 'pending'), [orderList]);
  const lowStockCount = useMemo(() => productList.filter((p) => (p.stock ?? 0) <= 5).length, [productList]);

  if (!canManage) {
    return (
      <View style={[styles.container, isDark && styles.containerDark, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <View style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: 32, borderRadius: 20, maxWidth: 460, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="lock-closed" size={32} color="#2563eb" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 8, textAlign: 'center' }}>
            Khu Vực Nghiệp Vụ Nhân Viên
          </Text>
          <Text style={{ fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
            {user ? (
              <>Tài khoản hiện tại của bạn là <Text style={{ fontWeight: '700', color: '#2563eb' }}>Khách Hàng</Text>. Cổng này chỉ dành cho Nhân Viên hoặc Quản Trị Viên để xử lý đơn hàng và điều phối kho hàng.</>
            ) : (
              <>Bạn cần đăng nhập bằng tài khoản <Text style={{ fontWeight: '700', color: '#2563eb' }}>Nhân Viên</Text> hoặc Quản Trị Viên để truy cập bàn làm việc này.</>
            )}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            <Pressable
              style={{ flex: 1, backgroundColor: isDark ? '#334155' : '#f1f5f9', paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={{ fontWeight: '700', color: isDark ? '#cbd5e1' : '#475569' }}>Về Cửa Hàng</Text>
            </Pressable>
            <Pressable
              style={{ flex: 1, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
              onPress={() => {
                if (user) logout();
                router.push('/login');
              }}
            >
              <Text style={{ fontWeight: '700', color: '#ffffff' }}>{user ? 'Đổi Tài Khoản' : 'Đăng Nhập'}</Text>
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

      {/* HEADER CỔNG NHÂN VIÊN */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backBtn} onPress={() => router.push('/(tabs)' as any)}>
            <Ionicons name="storefront-outline" size={18} color="#2563eb" />
            {isDesktop && <Text style={styles.backBtnText}>Cửa hàng</Text>}
          </Pressable>

          <View style={styles.brandGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[styles.headerBrand, isDark && styles.textDark]}>DANGVINHPC</Text>
              <View style={styles.staffBadge}>
                <Ionicons name="briefcase" size={12} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={styles.staffBadgeText}>STAFF PORTAL</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, isDark && styles.textMutedDark]}>
              Bàn làm việc Nhân viên • Xử lý đơn hàng, điều phối kho & Chăm sóc khách hàng
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* User pill */}
          <View style={[styles.userPill, isDark && styles.userPillDark]}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {(user?.name ? user.name[0] : user?.email ? user.email[0] : 'S').toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={[styles.userName, isDark && styles.textDark]}>{user?.name || 'Nhân viên trực'}</Text>
              <Text style={styles.userRole}>
                {user?.role === 'admin' ? '👑 Quản Trị Viên' : '👔 Nhân Viên Cửa Hàng'}
              </Text>
            </View>
          </View>

          {isAdmin && (
            <Pressable
              style={styles.adminSwitchBtn}
              onPress={() => router.push('/admin' as any)}
            >
              <Ionicons name="shield-checkmark" size={16} color="#7c3aed" />
              {isDesktop && <Text style={styles.adminSwitchBtnText}>Admin Portal</Text>}
            </Pressable>
          )}

          <Pressable style={[styles.refreshBtn, isDark && styles.refreshBtnDark]} onPress={loadData} disabled={loading}>
            <Ionicons name="sync-outline" size={16} color="#2563eb" />
            <Text style={styles.refreshBtnText}>Làm mới</Text>
          </Pressable>

          <Pressable
            style={[styles.logoutBtn, isDark && styles.logoutBtnDark]}
            onPress={() => setLogoutModalVisible(true)}
            accessibilityLabel="Đăng xuất tài khoản"
          >
            <Ionicons name="log-out-outline" size={16} color="#dc2626" />
            {isDesktop && <Text style={styles.logoutBtnText}>Đăng xuất</Text>}
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* KPI OVERVIEW CHO NHÂN VIÊN */}
        <View style={styles.kpiGrid}>
          <Pressable
            style={[styles.kpiCard, activeTab === 'orders' && orderStatusFilter === 'pending' && styles.kpiCardActive]}
            onPress={() => {
              setActiveTab('orders');
              setOrderStatusFilter('pending');
            }}
          >
            <View style={[styles.kpiIconWrap, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
            </View>
            <View>
              <Text style={styles.kpiNumber}>{pendingOrders.length}</Text>
              <Text style={styles.kpiLabel}>Đơn chờ duyệt</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.kpiCard, activeTab === 'orders' && orderStatusFilter === 'shipping' && styles.kpiCardActive]}
            onPress={() => {
              setActiveTab('orders');
              setOrderStatusFilter('shipping');
            }}
          >
            <View style={[styles.kpiIconWrap, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="airplane" size={20} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.kpiNumber}>{shippingOrders.length}</Text>
              <Text style={styles.kpiLabel}>Đang vận chuyển</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.kpiCard, activeTab === 'inventory' && stockFilter === 'low' && styles.kpiCardActive]}
            onPress={() => {
              setActiveTab('inventory');
              setStockFilter('low');
            }}
          >
            <View style={[styles.kpiIconWrap, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="warning" size={20} color="#d97706" />
            </View>
            <View>
              <Text style={styles.kpiNumber}>{lowStockCount}</Text>
              <Text style={styles.kpiLabel}>SP sắp hết kho (≤ 5)</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.kpiCard, activeTab === 'support' && styles.kpiCardActive]}
            onPress={() => setActiveTab('support')}
          >
            <View style={[styles.kpiIconWrap, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="chatbubbles" size={20} color="#7c3aed" />
            </View>
            <View>
              <Text style={styles.kpiNumber}>{supportPendingCount}</Text>
              <Text style={styles.kpiLabel}>Tin nhắn khách chờ</Text>
            </View>
          </Pressable>
        </View>

        {/* TAB NAVIGATION CHUYÊN DỤNG */}
        <View style={styles.tabNavRow}>
          {[
            { id: 'orders', label: 'Xử lý đơn hàng', icon: 'receipt', badge: pendingOrders.length },
            { id: 'inventory', label: 'Kho hàng & Tồn kho', icon: 'swap-vertical', badge: lowStockCount > 0 ? lowStockCount : null },
            { id: 'support', label: 'Hỗ trợ khách hàng', icon: 'chatbubbles', badge: supportPendingCount > 0 ? supportPendingCount : null },
            { id: 'catalog', label: 'Tra cứu sản phẩm', icon: 'search', badge: productList.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => {
                  setActiveTab(tab.id as StaffTab);
                  setSearchTerm('');
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={isActive ? '#ffffff' : '#64748b'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {tab.label}
                </Text>
                {tab.badge !== null && tab.badge > 0 ? (
                  <View style={[styles.tabBadge, isActive ? { backgroundColor: 'rgba(255,255,255,0.25)' } : { backgroundColor: '#fee2e2' }]}>
                    <Text style={[styles.tabBadgeText, isActive ? { color: '#ffffff' } : { color: '#b91c1c' }]}>
                      {tab.badge}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* SEARCH BAR CHUNG CHO CÁC TAB */}
        {activeTab !== 'support' && (
          <View style={styles.searchBarWrap}>
            <Ionicons name="search" size={17} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder={
                activeTab === 'orders'
                  ? 'Tìm đơn hàng theo mã, địa chỉ, khách...'
                  : activeTab === 'inventory'
                  ? 'Tìm theo tên sản phẩm, mã SKU...'
                  : 'Tìm cấu hình, thông số, tên sản phẩm...'
              }
              placeholderTextColor="#94a3b8"
            />
            {searchTerm ? (
              <Pressable onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={16} color="#94a3b8" />
              </Pressable>
            ) : null}
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB 1: XỬ LÝ ĐƠN HÀNG                                   */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <View style={styles.sectionWrap}>
            {/* Bộ lọc trạng thái đơn */}
            <View style={styles.statusFilterRow}>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'pending', label: 'Chờ duyệt', count: pendingOrders.length, color: '#ef4444' },
                { id: 'confirmed', label: 'Đã xác nhận', count: confirmedOrders.length, color: '#0284c7' },
                { id: 'shipping', label: 'Đang giao hàng', count: shippingOrders.length, color: '#2563eb' },
                { id: 'completed', label: 'Hoàn thành', count: completedOrders.length, color: '#16a34a' },
                { id: 'returns', label: 'Yêu cầu đổi trả', count: returnOrders.length, color: '#d97706' },
                { id: 'cancelled', label: 'Đã hủy' },
              ].map((sf) => {
                const isSelected = orderStatusFilter === sf.id;
                return (
                  <Pressable
                    key={sf.id}
                    style={[styles.statusFilterChip, isSelected && styles.statusFilterChipActive]}
                    onPress={() => setOrderStatusFilter(sf.id)}
                  >
                    <Text style={[styles.statusFilterChipText, isSelected && styles.statusFilterChipTextActive]}>
                      {sf.label} {sf.count !== undefined && sf.count > 0 ? `(${sf.count})` : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {filteredOrders.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="receipt-outline" size={44} color="#94a3b8" />
                <Text style={styles.emptyCardText}>Không tìm thấy đơn hàng nào</Text>
              </View>
            ) : (
              <View style={styles.orderListWrap}>
                {filteredOrders.map((ord) => {
                  const statusInfo =
                    ord.status === 'pending'
                      ? { label: 'Chờ duyệt', color: '#b91c1c', bg: '#fee2e2' }
                      : ord.status === 'confirmed'
                      ? { label: 'Đã xác nhận', color: '#0369a1', bg: '#e0f2fe' }
                      : ord.status === 'shipping'
                      ? { label: 'Đang giao hàng', color: '#7c3aed', bg: '#f5f3ff' }
                      : ord.status === 'delivered'
                      ? { label: 'Đã giao tới (Chờ khách nhận)', color: '#15803d', bg: '#dcfce7' }
                      : ord.status === 'completed'
                      ? { label: 'Giao thành công', color: '#15803d', bg: '#dcfce7' }
                      : { label: 'Đã hủy', color: '#64748b', bg: '#f1f5f9' };

                  return (
                    <View key={ord.id} style={styles.orderCard}>
                      <View style={styles.orderCardHeader}>
                        <View>
                          <Text style={styles.orderNumberText}>Đơn #{ord.orderNumber}</Text>
                          <Text style={styles.orderTimeText}>
                            {new Date(ord.createdAt).toLocaleString('vi-VN')}
                          </Text>
                        </View>
                        <View style={[styles.orderStatusBadge, { backgroundColor: statusInfo.bg }]}>
                          <Text style={[styles.orderStatusBadgeText, { color: statusInfo.color }]}>
                            {statusInfo.label}
                          </Text>
                        </View>
                      </View>

                      {/* Thông tin giao hàng */}
                      <View style={styles.orderCustomerBox}>
                        <Text style={styles.orderCustomerLine}>
                          📍 <Text style={{ fontWeight: '700' }}>Địa chỉ:</Text> {ord.shippingAddress}
                        </Text>
                        <Text style={styles.orderCustomerLine}>
                          💳 <Text style={{ fontWeight: '700' }}>Thanh toán:</Text>{' '}
                          {ord.paymentMethod === 'cod' ? 'Tiền mặt khi nhận (COD)' : ord.paymentMethod} •{' '}
                          {ord.shippingMethod === 'fast' ? 'Giao nhanh' : 'Tiêu chuẩn'}
                        </Text>
                      </View>

                      {/* Cảnh báo yêu cầu đổi trả nếu có */}
                      {ord.returnStatus ? (
                        <View
                          style={[
                            styles.staffReturnBanner,
                            ord.returnStatus === 'pending' ? styles.staffReturnPending : styles.staffReturnProcessed,
                          ]}
                        >
                          <Ionicons
                            name={ord.returnStatus === 'pending' ? 'alert-circle' : 'checkmark-circle'}
                            size={16}
                            color={ord.returnStatus === 'pending' ? '#b45309' : '#15803d'}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.staffReturnTitle}>
                              {ord.returnStatus === 'pending'
                                ? `Khách yêu cầu đổi trả: ${ord.returnReason || 'Lỗi sản phẩm'}`
                                : `Trạng thái đổi trả: ${ord.returnStatus === 'approved' ? 'Đã duyệt' : 'Từ chối'}`}
                            </Text>

                            {/* Minh chứng ảnh / video khách gửi */}
                            {ord.returnMedia && ord.returnMedia.length > 0 && (
                              <View style={{ marginTop: 6 }}>
                                <Text style={styles.staffProofLabel}>
                                  📸 Minh chứng ảnh/video lỗi ({ord.returnMedia.length} file - nhấn để phóng to):
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                                  {ord.returnMedia.map((mediaUrl: string, idx: number) => {
                                    const isVideo = mediaUrl.includes('video') || mediaUrl.endsWith('.mp4');
                                    return (
                                      <Pressable
                                        key={idx}
                                        style={styles.staffProofThumb}
                                        onPress={() => setPreviewMediaUrl(mediaUrl)}
                                      >
                                        {isVideo ? (
                                          <View style={styles.staffVideoBox}>
                                            <Ionicons name="videocam" size={20} color="#ffffff" />
                                            <Text style={styles.staffVideoText}>Video lỗi</Text>
                                          </View>
                                        ) : (
                                          <>
                                            <Image source={{ uri: mediaUrl }} style={styles.staffProofImg} resizeMode="cover" />
                                            <View style={styles.staffProofZoomIcon}>
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
                          {ord.returnStatus === 'pending' && (
                            <View style={{ flexDirection: 'column', gap: 6 }}>
                              <Pressable
                                style={styles.btnApproveReturn}
                                onPress={async () => {
                                  try {
                                    await apiService.updateReturnStatus(ord.id || ord.orderNumber, 'approved');
                                    showToast(`Đã duyệt yêu cầu đổi trả cho đơn #${ord.orderNumber}`);
                                    loadData();
                                  } catch (e: any) {
                                    showToast('Lỗi: ' + e.message);
                                  }
                                }}
                              >
                                <Text style={styles.btnApproveReturnText}>Duyệt đổi hàng</Text>
                              </Pressable>
                              <Pressable
                                style={styles.btnRejectReturn}
                                onPress={async () => {
                                  try {
                                    await apiService.updateReturnStatus(ord.id || ord.orderNumber, 'rejected');
                                    showToast(`Đã từ chối đổi trả đơn #${ord.orderNumber}`);
                                    loadData();
                                  } catch (e: any) {
                                    showToast('Lỗi: ' + e.message);
                                  }
                                }}
                              >
                                <Text style={styles.btnRejectReturnText}>Từ chối</Text>
                              </Pressable>
                            </View>
                          )}
                        </View>
                      ) : null}

                      {/* Danh sách mặt hàng */}
                      <View style={styles.orderItemsWrap}>
                        {ord.items?.map((item, idx) => (
                          <View key={idx} style={styles.orderItemRow}>
                            <Text style={styles.orderItemName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.orderItemQty}>x{item.quantity}</Text>
                            <Text style={styles.orderItemPrice}>
                              {formatPrice(item.price * item.quantity)}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Footer: Tổng tiền & Nút tác vụ nhanh */}
                      <View style={styles.orderCardFooter}>
                        <View>
                          <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                          <Text style={styles.totalValue}>{formatPrice(ord.totalAmount)}</Text>
                        </View>

                        <View style={styles.actionButtonGroup}>
                          <Pressable style={styles.btnDetails} onPress={() => setViewingOrder(ord)}>
                            <Ionicons name="eye-outline" size={15} color="#2563eb" />
                            <Text style={styles.btnDetailsText}>Chi tiết</Text>
                          </Pressable>

                          {/* Quick 1-click status triggers */}
                          {ord.status === 'pending' && (
                            <>
                              <Pressable
                                style={styles.btnConfirmOrder}
                                onPress={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'confirmed', ord.orderNumber)}
                                disabled={Boolean(updatingOrderId && (String(updatingOrderId) === String(ord.id) || updatingOrderId === ord.orderNumber))}
                              >
                                <Ionicons name="checkmark-circle" size={15} color="#ffffff" />
                                <Text style={styles.btnWhiteText}>Xác nhận đơn</Text>
                              </Pressable>
                              <Pressable
                                style={styles.btnCancelOrder}
                                onPress={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'cancelled', ord.orderNumber)}
                                disabled={Boolean(updatingOrderId && (String(updatingOrderId) === String(ord.id) || updatingOrderId === ord.orderNumber))}
                              >
                                <Ionicons name="close-circle" size={15} color="#b91c1c" />
                              </Pressable>
                            </>
                          )}

                          {ord.status === 'confirmed' && (
                            <Pressable
                              style={[styles.btnShipOrder, { backgroundColor: '#0284c7' }]}
                              onPress={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'shipping', ord.orderNumber)}
                              disabled={Boolean(updatingOrderId && (String(updatingOrderId) === String(ord.id) || updatingOrderId === ord.orderNumber))}
                            >
                              <Ionicons name="airplane" size={15} color="#ffffff" />
                              <Text style={styles.btnWhiteText}>Xuất kho giao hàng</Text>
                            </Pressable>
                          )}

                          {ord.status === 'shipping' && (
                            <Pressable
                              style={[styles.btnCompleteOrder, { backgroundColor: '#16a34a' }]}
                              onPress={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'delivered', ord.orderNumber)}
                              disabled={Boolean(updatingOrderId && (String(updatingOrderId) === String(ord.id) || updatingOrderId === ord.orderNumber))}
                            >
                              <Ionicons name="checkmark-done" size={15} color="#ffffff" />
                              <Text style={styles.btnWhiteText}>Báo đã giao xong</Text>
                            </Pressable>
                          )}

                          {ord.status === 'delivered' && (
                            <Pressable
                              style={[styles.btnCompleteOrder, { backgroundColor: '#059669' }]}
                              onPress={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'completed', ord.orderNumber)}
                              disabled={Boolean(updatingOrderId && (String(updatingOrderId) === String(ord.id) || updatingOrderId === ord.orderNumber))}
                            >
                              <Ionicons name="shield-checkmark" size={15} color="#ffffff" />
                              <Text style={styles.btnWhiteText}>Chốt hoàn tất</Text>
                            </Pressable>
                          )}
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
        {/* TAB 2: KHO HÀNG & ĐIỀU PHỐI TỒN KHO                       */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <View style={styles.sectionWrap}>
            {/* Quick stock filters */}
            <View style={styles.statusFilterRow}>
              {[
                { id: 'all', label: 'Tất cả sản phẩm', count: productList.length },
                { id: 'low', label: '⚠️ Sắp hết hàng (≤ 5)', count: lowStockCount, color: '#d97706' },
                { id: 'out', label: '❌ Hết hàng (0)', count: productList.filter((p) => (p.stock ?? 0) <= 0).length, color: '#dc2626' },
              ].map((sf) => {
                const isSelected = stockFilter === sf.id;
                return (
                  <Pressable
                    key={sf.id}
                    style={[styles.statusFilterChip, isSelected && styles.statusFilterChipActive]}
                    onPress={() => setStockFilter(sf.id as any)}
                  >
                    <Text style={[styles.statusFilterChipText, isSelected && styles.statusFilterChipTextActive]}>
                      {sf.label} ({sf.count})
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.inventoryListWrap}>
              {filteredInventory.map((p) => {
                const s = p.stock ?? 0;
                const isLow = s > 0 && s <= 5;
                const isOut = s <= 0;
                return (
                  <View key={p.id} style={styles.inventoryCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.invProdName} numberOfLines={1}>{p.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <Text style={styles.invProdSku}>Mã: {p.id}</Text>
                        <Text style={styles.invProdPrice}>{formatPrice(p.price)}</Text>
                      </View>
                    </View>

                    {/* Stock badge */}
                    <View style={[styles.stockBadge, isOut ? styles.stockBadgeOut : isLow ? styles.stockBadgeLow : styles.stockBadgeOk]}>
                      <Text style={[styles.stockBadgeText, isOut ? { color: '#dc2626' } : isLow ? { color: '#d97706' } : { color: '#15803d' }]}>
                        {isOut ? 'HẾT HÀNG' : `Còn ${s} sp`}
                      </Text>
                    </View>

                    {/* Stock adjustment controls */}
                    <View style={styles.stockControlGroup}>
                      <TextInput
                        style={styles.stockInput}
                        keyboardType="numeric"
                        placeholder="SL"
                        placeholderTextColor="#94a3b8"
                        value={inventoryQuantities[p.id] || ''}
                        onChangeText={(t) =>
                          setInventoryQuantities((prev) => ({
                            ...prev,
                            [p.id]: t.replace(/[^0-9]/g, ''),
                          }))
                        }
                      />
                      <Pressable
                        style={styles.btnStockIn}
                        onPress={() => handleInventoryAdjustment(p, 'in')}
                      >
                        <Ionicons name="add" size={15} color="#059669" />
                        <Text style={styles.btnStockInText}>Nhập</Text>
                      </Pressable>
                      <Pressable
                        style={styles.btnStockOut}
                        onPress={() => handleInventoryAdjustment(p, 'out')}
                      >
                        <Ionicons name="remove" size={15} color="#dc2626" />
                        <Text style={styles.btnStockOutText}>Xuất</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* TAB 3: HỖ TRỢ KHÁCH HÀNG (TÍCH HỢP LIVE CHAT)             */}
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

        {/* ======================================================== */}
        {/* TAB 4: TRA CỨU SẢN PHẨM & CẤU HÌNH (CATALOG)             */}
        {/* ======================================================== */}
        {activeTab === 'catalog' && (
          <View style={styles.sectionWrap}>
            <View style={styles.catalogGrid}>
              {productList
                .filter((p) => {
                  const q = searchTerm.toLowerCase();
                  return (
                    p.name?.toLowerCase().includes(q) ||
                    p.id?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
                  );
                })
                .map((p) => (
                  <View key={p.id} style={styles.catalogCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.catalogName} numberOfLines={2}>{p.name}</Text>
                      <Text style={styles.catalogSku}>Mã: {p.id}</Text>
                      <Text style={styles.catalogPrice}>{formatPrice(p.price)}</Text>
                      {p.description ? (
                        <Text style={styles.catalogDesc} numberOfLines={3}>{p.description}</Text>
                      ) : null}
                    </View>
                    <View style={styles.catalogFooter}>
                      <Text style={styles.catalogStock}>Tồn kho: {p.stock ?? 0} sp</Text>
                      <Pressable
                        style={styles.btnViewWeb}
                        onPress={() => router.push(`/products/${p.id}` as any)}
                      >
                        <Text style={styles.btnViewWebText}>Xem trang khách →</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAL: XEM CHI TIẾT ĐƠN HÀNG */}
      <Modal visible={!!viewingOrder} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Chi tiết đơn hàng #{viewingOrder?.orderNumber}</Text>
                <Text style={styles.modalSub}>{viewingOrder?.createdAt ? new Date(viewingOrder.createdAt).toLocaleString('vi-VN') : ''}</Text>
              </View>
              <Pressable onPress={() => setViewingOrder(null)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400, marginVertical: 12 }}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSecTitle}>Thông tin nhận hàng:</Text>
                <Text style={styles.modalText}>📍 Địa chỉ: {viewingOrder?.shippingAddress}</Text>
                <Text style={styles.modalText}>💳 Thanh toán: {viewingOrder?.paymentMethod === 'cod' ? 'Thu hộ khi nhận hàng (COD)' : viewingOrder?.paymentMethod}</Text>
                <Text style={styles.modalText}>🚚 Phương thức: {viewingOrder?.shippingMethod === 'fast' ? 'Giao hỏa tốc' : 'Tiêu chuẩn'}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSecTitle}>Danh sách mặt hàng:</Text>
                {viewingOrder?.items?.map((item, idx) => (
                  <View key={idx} style={styles.modalItemRow}>
                    <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#0f172a' }}>{item.name}</Text>
                    <Text style={{ fontSize: 13, color: '#64748b', marginHorizontal: 8 }}>x{item.quantity}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#2563eb' }}>{formatPrice(item.price * item.quantity)}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalTotalRow}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#0f172a' }}>Tổng thanh toán:</Text>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#dc2626' }}>
                  {formatPrice(viewingOrder?.totalAmount || 0)}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable style={styles.btnSecondary} onPress={() => setViewingOrder(null)}>
                <Text style={styles.btnSecondaryText}>Đóng</Text>
              </Pressable>
              {viewingOrder?.status === 'pending' && (
                <>
                  <Pressable
                    style={[styles.btnPrimary, { backgroundColor: '#16a34a' }]}
                    onPress={() => handleUpdateOrderStatus(viewingOrder.id || viewingOrder.orderNumber, 'confirmed', viewingOrder.orderNumber)}
                  >
                    <Text style={styles.btnPrimaryText}>Xác nhận đơn</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btnSecondary, { borderColor: '#fca5a5', backgroundColor: '#fef2f2' }]}
                    onPress={() => handleUpdateOrderStatus(viewingOrder.id || viewingOrder.orderNumber, 'cancelled', viewingOrder.orderNumber)}
                  >
                    <Text style={{ color: '#dc2626', fontWeight: '700' }}>Từ chối / Hủy đơn</Text>
                  </Pressable>
                </>
              )}
              {viewingOrder?.status === 'confirmed' && (
                <Pressable
                  style={[styles.btnPrimary, { backgroundColor: '#0284c7' }]}
                  onPress={() => handleUpdateOrderStatus(viewingOrder.id || viewingOrder.orderNumber, 'shipping', viewingOrder.orderNumber)}
                >
                  <Text style={styles.btnPrimaryText}>Xuất kho giao hàng</Text>
                </Pressable>
              )}
              {viewingOrder?.status === 'shipping' && (
                <Pressable
                  style={[styles.btnPrimary, { backgroundColor: '#16a34a' }]}
                  onPress={() => handleUpdateOrderStatus(viewingOrder.id || viewingOrder.orderNumber, 'completed', viewingOrder.orderNumber)}
                >
                  <Text style={styles.btnPrimaryText}>Giao thành công</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: XÁC NHẬN ĐĂNG XUẤT */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, isDark && styles.modalBoxDark, { maxWidth: 420, alignItems: 'center', padding: 24 }]}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Ionicons name="log-out-outline" size={26} color="#dc2626" />
            </View>
            <Text style={[styles.modalTitle, isDark && styles.textDark, { textAlign: 'center', fontSize: 18 }]}>
              Đăng xuất tài khoản
            </Text>
            <Text style={{ textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b', fontSize: 13, marginTop: 8, lineHeight: 20 }}>
              Bạn có chắc chắn muốn đăng xuất khỏi bàn làm việc nhân viên không?
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 22, width: '100%' }}>
              <Pressable
                style={[styles.btnSecondary, isDark && { backgroundColor: '#334155' }, { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 10 }]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={[styles.btnSecondaryText, isDark && { color: '#cbd5e1' }]}>Hủy bỏ</Text>
              </Pressable>
              <Pressable
                style={[{ flex: 1, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 10 }]}
                onPress={handleLogout}
              >
                <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 13 }}>Đăng xuất</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: XEM ẢNH MINH CHỨNG LỖI CỦA KHÁCH */}
      <Modal visible={!!previewMediaUrl} transparent animationType="fade">
        <View style={styles.lightboxBackdrop}>
          <View style={[styles.lightboxContainer, isDark && styles.lightboxContainerDark]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  textDark: {
    color: '#f8fafc',
  },
  textMutedDark: {
    color: '#94a3b8',
  },
  toast: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
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
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
  brandGroup: {
    gap: 2,
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  staffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  staffBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  userRole: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  adminSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  adminSwitchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7c3aed',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  refreshBtnDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutBtnDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  userPillDark: {
    backgroundColor: '#1e293b',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  /* KPI OVERVIEW */
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  kpiCardActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  kpiIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiNumber: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0f172a',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 1,
  },
  /* TAB NAVIGATION */
  tabNavRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 6,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  /* SEARCH BAR */
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  /* SECTION WRAP */
  sectionWrap: {
    gap: 12,
  },
  statusFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusFilterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  statusFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  statusFilterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  emptyCardText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  /* ORDER CARD */
  orderListWrap: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumberText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  orderTimeText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderStatusBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  orderCustomerBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  orderCustomerLine: {
    fontSize: 12,
    color: '#334155',
  },
  orderItemsWrap: {
    gap: 6,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemName: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '500',
  },
  orderItemQty: {
    fontSize: 12,
    color: '#64748b',
    marginHorizontal: 12,
  },
  orderItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  totalLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#dc2626',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  btnDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  btnDetailsText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  btnConfirmOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#059669',
  },
  btnCancelOrder: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  btnShipOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  btnCompleteOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#16a34a',
  },
  btnWhiteText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  /* INVENTORY */
  inventoryListWrap: {
    gap: 8,
  },
  inventoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  invProdName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  invProdSku: {
    fontSize: 11,
    color: '#64748b',
  },
  invProdPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeOk: {
    backgroundColor: '#dcfce7',
  },
  stockBadgeLow: {
    backgroundColor: '#fef3c7',
  },
  stockBadgeOut: {
    backgroundColor: '#fee2e2',
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  stockControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockInput: {
    width: 44,
    height: 32,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  btnStockIn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnStockInText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
  },
  btnStockOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnStockOutText: {
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: '800',
  },
  /* CATALOG */
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  catalogCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  catalogName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  catalogSku: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  catalogPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#dc2626',
    marginTop: 4,
  },
  catalogDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  catalogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  catalogStock: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  btnViewWeb: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
  },
  btnViewWebText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  /* MODAL */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    maxWidth: 520,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  modalBoxDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  modalSection: {
    marginVertical: 6,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    gap: 4,
  },
  modalSecTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  modalText: {
    fontSize: 12,
    color: '#475569',
  },
  modalItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  btnSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#059669',
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  /* STAFF RETURN REQUEST BANNER */
  staffReturnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 14,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  staffReturnPending: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  staffReturnProcessed: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  staffReturnTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  btnApproveReturn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnApproveReturnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  btnRejectReturn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnRejectReturnText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
  },
  staffProofLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  staffProofThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  staffProofZoomIcon: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 4,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffProofImg: {
    width: '100%',
    height: '100%',
  },
  staffVideoBox: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
  },
  staffVideoText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 2,
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
});
