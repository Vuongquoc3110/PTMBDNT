import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { apiService, type Order } from '@/services/api';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xác nhận', color: '#d97706', bg: '#fef3c7' },
  confirmed: { label: 'Đã xác nhận', color: '#2563eb', bg: '#dbeafe' },
  shipping: { label: 'Đang giao', color: '#7c3aed', bg: '#ede9fe' },
  completed: { label: 'Hoàn thành', color: '#16a34a', bg: '#dcfce7' },
  cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2' },
};

const formatPrice = (value: number) => `${value.toLocaleString('vi-VN')} ₫`;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

export default function OrdersTabScreen() {
  const { user } = useAppContext();
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
      setOrders(data);
    } catch (err: any) {
      setError('Không thể tải đơn hàng. Kiểm tra kết nối API.');
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'completed', label: 'Hoàn thành' },
  ];

  const filteredOrders = activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter);

  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const shippingCount = orders.filter(o => o.status === 'shipping').length;

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.errorIcon}>⚠️</Text>
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
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadOrders(true)} />}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Đơn hàng</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{orders.length} đơn</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: '#dbeafe' }]}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Tổng đơn</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#fef3c7' }]}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Chờ xử lý</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#ede9fe' }]}>
          <Text style={styles.statNumber}>{shippingCount}</Text>
          <Text style={styles.statLabel}>Đang giao</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#dcfce7' }]}>
          <Text style={styles.statNumber}>{formatPrice(totalAmount)}</Text>
          <Text style={styles.statLabel}>Tổng tiền</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filters.map(f => (
          <Pressable
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
        </View>
      ) : (
        filteredOrders.map(order => {
          const statusInfo = statusConfig[order.status] || statusConfig.pending;
          return (
            <Link key={order.id} href={{ pathname: '/orders/[id]', params: { id: String(order.id) } } as any} asChild>
              <Pressable style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                  </View>
                </View>

                <View style={styles.itemsSummary}>
                  {order.items.slice(0, 2).map((item, idx) => (
                    <Text key={idx} style={styles.itemText} numberOfLines={1}>
                      • {item.name} x{item.quantity}
                    </Text>
                  ))}
                  {order.items.length > 2 && (
                    <Text style={styles.moreItems}>+{order.items.length - 2} sản phẩm khác</Text>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.totalLabel}>Tổng tiền</Text>
                  <Text style={styles.totalValue}>{formatPrice(order.totalAmount)}</Text>
                </View>
              </Pressable>
            </Link>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8ff',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f8ff',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 15,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  headerBadgeText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
    paddingVertical: 2,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfeafc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfeafc',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#60a5fa',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  orderDate: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },
  itemsSummary: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  itemText: {
    color: '#334155',
    fontSize: 14,
    marginBottom: 4,
  },
  moreItems: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  totalLabel: {
    color: '#64748b',
    fontSize: 14,
  },
  totalValue: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
});
