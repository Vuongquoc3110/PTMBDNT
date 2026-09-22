import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { Header } from '@/components/Header';
import { formatPrice, products as fallbackProducts } from '@/data/products';
import { apiService, type Order } from '@/services/api';
import { useAppContext } from '@/context/AppContext';

const statusConfig: Record<
  string,
  { label: string; desc: string; color: string; bg: string; border: string; stepIndex: number; icon: keyof typeof Ionicons.glyphMap }
> = {
  pending: {
    label: 'Chờ xác nhận',
    desc: 'Đơn hàng đang chờ nhân viên DANGVINHPC kiểm tra và đóng gói',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    stepIndex: 1,
    icon: 'time',
  },
  confirmed: {
    label: 'Đã xác nhận',
    desc: 'Đơn hàng đã được duyệt và đang chuẩn bị xuất kho',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    stepIndex: 2,
    icon: 'checkmark-circle',
  },
  shipping: {
    label: 'Đang giao hàng',
    desc: 'Đơn hàng đang trên đường vận chuyển tới địa chỉ của bạn',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    stepIndex: 3,
    icon: 'bicycle',
  },
  completed: {
    label: 'Giao hàng thành công',
    desc: 'Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    stepIndex: 4,
    icon: 'checkmark-done-circle',
  },
  cancelled: {
    label: 'Đã hủy đơn',
    desc: 'Đơn hàng này đã được hủy bởi khách hàng hoặc quản trị viên',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    stepIndex: 0,
    icon: 'close-circle',
  },
};

const paymentLabels: Record<string, { name: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  cod: { name: 'Thanh toán tiền mặt khi nhận hàng (COD)', icon: 'cash-outline', color: '#16a34a' },
  banking: { name: 'Chuyển khoản VNPAY / Ngân hàng', icon: 'qr-code-outline', color: '#2563eb' },
  vnpay: { name: 'VNPAY QR Cổng thanh toán', icon: 'card-outline', color: '#2563eb' },
  momo: { name: 'Ví điện tử MoMo', icon: 'wallet-outline', color: '#d946ef' },
};

