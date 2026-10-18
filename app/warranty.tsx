import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { apiService, type Order } from '@/services/api';
import { expandOrderUnits } from '@/utils/deviceUnits';

interface WarrantyItem {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  expiryDate?: string;
  warrantyRange?: string;
  warrantyPeriod: string;
  status: 'valid' | 'expiring' | 'expired';
  remainingDays: number;
  showroom: string;
  orderNumber?: string;
  orderId?: number | string;
  customerAddress?: string;
  customerPhone?: string;
  matchedPhone?: string;
  returnStatus?: 'pending' | 'approved' | 'rejected' | null;
  returnReason?: string;
  returnMedia?: string[];
  productImage?: string;
  price?: number;
}

// So khớp số điện thoại thông minh (hỗ trợ lệch 1 số do gõ nhầm hoặc 10/11 chữ số)
function isPhoneMatch(queryDigits: string, targetStr: string): boolean {
  if (!queryDigits || queryDigits.length < 6) return false;

  // 1. Khớp chuỗi trực tiếp
  if (targetStr.includes(queryDigits)) return true;

  // 2. Tìm tất cả các dãy số trong targetStr (8 - 12 chữ số)
  const phoneMatches = targetStr.match(/[0-9]{8,12}/g) || [];

  for (const phone of phoneMatches) {
    if (phone === queryDigits) return true;
    if (phone.includes(queryDigits) || queryDigits.includes(phone)) return true;

    // Bỏ số 0 ở đầu
    const pNoZero = phone.replace(/^0+/, '');
    const qNoZero = queryDigits.replace(/^0+/, '');
    if (pNoZero === qNoZero || pNoZero.includes(qNoZero) || qNoZero.includes(pNoZero)) return true;

    // So khớp sai lệch tối đa 1 ký tự (ví dụ: 0865752150 vs 08657525150)
    if (Math.abs(phone.length - queryDigits.length) <= 1) {
      let i = 0, j = 0, matchCount = 0;
      while (i < phone.length && j < queryDigits.length) {
        if (phone[i] === queryDigits[j]) {
          matchCount++;
          i++;
          j++;
        } else if (phone.length > queryDigits.length) {
          i++;
        } else {
          j++;
        }
      }
      if (matchCount >= Math.min(phone.length, queryDigits.length) - 1 && matchCount >= 8) {
        return true;
      }
    }
  }

  return false;
}

const WARRANTY_CATEGORIES = [
  {
    key: 'laptop',
    title: 'Laptop & MacBook',
    icon: 'laptop-outline',
    period: '12 - 36 Tháng',
    badge: '1 ĐỔI 1 TRONG 30 NGÀY',
    summary: 'Áp dụng cho Asus, Acer, Dell, HP, Lenovo, MSI, Apple.',
    rules: [
      'Đổi mới trong vòng 30 ngày đầu tiên nếu máy phát sinh lỗi phần cứng do nhà sản xuất.',
      'Bảo hành chính hãng 12 - 36 tháng theo tiêu chuẩn hãng sản xuất.',
      'Miễn phí vệ sinh máy, tra keo tản nhiệt cao cấp trọn đời sử dụng tại DANGVINHPC.',
      'Hỗ trợ cài đặt phần mềm, cân màu màn hình chuẩn đồ họa miễn phí.',
      'Hỗ trợ gửi hãng bảo hành tận nhà với dòng máy có gói Onsite Support (Dell ProSupport, HP Onsite, Lenovo Premier).',
    ],
  },
  {
    key: 'pc',
    title: 'PC Gaming & Máy bộ DPC',
    icon: 'desktop-outline',
    period: '36 Tháng Từng Linh Kiện',
    badge: 'BẢO HÀNH TẬN NƠI',
    summary: 'Tất cả cấu hình PC lắp ráp & máy bộ văn phòng chính hãng.',
    rules: [
      'Linh kiện cấu thành dàn PC được bảo hành chính hãng từ 24 đến 36 tháng theo tem nhà phân phối.',
      '1 đổi 1 ngay lập tức trong 30 ngày đầu cho bất kỳ linh kiện nào bị lỗi phần cứng.',
      'Hỗ trợ mượn linh kiện thay thế tạm thời (VGA, Nguồn, RAM) nếu thời gian bảo hành hãng kéo dài.',
      'Miễn phí bảo dưỡng, vệ sinh bụi, kiểm tra hệ thống định kỳ trọn đời dàn máy.',
      'Bảo hành tận nơi trong nội thành Hải Dương và TP.HCM trong 12 tháng đầu tiên.',
    ],
  },
  {
    key: 'component',
    title: 'Linh kiện (CPU, Main, VGA, RAM, SSD)',
    icon: 'hardware-chip-outline',
    period: '24 - 36 Tháng',
    badge: 'ĐỔI MỚI 7 NGÀY',
    summary: 'Intel, AMD, ASUS, GIGABYTE, MSI, Corsair, Kingston, Samsung...',
    rules: [
      '1 đổi 1 ngay linh kiện mới trong 7 ngày đầu nếu phát sinh lỗi kỹ thuật.',
      'CPU Tray hoặc Box bảo hành 36 tháng chính hãng theo số Serial / Batch.',
      'VGA: Bảo hành chính hãng 36 tháng. Hỗ trợ gửi bảo hành cháy nổ với các hãng có chính sách đặc biệt (ASUS, MSI, GIGABYTE).',
      'RAM / Ổ cứng SSD: Đổi mới ngay khi xác định lỗi bad sector, chết chip nhớ trong suốt thời gian bảo hành.',
      'Nguồn máy tính (PSU): Bảo hành 36 - 120 tháng theo chuẩn 80 Plus của nhà sản xuất.',
    ],
  },
  {
    key: 'monitor',
    title: 'Màn hình máy tính',
    icon: 'tv-outline',
    period: '24 - 36 Tháng',
    badge: 'CHÍNH HÃNG 100%',
    summary: 'Dell, LG, ASUS, Samsung, ViewSonic, AOC, Gigabyte, BenQ...',
    rules: [
      'Đổi mới trong 30 ngày đầu tiên nếu phát sinh lỗi kỹ thuật hoặc lỗi sọc panel.',
      'Chính sách điểm chết (Bright / Dark Dots): Áp dụng chuẩn bảo hành Zero Bright Dot theo quy chuẩn của từng hãng sản xuất.',
      'Màn hình Dell, LG hỗ trợ đổi mới tại nhà theo gói dịch vụ cao cấp của hãng.',
      'Không bảo hành trường hợp nứt vỡ panel, chảy mực do va đập ngoại lực hoặc ẩm mốc, côn trùng.',
    ],
  },
  {
    key: 'gear',
    title: 'Gaming Gear & Phụ kiện',
    icon: 'game-controller-outline',
    period: '12 - 24 Tháng',
    badge: 'ĐỔI MỚI LINH HOẠT',
    summary: 'Bàn phím cơ, Chuột, Tai nghe, Tay cầm, Loa, Webcam...',
    rules: [
      '1 đổi 1 trong 15 ngày đầu nếu sản phẩm bị lỗi click đúp (double-click), kẹt switch, đứt ngầm dây.',
      'Bảo hành 12 - 24 tháng theo số Serial hoặc hộp sản phẩm.',
      'Hỗ trợ thay switch, thay feet chuột, sửa chữa chi phí ưu đãi sau khi hết hạn bảo hành.',
    ],
  },
  {
    key: 'chair',
    title: 'Ghế & Bàn công thái học',
    icon: 'briefcase-outline',
    period: '12 - 24 Tháng',
    badge: 'BẢO HÀNH PISTON',
    summary: 'Ghế Gaming, Ghế công thái học Ergonomic, Bàn nâng hạ điện...',
    rules: [
      'Bảo hành 12 - 24 tháng đối với piston thủy lực nâng hạ, khung chân và cơ chế ngả lưng.',
      'Động cơ bàn nâng hạ điện tử: Bảo hành đổi mới motor và bảng điều khiển trong 24 tháng.',
      'Không bảo hành hao mòn tự nhiên về bề mặt da, lưới rách do vật nhọn hoặc tàn thuốc.',
    ],
  },
];

