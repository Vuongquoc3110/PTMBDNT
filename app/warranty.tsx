import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
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

interface WarrantyItem {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyPeriod: string;
  status: 'valid' | 'expiring' | 'expired';
  remainingDays: number;
  showroom: string;
}

const MOCK_WARRANTY_DATA: Record<string, WarrantyItem[]> = {
  '0988888888': [
    {
      id: 'WAR-001',
      name: 'Pro Gaming Laptop X15 (RTX 4070 / i7-13700H)',
      category: 'Laptop',
      serialNumber: 'SN-LAP-X15-99281',
      purchaseDate: '15/01/2026',
      warrantyPeriod: '24 tháng',
      status: 'valid',
      remainingDays: 650,
      showroom: '191 Nguyễn Thị Duệ, TP. Hải Dương',
    },
    {
      id: 'WAR-002',
      name: 'Màn hình Gaming UltraSharp 27" 2K 165Hz',
      category: 'Màn hình',
      serialNumber: 'SN-MON-27U-10294',
      purchaseDate: '10/02/2026',
      warrantyPeriod: '36 tháng',
      status: 'valid',
      remainingDays: 1040,
      showroom: '191 Nguyễn Thị Duệ, TP. Hải Dương',
    },
  ],
  '0909123456': [
    {
      id: 'WAR-003',
      name: 'Card đồ họa ASUS ROG Strix GeForce RTX 4080 16GB',
      category: 'Linh kiện',
      serialNumber: 'SN-VGA-ROG-4080-88',
      purchaseDate: '20/12/2025',
      warrantyPeriod: '36 tháng',
      status: 'valid',
      remainingDays: 980,
      showroom: '123 Lê Lợi, Q.1, TP.HCM',
    },
  ],
};

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
  const { isDark } = useAppContext();

  // Search input & lookup state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<WarrantyItem[]>([]);

  // Category Tab Selection
  const [activeTab, setActiveTab] = useState('laptop');

  const selectedCategory = useMemo(() => {
    return WARRANTY_CATEGORIES.find((c) => c.key === activeTab) || WARRANTY_CATEGORIES[0];
  }, [activeTab]);

  const handleLookup = () => {
    const clean = searchQuery.trim().replace(/\s+/g, '');
    if (!clean) return;

    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      let found: WarrantyItem[] = [];

      if (MOCK_WARRANTY_DATA[clean]) {
        found = MOCK_WARRANTY_DATA[clean];
      } else {
        Object.values(MOCK_WARRANTY_DATA).forEach((items) => {
          items.forEach((item) => {
            if (
              item.serialNumber.toLowerCase().includes(clean.toLowerCase()) ||
              item.id.toLowerCase().includes(clean.toLowerCase()) ||
              item.name.toLowerCase().includes(clean.toLowerCase())
            ) {
              found.push(item);
            }
          });
        });
      }

      setSearchResult(found);
      setIsSearching(false);
    }, 300);
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
        <View style={StyleSheet.flatten([styles.heroCard, isDark ? styles.heroCardDark : null])}>
          <View style={styles.heroTextContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="shield-checkmark" size={15} color="#2563eb" style={{ marginRight: 6 }} />
              <Text style={styles.heroBadgeText}>DANGVINHPC CARE & WARRANTY</Text>
            </View>
            <Text style={StyleSheet.flatten([styles.heroTitle, isDark ? styles.textDark : null])}>
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
        <View style={StyleSheet.flatten([styles.lookupCard, isDark ? styles.lookupCardDark : null])}>
          <View style={styles.lookupHeader}>
            <View style={styles.lookupIconWrap}>
              <Ionicons name="search" size={20} color="#2563eb" />
            </View>
            <View>
              <Text style={StyleSheet.flatten([styles.lookupTitle, isDark ? styles.textDark : null])}>
                TRA CỨU THÔNG TIN BẢO HÀNH TRỰC TUYẾN
              </Text>
              <Text style={StyleSheet.flatten([styles.lookupSub, isDark ? styles.textMutedDark : null])}>
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
                placeholder="Nhập SĐT mua hàng (ví dụ: 0988888888) hoặc số Serial Number..."
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
                            <Text style={styles.codeText}>Mã: {item.id}</Text>
                          </View>
                          <Text style={StyleSheet.flatten([styles.itemTitle, isDark ? styles.textDark : null])}>{item.name}</Text>
                          <Text style={StyleSheet.flatten([styles.serialText, isDark ? styles.textMutedDark : null])}>
                            Serial: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{item.serialNumber}</Text>
                          </Text>
                        </View>
                        <View style={styles.statusBadgeValid}>
                          <Ionicons name="shield-checkmark" size={14} color="#15803d" style={{ marginRight: 4 }} />
                          <Text style={styles.statusBadgeText}>Còn bảo hành</Text>
                        </View>
                      </View>

                      <View style={styles.resultItemBottom}>
                        <View style={styles.infoCol}>
                          <Text style={styles.infoLabel}>Ngày mua hàng</Text>
                          <Text style={StyleSheet.flatten([styles.infoValue, isDark ? styles.textDark : null])}>{item.purchaseDate}</Text>
                        </View>
                        <View style={styles.infoCol}>
                          <Text style={styles.infoLabel}>Thời hạn bảo hành</Text>
                          <Text style={StyleSheet.flatten([styles.infoValue, isDark ? styles.textDark : null])}>{item.warrantyPeriod}</Text>
                        </View>
                        <View style={styles.infoCol}>
                          <Text style={styles.infoLabel}>Thời gian còn lại</Text>
                          <Text style={{ fontSize: 13, color: '#2563eb', fontWeight: '800' }}>
                            {item.remainingDays} ngày
                          </Text>
                        </View>
                        <View style={styles.infoColWide}>
                          <Text style={styles.infoLabel}>Showroom tiếp nhận</Text>
                          <Text style={StyleSheet.flatten([styles.infoValue, isDark ? styles.textDark : null])} numberOfLines={1}>
                            {item.showroom}
                          </Text>
                        </View>
                      </View>
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
                    Không tìm thấy sản phẩm nào khớp với từ khóa "{searchQuery}". Hãy kiểm tra lại SĐT hoặc gọi tổng đài 1800 6868 để được hỗ trợ.
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
        <View style={StyleSheet.flatten([styles.policyDetailCard, isDark ? styles.cardDark : null])}>
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
        <View style={StyleSheet.flatten([styles.centerCard, isDark ? styles.cardDark : null])}>
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
  lookupCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#3b82f6',
  },
  lookupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  lookupIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookupTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  lookupSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  searchBarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  inputBox: {
    flex: 1,
    minWidth: 280,
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
});
