import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ShowroomHeroIllustration } from '@/components/ShowroomHeroIllustration';
import { useAppContext } from '@/context/AppContext';

export default function ShowroomScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;
  const { isDark } = useAppContext();

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent('191 Nguyễn Thị Duệ, Phường Thanh Bình, Thành phố Hải Dương');
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleCallHotline = () => {
    Linking.openURL('tel:18006868').catch(() => {
      showToast('Hotline tư vấn miễn cước: 1800 6868 (8:00 - 21:30)');
    });
  };

  const handleCopyAddress = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('191 Nguyễn Thị Duệ, Phường Thanh Bình, TP. Hải Dương');
      showToast('Đã sao chép địa chỉ Showroom Hải Dương vào bộ nhớ tạm!');
    } else {
      showToast('191 Nguyễn Thị Duệ, Phường Thanh Bình, TP. Hải Dương');
    }
  };

  return (
    <View style={[styles.page, isDark && styles.pageDark]}>
      <Header />

      {/* TOAST MESSAGE */}
      {toastMessage ? (
        <View style={styles.toastWrap}>
          <Ionicons name="checkmark-circle" size={18} color="#22c55e" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* BREADCRUMB */}
          <View style={styles.breadcrumbBar}>
            <Link href="/(tabs)" asChild>
              <Pressable style={styles.breadcrumbTouch}>
                <Text style={styles.breadcrumbLink}>Trang chủ</Text>
              </Pressable>
            </Link>
            <Text style={styles.breadcrumbSep}>/</Text>
            <Text style={styles.breadcrumbCurrent}>Hệ thống Showroom</Text>
          </View>

          {/* HERO BANNER ILLUSTRATION (GEARVN PRO STYLE WITH SCOOTER & SHOWROOMS) */}
          <ShowroomHeroIllustration onActionClick={handleOpenGoogleMaps} />

          {/* KEY METRICS BAR */}
          <View style={[styles.metricsBarCard, isDark && styles.metricsBarCardDark]}>
            <View style={[styles.metricsBar, { flexDirection: isDesktop ? 'row' : 'column' }]}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricNumber, isDark && styles.metricNumberDark]}>100+</Text>
                <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>Dàn máy & Laptop trưng bày</Text>
              </View>
              <View style={[styles.metricSep, isDark && styles.metricSepDark, !isDesktop && { display: 'none' }]} />
              <View style={styles.metricItem}>
                <Text style={[styles.metricNumber, isDark && styles.metricNumberDark]}>30 ngày</Text>
                <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>1 đổi 1 lỗi phần cứng lập tức</Text>
              </View>
              <View style={[styles.metricSep, isDark && styles.metricSepDark, !isDesktop && { display: 'none' }]} />
              <View style={styles.metricItem}>
                <Text style={[styles.metricNumber, isDark && styles.metricNumberDark]}>0%</Text>
                <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>Trả góp duyệt hồ sơ 15 phút</Text>
              </View>
              <View style={[styles.metricSep, isDark && styles.metricSepDark, !isDesktop && { display: 'none' }]} />
              <View style={styles.metricItem}>
                <Text style={[styles.metricNumber, isDark && styles.metricNumberDark]}>Miễn phí</Text>
                <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>Vệ sinh & tra keo tản nhiệt trọn đời</Text>
              </View>
            </View>
          </View>

          {/* MAIN SPOTLIGHT: SHOWROOM HẢI DƯƠNG */}
          <View style={styles.showroomSpotlightCard}>
            <View style={styles.spotlightHeader}>
              <View style={styles.spotlightTag}>
                <Text style={styles.spotlightTagText}>[MỚI] SHOWROOM CÔNG NGHỆ HI-END</Text>
              </View>
              <Text style={styles.spotlightBranchName}>DANGVINHPC NGUYỄN THỊ DUỆ</Text>
              <Text style={styles.spotlightBranchSub}>
                Cơ sở trải nghiệm công nghệ chính hãng tiêu chuẩn quốc tế tại Hải Dương
              </Text>
            </View>

            <View style={[styles.spotlightBody, { flexDirection: isDesktop ? 'row' : 'column' }]}>
              {/* DETAILS COLUMN */}
              <View style={[styles.spotlightDetails, isDesktop && { flex: 1.1 }]}>
                {/* ADDRESS */}
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconWrap, { backgroundColor: '#fee2e2' }]}>
                    <Ionicons name="location" size={20} color="#dc2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoRowLabel}>Địa chỉ Showroom:</Text>
                    <Text style={styles.infoRowValue}>
                      191 Nguyễn Thị Duệ, Phường Thanh Bình, Thành phố Hải Dương
                    </Text>
                    <View style={styles.addressActions}>
                      <Pressable style={styles.inlineActionBtn} onPress={handleCopyAddress}>
                        <Ionicons name="copy-outline" size={13} color="#2563eb" style={{ marginRight: 4 }} />
                        <Text style={styles.inlineActionText}>Sao chép địa chỉ</Text>
                      </Pressable>
                      <Pressable style={styles.inlineActionBtn} onPress={handleOpenGoogleMaps}>
                        <Ionicons name="map-outline" size={13} color="#dc2626" style={{ marginRight: 4 }} />
                        <Text style={[styles.inlineActionText, { color: '#dc2626' }]}>Mở Google Maps</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* WORKING HOURS */}
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconWrap, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="time" size={20} color="#d97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoRowLabel}>Thời gian làm việc:</Text>
                    <Text style={styles.infoRowValue}>
                      8:00 - 21:30 | Thứ 2 - Chủ Nhật (Kể cả ngày lễ & Tết)
                    </Text>
                    <Text style={styles.infoRowNote}>Kỹ thuật viên túc trực hỗ trợ test máy 24/7</Text>
                  </View>
                </View>

                {/* HOTLINE */}
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconWrap, { backgroundColor: '#eff6ff' }]}>
                    <Ionicons name="call" size={20} color="#2563eb" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoRowLabel}>Hotline liên hệ:</Text>
                    <Text style={styles.infoRowValue}>
                      1800 6868 (Tư vấn miễn cước) • 0988 888 888
                    </Text>
                  </View>
                </View>

                {/* PARKING & SERVICES */}
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconWrap, { backgroundColor: '#f0fdf4' }]}>
                    <Ionicons name="car" size={20} color="#16a34a" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoRowLabel}>Tiện ích bãi đỗ xe & dịch vụ:</Text>
                    <Text style={styles.infoRowValue}>
                      Bãi đỗ xe ô tô & xe máy rộng rãi miễn phí, có bảo vệ trông giữ an toàn.
                    </Text>
                    <Text style={styles.infoRowNote}>
                      Lắp ráp máy lấy ngay trong 2h • Cài đặt Windows bản quyền & phần mềm miễn phí
                    </Text>
                  </View>
                </View>

                {/* BUTTONS */}
                <View style={styles.spotlightBtnRow}>
                  <Pressable style={styles.primaryActionBtn} onPress={handleOpenGoogleMaps}>
                    <Ionicons name="navigate-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.primaryActionBtnText}>Chỉ đường Google Maps</Text>
                  </Pressable>
                </View>
              </View>

              {/* SHOWROOM GALLERY COLUMN */}
              <View style={[styles.spotlightMedia, isDesktop && { flex: 0.9 }]}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=85',
                  }}
                  style={styles.galleryMainImg}
                  resizeMode="cover"
                />
                <View style={styles.galleryThumbRow}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1616711906333-870826ae33e5?auto=format&fit=crop&w=400&q=80',
                    }}
                    style={styles.galleryThumbImg}
                  />
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80',
                    }}
                    style={styles.galleryThumbImg}
                  />
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
                    }}
                    style={styles.galleryThumbImg}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* EXPERIENCE ZONES SECTION (KHU VỰC TRẢI NGHIỆM ĐỈNH CAO) */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionSub}>KHÔNG GIAN TRẢI NGHIỆM ĐỈNH CAO</Text>
              <Text style={styles.sectionTitle}>Các khu vực trải nghiệm tại Showroom</Text>
              <Text style={styles.sectionDesc}>
                Được bài trí theo chuẩn Studio công nghệ quốc tế, sẵn sàng cho khách hàng test cấu hình thực tế không giới hạn
              </Text>
            </View>

            <View style={[styles.zonesGrid, { flexDirection: isDesktop ? 'row' : 'column' }]}>
              {/* ZONE 1: PC GAMING */}
              <View style={styles.zoneCard}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
                  }}
                  style={styles.zoneImg}
                />
                <View style={styles.zoneContent}>
                  <View style={[styles.zoneBadge, { backgroundColor: '#fee2e2' }]}>
                    <Text style={[styles.zoneBadgeText, { color: '#dc2626' }]}>HI-END GAMING</Text>
                  </View>
                  <Text style={styles.zoneTitle}>Zone PC Custom & RTX 4090</Text>
                  <Text style={styles.zoneDesc}>
                    Trải nghiệm chiến game 4K Ray Tracing trên màn hình 240Hz với dàn PC tản nhiệt nước custom đỉnh cao.
                  </Text>
                </View>
              </View>

              {/* ZONE 2: LAPTOP HI-END */}
              <View style={styles.zoneCard}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80',
                  }}
                  style={styles.zoneImg}
                />
                <View style={styles.zoneContent}>
                  <View style={[styles.zoneBadge, { backgroundColor: '#eff6ff' }]}>
                    <Text style={[styles.zoneBadgeText, { color: '#2563eb' }]}>LAPTOP CHÍNH HÃNG</Text>
                  </View>
                  <Text style={styles.zoneTitle}>Zone Laptop & Ultrabook OLED</Text>
                  <Text style={styles.zoneDesc}>
                    Cầm nắm và thử nghiệm các dòng ASUS ROG, Dell XPS, MSI, Lenovo Legion và MacBook M3/M4 nguyên seal.
                  </Text>
                </View>
              </View>

              {/* ZONE 3: GEAR & CUSTOM KEYBOARD */}
              <View style={styles.zoneCard}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
                  }}
                  style={styles.zoneImg}
                />
                <View style={styles.zoneContent}>
                  <View style={[styles.zoneBadge, { backgroundColor: '#fef3c7' }]}>
                    <Text style={[styles.zoneBadgeText, { color: '#d97706' }]}>GAMING GEAR</Text>
                  </View>
                  <Text style={styles.zoneTitle}>Zone Bàn phím cơ & Chuột</Text>
                  <Text style={styles.zoneDesc}>
                    Gõ thử hàng chục mẫu switch bàn phím cơ, test chuột không dây 8000Hz và tai nghe Hi-Res chuẩn eSports.
                  </Text>
                </View>
              </View>

              {/* ZONE 4: ERGONOMIC SETUP */}
              <View style={styles.zoneCard}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80',
                  }}
                  style={styles.zoneImg}
                />
                <View style={styles.zoneContent}>
                  <View style={[styles.zoneBadge, { backgroundColor: '#f0fdf4' }]}>
                    <Text style={[styles.zoneBadgeText, { color: '#16a34a' }]}>GÓC SETUP MẪU</Text>
                  </View>
                  <Text style={styles.zoneTitle}>Zone Setup Công thái học</Text>
                  <Text style={styles.zoneDesc}>
                    Trải nghiệm bàn nâng hạ thông minh, ghế công thái học Sihoo/Corsair và Arm treo màn hình chuyên nghiệp.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 4 REASONS TO VISIT */}
          <View style={styles.perksCard}>
            <Text style={styles.perksTitle}>4 Đặc quyền khi ghé Showroom DANGVINHPC</Text>
            <View style={[styles.perksGrid, { flexDirection: isDesktop ? 'row' : 'column' }]}>
              <View style={styles.perkItem}>
                <View style={styles.perkIcon}>
                  <Ionicons name="shield-checkmark" size={24} color="#dc2626" />
                </View>
                <Text style={styles.perkHeading}>100% Linh kiện chính hãng</Text>
                <Text style={styles.perkText}>Cam kết nguồn gốc xuất xứ rõ ràng, bảo hành đổi mới 1:1 trong 30 ngày.</Text>
              </View>

              <View style={styles.perkItem}>
                <View style={styles.perkIcon}>
                  <Ionicons name="construct" size={24} color="#2563eb" />
                </View>
                <Text style={styles.perkHeading}>Lắp máy lấy ngay trong 2h</Text>
                <Text style={styles.perkText}>Dựng cấu hình trực tiếp, kiểm tra benchmark và bàn giao ngay tại chỗ.</Text>
              </View>

              <View style={styles.perkItem}>
                <View style={styles.perkIcon}>
                  <Ionicons name="sparkles" size={24} color="#f59e0b" />
                </View>
                <Text style={styles.perkHeading}>Bảo dưỡng & Vệ sinh trọn đời</Text>
                <Text style={styles.perkText}>Miễn phí vệ sinh máy, tra keo tản nhiệt gốm cao cấp trọn đời cho khách hàng.</Text>
              </View>

              <View style={styles.perkItem}>
                <View style={styles.perkIcon}>
                  <Ionicons name="card" size={24} color="#16a34a" />
                </View>
                <Text style={styles.perkHeading}>Trả góp 0% lãi suất</Text>
                <Text style={styles.perkText}>Hỗ trợ hơn 25 ngân hàng và tổ chức tài chính, xét duyệt thần tốc 15 phút.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* GEARVN STYLE FULL FOOTER */}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  pageDark: {
    backgroundColor: '#09090b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  container: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /* TOAST */
  toastWrap: {
    position: 'absolute',
    top: 75,
    alignSelf: 'center',
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 99,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  /* BREADCRUMB */
  breadcrumbBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  breadcrumbTouch: {
    paddingVertical: 4,
  },
  breadcrumbLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  breadcrumbSep: {
    fontSize: 13,
    color: '#94a3b8',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },

  /* HERO BANNER */
  heroBanner: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroLayout: {
    gap: 24,
    alignItems: 'center',
  },
  heroTextCol: {
    gap: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  heroTitleHighlight: {
    color: '#38bdf8',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
    maxWidth: 580,
  },
  heroChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  heroChipText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  heroBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
  },
  heroPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  heroSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
  },
  heroSecondaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  heroImgCol: {
    width: '100%',
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
  },
  heroShowroomImg: {
    width: '100%',
    height: 260,
    borderRadius: 18,
  },
  heroImgOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  overlayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  overlayBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  /* METRICS BAR CARD */
  metricsBarCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  metricsBarCardDark: {
    backgroundColor: '#0f172a',
    borderColor: '#263449',
  },
  metricsBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0284c7',
  },
  metricNumberDark: {
    color: '#38bdf8',
  },
  metricLabel: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
  },
  metricLabelDark: {
    color: '#94a3b8',
  },
  metricSep: {
    width: 1,
    height: 36,
    backgroundColor: '#e2e8f0',
  },
  metricSepDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  /* MAIN SPOTLIGHT CARD */
  showroomSpotlightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  spotlightHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
    marginBottom: 20,
  },
  spotlightTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  spotlightTagText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '800',
  },
  spotlightBranchName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  spotlightBranchSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  spotlightBody: {
    gap: 24,
    alignItems: 'flex-start',
  },
  spotlightDetails: {
    gap: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  infoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  infoRowValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
    lineHeight: 20,
  },
  infoRowNote: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 4,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  inlineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  inlineActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  spotlightBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryActionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  spotlightMedia: {
    width: '100%',
    gap: 10,
  },
  galleryMainImg: {
    width: '100%',
    height: 220,
    borderRadius: 14,
  },
  galleryThumbRow: {
    flexDirection: 'row',
    gap: 8,
  },
  galleryThumbImg: {
    flex: 1,
    height: 75,
    borderRadius: 10,
  },

  /* EXPERIENCE ZONES */
  sectionWrap: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '800',
    color: '#dc2626',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginTop: 4,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  zonesGrid: {
    gap: 16,
  },
  zoneCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  zoneImg: {
    width: '100%',
    height: 150,
  },
  zoneContent: {
    padding: 16,
    gap: 8,
  },
  zoneBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  zoneBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  zoneTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  zoneDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
  },

  /* PERKS CARD */
  perksCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    marginBottom: 24,
  },
  perksTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  perksGrid: {
    gap: 18,
  },
  perkItem: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  perkIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  perkHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  perkText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