export default function WarrantyScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user, isDark } = useAppContext();

  // Search input & lookup state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<WarrantyItem[]>([]);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  // Đơn hàng gần nhất của tài khoản đăng nhập để gợi ý tra cứu
  const [userRecentOrder, setUserRecentOrder] = useState<Order | null>(null);

  const { query: urlQuery } = useLocalSearchParams<{ query?: string }>();

  React.useEffect(() => {
    if (urlQuery && typeof urlQuery === 'string' && urlQuery.trim()) {
      handleLookup(urlQuery.trim());
    }
  }, [urlQuery]);

  React.useEffect(() => {
    if (user?.id) {
      apiService
        .getOrders(user.id)
        .then((orders) => {
          if (orders && orders.length > 0) {
            setUserRecentOrder(orders[0]);
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  // Category Tab Selection
  const [activeTab, setActiveTab] = useState('laptop');

  const selectedCategory = useMemo(() => {
    return WARRANTY_CATEGORIES.find((c) => c.key === activeTab) || WARRANTY_CATEGORIES[0];
  }, [activeTab]);

  const handleLookup = async (queryOverride?: string) => {
    const rawQuery = (typeof queryOverride === 'string' ? queryOverride : searchQuery).trim();
    if (!rawQuery) return;

    if (typeof queryOverride === 'string') {
      setSearchQuery(queryOverride);
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // 1. Lấy toàn bộ đơn hàng thực tế từ hệ thống cơ sở dữ liệu
      const orders = await apiService.getOrders().catch(() => []);

      const cleanQuery = rawQuery.toLowerCase();
      const cleanDigits = rawQuery.replace(/[^0-9]/g, '');

      let matchedItems: WarrantyItem[] = [];

      // 2. Tra cứu trong các đơn hàng thực tế
      orders.forEach((order: Order) => {
        if (order.status === 'cancelled') return;
        const unitItems = expandOrderUnits(order.items || []);
        const orderNum = (order.orderNumber || String(order.id)).toLowerCase();
        const address = (order.shippingAddress || '').toLowerCase();

        // Khớp mã Serial Number / IMEI hãng (ví dụ: BH-..., PF4A9X21, hoặc serial nhập riêng)
        const matchesUnit = (it: typeof unitItems[number]) =>
          [it.serialNumber, it.manufacturerSerial, it.legacySerialNumber]
            .some(value => value?.toLowerCase().includes(cleanQuery));
        const matchSerial = unitItems.some(matchesUnit);

        // Khớp mã đơn hàng (ví dụ: 1791707088214 hoặc ORD-1791707088214)
        const matchOrderCode =
          orderNum.includes(cleanQuery) ||
          (cleanDigits.length >= 4 && (orderNum.includes(cleanDigits) || String(order.id).includes(cleanDigits)));

        // Khớp số điện thoại thông minh (hỗ trợ cả lệch 1 số: 0865752150 vs 08657525150)
        const matchPhone = isPhoneMatch(cleanDigits, address);

        // Khớp tên khách / địa chỉ hoặc tên linh kiện
        const matchAddressOrName = address.includes(cleanQuery);
        const matchItems = order.items?.some((it) => it.name?.toLowerCase().includes(cleanQuery));

        // Nếu tra bằng số IMEI/Serial máy hoặc Mã đơn -> hiển thị ngay lập tức (miễn là đơn không bị hủy)
        // Nếu tra bằng SĐT -> chỉ hiển thị các đơn đã giao hàng / hoàn tất hoặc đang giao
        const isEligibleStatus =
          matchSerial ||
          matchOrderCode ||
          ['delivered', 'completed', 'shipping'].includes(order.status);

        if (!isEligibleStatus) return;

        if (matchOrderCode || matchPhone || matchAddressOrName || matchItems || matchSerial) {
          const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
          const phoneOnOrder = address.match(/0[0-9]{8,10}/)?.[0];

          unitItems.filter(item => !matchSerial || matchesUnit(item)).forEach((prodItem) => {
            const nameLower = (prodItem.name || '').toLowerCase();
            let cat = 'Linh kiện PC';
            let months = prodItem.warrantyMonths || 36;
            let period = `${months} Tháng`;

            if (!prodItem.warrantyMonths) {
              if (nameLower.includes('laptop') || nameLower.includes('macbook')) {
                cat = 'Laptop & Máy tính xách tay';
                period = '24 Tháng';
                months = 24;
              } else if (nameLower.includes('màn hình') || nameLower.includes('monitor')) {
                cat = 'Màn hình Gaming';
                period = '36 Tháng';
                months = 36;
              } else if (nameLower.includes('rtx') || nameLower.includes('vga') || nameLower.includes('card')) {
                cat = 'VGA / Card đồ họa';
                period = '36 Tháng';
                months = 36;
              } else if (nameLower.includes('cpu') || nameLower.includes('ram') || nameLower.includes('ssd') || nameLower.includes('mainboard') || nameLower.includes('pc')) {
                cat = 'Linh kiện máy tính';
                period = '36 Tháng';
                months = 36;
              } else if (nameLower.includes('chuột') || nameLower.includes('bàn phím') || nameLower.includes('tai nghe')) {
                cat = 'Gaming Gear';
                period = '12 Tháng';
                months = 12;
              }
            } else {
              period = `${months} Tháng`;
              if (nameLower.includes('laptop') || nameLower.includes('macbook')) cat = 'Laptop & Máy tính xách tay';
              else if (nameLower.includes('màn hình')) cat = 'Màn hình Gaming';
            }

            const itemExpiryDate = new Date(orderDate);
            itemExpiryDate.setMonth(itemExpiryDate.getMonth() + months);
            if (prodItem.warrantyExpiry) {
              const parts = prodItem.warrantyExpiry.split('/').map(Number);
              if (parts.length === 3 && parts.every(Number.isFinite)) {
                itemExpiryDate.setFullYear(parts[2], parts[1] - 1, parts[0]);
              }
            }

            const pad = (n: number) => String(n).padStart(2, '0');
            const formatD = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

            const itemPurchaseStr = prodItem.purchaseDate || formatD(orderDate);
            const itemExpiryStr = prodItem.warrantyExpiry || formatD(itemExpiryDate);
            const itemWarrantyRange = prodItem.warrantyRange || `${itemPurchaseStr} đến ${itemExpiryStr}`;

            const diffMs = itemExpiryDate.getTime() - Date.now();
            const remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

            const serialNumber = `${prodItem.serialNumber}${prodItem.manufacturerSerial ? ` (S/N: ${prodItem.manufacturerSerial})` : ''}`;

            matchedItems.push({
              id: `RMA-${order.id}-${prodItem.serialNumber}`,
              name: prodItem.name,
              category: cat,
              serialNumber,
              purchaseDate: itemPurchaseStr,
              expiryDate: itemExpiryStr,
              warrantyRange: itemWarrantyRange,
              warrantyPeriod: period,
              status: remainingDays > 0 ? 'valid' : 'expired',
              remainingDays,
              showroom: '191 Nguyễn Thị Duệ, TP. Hải Dương & 123 Lê Lợi, Q.1, TP.HCM',
              orderNumber: order.orderNumber || String(order.id),
              orderId: order.id,
              customerAddress: order.shippingAddress,
              matchedPhone: phoneOnOrder,
              returnStatus: order.returnStatus as any,
              returnReason: order.returnReason,
              returnMedia: order.returnMedia,
              productImage: prodItem.image,
              price: prodItem.price,
            });
          });
        }
      });

      // 3. Nếu không có đơn hàng khớp, kiểm tra mảng mock data cũ dự phòng
      setSearchResult(matchedItems);
    } catch (err) {
      console.error('Error looking up warranty:', err);
      setSearchResult([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCallHotline = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  return (
    <View style={StyleSheet.flatten([styles.pageWrapper, isDark ? styles.pageDark : null])}>
      <Header />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ==================== BREADCRUMB BAR ==================== */}
        <View style={styles.breadcrumbBar}>
          <Pressable
            style={StyleSheet.flatten([styles.breadcrumbTouch, isDark ? styles.breadcrumbTouchDark : null])}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="home-outline" size={14} color={isDark ? '#60a5fa' : '#2563eb'} style={{ marginRight: 6 }} />
            <Text style={StyleSheet.flatten([styles.breadcrumbLink, isDark ? { color: '#60a5fa' } : null])}>Trang chủ</Text>
          </Pressable>
          <Text style={StyleSheet.flatten([styles.breadcrumbSep, isDark ? styles.textMutedDark : null])}>/</Text>
          <Text style={StyleSheet.flatten([styles.breadcrumbCurrent, isDark ? styles.textDark : null])}>Chính sách bảo hành</Text>
        </View>

        {/* ==================== HERO SECTION BANNER ==================== */}
        <View style={StyleSheet.flatten([styles.heroCard, isMobile ? styles.heroCardMobile : null, isDark ? styles.heroCardDark : null])}>
          <View style={styles.heroTextContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="shield-checkmark" size={15} color="#2563eb" style={{ marginRight: 6 }} />
              <Text style={styles.heroBadgeText}>DANGVINHPC CARE & WARRANTY</Text>
            </View>
            <Text style={StyleSheet.flatten([styles.heroTitle, isMobile ? styles.heroTitleMobile : null, isDark ? styles.textDark : null])}>
              CHÍNH SÁCH BẢO HÀNH CHÍNH HÃNG
            </Text>
            <Text style={StyleSheet.flatten([styles.heroSubtitle, isDark ? styles.textMutedDark : null])}>
              Cam kết dịch vụ sau bán hàng chuyên nghiệp, xử lý siêu tốc, linh kiện chính hãng 100% và luôn đặt quyền lợi của khách hàng lên hàng đầu.
            </Text>

            {/* Quick Contact Chips */}
            <View style={styles.quickContactRow}>
              <Pressable
                style={styles.hotlinePill}
                onPress={() => handleCallHotline('18006868')}
              >
                <Ionicons name="call" size={15} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.hotlinePillText}>Tổng đài CSKH: 1800 6868 (Miễn cước)</Text>
              </Pressable>

              <Pressable
                style={StyleSheet.flatten([styles.hotlinePillSecondary, isDark ? styles.hotlinePillDark : null])}
                onPress={() => handleCallHotline('0900000000')}
              >
                <Ionicons name="hardware-chip-outline" size={15} color="#2563eb" style={{ marginRight: 6 }} />
                <Text style={styles.hotlineSecondaryText}>Kỹ thuật: 0900 000 000</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ==================== TOOL TRA CỨU BẢO HÀNH ONLINE ==================== */}
        <View style={StyleSheet.flatten([styles.lookupCard, isMobile ? styles.lookupCardMobile : null, isDark ? styles.lookupCardDark : null])}>
          <View style={styles.lookupHeader}>
            <View style={styles.lookupIconWrap}>
              <Ionicons name="search" size={20} color="#2563eb" />
            </View>
            <View style={styles.lookupHeaderTextWrap}>
              <Text style={StyleSheet.flatten([styles.lookupTitle, isMobile ? styles.lookupTitleMobile : null, isDark ? styles.textDark : null])}>
                TRA CỨU THÔNG TIN BẢO HÀNH TRỰC TUYẾN
              </Text>
              <Text style={StyleSheet.flatten([styles.lookupSub, isMobile ? styles.lookupSubMobile : null, isDark ? styles.textMutedDark : null])}>
                Nhập số điện thoại mua hàng, số Serial Number hoặc mã đơn hàng để kiểm tra thời hạn
              </Text>
            </View>
          </View>

          <View style={styles.searchBarRow}>
            <View style={StyleSheet.flatten([styles.inputBox, searchFocused ? styles.inputBoxFocused : null, isDark ? styles.inputBoxDark : null])}>
              <Ionicons name="barcode-outline" size={20} color={searchFocused ? '#2563eb' : '#94a3b8'} style={{ marginRight: 10 }} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Nhập SĐT mua hàng (VD: 0865752150), mã đơn hàng hoặc số Serial..."
                placeholderTextColor="#94a3b8"
                style={StyleSheet.flatten([styles.input, isDark ? styles.textDark : null])}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onSubmitEditing={handleLookup}
              />
              {searchQuery ? (
                <Pressable onPress={() => { setSearchQuery(''); setHasSearched(false); setSearchResult([]); }}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </Pressable>
              ) : null}
            </View>

            <Pressable
              style={styles.lookupBtn}
              onPress={handleLookup}
            >
              {isSearching ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="search-outline" size={17} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.lookupBtnText}>Kiểm tra ngay</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* GỢI Ý ĐƠN HÀNG NHANH CỦA TÀI KHOẢN ĐĂNG NHẬP */}
          {userRecentOrder ? (
            <View style={styles.quickSuggestRow}>
              <Text style={[styles.quickSuggestLabel, isDark && styles.textMutedDark]}>
                ⚡ Gợi ý đơn của bạn:
              </Text>
              <Pressable
                style={styles.quickSuggestPill}
                onPress={() => handleLookup(userRecentOrder.orderNumber || String(userRecentOrder.id))}
              >
                <Ionicons name="receipt-outline" size={13} color="#2563eb" />
                <Text style={styles.quickSuggestPillText}>
                  Đơn #{userRecentOrder.orderNumber || userRecentOrder.id}
                </Text>
              </Pressable>
              {userRecentOrder.shippingAddress?.match(/0[0-9]{8,10}/)?.[0] ? (
                <Pressable
                  style={[styles.quickSuggestPill, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}
                  onPress={() => {
                    const phone = userRecentOrder.shippingAddress?.match(/0[0-9]{8,10}/)?.[0] || '';
                    handleLookup(phone);
                  }}
                >
                  <Ionicons name="call-outline" size={13} color="#15803d" />
                  <Text style={[styles.quickSuggestPillText, { color: '#15803d' }]}>
                    SĐT: {userRecentOrder.shippingAddress?.match(/0[0-9]{8,10}/)?.[0]}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {/* LOOKUP RESULTS */}
          {hasSearched ? (
            <View style={styles.resultContainer}>
              {searchResult.length > 0 ? (
                <View style={styles.resultList}>
                  <Text style={styles.resultCountText}>
                    Tìm thấy <Text style={{ fontWeight: '800', color: '#2563eb' }}>{searchResult.length}</Text> thiết bị trong hệ thống bảo hành:
                  </Text>
                  {searchResult.map((item) => (
                    <View key={item.id} style={StyleSheet.flatten([styles.resultItemCard, isDark ? styles.resultItemCardDark : null])}>
                      <View style={styles.resultItemTop}>
                        <View style={{ flex: 1 }}>
                          <View style={styles.catBadgeWrap}>
                            <Text style={styles.catBadgeText}>{item.category}</Text>
                            <Text style={styles.codeText}>Mã phiếu: {item.id}</Text>
                          </View>
                          <Text style={StyleSheet.flatten([styles.itemTitle, isDark ? styles.textDark : null])}>{item.name}</Text>
                          <Text style={StyleSheet.flatten([styles.serialText, isDark ? styles.textMutedDark : null])}>
                            Serial: <Text style={{ fontWeight: '700', color: isDark ? '#f8fafc' : '#0f172a' }}>{item.serialNumber}</Text>
                          </Text>
                          {item.matchedPhone ? (
                            <Text style={[styles.serialText, isDark && styles.textMutedDark, { marginTop: 2 }]}>
                              📞 SĐT nhận hàng: <Text style={{ fontWeight: '700', color: isDark ? '#f8fafc' : '#0f172a' }}>{item.matchedPhone}</Text>
                            </Text>
                          ) : null}
                        </View>
                        {item.returnStatus === 'approved' ? (
                          <View style={[styles.statusBadgeValid, { backgroundColor: '#dcfce7', borderColor: '#86efac' }]}>
                            <Ionicons name="checkmark-circle" size={14} color="#15803d" style={{ marginRight: 4 }} />
                            <Text style={[styles.statusBadgeText, { color: '#15803d' }]}>Đã duyệt đổi mới</Text>
                          </View>
                        ) : item.returnStatus === 'pending' ? (
                          <View style={[styles.statusBadgeValid, { backgroundColor: '#fef3c7', borderColor: '#fde047' }]}>
                            <Ionicons name="time" size={14} color="#b45309" style={{ marginRight: 4 }} />
                            <Text style={[styles.statusBadgeText, { color: '#b45309' }]}>Chờ duyệt đổi trả</Text>
                          </View>
                        ) : (
                          <View style={styles.statusBadgeValid}>
                            <Ionicons name="shield-checkmark" size={14} color="#15803d" style={{ marginRight: 4 }} />
                            <Text style={styles.statusBadgeText}>Còn bảo hành</Text>
                          </View>
                        )}
                      </View>

                      {/* HỒ SƠ ĐỔI TRẢ & BẢO HÀNH NẾU CÓ */}
                      {item.returnStatus ? (
                        <View
                          style={[
                            styles.returnNoticeCard,
                            item.returnStatus === 'approved'
                              ? styles.returnApprovedBg
                              : item.returnStatus === 'pending'
                              ? styles.returnPendingBg
                              : styles.returnRejectedBg,
                          ]}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <Ionicons
                              name={
                                item.returnStatus === 'approved'
                                  ? 'checkmark-circle'
                                  : item.returnStatus === 'pending'
                                  ? 'time'
                                  : 'close-circle'
                              }
                              size={16}
                              color={
                                item.returnStatus === 'approved'
                                  ? '#15803d'
                                  : item.returnStatus === 'pending'
                                  ? '#b45309'
                                  : '#b91c1c'
                              }
                            />
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: '800',
                                color:
                                  item.returnStatus === 'approved'
                                    ? '#15803d'
                                    : item.returnStatus === 'pending'
                                    ? '#b45309'
                                    : '#b91c1c',
                              }}
                            >
                              {item.returnStatus === 'approved'
                                ? 'HỒ SƠ BẢO HÀNH ĐÃ DUYỆT: CHẤP THUẬN ĐỔI MỚI 1-1'
                                : item.returnStatus === 'pending'
                                ? 'HỒ SƠ ĐANG CHỜ KỸ THUẬT VIÊN XÉT DUYỆT'
                                : 'HỒ SƠ BẢO HÀNH KHÔNG ĐƯỢC CHẤP THUẬN'}
                            </Text>
                          </View>

                          <Text style={{ fontSize: 12, color: '#334155', lineHeight: 18 }}>
                            Lỗi ghi nhận: <Text style={{ fontWeight: '700' }}>{item.returnReason || 'Sản phẩm lỗi kỹ thuật / nứt vỡ khi vận chuyển'}</Text>
                          </Text>

                          {item.returnStatus === 'approved' && (
                            <Text style={{ fontSize: 12, color: '#166534', marginTop: 4, fontWeight: '600', lineHeight: 18 }}>
                              ✅ DANGVINHPC đã duyệt đổi mới thiết bị. Kỹ thuật viên / bưu tá sẽ liên hệ qua điện thoại để thu hồi sản phẩm lỗi và bàn giao sản phẩm mới 100% tận nơi.
                            </Text>
                          )}

                          {/* Minh chứng ảnh từ khách */}
                          {item.returnMedia && item.returnMedia.length > 0 && (
                            <View style={{ marginTop: 8 }}>
                              <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748b', marginBottom: 4 }}>
                                📸 Minh chứng ảnh từ khách ({item.returnMedia.length} file - nhấn để phóng to):
                              </Text>
                              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 6 }}>
                                {item.returnMedia.map((mediaUrl: string, mIdx: number) => (
                                  <Pressable
                                    key={mIdx}
                                    style={styles.proofThumb}
                                    onPress={() => setPreviewMediaUrl(mediaUrl)}
                                  >
                                    <Image source={{ uri: mediaUrl }} style={styles.proofThumbImg} resizeMode="cover" />
                                    <View style={styles.proofZoomIcon}>
                                      <Ionicons name="scan-outline" size={11} color="#ffffff" />
                                    </View>
                                  </Pressable>
                                ))}
                              </ScrollView>
                            </View>
                          )}
                        </View>
                      ) : null}

                      {/* BANNER THỜI HẠN BẢO HÀNH DỰ KIẾN */}
                      <View
                        style={{
                          backgroundColor: isDark ? '#1e293b' : '#f0fdf4',
                          borderWidth: 1,
                          borderColor: isDark ? '#334155' : '#bbf7d0',
                          borderRadius: 10,
                          padding: 10,
                          marginHorizontal: 14,
                          marginBottom: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 8,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="shield-checkmark" size={16} color="#16a34a" />
                          </View>
                          <View>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                              Thời hạn bảo hành dự kiến
                            </Text>
                            <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#4ade80' : '#15803d' }}>
                              {item.warrantyRange || `${item.purchaseDate} đến ${item.expiryDate || 'N/A'}`}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            backgroundColor: item.remainingDays > 0 ? '#16a34a' : '#dc2626',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 20,
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '800', color: '#ffffff' }}>
                            {item.remainingDays > 0 ? `Còn ${item.remainingDays} ngày` : 'Hết hạn bảo hành'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.resultItemBottom}>
                        <View style={styles.infoCol}>
                          <Text style={styles.infoLabel}>Ngày mua máy</Text>
                          <Text style={StyleSheet.flatten([styles.infoValue, isDark ? styles.textDark : null])}>{item.purchaseDate}</Text>
                        </View>
                        <View style={styles.infoCol}>
                          <Text style={styles.infoLabel}>Gói bảo hành</Text>
                          <Text style={StyleSheet.flatten([styles.infoValue, isDark ? styles.textDark : null])}>{item.warrantyPeriod}</Text>
                        </View>
                        <View style={styles.infoCol}>
                          <Text style={styles.infoLabel}>Hạn đến ngày</Text>
                          <Text style={{ fontSize: 13, color: '#0284c7', fontWeight: '800' }}>
                            {item.expiryDate || 'Chính hãng'}
                          </Text>
                        </View>
                        <View style={styles.infoColWide}>
                          <Text style={styles.infoLabel}>Showroom tiếp nhận</Text>
                          <Text style={StyleSheet.flatten([styles.infoValue, isDark ? styles.textDark : null])} numberOfLines={1}>
                            {item.showroom}
                          </Text>
                        </View>
                      </View>

                      {item.orderId ? (
                        <View style={styles.cardFooterActions}>
                          <Text style={{ fontSize: 12, color: '#64748b' }}>
                            Mã đơn mua gốc: <Text style={{ fontWeight: '700', color: isDark ? '#f8fafc' : '#0f172a' }}>#{item.orderNumber}</Text>
                          </Text>
                          <Pressable
                            style={styles.btnViewOrder}
                            onPress={() => router.push(`/orders/${item.orderId}` as any)}
                          >
                            <Text style={styles.btnViewOrderText}>Xem chi tiết đơn hàng →</Text>
                          </Pressable>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noResultBox}>
                  <Ionicons name="alert-circle-outline" size={38} color="#94a3b8" />
                  <Text style={StyleSheet.flatten([styles.noResultTitle, isDark ? styles.textDark : null])}>
                    Không tìm thấy dữ liệu bảo hành
                  </Text>
                  <Text style={styles.noResultSub}>
                    Không tìm thấy sản phẩm nào khớp với từ khóa &quot;{searchQuery}&quot;. Hãy kiểm tra lại SĐT hoặc gọi tổng đài 1800 6868 để được hỗ trợ.
                  </Text>
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* ==================== 4 CAM KẾT VÀNG BẢO HÀNH ==================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={StyleSheet.flatten([styles.sectionHeading, isDark ? styles.textDark : null])}>
            4 CAM KẾT VÀNG TẠI DANGVINHPC
          </Text>
          <Text style={StyleSheet.flatten([styles.sectionSubHeading, isDark ? styles.textMutedDark : null])}>
            Quy chuẩn phục vụ hàng đầu cho mọi khách hàng mua sắm thiết bị công nghệ
          </Text>
        </View>

        <View style={styles.commitGrid}>
          <View style={StyleSheet.flatten([styles.commitCard, isDark ? styles.cardDark : null])}>
            <View style={styles.commitIconWrapBlue}>
              <Ionicons name="swap-horizontal" size={24} color="#2563eb" />
            </View>
            <Text style={StyleSheet.flatten([styles.commitTitle, isDark ? styles.textDark : null])}>1 ĐỔI 1 TRONG 30 NGÀY</Text>
            <Text style={StyleSheet.flatten([styles.commitDesc, isDark ? styles.textMutedDark : null])}>
              Đổi mới thiết bị ngay lập tức nếu máy bị lỗi phần cứng từ nhà sản xuất trong 30 ngày đầu tiên.
            </Text>
          </View>

          <View style={StyleSheet.flatten([styles.commitCard, isDark ? styles.cardDark : null])}>
            <View style={styles.commitIconWrapGreen}>
              <Ionicons name="flash-outline" size={24} color="#15803d" />
            </View>
            <Text style={StyleSheet.flatten([styles.commitTitle, isDark ? styles.textDark : null])}>XỬ LÝ SIÊU TỐC</Text>
            <Text style={StyleSheet.flatten([styles.commitDesc, isDark ? styles.textMutedDark : null])}>
              Chẩn đoán và thông báo tình trạng lỗi trong vòng 24h. Xử lý bảo hành hãng nhanh chóng trong 3 - 7 ngày.
            </Text>
          </View>

          <View style={StyleSheet.flatten([styles.commitCard, isDark ? styles.cardDark : null])}>
            <View style={styles.commitIconWrapYellow}>
              <Ionicons name="cube-outline" size={24} color="#b45309" />
            </View>
            <Text style={StyleSheet.flatten([styles.commitTitle, isDark ? styles.textDark : null])}>GIAO NHẬN TẬN NHÀ</Text>
            <Text style={StyleSheet.flatten([styles.commitDesc, isDark ? styles.textMutedDark : null])}>
              Hỗ trợ miễn phí tiếp nhận và gửi trả hàng bảo hành qua bưu cục toàn quốc đối với sản phẩm chính hãng.
            </Text>
          </View>

          <View style={StyleSheet.flatten([styles.commitCard, isDark ? styles.cardDark : null])}>
            <View style={styles.commitIconWrapPurple}>
              <Ionicons name="headset-outline" size={24} color="#7c3aed" />
            </View>
            <Text style={StyleSheet.flatten([styles.commitTitle, isDark ? styles.textDark : null])}>HỖ TRỢ THIẾT BỊ THAY THẾ</Text>
            <Text style={StyleSheet.flatten([styles.commitDesc, isDark ? styles.textMutedDark : null])}>
              Cho mượn linh kiện / Laptop dự phòng sử dụng tạm thời khi sản phẩm cần gửi hãng nước ngoài sửa chữa.
            </Text>
          </View>
        </View>

        {/* ==================== QUY ĐỊNH BẢO HÀNH THEO NGÀNH HÀNG ==================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={StyleSheet.flatten([styles.sectionHeading, isDark ? styles.textDark : null])}>
            QUY ĐỊNH BẢO HÀNH CHI TIẾT THEO NGÀNH HÀNG
          </Text>
          <Text style={StyleSheet.flatten([styles.sectionSubHeading, isDark ? styles.textMutedDark : null])}>
            Nhấn chọn danh mục để xem chi tiết thời hạn và quy chuẩn bảo hành của từng dòng sản phẩm
          </Text>
        </View>

        {/* Category Selector Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {WARRANTY_CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setActiveTab(cat.key)}
                style={StyleSheet.flatten([
                  styles.catTabChip,
                  isDark ? styles.catTabChipDark : null,
                  isActive ? styles.catTabChipActive : null,
                ])}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={17}
                  color={isActive ? '#ffffff' : (isDark ? '#60a5fa' : '#2563eb')}
                  style={{ marginRight: 6 }}
                />
                <Text style={StyleSheet.flatten([styles.catTabText, isDark ? styles.textDark : null, isActive ? styles.catTabTextActive : null])}>
                  {cat.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Selected Category Policy Content */}
        <View style={StyleSheet.flatten([styles.policyDetailCard, isMobile ? styles.policyDetailCardMobile : null, isDark ? styles.cardDark : null])}>
          <View style={styles.policyHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.policyBadgeRow}>
                <View style={styles.timeBadge}>
                  <Ionicons name="time-outline" size={14} color="#2563eb" style={{ marginRight: 4 }} />
                  <Text style={styles.timeBadgeText}>{selectedCategory.period}</Text>
                </View>
                <View style={styles.specialBadge}>
                  <Text style={styles.specialBadgeText}>{selectedCategory.badge}</Text>
                </View>
              </View>
              <Text style={StyleSheet.flatten([styles.policyMainTitle, isDark ? styles.textDark : null])}>{selectedCategory.title}</Text>
              <Text style={styles.policySummary}>{selectedCategory.summary}</Text>
            </View>
          </View>

          <View style={styles.rulesList}>
            {selectedCategory.rules.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <View style={styles.checkIconWrap}>
                  <Ionicons name="checkmark-circle" size={18} color="#2563eb" />
                </View>
                <Text style={StyleSheet.flatten([styles.ruleText, isDark ? styles.textDark : null])}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ==================== QUY TRÌNH 4 BƯỚC TIẾP NHẬN BẢO HÀNH ==================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={StyleSheet.flatten([styles.sectionHeading, isDark ? styles.textDark : null])}>
            QUY TRÌNH TIẾP NHẬN BẢO HÀNH 4 BƯỚC
          </Text>
        </View>

        <View style={styles.processStepsRow}>
          <View style={StyleSheet.flatten([styles.stepItem, isDark ? styles.cardDark : null])}>
            <View style={styles.stepNumberBadge}><Text style={styles.stepNumText}>1</Text></View>
            <Text style={StyleSheet.flatten([styles.stepTitle, isDark ? styles.textDark : null])}>Tiếp nhận thiết bị</Text>
            <Text style={styles.stepDesc}>
              Khách hàng mang sản phẩm trực tiếp đến Showroom hoặc gửi chuyển phát nhanh miễn cước.
            </Text>
          </View>

          <View style={StyleSheet.flatten([styles.stepItem, isDark ? styles.cardDark : null])}>
            <View style={styles.stepNumberBadge}><Text style={styles.stepNumText}>2</Text></View>
            <Text style={StyleSheet.flatten([styles.stepTitle, isDark ? styles.textDark : null])}>Chẩn đoán kỹ thuật</Text>
            <Text style={styles.stepDesc}>
              Kỹ thuật viên kiểm tra phần cứng, xác định lỗi và thông báo phương án xử lý trong 24h.
            </Text>
          </View>

          <View style={StyleSheet.flatten([styles.stepItem, isDark ? styles.cardDark : null])}>
            <View style={styles.stepNumberBadge}><Text style={styles.stepNumText}>3</Text></View>
            <Text style={StyleSheet.flatten([styles.stepTitle, isDark ? styles.textDark : null])}>Xử lý & Đổi mới</Text>
            <Text style={styles.stepDesc}>
              Tiến hành đổi mới linh kiện ngay hoặc gửi hãng bảo hành theo tiêu chuẩn chính hãng.
            </Text>
          </View>

          <View style={StyleSheet.flatten([styles.stepItem, isDark ? styles.cardDark : null])}>
            <View style={styles.stepNumberBadge}><Text style={styles.stepNumText}>4</Text></View>
            <Text style={StyleSheet.flatten([styles.stepTitle, isDark ? styles.textDark : null])}>Bàn giao & Hỗ trợ</Text>
            <Text style={styles.stepDesc}>
              Kiểm tra vận hành (burn-in test), vệ sinh sạch sẽ và bàn giao lại tận tay khách hàng.
            </Text>
          </View>
        </View>

        {/* ==================== ĐIỀU KIỆN ĐƯỢC BẢO HÀNH VÀ TỪ CHỐI ==================== */}
        <View style={styles.conditionCompareGrid}>
          {/* Cột được bảo hành */}
          <View style={StyleSheet.flatten([styles.conditionCol, isDark ? styles.cardDark : null, styles.conditionValidBorder])}>
            <View style={styles.condHeader}>
              <Ionicons name="checkmark-done-circle" size={24} color="#15803d" />
              <Text style={styles.condTitleValid}>ĐIỀU KIỆN ĐƯỢC BẢO HÀNH</Text>
            </View>
            <View style={styles.condList}>
              <Text style={StyleSheet.flatten([styles.condItem, isDark ? styles.textMutedDark : null])}>
                • Sản phẩm do DANGVINHPC trực tiếp phân phối và còn trong thời hạn bảo hành.
              </Text>
              <Text style={StyleSheet.flatten([styles.condItem, isDark ? styles.textMutedDark : null])}>
                • Tem bảo hành, tem niêm phong và mã vạch Serial Number còn nguyên vẹn, không rách rời, chắp vá hay bôi xóa.
              </Text>
              <Text style={StyleSheet.flatten([styles.condItem, isDark ? styles.textMutedDark : null])}>
                • Sản phẩm phát sinh lỗi phần cứng do nhà sản xuất trong điều kiện sử dụng bình thường.
              </Text>
              <Text style={StyleSheet.flatten([styles.condItem, isDark ? styles.textMutedDark : null])}>
                • Màn hình đủ điều kiện số điểm chết theo quy chuẩn công bố của từng hãng.
              </Text>
            </View>
          </View>

          {/* Cột từ chối bảo hành */}
          <View style={StyleSheet.flatten([styles.conditionCol, isDark ? styles.cardDark : null, styles.conditionInvalidBorder])}>
            <View style={styles.condHeader}>
              <Ionicons name="close-circle" size={24} color="#b91c1c" />
              <Text style={styles.condTitleInvalid}>TRƯỜNG HỢP TỪ CHỐI BẢO HÀNH</Text>
            </View>
            <View style={styles.condList}>
              <Text style={StyleSheet.flatten([styles.condItem, isDark ? styles.textMutedDark : null])}>
                • Sản phẩm có dấu hiệu rơi vỡ, nứt mẻ, móp méo, biến dạng vật lý hoặc rách mạch PCB.
              </Text>
              <Text style={StyleSheet.flatten([styles.condItem, isDark ? styles.textMutedDark : null])}>
                • Sản phẩm bị ẩm ướt, vô nước, rỉ sét, oxy hóa hoặc côn trùng (kiến, gián) xâm nhập.
              </Text>
              <Text style={StyleSheet.flatten([styles.condItem, isDark ? styles.textMutedDark : null])}>
                • Cháy nổ, phù tụ, nứt chip do nguồn điện không ổn định, sét đánh hoặc sử dụng sai quy cách.
              </Text>
              <Text style={StyleSheet.flatten([styles.condItem, isDark ? styles.textMutedDark : null])}>
                • Thiết bị đã bị can thiệp sửa chữa, mod tản nhiệt, flash BIOS tùy chỉnh bởi bên thứ ba không được ủy quyền.
              </Text>
            </View>
          </View>
        </View>

        {/* ==================== TRUNG TÂM TIẾP NHẬN BẢO HÀNH ==================== */}
        <View style={StyleSheet.flatten([styles.centerCard, isMobile ? styles.centerCardMobile : null, isDark ? styles.cardDark : null])}>
          <Text style={StyleSheet.flatten([styles.centerCardTitle, isDark ? styles.textDark : null])}>
            ĐỊA ĐIỂM TIẾP NHẬN BẢO HÀNH DANGVINHPC
          </Text>

          <View style={styles.addressGrid}>
            <View style={StyleSheet.flatten([styles.addressItem, isDark ? styles.addressItemDark : null])}>
              <View style={styles.addrIconWrap}>
                <Ionicons name="location" size={20} color="#2563eb" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={StyleSheet.flatten([styles.addrName, isDark ? styles.textDark : null])}>TRUNG TÂM BẢO HÀNH HẢI DƯƠNG</Text>
                <Text style={StyleSheet.flatten([styles.addrText, isDark ? styles.textMutedDark : null])}>
                  191 Nguyễn Thị Duệ, Phường Thanh Bình, TP. Hải Dương
                </Text>
                <Text style={styles.addrPhone}>Hotline: 0900 000 000 (8:30 - 21:30)</Text>
              </View>
            </View>

            <View style={StyleSheet.flatten([styles.addressItem, isDark ? styles.addressItemDark : null])}>
              <View style={styles.addrIconWrap}>
                <Ionicons name="location" size={20} color="#2563eb" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={StyleSheet.flatten([styles.addrName, isDark ? styles.textDark : null])}>TRUNG TÂM TIẾP NHẬN TP. HỒ CHÍ MINH</Text>
                <Text style={StyleSheet.flatten([styles.addrText, isDark ? styles.textMutedDark : null])}>
                  123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                </Text>
                <Text style={styles.addrPhone}>Hotline: 0909 123 456 (8:30 - 21:30)</Text>
              </View>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>

      {/* MODAL LIGHTBOX XEM ẢNH MINH CHỨNG */}
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
                <Image
                  source={{ uri: previewMediaUrl }}
                  style={styles.lightboxImage}
                  resizeMode="contain"
                />
              ) : null}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#f4f8ff',
  },
  pageDark: {
    backgroundColor: '#0f172a',
  },
  scroll: {
    flex: 1,
  },
  breadcrumbBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  breadcrumbTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  breadcrumbTouchDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  breadcrumbLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  breadcrumbSep: {
    marginHorizontal: 8,
    color: '#94a3b8',
    fontSize: 13,
  },
  breadcrumbCurrent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  textDark: {
    color: '#f8fafc',
  },
  textMutedDark: {
    color: '#94a3b8',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  heroCard: {
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
    padding: 28,
  },
  heroCardMobile: {
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 16,
  },
  heroCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  heroTextContent: {
    maxWidth: 900,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: '#2563eb',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroTitleMobile: {
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 20,
  },
  quickContactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hotlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  hotlinePillText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  hotlinePillSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  hotlinePillDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  hotlineSecondaryText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '800',
  },
  lookupCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    padding: 24,
  },
  lookupCardMobile: {
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 16,
  },
  lookupCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#3b82f6',
  },
  lookupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  lookupIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  lookupHeaderTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  lookupTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 24,
  },
  lookupTitleMobile: {
    fontSize: 15,
    lineHeight: 21,
  },
  lookupSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 18,
  },
  lookupSubMobile: {
    fontSize: 12,
    lineHeight: 16,
  },
  searchBarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  inputBox: {
    flex: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputBoxFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  inputBoxDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  lookupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 22,
    height: 48,
    borderRadius: 12,
  },
  lookupBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  quickSuggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  quickSuggestLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  quickSuggestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  quickSuggestPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  resultContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 18,
  },
  resultList: {
    gap: 12,
  },
  resultCountText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  resultItemCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  resultItemCardDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  resultItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  catBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  catBadgeText: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  serialText: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadgeValid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '800',
  },
  resultItemBottom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  infoCol: {
    minWidth: 110,
  },
  infoColWide: {
    flex: 1.5,
    minWidth: 140,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  noResultBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 6,
  },
  noResultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  noResultSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 500,
  },
  sectionHeaderRow: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  sectionSubHeading: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  commitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 14,
    marginBottom: 36,
  },
  commitCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
  },
  commitIconWrapBlue: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: '#eff6ff',
  },
  commitIconWrapGreen: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: '#f0fdf4',
  },
  commitIconWrapYellow: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: '#fef3c7',
  },
  commitIconWrapPurple: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: '#f5f3ff',
  },
  commitTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  commitDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  tabScroll: {
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 16,
  },
  catTabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  catTabChipDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  catTabChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  catTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  catTabTextActive: {
    color: '#ffffff',
  },
  policyDetailCard: {
    marginHorizontal: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    marginBottom: 36,
  },
  policyDetailCardMobile: {
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 16,
  },
  policyHeader: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
  },
  policyBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
  },
  specialBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specialBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#dc2626',
  },
  policyMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
  },
  policySummary: {
    fontSize: 13,
    color: '#64748b',
  },
  rulesList: {
    gap: 12,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIconWrap: {
    marginTop: 2,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  processStepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 14,
    marginBottom: 36,
  },
  stepItem: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepNumText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  conditionCompareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 36,
  },
  conditionCol: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopWidth: 4,
    padding: 20,
  },
  conditionValidBorder: {
    borderTopColor: '#22c55e',
  },
  conditionInvalidBorder: {
    borderTopColor: '#ef4444',
  },
  condHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  condTitleValid: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
    color: '#15803d',
  },
  condTitleInvalid: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
    color: '#b91c1c',
  },
  condList: {
    gap: 10,
  },
  condItem: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  centerCard: {
    marginHorizontal: 24,
    marginBottom: 36,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
  },
  centerCardMobile: {
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 16,
  },
  centerCardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
  },
  addressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  addressItem: {
    flex: 1,
    minWidth: 280,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  addressItemDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  addrIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addrName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  addrText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    lineHeight: 18,
  },
  addrPhone: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },

  /* RETURN & WARRANTY NOTICE STYLES */
  returnNoticeCard: {
    marginVertical: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  returnApprovedBg: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  returnPendingBg: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde047',
  },
  returnRejectedBg: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  proofThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  proofThumbImg: {
    width: '100%',
    height: '100%',
  },
  proofZoomIcon: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 4,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  btnViewOrder: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  btnViewOrderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
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
