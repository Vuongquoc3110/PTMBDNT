import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { formatPrice, getProductFallbackImage, isInvalidOrBlockedImageUrl } from '@/data/products';
import { apiService, type Order } from '@/services/api';

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  pending: {
    label: 'Chờ xác nhận',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: 'time-outline',
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: 'checkmark-circle-outline',
  },
  shipping: {
    label: 'Đang giao hàng',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: 'bicycle-outline',
  },
  completed: {
    label: 'Đã hoàn thành',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: 'checkmark-done-outline',
  },
  cancelled: {
    label: 'Đã hủy',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: 'close-circle-outline',
  },
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Hôm nay';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Gần đây';
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

function parseOrderItems(rawItems: any): any[] {
  if (!rawItems) return [];
  if (Array.isArray(rawItems)) return rawItems;
  if (typeof rawItems === 'string') {
    try {
      const parsed = JSON.parse(rawItems);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function OrdersTabScreen() {
  const router = useRouter();
  const { user, addToCart } = useAppContext();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await apiService.getOrders(user?.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const counts = useMemo(() => {
    const list = orders || [];
    return {
      all: list.length,
      pending: list.filter((o) => o?.status === 'pending').length,
      shipping: list.filter((o) => o?.status === 'shipping').length,
      completed: list.filter((o) => o?.status === 'completed').length,
    };
  }, [orders]);

  const filters = useMemo(() => [
    { key: 'all', label: 'Tất cả', count: counts.all },
    { key: 'pending', label: 'Chờ xác nhận', count: counts.pending },
    { key: 'shipping', label: 'Đang giao', count: counts.shipping },
    { key: 'completed', label: 'Hoàn thành', count: counts.completed },
  ], [counts]);

  const filteredOrders = useMemo(() => {
    const list = orders || [];
    if (activeFilter === 'all') return list;
    return list.filter((o) => o?.status === activeFilter);
  }, [orders, activeFilter]);

  const totalSpent = useMemo(() => {
    return (orders || [])
      .filter((o) => o && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o?.totalAmount) || 0), 0);
  }, [orders]);

  const handleReorder = (order: Order, e: any) => {
    e?.stopPropagation?.();
    const items = parseOrderItems(order.items);
    if (items.length > 0) {
      items.forEach((item) => {
        const itemImage =
          item?.image && !isInvalidOrBlockedImageUrl(item.image)
            ? item.image
            : getProductFallbackImage({ id: item?.productId, name: item?.name });

        addToCart({
          id: item?.productId || 'reorder',
          name: item?.name || 'Sản phẩm',
          price: Number(item?.price) || 0,
          image: itemImage,
          qty: Number(item?.quantity) || 1,
          spec: item?.selectedConfig || '',
          category: 'Tech',
          selected: true,
        });
      });
      router.push('/cart' as any);
    }
  };

  const handleOpenDetail = (orderId: number | string) => {
    router.push({
      pathname: '/orders/[id]',
      params: { id: String(orderId) },
    } as any);
  };

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải lịch sử đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerState}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" style={{ marginBottom: 12 }} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadOrders(false)}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadOrders(true)} />}
    >
      {/* 1. CLEAN MODERN HEADER */}
      <View style={styles.headerBlock}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Đơn hàng của tôi</Text>
          <Text style={styles.subtitle}>
            Theo dõi hành trình vận chuyển và quản lý hóa đơn mua sắm
          </Text>
        </View>

        {totalSpent > 0 && (
          <View style={styles.summaryBadge}>
            <Ionicons name="wallet-outline" size={15} color="#2563eb" />
            <Text style={styles.summaryBadgeText}>
              Đã tích lũy: <Text style={{ fontWeight: '800', color: '#1d4ed8' }}>{formatPrice(totalSpent)}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* 2. MINIMALIST SEGMENTED TABS */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <Pressable
                key={f.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {f.label}
                </Text>
                {f.count > 0 && (
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                      {f.count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. ORDER CARDS LIST */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="bag-handle-outline" size={44} color="#94a3b8" />
          </View>
          <Text style={styles.emptyTitle}>Chưa có đơn hàng nào ở mục này</Text>
          <Text style={styles.emptySubtitle}>
            Hàng ngàn máy tính, linh kiện PC và phụ kiện chính hãng đang chờ bạn khám phá.
          </Text>
          <Pressable style={styles.shopNowBtn} onPress={() => router.push('/products' as any)}>
            <Ionicons name="cart" size={16} color="#ffffff" />
            <Text style={styles.shopNowBtnText}>Khám phá sản phẩm ngay</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.orderListWrap}>
          {filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.pending;
            const items = parseOrderItems(order.items);
            const firstItem = items[0];
            const otherItemsCount = Math.max(0, items.length - 1);
            const totalQuantity = items.reduce((sum: number, it: any) => sum + (Number(it?.quantity) || 1), 0) || 1;

            const itemImage =
              firstItem?.image && !isInvalidOrBlockedImageUrl(firstItem.image)
                ? firstItem.image
                : getProductFallbackImage({
                    id: firstItem?.productId,
                    name: firstItem?.name || order.orderNumber,
                  });

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* CARD HEADER */}
                <View style={styles.orderCardHeader}>
                  <View style={styles.orderNumberGroup}>
                    <Ionicons name="receipt-outline" size={16} color="#2563eb" />
                    <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
                    <Text style={styles.orderHeaderDot}>•</Text>
                    <Text style={styles.orderDateText}>{formatDate(order.createdAt)}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: statusInfo.bg, borderColor: statusInfo.border },
                    ]}
                  >
                    <Ionicons name={statusInfo.icon} size={13} color={statusInfo.color} style={{ marginRight: 4 }} />
                    <Text style={[styles.statusPillText, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                {/* CARD BODY: ITEM DETAILS WITH THUMBNAIL */}
                <Pressable
                  style={styles.orderItemBody}
                  onPress={() => handleOpenDetail(order.id)}
                >
                  <Image
                    source={{ uri: itemImage }}
                    style={styles.itemThumb}
                    resizeMode="contain"
                    {...({ referrerPolicy: 'no-referrer' } as any)}
                  />

                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {firstItem?.name || 'Sản phẩm công nghệ DANGVINHPC'}
                    </Text>

                    <View style={styles.itemMetaRow}>
                      {firstItem?.selectedConfig ? (
                        <View style={styles.configPill}>
                          <Text style={styles.configPillText}>{firstItem.selectedConfig}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.itemQuantityText}>
                        Số lượng: <Text style={{ fontWeight: '700', color: '#0f172a' }}>x{firstItem?.quantity || 1}</Text>
                      </Text>
                    </View>

                    {otherItemsCount > 0 && (
                      <Text style={styles.moreItemsText}>
                        +{otherItemsCount} sản phẩm khác trong đơn hàng này
                      </Text>
                    )}
                  </View>

                  <View style={styles.itemPriceCol}>
                    <Text style={styles.itemPriceValue}>
                      {formatPrice(firstItem?.price || order.totalAmount)}
                    </Text>
                  </View>
                </Pressable>

                {/* DELIVERY ADDRESS ROW */}
                {order.shippingAddress ? (
                  <View style={styles.orderAddressRow}>
                    <Ionicons name="location-outline" size={14} color="#64748b" />
                    <Text style={styles.orderAddressText} numberOfLines={1}>
                      <Text style={{ fontWeight: '700', color: '#475569' }}>Giao đến: </Text>
                      {order.shippingAddress}
                    </Text>
                  </View>
                ) : null}

                {/* CARD FOOTER */}
                <View style={styles.orderCardFooter}>
                  <View style={styles.totalAmountGroup}>
                    <Text style={styles.totalAmountLabel}>
                      Tổng thanh toán ({totalQuantity} món):
                    </Text>
                    <Text style={styles.totalAmountValue}>
                      {formatPrice(order.totalAmount)}
                    </Text>
                  </View>

                  <View style={styles.actionBtnGroup}>
                    <Pressable
                      style={styles.detailOutlineBtn}
                      onPress={() => handleOpenDetail(order.id)}
                    >
                      <Text style={styles.detailOutlineBtnText}>Xem chi tiết</Text>
                    </Pressable>

                    {order.status === 'completed' ? (
                      <Pressable
                        style={styles.reorderPrimaryBtn}
                        onPress={(e) => handleReorder(order, e)}
                      >
                        <Ionicons name="refresh" size={14} color="#ffffff" style={{ marginRight: 4 }} />
                        <Text style={styles.reorderPrimaryBtnText}>Mua lại</Text>
                      </Pressable>
                    ) : order.status === 'shipping' ? (
                      <Pressable
                        style={[styles.reorderPrimaryBtn, { backgroundColor: '#7c3aed' }]}
                        onPress={() => handleOpenDetail(order.id)}
                      >
                        <Ionicons name="location-outline" size={14} color="#ffffff" style={{ marginRight: 4 }} />
                        <Text style={styles.reorderPrimaryBtnText}>Theo dõi</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.reorderPrimaryBtn}
                        onPress={() => handleOpenDetail(order.id)}
                      >
                        <Text style={styles.reorderPrimaryBtnText}>Chi tiết đơn</Text>
                        <Ionicons name="chevron-forward" size={14} color="#ffffff" style={{ marginLeft: 2 }} />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 90,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  contentDesktop: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },

  /* HEADER */
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  headerTitleWrap: {
    flex: 1,
    minWidth: 240,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 18,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  summaryBadgeText: {
    fontSize: 12,
    color: '#1e40af',
  },

  /* TABS */
  tabsContainer: {
    marginBottom: 16,
  },
  tabsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  tabLabelActive: {
    color: '#ffffff',
  },
  tabBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tabBadgeTextActive: {
    color: '#ffffff',
  },

  /* ORDER CARD */
  orderListWrap: {
    gap: 14,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  orderNumberGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  orderNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderHeaderDot: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  orderDateText: {
    fontSize: 12,
    color: '#64748b',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* ORDER BODY */
  orderItemBody: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
    alignItems: 'center',
  },
  itemThumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
    marginBottom: 4,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  configPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  configPillText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  itemQuantityText: {
    fontSize: 12,
    color: '#64748b',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 5,
  },
  itemPriceCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemPriceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  orderAddressText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },

  /* ORDER FOOTER */
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexWrap: 'wrap',
    gap: 12,
  },
  totalAmountGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  totalAmountLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  totalAmountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#dc2626',
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailOutlineBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  detailOutlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  reorderPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  reorderPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* EMPTY STATE */
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 12,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 19,
    marginBottom: 20,
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  shopNowBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
