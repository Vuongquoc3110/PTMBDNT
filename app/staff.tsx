import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  const { user, isAdmin, isStaff, canManage, isDark } = useAppContext();

  const [activeTab, setActiveTab] = useState<StaffTab>('orders');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
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
  }, [loadData]);

  // Handle Order Status Transitions
  const handleUpdateOrderStatus = async (orderId: number, nextStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await apiService.updateOrderStatus(orderId, nextStatus);
      setOrderList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
      if (viewingOrder?.id === orderId) {
        setViewingOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
      const label =
        nextStatus === 'confirmed'
          ? 'Đã duyệt đơn'
          : nextStatus === 'shipping'
          ? 'Đang giao hàng'
          : nextStatus === 'completed'
          ? 'Đã hoàn thành'
          : 'Đã hủy đơn';
      showToast(`${label} cho đơn hàng #${orderId}`);
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
      const matchStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
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
  const shippingOrders = useMemo(() => orderList.filter((o) => o.status === 'shipping'), [orderList]);
  const lowStockCount = useMemo(() => productList.filter((p) => (p.stock ?? 0) <= 5).length, [productList]);

  if (user && user.role === 'customer') {
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
            Tài khoản hiện tại của bạn là <Text style={{ fontWeight: '700', color: '#2563eb' }}>Khách Hàng</Text>. Cổng này chỉ dành cho Nhân Viên hoặc Quản Trị Viên để xử lý đơn hàng và điều phối kho hàng.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            <Pressable
              style={{ flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={{ fontWeight: '700', color: '#475569' }}>Về Cửa Hàng</Text>
            </Pressable>
            <Pressable
              style={{ flex: 1, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
              onPress={() => router.push('/login')}
            >
              <Text style={{ fontWeight: '700', color: '#ffffff' }}>Đổi Tài Khoản</Text>
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
          <View style={styles.userPill}>
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

          <Pressable style={styles.refreshBtn} onPress={loadData} disabled={loading}>
            <Ionicons name="sync-outline" size={16} color="#2563eb" />
            <Text style={styles.refreshBtnText}>Làm mới</Text>
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
                { id: 'confirmed', label: 'Đã xác nhận' },
                { id: 'shipping', label: 'Đang giao hàng', count: shippingOrders.length, color: '#2563eb' },
                { id: 'completed', label: 'Hoàn thành' },
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
                      ? { label: 'Đang giao hàng', color: '#1d4ed8', bg: '#dbeafe' }
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
                                onPress={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                                disabled={updatingOrderId === ord.id}
                              >
                                <Ionicons name="checkmark-circle" size={15} color="#ffffff" />
                                <Text style={styles.btnWhiteText}>Duyệt đơn</Text>
                              </Pressable>
                              <Pressable
                                style={styles.btnCancelOrder}
                                onPress={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                                disabled={updatingOrderId === ord.id}
                              >
                                <Ionicons name="close-circle" size={15} color="#b91c1c" />
                              </Pressable>
                            </>
                          )}

                          {ord.status === 'confirmed' && (
                            <Pressable
                              style={styles.btnShipOrder}
                              onPress={() => handleUpdateOrderStatus(ord.id, 'shipping')}
                              disabled={updatingOrderId === ord.id}
                            >
                              <Ionicons name="airplane" size={15} color="#ffffff" />
                              <Text style={styles.btnWhiteText}>Xuất kho giao</Text>
                            </Pressable>
                          )}

                          {ord.status === 'shipping' && (
                            <Pressable
                              style={styles.btnCompleteOrder}
                              onPress={() => handleUpdateOrderStatus(ord.id, 'completed')}
                              disabled={updatingOrderId === ord.id}
                            >
                              <Ionicons name="checkmark-done" size={15} color="#ffffff" />
                              <Text style={styles.btnWhiteText}>Đã giao xong</Text>
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
                <Pressable
                  style={styles.btnPrimary}
                  onPress={() => handleUpdateOrderStatus(viewingOrder.id, 'confirmed')}
                >
                  <Text style={styles.btnPrimaryText}>Xác nhận đơn ngay</Text>
                </Pressable>
              )}
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
});
