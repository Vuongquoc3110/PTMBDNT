import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
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
import { VIETNAM_PROVINCES } from '@/data/vietnamLocations';
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
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 992;

  const { cartItems, clearCart, user, updateUserProfile, appliedVoucher, setAppliedVoucher, markVoucherAsUsed } = useAppContext();

  const checkoutItems = useMemo(() => {
    const selected = cartItems.filter((i) => i.selected);
    return selected.length > 0 ? selected : cartItems;
  }, [cartItems]);

  const [fullname, setFullname] = useState(user?.name || '');
  const [phone, setPhone] = useState(() => (user?.phone || '').replace(/[^0-9]/g, '').slice(0, 10));

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(cleaned);
  };

  // Vietnam Location Selectors
  const [selectedProvinceId, setSelectedProvinceId] = useState(() => {
    if (user?.address || user?.city) {
      const combined = `${user?.address || ''} ${user?.city || ''}`.toLowerCase();
      const found = VIETNAM_PROVINCES.find((p) =>
        combined.includes(p.name.toLowerCase().replace('tp. ', '')) ||
        combined.includes(p.id)
      );
      if (found) return found.id;
    }
    return 'hcm';
  });

  const selectedProvince = useMemo(() => {
    return VIETNAM_PROVINCES.find((p) => p.id === selectedProvinceId) || VIETNAM_PROVINCES[0];
  }, [selectedProvinceId]);

  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    if (user?.address) {
      const foundD = selectedProvince.districts.find((d) =>
        user.address?.toLowerCase().includes(d.toLowerCase())
      );
      if (foundD) return foundD;
    }
    return selectedProvince.districts[0] || 'Quận 1';
  });

  const [streetAddress, setStreetAddress] = useState(() => {
    if (user?.address) {
      return user.address;
    }
    return '';
  });

  const [provinceModalVisible, setProvinceModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');

  const fullAddress = useMemo(() => {
    const parts = [];
    if (streetAddress.trim()) parts.push(streetAddress.trim());
    if (selectedDistrict) parts.push(selectedDistrict);
    if (selectedProvince?.name) parts.push(selectedProvince.name);
    return parts.join(', ');
  }, [streetAddress, selectedDistrict, selectedProvince]);

  const handleSelectProvince = (provId: string) => {
    setSelectedProvinceId(provId);
    const prov = VIETNAM_PROVINCES.find((p) => p.id === provId) || VIETNAM_PROVINCES[0];
    setSelectedDistrict(prov.districts[0] || '');
    setProvinceModalVisible(false);
    setProvinceSearch('');
  };

  const handleSelectDistrict = (dist: string) => {
    setSelectedDistrict(dist);
    setDistrictModalVisible(false);
    setDistrictSearch('');
  };

  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [note, setNote] = useState('Giao hàng giờ hành chính');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(900);

  useEffect(() => {
    if (!qrModalVisible) return;
    setQrCountdown(900);
    const interval = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [qrModalVisible]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  const isFreeShipEligible = subtotal >= 5000000 || appliedVoucher?.code === 'FREESHIP';
  const shipping = isFreeShipEligible ? 0 : 30000;
  const voucherDiscount = appliedVoucher && appliedVoucher.code !== 'FREESHIP' ? appliedVoucher.discount : 0;
  const total = Math.max(0, subtotal + shipping - voucherDiscount);

  const handleOrder = async () => {
    if (checkoutItems.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    if (!fullname.trim() || !phone.trim() || !streetAddress.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      alert('Số điện thoại nhận hàng không hợp lệ (phải đủ 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09)');
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
        shippingAddress: `${fullname.trim()} - ${phone.trim()}, ${fullAddress} (Ghi chú: ${note.trim()})`,
        shippingMethod: 'standard',
        paymentMethod,
        voucherCode: appliedVoucher?.code,
      });

      setCreatedOrderNumber(res.orderNumber);
      if (res.orderId) setCreatedOrderId(res.orderId);

      // Nếu đã chọn và dùng voucher thì ghi nhận đã sử dụng để tài khoản đó không còn voucher đó
      if (appliedVoucher) {
        try {
          await markVoucherAsUsed(appliedVoucher.code);
        } catch (vErr) {
          console.warn('Lỗi lưu trạng thái voucher:', vErr);
        }
        setAppliedVoucher(null);
      }

      // Lưu địa chỉ mặc định cho khách nếu được chọn
      if (saveAsDefault && user) {
        updateUserProfile({
          name: fullname.trim(),
          phone: phone.trim(),
          address: fullAddress,
          city: selectedProvince.name,
        }).catch((err) => console.warn('Could not save default profile address:', err));
      }

      clearCart();
      if (paymentMethod === 'vnpay' || paymentMethod === 'momo') {
        setQrModalVisible(true);
      } else {
        setIsSuccess(true);
      }
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="location-outline" size={20} color="#2563eb" />
                      <Text style={styles.cardTitle}>Thông tin nhận hàng</Text>
                    </View>
                    {user?.address ? (
                      <View style={styles.defaultBadge}>
                        <Ionicons name="shield-checkmark" size={12} color="#16a34a" />
                        <Text style={styles.defaultBadgeText}>Địa chỉ từ hồ sơ</Text>
                      </View>
                    ) : null}
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
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={styles.fieldLabel}>Số điện thoại liên hệ *</Text>
                        <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '600' }}>{phone.length}/10 số</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={handlePhoneChange}
                        placeholder="Nhập số điện thoại (10 số)..."
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>

                  {/* VIETNAM REGION SELECTION ROW */}
                  <View style={styles.formRow}>
                    {/* Tỉnh / Thành phố */}
                    <View style={styles.fieldCol}>
                      <Text style={styles.fieldLabel}>Tỉnh / Thành phố *</Text>
                      <Pressable
                        style={styles.pickerTrigger}
                        onPress={() => setProvinceModalVisible(true)}
                      >
                        <Ionicons name="business-outline" size={17} color="#2563eb" />
                        <Text style={styles.pickerTriggerText} numberOfLines={1}>
                          {selectedProvince.name}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color="#64748b" style={{ marginLeft: 'auto' }} />
                      </Pressable>
                    </View>

                    {/* Quận / Huyện */}
                    <View style={styles.fieldCol}>
                      <Text style={styles.fieldLabel}>Quận / Huyện *</Text>
                      <Pressable
                        style={styles.pickerTrigger}
                        onPress={() => setDistrictModalVisible(true)}
                      >
                        <Ionicons name="navigate-outline" size={17} color="#2563eb" />
                        <Text style={styles.pickerTriggerText} numberOfLines={1}>
                          {selectedDistrict || 'Chọn Quận / Huyện'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color="#64748b" style={{ marginLeft: 'auto' }} />
                      </Pressable>
                    </View>
                  </View>

                  {/* ĐỊA CHỈ CHI TIẾT */}
                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Địa chỉ chi tiết (Số nhà, tên đường, phường/xã) *</Text>
                    <TextInput
                      style={styles.input}
                      value={streetAddress}
                      onChangeText={setStreetAddress}
                      placeholder="Ví dụ: 123 Lê Lợi, Phường Bến Nghé"
                    />
                  </View>

                  {/* PREVIEW OF COMBINED FULL ADDRESS */}
                  <View style={styles.addressPreviewBox}>
                    <Ionicons name="location" size={18} color="#2563eb" style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.addressPreviewLabel}>Địa chỉ nhận hàng đầy đủ:</Text>
                      <Text style={styles.addressPreviewText}>
                        {fullAddress || 'Vui lòng chọn khu vực và nhập địa chỉ cụ thể'}
                      </Text>
                    </View>
                  </View>

                  {/* CHECKBOX: LƯU LÀM ĐỊA CHỈ MẶC ĐỊNH */}
                  <Pressable
                    style={styles.saveDefaultRow}
                    onPress={() => setSaveAsDefault(!saveAsDefault)}
                  >
                    <View style={[styles.checkboxBox, saveAsDefault && styles.checkboxBoxActive]}>
                      {saveAsDefault && <Ionicons name="checkmark" size={13} color="#ffffff" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.saveDefaultTitle}>
                        Lưu làm địa chỉ nhận hàng mặc định
                      </Text>
                      <Text style={styles.saveDefaultSub}>
                        Tự động ghi nhớ và điền sẵn cho các đơn hàng tiếp theo
                      </Text>
                    </View>
                  </Pressable>

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

                            {isSelected && (method.id === 'vnpay' || method.id === 'momo') && (
                              <View style={styles.qrInlineNotice}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                  <Ionicons
                                    name="qr-code"
                                    size={15}
                                    color={method.id === 'vnpay' ? '#0284c7' : '#db2777'}
                                  />
                                  <Text
                                    style={[
                                      styles.qrInlineNoticeTitle,
                                      { color: method.id === 'vnpay' ? '#0284c7' : '#db2777' },
                                    ]}
                                  >
                                    {method.id === 'vnpay'
                                      ? 'Tự động tạo mã VNPAY-QR theo số tiền đơn hàng'
                                      : 'Tự động tạo mã QR MoMo theo số tiền đơn hàng'}
                                  </Text>
                                </View>
                                <Text style={styles.qrInlineNoticeText}>
                                  Khi bấm xác nhận đặt hàng, hệ thống sẽ mở mã QR Code kèm cú pháp chuyển khoản để bạn quét thanh toán tức thì.
                                </Text>
                                <Pressable
                                  style={[
                                    styles.qrDemoQuickBtn,
                                    { backgroundColor: method.id === 'vnpay' ? '#0284c7' : '#db2777' },
                                  ]}
                                  onPress={(e) => {
                                    e.stopPropagation?.();
                                    setQrModalVisible(true);
                                  }}
                                >
                                  <Ionicons name="scan-outline" size={13} color="#ffffff" style={{ marginRight: 4 }} />
                                  <Text style={styles.qrDemoQuickBtnText}>
                                    Xem trước mã QR Demo ({method.id === 'vnpay' ? 'VNPAY' : 'MoMo'})
                                  </Text>
                                </Pressable>
                              </View>
                            )}
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
                          {item.spec ? (
                            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }} numberOfLines={1}>
                              {item.spec}
                            </Text>
                          ) : null}
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
                    <Text style={[styles.breakdownVal, isFreeShipEligible && { color: '#16a34a', fontWeight: '700' }]}>
                      {isFreeShipEligible ? 'MIỄN PHÍ' : '30.000 ₫'}
                    </Text>
                  </View>
                  {appliedVoucher ? (
                    <View style={styles.breakdownRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="checkmark-circle" size={15} color="#16a34a" />
                        <Text style={[styles.breakdownLabel, { color: '#16a34a', fontWeight: '600' }]}>
                          Voucher ({appliedVoucher.code})
                        </Text>
                      </View>
                      <Text style={[styles.breakdownVal, { color: '#16a34a', fontWeight: '700' }]}>
                        {appliedVoucher.code === 'FREESHIP' ? 'Miễn phí ship (30.000 ₫)' : `-${formatPrice(voucherDiscount)}`}
                      </Text>
                    </View>
                  ) : null}

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

      {/* MODAL: CHỌN TỈNH / THÀNH PHỐ */}
      <Modal visible={provinceModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="business" size={20} color="#2563eb" />
                <Text style={styles.modalTitle}>Chọn Tỉnh / Thành phố</Text>
              </View>
              <Pressable onPress={() => setProvinceModalVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.modalSearchWrap}>
              <Ionicons name="search-outline" size={17} color="#94a3b8" />
              <TextInput
                style={styles.modalSearchInput}
                value={provinceSearch}
                onChangeText={setProvinceSearch}
                placeholder="Tìm kiếm tỉnh, thành phố..."
              />
              {provinceSearch.length > 0 && (
                <Pressable onPress={() => setProvinceSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#94a3b8" />
                </Pressable>
              )}
            </View>

            <ScrollView style={styles.modalListScroll}>
              {VIETNAM_PROVINCES.filter((p) =>
                p.name.toLowerCase().includes(provinceSearch.toLowerCase().trim())
              ).map((p) => {
                const isSelected = p.id === selectedProvinceId;
                return (
                  <Pressable
                    key={p.id}
                    style={[styles.modalListItem, isSelected && styles.modalListItemActive]}
                    onPress={() => handleSelectProvince(p.id)}
                  >
                    <Text style={[styles.modalListText, isSelected && styles.modalListTextActive]}>
                      {p.name}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={18} color="#2563eb" />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: CHỌN QUẬN / HUYỆN */}
      <Modal visible={districtModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="navigate" size={20} color="#2563eb" />
                <Text style={styles.modalTitle}>Chọn Quận / Huyện ({selectedProvince.name})</Text>
              </View>
              <Pressable onPress={() => setDistrictModalVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.modalSearchWrap}>
              <Ionicons name="search-outline" size={17} color="#94a3b8" />
              <TextInput
                style={styles.modalSearchInput}
                value={districtSearch}
                onChangeText={setDistrictSearch}
                placeholder="Tìm kiếm quận, huyện..."
              />
              {districtSearch.length > 0 && (
                <Pressable onPress={() => setDistrictSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#94a3b8" />
                </Pressable>
              )}
            </View>

            <ScrollView style={styles.modalListScroll}>
              {selectedProvince.districts
                .filter((d) => d.toLowerCase().includes(districtSearch.toLowerCase().trim()))
                .map((d) => {
                  const isSelected = d === selectedDistrict;
                  return (
                    <Pressable
                      key={d}
                      style={[styles.modalListItem, isSelected && styles.modalListItemActive]}
                      onPress={() => handleSelectDistrict(d)}
                    >
                      <Text style={[styles.modalListText, isSelected && styles.modalListTextActive]}>
                        {d}
                      </Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={18} color="#2563eb" />}
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: MÃ QR THANH TOÁN DEMO (VNPAY / MOMO) */}
      <Modal visible={qrModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.qrModalBox, { borderColor: paymentMethod === 'vnpay' ? '#0284c7' : '#db2777' }]}>
            {/* MODAL HEADER */}
            <View style={styles.qrModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={[
                    styles.qrBrandBadge,
                    { backgroundColor: paymentMethod === 'vnpay' ? '#eff6ff' : '#fdf2f8' },
                  ]}
                >
                  <Ionicons
                    name={paymentMethod === 'vnpay' ? 'qr-code' : 'wallet'}
                    size={20}
                    color={paymentMethod === 'vnpay' ? '#0284c7' : '#db2777'}
                  />
                </View>
                <View>
                  <Text style={styles.qrModalTitle}>
                    {paymentMethod === 'vnpay' ? 'Thanh toán qua VNPAY-QR' : 'Thanh toán qua Ví MoMo'}
                  </Text>
                  <Text style={styles.qrModalSub}>
                    {paymentMethod === 'vnpay' ? 'Quét bằng hơn 40 ứng dụng Ngân hàng' : 'Quét bằng ứng dụng Ví MoMo'}
                  </Text>
                </View>
              </View>

              <Pressable onPress={() => setQrModalVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            {/* COUNTDOWN BANNER */}
            <View style={styles.qrCountdownBar}>
              <Ionicons name="time-outline" size={16} color="#d97706" />
              <Text style={styles.qrCountdownText}>
                Mã QR có hiệu lực trong:{' '}
                <Text style={{ fontWeight: '800', color: '#dc2626' }}>{formatCountdown(qrCountdown)}</Text>
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.qrModalBody}>
              {/* KHUNG HIỂN THỊ MÃ QR CODE */}
              <View style={[styles.qrFrame, { borderColor: paymentMethod === 'vnpay' ? '#bae6fd' : '#fbcfe8' }]}>
                <Image
                  source={{
                    uri: `https://api.vietqr.io/image/970422-0988888888-compact2.jpg?amount=${total}&addInfo=${encodeURIComponent(
                      (paymentMethod === 'vnpay' ? 'VNPAY' : 'MOMO') + ' ' + (createdOrderNumber || 'ORDER')
                    )}&accountName=${encodeURIComponent('DANGVINHPC HI-END STORE')}`,
                  }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
                <Text style={styles.qrScanHint}>
                  Hướng camera điện thoại để quét mã tự động điền số tiền
                </Text>
              </View>

              {/* THÔNG TIN THANH TOÁN CHI TIẾT */}
              <View style={styles.qrDetailsCard}>
                <View style={styles.qrDetailRow}>
                  <Text style={styles.qrDetailLabel}>Tổng số tiền:</Text>
                  <Text style={styles.qrDetailPrice}>{formatPrice(total)}</Text>
                </View>
                <View style={styles.qrDetailRow}>
                  <Text style={styles.qrDetailLabel}>Mã đơn hàng:</Text>
                  <Text style={styles.qrDetailVal}>#{createdOrderNumber || 'ORD-NEW'}</Text>
                </View>
                <View style={styles.qrDetailRow}>
                  <Text style={styles.qrDetailLabel}>Đơn vị thụ hưởng:</Text>
                  <Text style={styles.qrDetailVal}>DANGVINHPC HI-END STORE</Text>
                </View>
                <View style={styles.qrDetailRow}>
                  <Text style={styles.qrDetailLabel}>
                    {paymentMethod === 'vnpay' ? 'Ngân hàng nhận:' : 'Ví nhận tiền:'}
                  </Text>
                  <Text style={styles.qrDetailVal}>
                    {paymentMethod === 'vnpay' ? 'MB Bank (Ngân hàng Quân Đội)' : 'Ví điện tử MoMo'}
                  </Text>
                </View>
                <View style={styles.qrDetailRow}>
                  <Text style={styles.qrDetailLabel}>Số TK / Số ví:</Text>
                  <Text style={styles.qrDetailValHighlight}>0988 888 888</Text>
                </View>
                <View style={styles.qrDetailRow}>
                  <Text style={styles.qrDetailLabel}>Nội dung CK:</Text>
                  <Text style={styles.qrDetailValHighlight}>
                    {paymentMethod === 'vnpay' ? 'VNPAY' : 'MOMO'} {createdOrderNumber || 'ORDER'}
                  </Text>
                </View>
              </View>

              {/* NÚT XÁC NHẬN VÀ QUAY LẠI */}
              <Pressable
                style={[
                  styles.confirmPaymentBtn,
                  { backgroundColor: paymentMethod === 'vnpay' ? '#0284c7' : '#db2777' },
                ]}
                onPress={() => {
                  setQrModalVisible(false);
                  setIsSuccess(true);
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.confirmPaymentBtnText}>TÔI ĐÃ CHUYỂN KHOẢN XONG</Text>
              </Pressable>

              <Pressable style={styles.cancelPaymentBtn} onPress={() => setQrModalVisible(false)}>
                <Text style={styles.cancelPaymentBtnText}>Đóng mã QR / Thanh toán sau</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  saveDefaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    cursor: 'pointer',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  saveDefaultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  saveDefaultSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },

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

  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 11,
    cursor: 'pointer',
  },
  pickerTriggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  addressPreviewBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 16,
  },
  addressPreviewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 2,
  },
  addressPreviewText: {
    fontSize: 13,
    color: '#1e3a8a',
    lineHeight: 18,
    fontWeight: '500',
  },

  /* MODAL SELECTOR */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 460,
    maxHeight: '80%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    padding: 0,
  },
  modalListScroll: {
    maxHeight: 340,
  },
  modalListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 4,
    cursor: 'pointer',
  },
  modalListItemActive: {
    backgroundColor: '#eff6ff',
  },
  modalListText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  modalListTextActive: {
    color: '#2563eb',
    fontWeight: '700',
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

  /* INLINE QR NOTICE */
  qrInlineNotice: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qrInlineNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  qrInlineNoticeText: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 8,
  },
  qrDemoQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  qrDemoQuickBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },

  /* MODAL QR PAYMENT BOX */
  qrModalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    maxWidth: 460,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 8,
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  qrBrandBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  qrModalSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  qrCountdownBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fffbeb',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
  },
  qrCountdownText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  qrModalBody: {
    padding: 20,
    alignItems: 'center',
  },
  qrFrame: {
    width: 230,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  qrScanHint: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 14,
  },
  qrDetailsCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  qrDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrDetailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  qrDetailPrice: {
    fontSize: 17,
    fontWeight: '900',
    color: '#dc2626',
  },
  qrDetailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  qrDetailValHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284c7',
  },
  confirmPaymentBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmPaymentBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelPaymentBtn: {
    paddingVertical: 8,
  },
  cancelPaymentBtnText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
});
