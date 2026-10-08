import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { Header } from '@/components/Header';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';
import { formatPrice, getProductFallbackImage, isInvalidOrBlockedImageUrl } from '@/data/products';
import { useAppContext, type CartItem } from '@/context/AppContext';
import { apiService, type Voucher } from '@/services/api';

export default function CartScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 992;

  const {
    cartItems: items,
    updateCartQty,
    removeFromCart,
    toggleSelectCartItem,
    toggleSelectAllCart,
    user,
    appliedVoucher,
    setAppliedVoucher,
    usedVouchers,
  } = useAppContext();

  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [toast, setToast] = useState('');
  const [authModalVisible, setAuthModalVisible] = useState(false);

  useEffect(() => {
    apiService.getVouchers().then((v) => setAvailableVouchers(v)).catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const updateQty = (id: string, delta: number) => {
    updateCartQty(id, delta);
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    removeFromCart(id);
    if (item) showToast(`Đã xóa "${item.name}" khỏi giỏ`);
  };

  const toggleSelect = (id: string) => {
    toggleSelectCartItem(id);
  };

  const allSelected = items.length > 0 && items.every((i) => i.selected);

  const toggleSelectAll = () => {
    toggleSelectAllCart(!allSelected);
  };

  const removeSelected = () => {
    items.filter((i) => i.selected).forEach((i) => removeFromCart(i.id));
    showToast('Đã xóa các sản phẩm được chọn');
  };

  // Calculations
  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);
  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [selectedItems],
  );

  // Lọc bỏ những mã mà tài khoản hiện tại đã sử dụng (để tài khoản không còn voucher đó)
  const displayVouchers = useMemo(() => {
    return availableVouchers.filter((v) => !usedVouchers.includes(v.code.toUpperCase()));
  }, [availableVouchers, usedVouchers]);

  // Tự động hủy mã nếu số tiền giỏ hàng giảm xuống dưới mức tối thiểu của voucher
  useEffect(() => {
    if (
      appliedVoucher &&
      typeof (appliedVoucher as any).minOrder === 'number' &&
      subtotal > 0 &&
      subtotal < (appliedVoucher as any).minOrder
    ) {
      const vCode = appliedVoucher.code;
      const minVal = (appliedVoucher as any).minOrder;
      setAppliedVoucher(null);
      showToast(`Đơn hàng không còn đủ tối thiểu ${formatPrice(minVal)}, mã ${vCode} đã tự động hủy.`);
    }
  }, [subtotal, appliedVoucher]);

  const handleApplyVoucher = async (codeToApply?: string) => {
    const code = (codeToApply || voucherInput).trim().toUpperCase();
    if (!code) return;

    if (usedVouchers.includes(code)) {
      setVoucherError('Tài khoản của bạn đã sử dụng mã giảm giá này rồi!');
      showToast('Tài khoản đã sử dụng mã này rồi!');
      return;
    }

    try {
      const currentSubtotal = items.filter((i) => i.selected).reduce((s, it) => s + it.price * it.qty, 0);
      const res = await apiService.validateVoucher(code, currentSubtotal, user?.id);
      if (res.valid && res.voucher) {
        setAppliedVoucher({
          code: res.voucher.code,
          discount: res.discount || 0,
          minOrder: res.voucher.minOrder,
          label: res.voucher.label,
        });
        setVoucherError('');
        setVoucherInput('');
        showToast(`Áp dụng mã ${res.voucher.code} thành công (-${formatPrice(res.discount || 0)})!`);
      } else {
        setVoucherError(res.error || 'Mã giảm giá không hợp lệ');
      }
    } catch (err: any) {
      setVoucherError(err.message || 'Mã giảm giá không hợp lệ');
    }
  };

  const handleSelectVoucher = (v: Voucher) => {
    const isSelected = appliedVoucher?.code.toUpperCase() === v.code.toUpperCase();
    if (isSelected) {
      setAppliedVoucher(null);
      setVoucherError('');
      showToast(`Đã hủy áp dụng mã ${v.code}`);
      return;
    }

    if (usedVouchers.includes(v.code.toUpperCase())) {
      showToast('Tài khoản của bạn đã sử dụng mã giảm giá này rồi!');
      return;
    }

    const minRequired = v.minOrder || 0;
    if (subtotal < minRequired) {
      showToast(
        `Chưa đủ điều kiện! Đơn hàng cần tối thiểu ${formatPrice(minRequired)} (còn thiếu ${formatPrice(minRequired - subtotal)})`
      );
      return;
    }

    setAppliedVoucher({
      code: v.code,
      discount: v.discount,
      minOrder: v.minOrder,
      label: v.label,
    });
    setVoucherError('');
    showToast(`Áp dụng mã ${v.code} thành công (-${formatPrice(v.discount)})!`);
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError('');
    showToast('Đã hủy mã giảm giá');
  };
  const totalOriginal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + (item.oldPrice || item.price) * item.qty, 0),
    [selectedItems],
  );
  const totalSavings = totalOriginal - subtotal;

  const freeShipThreshold = 5000000;
  const isFreeShipEligible = subtotal >= freeShipThreshold || appliedVoucher?.code === 'FREESHIP';
  const rawShipping = selectedItems.length > 0 ? (isFreeShipEligible ? 0 : 30000) : 0;
  const voucherDiscount = appliedVoucher && appliedVoucher.code !== 'FREESHIP' ? appliedVoucher.discount : 0;
  const finalTotal = Math.max(0, subtotal + rawShipping - voucherDiscount);

  if (!user) {
    return (
      <View style={styles.page}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, minHeight: 480 }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            padding: 36,
            maxWidth: 460,
            width: '100%',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 4,
          }}>
            <View style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: '#eff6ff',
              borderWidth: 2,
              borderColor: '#bfdbfe',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Ionicons name="cart-outline" size={38} color="#2563eb" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 10 }}>
              Bạn Chưa Đăng Nhập
            </Text>
            <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
              Khách hàng chưa đăng nhập sẽ không thể thêm sản phẩm vào giỏ hàng và không thể mua hàng. Vui lòng đăng nhập để bắt đầu mua sắm!
            </Text>
            <Pressable
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 12,
                shadowColor: '#2563eb',
                shadowOpacity: 0.25,
                shadowRadius: 10,
              }}
              onPress={() => router.push('/login' as any)}
            >
              <Ionicons name="log-in-outline" size={20} color="#ffffff" />
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 15 }}>Đăng nhập ngay</Text>
            </Pressable>
            <Pressable
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                borderWidth: 1,
                borderColor: '#cbd5e1',
                paddingVertical: 13,
                borderRadius: 14,
                alignItems: 'center',
              }}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={{ color: '#334155', fontWeight: '600', fontSize: 14 }}>Về trang chủ xem sản phẩm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Header />

      {/* TOAST ALERT */}
      {toast ? (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color="#22c55e" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.container} contentContainerStyle={[styles.content, !isDesktop && { paddingBottom: 100 }]}>
        <View style={[styles.innerWrapper, !isDesktop && { paddingHorizontal: 12, paddingTop: 14 }]}>
          {/* BREADCRUMB & HEADER */}
          <View style={styles.topHeader}>
            <View style={styles.breadcrumbRow}>
              <Link href="/(tabs)" style={styles.breadcrumbLink}>
                Trang chủ
              </Link>
              <Text style={styles.breadcrumbSep}>/</Text>
              <Text style={styles.breadcrumbCurrent}>Giỏ hàng</Text>
            </View>
            <View style={styles.titleRow}>
              <View style={styles.titleLeft}>
                <Text style={styles.pageTitle}>Giỏ hàng của bạn</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{items.length} sản phẩm</Text>
                </View>
              </View>
              <Link href={'/products' as any} style={styles.continueLink}>
                <Ionicons name="arrow-back" size={16} color="#2563eb" style={{ marginRight: 6 }} />
                <Text style={styles.continueLinkText}>Tiếp tục mua hàng</Text>
              </Link>
            </View>
          </View>

          {/* GUEST WARNING BANNER */}
          {!user && (
            <View style={{
              backgroundColor: '#fffbeb',
              borderWidth: 1,
              borderColor: '#fde68a',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="lock-closed" size={20} color="#d97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#92400e' }}>Bạn chưa đăng nhập</Text>
                  <Text style={{ fontSize: 13, color: '#b45309', marginTop: 2 }}>Vui lòng đăng nhập để lưu giỏ hàng và thanh toán đặt hàng.</Text>
                </View>
              </View>
              <Pressable
                style={{
                  backgroundColor: '#2563eb',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                onPress={() => router.push('/login' as any)}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Đăng nhập</Text>
              </Pressable>
            </View>
          )}

          {/* FREE SHIPPING PROGRESS BANNER */}
          {items.length > 0 && (
            <View style={styles.shippingBanner}>
              <View style={styles.shippingBannerHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="rocket-outline" size={18} color="#2563eb" />
                  <Text style={styles.shippingBannerText}>
                    {isFreeShipEligible ? (
                      <Text style={{ fontWeight: '700', color: '#16a34a' }}>
                        🎉 Bạn được Miễn phí giao hàng toàn quốc!
                      </Text>
                    ) : (
                      <>
                        Mua thêm{' '}
                        <Text style={{ fontWeight: '700', color: '#2563eb' }}>
                          {formatPrice(freeShipThreshold - subtotal)}
                        </Text>{' '}
                        để được <Text style={{ fontWeight: '700' }}>Freeship</Text>
                      </>
                    )}
                  </Text>
                </View>
                <Text style={styles.shippingPercentText}>
                  {Math.min(100, Math.round((subtotal / freeShipThreshold) * 100))}%
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(100, (subtotal / freeShipThreshold) * 100)}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* EMPTY STATE */}
          {items.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="cart-outline" size={64} color="#94a3b8" />
              </View>
              <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
              <Text style={styles.emptySubtitle}>
                Chưa có sản phẩm nào trong giỏ. Khám phá ngay hàng nghìn linh kiện, PC & Laptop chính hãng!
              </Text>
              <Pressable
                style={styles.shopNowBtn}
                onPress={() => router.push('/products' as any)}
              >
                <Ionicons name="bag-handle-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.shopNowBtnText}>Khám phá sản phẩm ngay</Text>
              </Pressable>
            </View>
          ) : (
            /* 2-COLUMN RESPONSIVE LAYOUT */
            <View style={[styles.mainGrid, !isDesktop && styles.mainGridMobile]}>
              {/* LEFT COLUMN: ITEMS LIST */}
              <View style={styles.leftColumn}>
                {/* SELECT ALL & BULK DELETE BAR */}
                <View style={styles.bulkActionBar}>
                  <Pressable style={styles.checkboxRow} onPress={toggleSelectAll}>
                    <View style={[styles.checkbox, allSelected && styles.checkboxActive]}>
                      {allSelected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                    </View>
                    <Text style={styles.bulkActionText}>
                      Chọn tất cả ({items.length} sản phẩm)
                    </Text>
                  </Pressable>

                  {selectedItems.length > 0 && (
                    <Pressable style={styles.deleteSelectedBtn} onPress={removeSelected}>
                      <Ionicons name="trash-outline" size={16} color="#ef4444" style={{ marginRight: 4 }} />
                      <Text style={styles.deleteSelectedText}>Xóa đã chọn ({selectedItems.length})</Text>
                    </Pressable>
                  )}
                </View>

                {/* CART ITEMS LIST */}
                <View style={styles.itemsList}>
                  {items.map((item) => (
                    <View key={item.id} style={styles.cartCard}>
                      <View style={styles.cartCardRow}>
                        {/* CHECKBOX */}
                        <Pressable style={styles.checkboxTouch} onPress={() => toggleSelect(item.id)}>
                          <View style={[styles.checkbox, item.selected && styles.checkboxActive]}>
                            {item.selected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                          </View>
                        </Pressable>

                        {/* PRODUCT IMAGE */}
                        <Link href={{ pathname: '/products/[id]', params: { id: item.id.split('::')[0] } }} asChild>
                          <Pressable style={styles.imgWrap}>
                            <Image
                              source={{
                                uri: item.image && !isInvalidOrBlockedImageUrl(item.image)
                                  ? item.image
                                  : getProductFallbackImage(item),
                              }}
                              style={styles.productImg}
                            />
                          </Pressable>
                        </Link>

                        {/* PRODUCT INFO */}
                        <View style={styles.productDetails}>
                          <View style={styles.itemHeader}>
                            <View style={styles.itemCategoryBadge}>
                              <Text style={styles.itemCategoryText}>{item.category}</Text>
                            </View>
                            <Pressable
                              style={styles.trashBtn}
                              onPress={() => removeItem(item.id)}
                              hitSlop={8}
                            >
                              <Ionicons name="trash-outline" size={18} color="#94a3b8" />
                            </Pressable>
                          </View>

                          <Link href={{ pathname: '/products/[id]', params: { id: item.id.split('::')[0] } }} asChild>
                            <Pressable>
                              <Text style={styles.productTitle} numberOfLines={2}>
                                {item.name}
                              </Text>
                            </Pressable>
                          </Link>

                          <Text style={styles.productSpec} numberOfLines={1}>
                            {item.spec}
                          </Text>

                          {/* STOCK STATUS */}
                          <View style={styles.stockBadgeRow}>
                            <View style={[styles.stockDot, (item.stock ?? 999) <= 0 && { backgroundColor: '#ef4444' }]} />
                            <Text style={[styles.stockText, (item.stock ?? 999) <= 0 && { color: '#ef4444' }]}>
                              {(item.stock ?? 999) > 0 ? `Còn hàng (Kho: ${item.stock ?? 'Sẵn sàng'})` : 'Tạm hết hàng'}
                            </Text>
                          </View>

                          {/* BOTTOM ROW: PRICE & STEPPER */}
                          <View style={styles.cardBottomRow}>
                            <View style={styles.priceColumn}>
                              <View style={styles.priceRow}>
                                <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
                                {item.oldPrice && item.oldPrice > item.price ? (
                                  <Text style={styles.oldPrice}>{formatPrice(item.oldPrice)}</Text>
                                ) : null}
                              </View>
                              {item.oldPrice && item.oldPrice > item.price ? (
                                <Text style={styles.savingBadge}>
                                  Tiết kiệm {formatPrice((item.oldPrice - item.price) * item.qty)}
                                </Text>
                              ) : null}
                            </View>

                            {/* QUANTITY STEPPER */}
                            <View style={styles.stepperWrap}>
                              <Pressable
                                style={[styles.stepperBtn, item.qty <= 1 && styles.stepperBtnDisabled]}
                                onPress={() => updateQty(item.id, -1)}
                                disabled={item.qty <= 1}
                              >
                                <Ionicons
                                  name="remove"
                                  size={16}
                                  color={item.qty <= 1 ? '#cbd5e1' : '#334155'}
                                />
                              </Pressable>
                              <View style={styles.stepperValueWrap}>
                                <Text style={styles.stepperValueText}>{item.qty}</Text>
                              </View>
                              <Pressable
                                style={styles.stepperBtn}
                                onPress={() => updateQty(item.id, 1)}
                              >
                                <Ionicons name="add" size={16} color="#334155" />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* TRUST BADGES ROW ON BOTTOM OF LIST */}
                <View style={styles.trustBanner}>
                  <View style={styles.trustItem}>
                    <Ionicons name="shield-checkmark" size={22} color="#2563eb" />
                    <View>
                      <Text style={styles.trustItemTitle}>100% Chính Hãng</Text>
                      <Text style={styles.trustItemSub}>Bảo hành tới 36 tháng</Text>
                    </View>
                  </View>
                  <View style={styles.trustDivider} />
                  <View style={styles.trustItem}>
                    <Ionicons name="sync-circle" size={24} color="#16a34a" />
                    <View>
                      <Text style={styles.trustItemTitle}>Đổi Trả 1-1</Text>
                      <Text style={styles.trustItemSub}>Trong vòng 30 ngày</Text>
                    </View>
                  </View>
                  <View style={styles.trustDivider} />
                  <View style={styles.trustItem}>
                    <Ionicons name="flash" size={22} color="#ea580c" />
                    <View>
                      <Text style={styles.trustItemTitle}>Giao Nhanh 2H</Text>
                      <Text style={styles.trustItemSub}>Hỗ trợ lắp đặt tận nơi</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
              <View style={styles.rightColumn}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryCardTitle}>Tóm tắt đơn hàng</Text>

                  {/* VOUCHER SECTION */}
                  <View style={styles.voucherSection}>
                    <View style={styles.voucherHeaderRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="ticket" size={17} color="#2563eb" />
                        <Text style={styles.voucherTitle}>Mã giảm giá / Khuyến mãi</Text>
                      </View>
                      {appliedVoucher && (
                        <Pressable onPress={removeVoucher} hitSlop={6}>
                          <Text style={styles.removeVoucherText}>Hủy áp dụng</Text>
                        </Pressable>
                      )}
                    </View>

                    {/* VOUCHER INPUT ROW */}
                    <View style={styles.voucherInputRow}>
                      <TextInput
                        placeholder="Nhập mã ưu đãi..."
                        placeholderTextColor="#94a3b8"
                        style={styles.voucherInput}
                        value={voucherInput}
                        onChangeText={(text) => {
                          setVoucherInput(text);
                          setVoucherError('');
                        }}
                        autoCapitalize="characters"
                      />
                      <Pressable
                        style={[
                          styles.applyVoucherBtn,
                          !voucherInput.trim() && styles.applyVoucherBtnDisabled,
                        ]}
                        onPress={() => handleApplyVoucher()}
                        disabled={!voucherInput.trim()}
                      >
                        <Text style={styles.applyVoucherBtnText}>Áp dụng</Text>
                      </Pressable>
                    </View>

                    {voucherError ? (
                      <Text style={styles.voucherErrorText}>{voucherError}</Text>
                    ) : null}

                    {/* APPLIED VOUCHER BANNER */}
                    {appliedVoucher && (
                      <View style={styles.appliedVoucherBanner}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                          <View style={styles.appliedGreenIconBox}>
                            <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={styles.appliedVoucherCode}>{appliedVoucher.code}</Text>
                              <View style={styles.appliedTagBadge}>
                                <Text style={styles.appliedTagBadgeText}>Đang áp dụng</Text>
                              </View>
                            </View>
                            <Text style={styles.appliedVoucherDesc}>
                              {appliedVoucher.code === 'FREESHIP'
                                ? 'Miễn phí giao hàng toàn quốc (30.000₫)'
                                : `Giảm ngay ${formatPrice(appliedVoucher.discount)}`}
                            </Text>
                          </View>
                        </View>
                        <Pressable onPress={removeVoucher} hitSlop={8} style={styles.removeVoucherBtn}>
                          <Ionicons name="close" size={16} color="#64748b" />
                        </Pressable>
                      </View>
                    )}

                    {/* VOUCHER LIST HEADER */}
                    <View style={styles.voucherListHeader}>
                      <Text style={styles.voucherListTitle}>
                        Mã ưu đãi của bạn ({displayVouchers.length})
                      </Text>
                      <Text style={styles.voucherListSubtitle}>
                        Đạt đủ điều kiện sẽ hiện tích xanh khi chọn
                      </Text>
                    </View>

                    {/* VOUCHER CARDS LIST */}
                    {displayVouchers.length === 0 ? (
                      <View style={styles.noVouchersBox}>
                        <Ionicons name="ticket-outline" size={24} color="#94a3b8" />
                        <Text style={styles.noVouchersText}>
                          Tài khoản của bạn đã sử dụng hết các mã giảm giá hiện có.
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.vouchersListWrap}>
                        {displayVouchers.map((v) => {
                          const isEligible = subtotal >= (v.minOrder || 0);
                          const isSelected = appliedVoucher?.code.toUpperCase() === v.code.toUpperCase();
                          const missingAmount = Math.max(0, (v.minOrder || 0) - subtotal);

                          return (
                            <Pressable
                              key={v.code}
                              style={[
                                styles.voucherCard,
                                isSelected && styles.voucherCardSelected,
                                !isEligible && styles.voucherCardIneligible,
                              ]}
                              onPress={() => handleSelectVoucher(v)}
                            >
                              <View style={styles.voucherCardLeft}>
                                <View
                                  style={[
                                    styles.voucherCardIconBox,
                                    isSelected && styles.voucherCardIconBoxSelected,
                                    !isEligible && styles.voucherCardIconBoxIneligible,
                                  ]}
                                >
                                  <Ionicons
                                    name={isSelected ? 'checkmark-circle' : isEligible ? 'pricetag' : 'lock-closed'}
                                    size={18}
                                    color={isSelected ? '#16a34a' : isEligible ? '#2563eb' : '#94a3b8'}
                                  />
                                </View>
                                <View style={styles.voucherCardDetails}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                    <Text style={[styles.voucherCardCode, !isEligible && styles.textMuted]}>
                                      {v.code}
                                    </Text>
                                    <Text style={[styles.voucherCardDiscount, isSelected && { color: '#16a34a' }]}>
                                      {v.code === 'FREESHIP' ? 'Freeship 30k' : `Giảm ${formatPrice(v.discount)}`}
                                    </Text>
                                  </View>

                                  <Text style={styles.voucherCardLabel} numberOfLines={1}>
                                    {v.label || (v.minOrder ? `Đơn từ ${formatPrice(v.minOrder)}` : 'Đơn từ 0₫')}
                                  </Text>

                                  {isEligible ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                      <Ionicons name="checkmark-circle" size={13} color="#16a34a" />
                                      <Text style={styles.eligibleHintText}>Đủ điều kiện áp dụng</Text>
                                    </View>
                                  ) : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                      <Ionicons name="alert-circle-outline" size={13} color="#ea580c" />
                                      <Text style={styles.ineligibleHintText}>
                                        Thiếu {formatPrice(missingAmount)} để chọn mã
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              </View>

                              {/* STATUS BADGE / TÍCH XANH */}
                              <View style={styles.voucherCardRight}>
                                {isSelected ? (
                                  <View style={styles.greenTickBox}>
                                    <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
                                    <Text style={styles.greenTickText}>Đã chọn</Text>
                                  </View>
                                ) : isEligible ? (
                                  <View style={styles.selectBtnBadge}>
                                    <Text style={styles.selectBtnBadgeText}>Chọn dùng</Text>
                                  </View>
                                ) : (
                                  <View style={styles.lockedBadge}>
                                    <Ionicons name="lock-closed" size={12} color="#94a3b8" />
                                    <Text style={styles.lockedBadgeText}>Chưa đủ ĐK</Text>
                                  </View>
                                )}
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                  </View>

                  {/* PRICE BREAKDOWN */}
                  <View style={styles.breakdownWrap}>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>
                        Tạm tính ({selectedItems.reduce((sum, i) => sum + i.qty, 0)} món)
                      </Text>
                      <Text style={styles.breakdownVal}>{formatPrice(subtotal)}</Text>
                    </View>

                    {totalSavings > 0 && (
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Giảm giá trực tiếp</Text>
                        <Text style={[styles.breakdownVal, { color: '#16a34a' }]}>
                          -{formatPrice(totalSavings)}
                        </Text>
                      </View>
                    )}

                    {appliedVoucher && appliedVoucher.code !== 'FREESHIP' && (
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Voucher ({appliedVoucher.code})</Text>
                        <Text style={[styles.breakdownVal, { color: '#16a34a' }]}>
                          -{formatPrice(appliedVoucher.discount)}
                        </Text>
                      </View>
                    )}

                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>Phí vận chuyển</Text>
                      <Text
                        style={[
                          styles.breakdownVal,
                          (isFreeShipEligible || appliedVoucher?.code === 'FREESHIP') && {
                            color: '#16a34a',
                            fontWeight: '700',
                          },
                        ]}
                      >
                        {isFreeShipEligible || appliedVoucher?.code === 'FREESHIP'
                          ? 'MIỄN PHÍ'
                          : formatPrice(rawShipping)}
                      </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* TOTAL */}
                    <View style={styles.totalRow}>
                      <View>
                        <Text style={styles.totalText}>Tổng thanh toán</Text>
                        <Text style={styles.vatNote}>(Đã bao gồm thuế VAT)</Text>
                      </View>
                      <Text style={styles.totalNumber}>{formatPrice(finalTotal)}</Text>
                    </View>
                  </View>

                  {/* CHECKOUT BUTTON */}
                  <Pressable
                    style={[styles.checkoutBtn, selectedItems.length === 0 && styles.checkoutBtnDisabled]}
                    onPress={() => {
                      if (!user) {
                        setAuthModalVisible(true);
                        return;
                      }
                      if (selectedItems.length > 0) {
                        router.push('/checkout' as any);
                      }
                    }}
                    disabled={selectedItems.length === 0}
                  >
                    <Ionicons name="card" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={styles.checkoutBtnText}>
                      {selectedItems.length === 0
                        ? 'Chưa chọn sản phẩm'
                        : `Tiến hành đặt hàng • ${formatPrice(finalTotal)}`}
                    </Text>
                  </Pressable>

                  {/* PAYMENT ICONS BADGE */}
                  <View style={styles.paymentMethodsRow}>
                    <Text style={styles.paymentMethodsTitle}>Hỗ trợ thanh toán:</Text>
                    <View style={styles.paymentBadgesList}>
                      <View style={styles.paymentPill}><Text style={styles.paymentPillText}>VNPAY</Text></View>
                      <View style={styles.paymentPill}><Text style={styles.paymentPillText}>MoMo</Text></View>
                      <View style={styles.paymentPill}><Text style={styles.paymentPillText}>Visa/Master</Text></View>
                      <View style={styles.paymentPill}><Text style={styles.paymentPillText}>COD</Text></View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR */}
      {!isDesktop && items.length > 0 && (
        <View style={styles.mobileBottomBar}>
          <View style={styles.mobileBottomInfo}>
            <Text style={styles.mobileBottomLabel}>Tổng thanh toán</Text>
            <Text style={styles.mobileBottomPrice}>{formatPrice(finalTotal)}</Text>
          </View>
          <Pressable
            style={[styles.mobileBottomBtn, selectedItems.length === 0 && styles.mobileBottomBtnDisabled]}
            onPress={() => {
              if (!user) {
                setAuthModalVisible(true);
                return;
              }
              if (selectedItems.length > 0) {
                router.push('/checkout' as any);
              }
            }}
            disabled={selectedItems.length === 0}
          >
            <Ionicons name="card" size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.mobileBottomBtnText}>
              {selectedItems.length === 0 ? 'Chưa chọn SP' : `Đặt hàng (${selectedItems.length})`}
            </Text>
          </Pressable>
        </View>
      )}

      <AuthRequiredModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        message="Bạn cần đăng nhập tài khoản để tiến hành đặt mua hàng."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 60,
  },
  innerWrapper: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  toast: {
    position: 'absolute',
    top: 75,
    right: 24,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  /* TOP HEADER & BREADCRUMB */
  topHeader: {
    marginBottom: 20,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  breadcrumbLink: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  breadcrumbSep: {
    fontSize: 13,
    color: '#94a3b8',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  countBadgeText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  continueLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  continueLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },

  /* SHIPPING BANNER */
  shippingBanner: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 20,
  },
  shippingBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  shippingBannerText: {
    fontSize: 13,
    color: '#334155',
  },
  shippingPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#dbeafe',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },

  /* EMPTY STATE */
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
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
    maxWidth: 420,
    lineHeight: 20,
    marginBottom: 24,
  },
  shopNowBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  shopNowBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  /* MAIN GRID LAYOUT */
  mainGrid: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-start',
  },
  mainGridMobile: {
    flexDirection: 'column',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    width: 380,
  },

  /* BULK ACTIONS */
  bulkActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxTouch: {
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  bulkActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  deleteSelectedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteSelectedText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '600',
  },

  /* CART ITEMS */
  itemsList: {
    gap: 14,
  },
  cartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cartCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  imgWrap: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemCategoryBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  itemCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },
  trashBtn: {
    padding: 4,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
    marginBottom: 4,
  },
  productSpec: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  stockBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16a34a',
  },

  /* PRICE & STEPPER */
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  priceColumn: {
    gap: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#dc2626',
  },
  oldPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  savingBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16a34a',
  },

  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperValueWrap: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  stepperValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* TRUST ROW */
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  trustItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  trustItemSub: {
    fontSize: 11,
    color: '#64748b',
  },
  trustDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 12,
  },

  /* RIGHT COLUMN: SUMMARY CARD */
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },

  /* VOUCHER SECTION */
  voucherSection: {
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  voucherHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  voucherTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  removeVoucherText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  voucherInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  voucherInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  applyVoucherBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyVoucherBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  applyVoucherBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  voucherErrorText: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 4,
    fontWeight: '500',
  },
  appliedVoucherBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  appliedGreenIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedVoucherCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16a34a',
  },
  appliedTagBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  appliedTagBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  appliedVoucherDesc: {
    fontSize: 11,
    color: '#15803d',
    marginTop: 2,
  },
  removeVoucherBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherListHeader: {
    marginTop: 14,
    marginBottom: 8,
  },
  voucherListTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  voucherListSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  noVouchersBox: {
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  noVouchersText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  vouchersListWrap: {
    gap: 8,
    marginTop: 4,
  },
  voucherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 10,
    gap: 8,
  },
  voucherCardSelected: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  voucherCardIneligible: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  voucherCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  voucherCardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherCardIconBoxSelected: {
    backgroundColor: '#dcfce7',
  },
  voucherCardIconBoxIneligible: {
    backgroundColor: '#f1f5f9',
  },
  voucherCardDetails: {
    flex: 1,
  },
  voucherCardCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  voucherCardDiscount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  voucherCardLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  eligibleHintText: {
    fontSize: 10.5,
    color: '#16a34a',
    fontWeight: '600',
  },
  ineligibleHintText: {
    fontSize: 10.5,
    color: '#ea580c',
    fontWeight: '500',
  },
  textMuted: {
    color: '#94a3b8',
  },
  voucherCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  greenTickBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  greenTickText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  selectBtnBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  selectBtnBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lockedBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94a3b8',
  },

  /* BREAKDOWN */
  breakdownWrap: {
    gap: 10,
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  vatNote: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  totalNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#dc2626',
  },

  /* CHECKOUT BUTTON */
  checkoutBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  checkoutBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },

  /* PAYMENT BADGES */
  paymentMethodsRow: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  paymentMethodsTitle: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 8,
  },
  paymentBadgesList: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paymentPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },

  /* MOBILE STICKY BOTTOM BAR */
  mobileBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
    zIndex: 999,
  },
  mobileBottomInfo: {
    flex: 1,
  },
  mobileBottomLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  mobileBottomPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#dc2626',
    marginTop: 2,
  },
  mobileBottomBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mobileBottomBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  mobileBottomBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
});
