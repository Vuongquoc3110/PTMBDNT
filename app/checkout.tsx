import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { Header } from '@/components/Header';
import { formatPrice } from '@/data/products';
import { useAppContext } from '@/context/AppContext';
import { apiService } from '@/services/api';

const PAYMENT_METHODS = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    desc: 'Kiểm tra hàng trước khi thanh toán tiền mặt',
    icon: 'cash-outline',
    badge: 'Tiện lợi',
  },
  {
    id: 'vnpay',
    name: 'VNPAY QR / Thẻ nội địa ATM',
    desc: 'Quét mã thanh toán qua app ngân hàng tức thì',
    icon: 'qr-code-outline',
    badge: 'Giảm 20K',
  },
  {
    id: 'momo',
    name: 'Ví điện tử MoMo',
    desc: 'Thanh toán một chạm qua ví MoMo',
    icon: 'wallet-outline',
    badge: 'Nhanh chóng',
  },
  {
    id: 'card',
    name: 'Thẻ tín dụng / Ghi nợ (Visa, Master)',
    desc: 'Hỗ trợ trả góp 0% lãi suất với thẻ tín dụng',
    icon: 'card-outline',
    badge: 'Trả góp 0%',
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 992;

  const { cartItems, clearCart, user } = useAppContext();

  const checkoutItems = useMemo(() => {
    const selected = cartItems.filter((i) => i.selected);
    return selected.length > 0 ? selected : cartItems;
  }, [cartItems]);

  const [fullname, setFullname] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [note, setNote] = useState('Giao hàng giờ hành chính');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  if (!user) {
    return (
      <View style={styles.page}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 32, maxWidth: 440, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20 }}>
            <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="lock-closed" size={32} color="#2563eb" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>
              Yêu Cầu Đăng Nhập
            </Text>
            <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
              Bạn cần đăng nhập tài khoản để xác nhận đơn hàng, lưu thông tin giao hàng và tích luỹ điểm thưởng.
            </Text>
            <Pressable
              style={{ width: '100%', backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 }}
              onPress={() => router.push('/login' as any)}
            >
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 15 }}>Đăng nhập để mua hàng</Text>
            </Pressable>
            <Pressable
              style={{ width: '100%', backgroundColor: '#f1f5f9', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={{ color: '#475569', fontWeight: '600', fontSize: 14 }}>Về trang chủ</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [checkoutItems]);

  const shipping = subtotal >= 5000000 ? 0 : 30000;
  const discount = 30000; // Freeship voucher
  const total = Math.max(0, subtotal + shipping - discount);

  const handleOrder = async () => {
    if (checkoutItems.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    if (!fullname.trim() || !phone.trim() || !address.trim()) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiService.createOrder({
        userId: user?.id || 1,
        items: checkoutItems.map((it) => ({
          productId: it.id,
          name: it.name,
          price: it.price,
          quantity: it.qty,
          image: it.image,
        })),
        totalAmount: total,
        shippingAddress: `${fullname} - ${phone}, ${address} (Ghi chú: ${note})`,
        shippingMethod: 'standard',
        paymentMethod,
      });

      setCreatedOrderNumber(res.orderNumber);
      if (res.orderId) setCreatedOrderId(res.orderId);
      clearCart();
      setIsSuccess(true);
    } catch (err: any) {
      alert('Lỗi tạo đơn hàng: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.page}>
      <Header />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.inner}>
          {/* BREADCRUMBS */}
          <View style={styles.breadcrumbRow}>
            <Link href="/(tabs)" style={styles.breadcrumbLink}>Trang chủ</Link>
            <Text style={styles.breadcrumbSep}>/</Text>
            <Link href={'/cart' as any} style={styles.breadcrumbLink}>Giỏ hàng</Link>
            <Text style={styles.breadcrumbSep}>/</Text>
            <Text style={styles.breadcrumbCurrent}>Thanh toán</Text>
          </View>

          <Text style={styles.pageTitle}>Xác nhận & Thanh toán đơn hàng</Text>

          {isSuccess ? (
            <View style={styles.successCard}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-done-circle" size={80} color="#22c55e" />
              </View>
              <Text style={styles.successTitle}>Đặt hàng thành công!</Text>
              <Text style={styles.successDesc}>
                Cảm ơn bạn đã mua hàng tại DANGVINHPC. Mã đơn hàng của bạn là{' '}
                <Text style={{ fontWeight: '800', color: '#0f172a' }}>#{createdOrderNumber || 'ORD-NEW'}</Text>.
                Hệ thống đã ghi nhận và chuyển thông tin đến bộ phận giao vận.
              </Text>
              <View style={styles.successBtnRow}>
                <Pressable
                  style={styles.homeBtn}
                  onPress={() => router.push('/(tabs)')}
                >
                  <Ionicons name="home-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.homeBtnText}>Về trang chủ</Text>
                </Pressable>
                <Pressable
                  style={styles.ordersBtn}
                  onPress={() => {
                    if (createdOrderId) {
                      router.push({ pathname: '/orders/[id]', params: { id: String(createdOrderId) } } as any);
                    } else {
                      router.push('/(tabs)/explore');
                    }
                  }}
                >
                  <Text style={styles.ordersBtnText}>Xem chi tiết đơn hàng</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={[styles.grid, !isDesktop && styles.gridMobile]}>
              {/* LEFT COLUMN: FORM */}
              <View style={styles.leftCol}>
                {/* SHIPPING INFO */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="location-outline" size={22} color="#2563eb" />
                    <Text style={styles.cardTitle}>Thông tin nhận hàng</Text>
                  </View>

                  <View style={styles.formRow}>
                    <View style={styles.fieldCol}>
                      <Text style={styles.fieldLabel}>Họ và tên người nhận *</Text>
                      <TextInput
                        style={styles.input}
                        value={fullname}
                        onChangeText={setFullname}
                        placeholder="Nhập họ và tên..."
                      />
                    </View>
                    <View style={styles.fieldCol}>
                      <Text style={styles.fieldLabel}>Số điện thoại liên hệ *</Text>
                      <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Nhập số điện thoại..."
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Địa chỉ giao hàng chi tiết *</Text>
                    <TextInput
                      style={styles.input}
                      value={address}
                      onChangeText={setAddress}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Ghi chú cho shipper (Tùy chọn)</Text>
                    <TextInput
                      style={[styles.input, { minHeight: 60 }]}
                      value={note}
                      onChangeText={setNote}
                      placeholder="Ví dụ: Gọi trước khi giao, giao giờ hành chính..."
                      multiline
                    />
                  </View>
                </View>

                {/* PAYMENT METHODS */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="wallet-outline" size={22} color="#2563eb" />
                    <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
                  </View>

                  <View style={styles.paymentList}>
                    {PAYMENT_METHODS.map((method) => {
                      const isSelected = paymentMethod === method.id;
                      return (
                        <Pressable
                          key={method.id}
                          style={[styles.paymentItem, isSelected && styles.paymentItemActive]}
                          onPress={() => setPaymentMethod(method.id)}
                        >
                          <View style={[styles.radio, isSelected && styles.radioActive]}>
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                          <View style={styles.paymentIconWrap}>
                            <Ionicons name={method.icon as any} size={22} color={isSelected ? '#2563eb' : '#64748b'} />
                          </View>
                          <View style={styles.paymentInfo}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Text style={[styles.paymentName, isSelected && styles.paymentNameActive]}>
                                {method.name}
                              </Text>
                              {method.badge && (
                                <View style={styles.paymentBadge}>
                                  <Text style={styles.paymentBadgeText}>{method.badge}</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.paymentDesc}>{method.desc}</Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* RIGHT COLUMN: ORDER SUMMARY */}
              <View style={styles.rightCol}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryCardTitle}>Đơn hàng của bạn ({checkoutItems.length})</Text>

                  <View style={styles.summaryItemsList}>
                    {checkoutItems.map((item) => (
                      <View key={item.id} style={styles.miniItemRow}>
                        <View style={styles.miniItemInfo}>
                          <Text style={styles.miniItemName} numberOfLines={1}>{item.name}</Text>
                          <Text style={styles.miniItemQty}>Số lượng: {item.qty}</Text>
                        </View>
                        <Text style={styles.miniItemPrice}>{formatPrice(item.price * item.qty)}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Tạm tính</Text>
                    <Text style={styles.breakdownVal}>{formatPrice(subtotal)}</Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Phí vận chuyển</Text>
                    <Text style={[styles.breakdownVal, { color: '#16a34a', fontWeight: '700' }]}>MIỄN PHÍ</Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Voucher FREESHIP</Text>
                    <Text style={[styles.breakdownVal, { color: '#16a34a' }]}>-30.000 ₫</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.totalVal}>{formatPrice(total)}</Text>
                  </View>

                  <Pressable
                    style={[styles.submitOrderBtn, isSubmitting && { opacity: 0.7 }]}
                    onPress={handleOrder}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="shield-checkmark-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={styles.submitOrderBtnText}>
                      {isSubmitting ? 'Đang xử lý đơn...' : 'XÁC NHẬN ĐẶT HÀNG'}
                    </Text>
                  </Pressable>

                  <Text style={styles.guaranteeText}>
                    🔒 Thông tin thanh toán được mã hóa bảo mật 256-bit SSL
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1 },
  content: { paddingBottom: 60 },
  inner: { maxWidth: 1140, width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 24 },
  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  breadcrumbLink: { fontSize: 13, color: '#64748b' },
  breadcrumbSep: { fontSize: 13, color: '#94a3b8' },
  breadcrumbCurrent: { fontSize: 13, color: '#0f172a', fontWeight: '700' },
  pageTitle: { fontSize: 26, fontWeight: '900', color: '#0f172a', marginBottom: 24 },

  grid: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  gridMobile: { flexDirection: 'column' },
  leftCol: { flex: 1, gap: 18 },
  rightCol: { width: 380 },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },

  formRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  fieldCol: { flex: 1 },
  formGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },

  paymentList: { gap: 10 },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  paymentItemActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: '#2563eb' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563eb' },
  paymentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  paymentNameActive: { color: '#2563eb' },
  paymentDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  paymentBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paymentBadgeText: { fontSize: 10, fontWeight: '700', color: '#16a34a' },

  /* SUMMARY */
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 22,
  },
  summaryCardTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a', marginBottom: 14 },
  summaryItemsList: { gap: 10, marginBottom: 14 },
  miniItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniItemInfo: { flex: 1, marginRight: 10 },
  miniItemName: { fontSize: 13, fontWeight: '600', color: '#0f172a' },
  miniItemQty: { fontSize: 11, color: '#64748b' },
  miniItemPrice: { fontSize: 13, fontWeight: '700', color: '#0f172a' },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  breakdownLabel: { fontSize: 13, color: '#64748b' },
  breakdownVal: { fontSize: 13, fontWeight: '600', color: '#0f172a' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6, marginBottom: 18 },
  totalLabel: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  totalVal: { fontSize: 20, fontWeight: '900', color: '#dc2626' },

  submitOrderBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  submitOrderBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  guaranteeText: { fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 14 },

  /* SUCCESS */
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconCircle: { marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 10 },
  successDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', maxWidth: 480, lineHeight: 22, marginBottom: 28 },
  successBtnRow: { flexDirection: 'row', gap: 14 },
  homeBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  homeBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  ordersBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ordersBtnText: { color: '#334155', fontSize: 14, fontWeight: '700' },
});