const shippingLabels: Record<string, string> = {
  standard: 'Giao hàng tiêu chuẩn (1 - 3 ngày làm việc)',
  express: 'Giao hàng hỏa tốc (Trong vòng 24 giờ)',
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} lúc ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 960;

  const { addToCart, user } = useAppContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadOrder = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getOrderById(Number(id));
      setOrder(data);
    } catch (err) {
      setError('Không tìm thấy thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (typeof window !== 'undefined') {
      const confirm = window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${order.orderNumber} không?`);
      if (!confirm) return;
    }

    try {
      setCancelling(true);
      await apiService.cancelOrder(order.id);
      setOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
      showToast('Đã hủy đơn hàng thành công!');
    } catch (e: any) {
      showToast(e.message || 'Không thể hủy đơn hàng lúc này');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((it) => {
      const p = fallbackProducts.find((x) => x.id === it.productId || x.name === it.name) || {
        id: it.productId,
        name: it.name,
        price: it.price,
        image: it.image,
      };
      addToCart(p, it.quantity);
    });
    showToast('Đã thêm các sản phẩm vào giỏ hàng!');
    setTimeout(() => {
      router.push('/cart' as any);
    }, 800);
  };

  if (loading) {
    return (
      <View style={styles.page}>
        <Header />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
        </View>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.page}>
        <Header />
        <View style={styles.centerBox}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="receipt-outline" size={48} color="#94a3b8" />
          </View>
          <Text style={styles.emptyTitle}>Không tìm thấy đơn hàng</Text>
          <Text style={styles.emptySubtitle}>
            {error || 'Mã đơn hàng không tồn tại hoặc bạn không có quyền xem đơn này.'}
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/(tabs)/explore' as any)}>
            <Ionicons name="arrow-back" size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.primaryBtnText}>Xem danh sách đơn hàng</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const paymentInfo = paymentLabels[order.paymentMethod] || {
    name: order.paymentMethod,
    icon: 'cash-outline',
    color: '#475569',
  };

  const steps = [
    { key: 1, title: 'Đặt hàng', icon: 'bag-check-outline' },
    { key: 2, title: 'Xác nhận', icon: 'cube-outline' },
    { key: 3, title: 'Vận chuyển', icon: 'bicycle-outline' },
    { key: 4, title: 'Thành công', icon: 'checkmark-done-circle-outline' },
  ];

  return (
    <View style={styles.page}>
      <Header />

      {/* TOAST ALERT */}
      {toast ? (
        <View style={styles.toastWrap}>
          <Ionicons name="information-circle" size={20} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* TOP BREADCRUMB BAR */}
          <View style={styles.breadcrumbBar}>
            <View style={styles.breadcrumbLeft}>
              <Pressable style={styles.backBtn} onPress={() => router.push('/(tabs)/explore' as any)}>
                <Ionicons name="arrow-back" size={18} color="#2563eb" />
                <Text style={styles.backBtnText}>Danh sách đơn</Text>
              </Pressable>

              <View style={styles.breadcrumbPath}>
                <Link href="/(tabs)" style={styles.breadcrumbLink}>Trang chủ</Link>
                <Text style={styles.breadcrumbSep}>/</Text>
                <Link href={'/(tabs)/explore' as any} style={styles.breadcrumbLink}>Đơn hàng</Link>
                <Text style={styles.breadcrumbSep}>/</Text>
                <Text style={styles.breadcrumbCurrent}>#{order.orderNumber}</Text>
              </View>
            </View>

            <View style={styles.orderNumberBadge}>
              <Text style={styles.orderNumberBadgeText}>MÃ ĐƠN: {order.orderNumber}</Text>
            </View>
          </View>

          {/* STATUS HERO BANNER */}
          <View style={[styles.statusHero, { backgroundColor: statusInfo.bg, borderColor: statusInfo.border }]}>
            <View style={styles.statusHeroTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={[styles.statusIconWrap, { backgroundColor: '#ffffff', shadowColor: statusInfo.color }]}>
                  <Ionicons name={statusInfo.icon} size={28} color={statusInfo.color} />
                </View>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                    <View style={[styles.statusPill, { backgroundColor: statusInfo.color }]}>
                      <Text style={styles.statusPillText}>Đơn #{order.id}</Text>
                    </View>
                  </View>
                  <Text style={styles.statusDesc}>{statusInfo.desc}</Text>
                </View>
              </View>

              <View style={styles.orderDateCol}>
                <Text style={styles.orderDateLabel}>Thời gian tạo đơn</Text>
                <Text style={styles.orderDateValue}>{formatDate(order.createdAt)}</Text>
              </View>
            </View>

            {/* PROGRESS STEPPER (IF NOT CANCELLED) */}
            {order.status !== 'cancelled' ? (
              <View style={styles.stepperWrap}>
                <View style={styles.stepperLineTrack}>
                  <View
                    style={[
                      styles.stepperLineFill,
                      {
                        width:
                          statusInfo.stepIndex === 1
                            ? '12%'
                            : statusInfo.stepIndex === 2
                            ? '42%'
                            : statusInfo.stepIndex === 3
                            ? '75%'
                            : '100%',
                      },
                    ]}
                  />
                </View>

                <View style={styles.stepperStepsRow}>
                  {steps.map((st) => {
                    const isPassed = statusInfo.stepIndex >= st.key;
                    const isCurrent = statusInfo.stepIndex === st.key;
                    return (
                      <View key={st.key} style={styles.stepItem}>
                        <View
                          style={[
                            styles.stepCircle,
                            isPassed && styles.stepCirclePassed,
                            isCurrent && styles.stepCircleCurrent,
                          ]}
                        >
                          <Ionicons
                            name={isPassed ? 'checkmark' : (st.icon as any)}
                            size={14}
                            color={isPassed ? '#ffffff' : '#94a3b8'}
                          />
                        </View>
                        <Text
                          style={[
                            styles.stepLabel,
                            isPassed && styles.stepLabelPassed,
                            isCurrent && styles.stepLabelCurrent,
                          ]}
                        >
                          {st.title}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>

          {/* MAIN 2-COLUMN LAYOUT */}
          <View style={[styles.mainGrid, { flexDirection: isDesktop ? 'row' : 'column' }]}>
            {/* LEFT COLUMN: PRODUCTS & TIMELINE */}
            <View style={[styles.leftCol, isDesktop && { flex: 1.5 }]}>
              {/* PRODUCTS LIST CARD */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="cube" size={20} color="#2563eb" />
                    <Text style={styles.cardTitle}>
                      Danh sách sản phẩm ({order.items.length})
                    </Text>
                  </View>
                  <Text style={styles.cardSubCount}>Kiểm tra đóng gói chính hãng</Text>
                </View>

                <View style={styles.itemsList}>
                  {order.items.map((item, idx) => {
                    // Fallback lookup image if not present in item
                    const matchingProduct = fallbackProducts.find(
                      (p) => p.id === item.productId || p.name === item.name
                    );
                    const imageUri =
                      item.image ||
                      matchingProduct?.image ||
                      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80';

                    return (
                      <View
                        key={idx}
                        style={[
                          styles.productRow,
                          idx < order.items.length - 1 && styles.productRowBorder,
                        ]}
                      >
                        <Image source={{ uri: imageUri }} style={styles.productThumb} />

                        <View style={styles.productInfo}>
                          <Text style={styles.productCategory}>
                            {matchingProduct?.category || 'Linh Kiện Cao Cấp'}
                          </Text>
                          <Text style={styles.productName} numberOfLines={2}>
                            {item.name}
                          </Text>
                          <View style={styles.productPriceRow}>
                            <Text style={styles.unitPrice}>
                              {formatPrice(item.price)}
                            </Text>
                            <View style={styles.quantityTag}>
                              <Text style={styles.quantityText}>x{item.quantity}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.productSubtotalCol}>
                          <Text style={styles.subtotalText}>
                            {formatPrice(item.price * item.quantity)}
                          </Text>
                          {item.productId && (
                            <Link
                              href={{ pathname: '/products/[id]', params: { id: item.productId } } as any}
                              style={styles.viewProductLink}
                            >
                              <Text style={styles.viewProductLinkText}>Xem chi tiết</Text>
                            </Link>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* TIMELINE & TRACKING NOTE */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="navigate" size={20} color="#2563eb" />
                    <Text style={styles.cardTitle}>Tiến trình & Lịch sử đơn</Text>
                  </View>
                </View>

                <View style={styles.timelineList}>
                  <View style={styles.timelineNode}>
                    <View style={[styles.timelineDotCircle, { backgroundColor: '#16a34a' }]}>
                      <Ionicons name="checkmark" size={12} color="#ffffff" />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineAction}>Đặt hàng thành công</Text>
                      <Text style={styles.timelineSub}>
                        Hệ thống đã ghi nhận đơn hàng và gửi xác nhận vào tài khoản.
                      </Text>
                      <Text style={styles.timelineTime}>{formatDate(order.createdAt)}</Text>
                    </View>
                  </View>

                  {order.status !== 'pending' && (
                    <View style={styles.timelineNode}>
                      <View
                        style={[
                          styles.timelineDotCircle,
                          {
                            backgroundColor:
                              order.status === 'cancelled' ? '#dc2626' : '#2563eb',
                          },
                        ]}
                      >
                        <Ionicons
                          name={order.status === 'cancelled' ? 'close' : 'sync'}
                          size={12}
                          color="#ffffff"
                        />
                      </View>
                      <View style={styles.timelineContent}>
                        <Text style={styles.timelineAction}>
                          {order.status === 'cancelled'
                            ? 'Đơn hàng đã được hủy'
                            : order.status === 'completed'
                            ? 'Đã giao hàng thành công'
                            : 'Đang chuẩn bị hàng / Đang vận chuyển'}
                        </Text>
                        <Text style={styles.timelineSub}>
                          Cập nhật trạng thái tự động bởi ban quản trị DANGVINHPC.
                        </Text>
                        <Text style={styles.timelineTime}>
                          {formatDate(order.updatedAt || order.createdAt)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN: SHIPPING, PAYMENT, TOTAL & ACTIONS */}
            <View style={[styles.rightCol, isDesktop && { flex: 1 }]}>
              {/* SHIPPING ADDRESS CARD */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="location" size={18} color="#2563eb" />
                    <Text style={styles.cardTitle}>Thông tin nhận hàng</Text>
                  </View>
                </View>

                <View style={styles.addressBox}>
                  <View style={styles.addressUserRow}>
                    <Text style={styles.addressName}>{user?.name || 'Khách hàng'}</Text>
                    <Text style={styles.addressPhone}>({user?.phone || '0909 123 456'})</Text>
                  </View>
                  <Text style={styles.addressDetail}>{order.shippingAddress}</Text>
                  <View style={styles.safeBadge}>
                    <Ionicons name="shield-checkmark" size={14} color="#16a34a" />
                    <Text style={styles.safeBadgeText}>Giao hàng bảo hiểm 100% giá trị linh kiện</Text>
                  </View>
                </View>
              </View>

              {/* PAYMENT & LOGISTICS CARD */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="card" size={18} color="#2563eb" />
                    <Text style={styles.cardTitle}>Vận chuyển & Thanh toán</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Đơn vị giao hàng</Text>
                  <Text style={styles.detailValue}>
                    {shippingLabels[order.shippingMethod] || 'Giao hàng tiêu chuẩn DPC Express'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hình thức thanh toán</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                    <Ionicons name={paymentInfo.icon} size={16} color={paymentInfo.color} />
                    <Text style={[styles.detailValue, { color: paymentInfo.color }]}>
                      {paymentInfo.name}
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0, marginBottom: 0 }]}>
                  <Text style={styles.detailLabel}>Tình trạng thanh toán</Text>
                  <View
                    style={[
                      styles.paymentStatusBadge,
                      {
                        backgroundColor:
                          order.paymentMethod === 'cod' && order.status !== 'completed'
                            ? '#fffbeb'
                            : '#f0fdf4',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.paymentStatusText,
                        {
                          color:
                            order.paymentMethod === 'cod' && order.status !== 'completed'
                              ? '#d97706'
                              : '#16a34a',
                        },
                      ]}
                    >
                      {order.paymentMethod === 'cod' && order.status !== 'completed'
                        ? 'Thanh toán khi nhận hàng'
                        : 'Đã hoàn tất thanh toán'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* PAYMENT SUMMARY CARD */}
              <View style={[styles.card, styles.summaryCard]}>
                <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Bảng tính chi phí</Text>

                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Tạm tính tiền hàng</Text>
                  <Text style={styles.costVal}>
                    {formatPrice(order.totalAmount)}
                  </Text>
                </View>

                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Phí giao hàng toàn quốc</Text>
                  <Text style={[styles.costVal, { color: '#16a34a' }]}>MIỄN PHÍ</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.finalTotalRow}>
                  <View>
                    <Text style={styles.finalTotalLabel}>Tổng thanh toán</Text>
                    <Text style={styles.vatNote}>(Đã bao gồm thuế GTGT VAT)</Text>
                  </View>
                  <Text style={styles.finalTotalVal}>
                    {formatPrice(order.totalAmount)}
                  </Text>
                </View>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.actionsWrap}>
                <Pressable style={styles.reorderBtn} onPress={handleReorder}>
                  <Ionicons name="reload" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.reorderBtnText}>Mua lại đơn hàng này</Text>
                </Pressable>

                {order.status === 'pending' && (
                  <Pressable
                    style={[styles.cancelBtn, cancelling && { opacity: 0.6 }]}
                    onPress={handleCancelOrder}
                    disabled={cancelling}
                  >
                    <Ionicons name="close-circle-outline" size={18} color="#dc2626" style={{ marginRight: 8 }} />
                    <Text style={styles.cancelBtnText}>
                      {cancelling ? 'Đang xử lý...' : 'Hủy đơn hàng này'}
                    </Text>
                  </Pressable>
                )}

                <View style={styles.supportBox}>
                  <Ionicons name="headset-outline" size={18} color="#64748b" />
                  <Text style={styles.supportText}>
                    Cần hỗ trợ về đơn hàng? Gọi ngay{' '}
                    <Text style={{ fontWeight: '800', color: '#2563eb' }}>1900 8888</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    minHeight: 400,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 400,
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  /* BREADCRUMB */
  breadcrumbBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  breadcrumbLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 6,
  },
  backBtnText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
  breadcrumbPath: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breadcrumbLink: {
    fontSize: 13,
    color: '#64748b',
  },
  breadcrumbSep: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderNumberBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orderNumberBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },

  /* STATUS HERO BANNER */
  statusHero: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statusHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statusIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  statusDesc: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  orderDateCol: {
    alignItems: 'flex-end',
  },
  orderDateLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  orderDateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },

  /* STEPPER */
  stepperWrap: {
    marginTop: 10,
    position: 'relative',
  },
  stepperLineTrack: {
    position: 'absolute',
    top: 14,
    left: '8%',
    right: '8%',
    height: 3,
    backgroundColor: '#cbd5e1',
    zIndex: 1,
  },
  stepperLineFill: {
    height: 3,
    backgroundColor: '#2563eb',
  },
  stepperStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
  },
  stepItem: {
    alignItems: 'center',
    width: 70,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepCirclePassed: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  stepCircleCurrent: {
    borderColor: '#2563eb',
    transform: [{ scale: 1.15 }],
  },
  stepLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelPassed: {
    color: '#334155',
  },
  stepLabelCurrent: {
    color: '#2563eb',
    fontWeight: '800',
  },

  /* MAIN GRID */
  mainGrid: {
    gap: 20,
  },
  leftCol: {
    gap: 20,
  },
  rightCol: {
    gap: 20,
  },

  /* CARDS */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardSubCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  /* PRODUCT ROW */
  itemsList: {},
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  productThumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 19,
    marginBottom: 6,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitPrice: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  quantityTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  productSubtotalCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  subtotalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  viewProductLink: {
    marginTop: 2,
  },
  viewProductLinkText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },

  /* TIMELINE */
  timelineList: {
    paddingLeft: 4,
  },
  timelineNode: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  timelineDotCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineAction: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  timelineSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 18,
  },
  timelineTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },

  /* ADDRESS */
  addressBox: {},
  addressUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  addressPhone: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  addressDetail: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 10,
  },
  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  safeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },

  /* DETAILS */
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  paymentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* SUMMARY */
  summaryCard: {
    backgroundColor: '#ffffff',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  costLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  costVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  finalTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  vatNote: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  finalTotalVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#dc2626',
  },

  /* ACTIONS */
  actionsWrap: {
    gap: 12,
  },
  reorderBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  reorderBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  cancelBtnText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
  supportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
  },
  supportText: {
    fontSize: 13,
    color: '#64748b',
  },

  /* TOAST */
  toastWrap: {
    position: 'absolute',
    top: 75,
    right: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    zIndex: 9999,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
});
