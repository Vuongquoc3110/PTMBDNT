import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAppContext } from '@/context/AppContext';

// Danh sách các Slide Banner sự kiện lớn (Bên trái) - TONE MÀU SÁNG RỰC RỠ CHUẨN GEARVN
const MAIN_EVENT_SLIDES = [
  {
    id: 'slide-1',
    eyebrow: 'MÀN HÌNH CHÍNH HÃNG ↗',
    title: 'Màn Hình Gaming & Đồ Họa',
    dealHighlight: 'Deal Hời Giảm Đến 53%',
    giftInfo: 'Arm Brateck LDT97-C012E giá chỉ 250.000₫ khi mua kèm màn hình bất kỳ',
    badge: 'GIẢM ĐẾN 53%',
    link: '/products?category=monitor',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=85',
    cardBg: '#0284c7', // Xanh Cyan Bầu Trời Công Nghệ Sáng Lóa
    subBg: '#0369a1',
    accentYellow: '#fef08a',
  },
  {
    id: 'slide-2',
    eyebrow: 'BUILD PC ĐỈNH CAO ↗',
    title: 'Đại Tiệc Build PC Gaming',
    dealHighlight: 'Tặng Màn Hình Gaming 240Hz',
    giftInfo: 'Áp dụng cho mọi cấu hình Core i7 / Ryzen 7 + RTX 4070 trở lên',
    badge: 'TẶNG MÀN 240HZ',
    link: '/products?category=pc-gaming',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85',
    cardBg: '#1d4ed8', // Xanh Electric Blue Hi-End Rực Rỡ
    subBg: '#1e40af',
    accentYellow: '#fed7aa',
  },
  {
    id: 'slide-3',
    eyebrow: 'LAPTOP GAMING NEXT-GEN ↗',
    title: 'Laptop Gaming Cực Khủng',
    dealHighlight: 'Giảm 4 Triệu + Balo ROG',
    giftInfo: 'Tặng kèm chuột không dây gaming và bàn di chuột khổ lớn 90x40cm',
    badge: 'QUÀ TẶNG 3.5TR',
    link: '/products?category=laptop-gaming',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=85',
    cardBg: '#0f766e', // Xanh Ngọc Bích Công Nghệ Mint Tươi Sáng
    subBg: '#115e59',
    accentYellow: '#bbf7d0',
  },
];

// Danh sách các Slide Sự kiện phụ (Bên dưới banner lớn - Quà tặng màn hình BenQ tặng ghế)
const SUB_EVENT_SLIDES = [
  {
    id: 'sub-1',
    tag: 'QUÀ TẶNG KHỦNG',
    title: 'Mua màn hình BenQ & Zowie',
    highlight: 'TẶNG NGAY GHẾ ERGONOMIC',
    giftDetail: 'Ghế Ergonomic Warrior Pawn lưới vân mây trị giá 2.890.000₫',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=85',
    link: '/products?category=monitor',
  },
  {
    id: 'sub-2',
    tag: 'ƯU ĐÃI NÂNG CẤP',
    title: 'Sắm combo Mainboard + CPU',
    highlight: 'TẶNG TẢN THÁP DEEPCOOL',
    giftDetail: 'Tản nhiệt tháp đôi DeepCool AK620 Digital trị giá 1.890.000₫',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    link: '/products?category=main-cpu-vga',
  },
];

// 4 Card sự kiện cột bên phải - NỀN TRẮNG SÁNG VIỀN MẢNH TINH TẾ
const RIGHT_EVENT_CARDS = [
  {
    id: 'card-1',
    title: 'Build PC',
    badgeText: 'Tặng Màn Hình 240Hz',
    badgeBg: '#f97316',
    subText: 'Deal hời cấu hình khủng',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80',
    link: '/products?category=pc-gaming',
  },
  {
    id: 'card-2',
    title: 'Bàn Phím Cơ',
    badgeText: 'Giảm đến 26%',
    badgeBg: '#ea580c',
    subText: 'Custom & Gaming RGB',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80',
    link: '/products?category=keyboard',
  },
  {
    id: 'card-3',
    title: 'PC i5 / RTX 5060',
    badgeText: 'Giá từ 23.000.000₫',
    badgeBg: '#059669',
    subText: 'Chiến mượt mọi game AAA',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
    link: '/products?category=pc-gaming',
  },
  {
    id: 'card-4',
    title: 'Laptop Gaming',
    badgeText: 'Quà tặng 3.500.000₫',
    badgeBg: '#2563eb',
    subText: 'Sẵn hàng giao nhanh 2h',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80',
    link: '/products?category=laptop-gaming',
  },
];

export function HomeHeroBanners() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;
  const isTablet = width >= 640 && width < 980;
  const { isDark } = useAppContext();

  const [activeMainSlide, setActiveMainSlide] = useState(0);
  const [activeSubSlide, setActiveSubSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Tự động xoay vòng slide lớn mỗi 5.5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextMainSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [activeMainSlide]);

  const changeSlideWithAnim = (nextIndex: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.3, duration: 150, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
    setActiveMainSlide(nextIndex);
  };

  const handleNextMainSlide = () => {
    const next = (activeMainSlide + 1) % MAIN_EVENT_SLIDES.length;
    changeSlideWithAnim(next);
  };

  const handlePrevMainSlide = () => {
    const prev = (activeMainSlide - 1 + MAIN_EVENT_SLIDES.length) % MAIN_EVENT_SLIDES.length;
    changeSlideWithAnim(prev);
  };

  const handleNextSubSlide = () => {
    setActiveSubSlide((prev) => (prev + 1) % SUB_EVENT_SLIDES.length);
  };

  const handlePrevSubSlide = () => {
    setActiveSubSlide((prev) => (prev - 1 + SUB_EVENT_SLIDES.length) % SUB_EVENT_SLIDES.length);
  };

  const currentMain = MAIN_EVENT_SLIDES[activeMainSlide];
  const currentSub = SUB_EVENT_SLIDES[activeSubSlide];

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      {/* ================= CỘT TRÁI: BANNER LỚN + BANNER PHỤ ================= */}
      <View style={[styles.leftColumn, isDesktop && styles.leftColumnDesktop]}>
        {/* 1. HERO MAIN SLIDER (BANNER LỚN TONE XANH CYAN TƯƠI SÁNG CHUẨN GEARVN) */}
        <View style={[styles.mainSliderCard, { backgroundColor: currentMain.cardBg }]}>
          <Pressable
            style={styles.mainSlideTouch}
            onPress={() => router.push(currentMain.link as any)}
          >
            <Animated.View style={[styles.mainSlideContent, { opacity: fadeAnim }]}>
              {/* PHẦN CHỮ & THÔNG ĐIỆP SALE */}
              <View style={styles.mainSlideCopy}>
                {/* BIỂN VÀNG RỰC RỠ CHUẨN GEARVN */}
                <View style={styles.gearvnBannerSign}>
                  <Text style={styles.gearvnSignTitle}>{currentMain.eyebrow}</Text>
                  <View style={styles.gearvnSignBadge}>
                    <Text style={styles.gearvnSignBadgeText}>{currentMain.dealHighlight}</Text>
                  </View>
                </View>

                <Text style={styles.mainSlideTitle} numberOfLines={2}>
                  {currentMain.title}
                </Text>

                <Text style={styles.mainSlideGift} numberOfLines={2}>
                  🎁 {currentMain.giftInfo}
                </Text>

                <View style={styles.ctaButtonRow}>
                  <View style={styles.ctaButton}>
                    <Text style={styles.ctaButtonText}>XEM CHI TIẾT</Text>
                    <Ionicons name="arrow-forward" size={14} color="#0f172a" style={{ marginLeft: 4 }} />
                  </View>
                </View>
              </View>

              {/* HÌNH ẢNH SẢN PHẨM KHỦNG BÊN PHẢI */}
              <View style={styles.mainSlideImageWrap}>
                <Image
                  source={{ uri: currentMain.image }}
                  style={styles.mainSlideImg}
                  resizeMode="cover"
                />
              </View>
            </Animated.View>
          </Pressable>

          {/* NÚT MŨI TÊN ĐIỀU HƯỚNG MÀU TRẮNG NGỌC TRAI NỔI BẬT */}
          <Pressable
            style={[styles.navArrowBtn, styles.navArrowLeft]}
            onPress={handlePrevMainSlide}
            hitSlop={8}
            accessibilityLabel="Slide trước"
          >
            <Ionicons name="chevron-back" size={20} color="#0284c7" />
          </Pressable>
          <Pressable
            style={[styles.navArrowBtn, styles.navArrowRight]}
            onPress={handleNextMainSlide}
            hitSlop={8}
            accessibilityLabel="Slide kế tiếp"
          >
            <Ionicons name="chevron-forward" size={20} color="#0284c7" />
          </Pressable>

          {/* DẢI CAM KẾT CHÂN BANNER TONE XANH DƯƠNG TƯƠI MÁT */}
          <View style={[styles.policyBar, { backgroundColor: currentMain.subBg }]}>
            <View style={styles.policyItem}>
              <Ionicons name="shield-checkmark" size={14} color="#fde047" />
              <Text style={styles.policyText}>Đổi mới 100% trong 30 ngày</Text>
            </View>
            <View style={styles.policyItem}>
              <Ionicons name="flash" size={14} color="#fde047" />
              <Text style={styles.policyText}>Miễn phí & Giao nhanh 2H</Text>
            </View>
            <View style={styles.policyItem}>
              <Ionicons name="card" size={14} color="#fde047" />
              <Text style={styles.policyText}>Trả góp 0% nhanh chóng</Text>
            </View>
          </View>

          {/* DOTS CHỈ BÁO SLIDE */}
          <View style={[styles.dotsRow, { backgroundColor: currentMain.subBg }]}>
            {MAIN_EVENT_SLIDES.map((slide, idx) => (
              <Pressable
                key={slide.id}
                onPress={() => changeSlideWithAnim(idx)}
                style={[styles.dot, activeMainSlide === idx && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* 2. SUB EVENT BANNER (BANNER NGANG - MUA MÀN TẶNG GHẾ GAMING) */}
        <Pressable
          style={[styles.subEventBanner, isDark && styles.subEventBannerDark]}
          onPress={() => router.push(currentSub.link as any)}
        >
          <View style={styles.subEventLeft}>
            <View style={styles.subTagPill}>
              <Text style={styles.subTagPillText}>{currentSub.tag}</Text>
            </View>
            <Text style={styles.subEventTitle}>{currentSub.title}</Text>
            <Text style={styles.subEventHighlight}>{currentSub.highlight}</Text>
            <Text style={styles.subEventGift} numberOfLines={1}>
              {currentSub.giftDetail}
            </Text>
          </View>

          <View style={styles.subEventRight}>
            <Image
              source={{ uri: currentSub.image }}
              style={styles.subEventImg}
              resizeMode="cover"
            />
          </View>

          {/* NÚT ĐIỀU HƯỚNG SUB BANNER */}
          <Pressable
            style={[styles.subNavBtn, styles.subNavLeft]}
            onPress={(e) => {
              e.stopPropagation();
              handlePrevSubSlide();
            }}
          >
            <Ionicons name="chevron-back" size={14} color="#ffffff" />
          </Pressable>
          <Pressable
            style={[styles.subNavBtn, styles.subNavRight]}
            onPress={(e) => {
              e.stopPropagation();
              handleNextSubSlide();
            }}
          >
            <Ionicons name="chevron-forward" size={14} color="#ffffff" />
          </Pressable>
        </Pressable>
      </View>

      {/* ================= CỘT PHẢI: 4 THẺ SỰ KIỆN NỀN TRẮNG SÁNG SỦA ================= */}
      <View
        style={[
          styles.rightColumn,
          isDesktop ? styles.rightColumnDesktop : styles.rightColumnMobile,
        ]}
      >
        {RIGHT_EVENT_CARDS.map((card) => (
          <Pressable
            key={card.id}
            style={[
              styles.eventMiniCard,
              isDark && styles.eventMiniCardDark,
              !isDesktop && styles.eventMiniCardMobile,
            ]}
            onPress={() => router.push(card.link as any)}
            {...({ dataSet: { eventCard: 'true' } } as any)}
          >
            <View style={styles.eventMiniCopy}>
              <Text style={[styles.eventMiniTitle, isDark && styles.textLight]} numberOfLines={1}>
                {card.title}
              </Text>
              <View style={[styles.eventMiniBadge, { backgroundColor: card.badgeBg }]}>
                <Text style={styles.eventMiniBadgeText} numberOfLines={1}>
                  {card.badgeText}
                </Text>
              </View>
              <Text style={styles.eventMiniSub} numberOfLines={1}>
                {card.subText}
              </Text>
            </View>

            <View style={styles.eventMiniImgWrap}>
              <Image
                source={{ uri: card.image }}
                style={styles.eventMiniImg}
                resizeMode="cover"
              />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    gap: 12,
  },
  containerDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  /* CỘT TRÁI */
  leftColumn: {
    width: '100%',
    gap: 12,
  },
  leftColumnDesktop: {
    flex: 1.85,
  },

  /* 1. HERO MAIN SLIDER (TƯƠI SÁNG & RỰC RỠ) */
  mainSliderCard: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 280,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#38bdf8',
    shadowColor: '#0284c7',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  mainSlideTouch: {
    flex: 1,
  },
  mainSlideContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22,
    minHeight: 230,
  },
  mainSlideCopy: {
    flex: 1.25,
    paddingRight: 16,
    zIndex: 2,
  },

  /* BIỂN VÀNG GEARVN NỔI BẬT */
  gearvnBannerSign: {
    backgroundColor: '#fef08a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#facc15',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  gearvnSignTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  gearvnSignBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#fde047',
  },
  gearvnSignBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: 0.2,
  },

  mainSlideTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 28,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mainSlideGift: {
    color: '#f0f9ff',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
    fontWeight: '600',
  },
  ctaButtonRow: {
    flexDirection: 'row',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaButtonText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  mainSlideImageWrap: {
    flex: 1,
    height: 190,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mainSlideImg: {
    width: '100%',
    height: '100%',
  },

  /* NÚT MŨI TÊN MÀU TRẮNG NGỌC TRAI NỔI TRÊN NỀN XANH */
  navArrowBtn: {
    position: 'absolute',
    top: '38%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  navArrowLeft: {
    left: 10,
  },
  navArrowRight: {
    right: 10,
  },

  /* DẢI CHÍNH SÁCH CHÂN BANNER */
  policyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  policyText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },

  /* DOTS */
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#fde047',
  },

  /* 2. SUB EVENT BANNER (GAMING STUDIO TƯƠNG PHẢN TINH TẾ) */
  subEventBanner: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 120,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  subEventBannerDark: {
    backgroundColor: '#0b1120',
    borderColor: '#1e293b',
  },
  subEventLeft: {
    flex: 1.4,
    paddingRight: 12,
    zIndex: 2,
  },
  subTagPill: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  subTagPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  subEventTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  subEventHighlight: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  subEventGift: {
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  subEventRight: {
    flex: 1,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subEventImg: {
    width: '100%',
    height: '100%',
  },
  subNavBtn: {
    position: 'absolute',
    top: '38%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  subNavLeft: {
    left: 8,
  },
  subNavRight: {
    right: 8,
  },

  /* CỘT PHẢI: 4 THẺ SỰ KIỆN NỀN TRẮNG SÁNG & TINH TẾ */
  rightColumn: {
    width: '100%',
    gap: 10,
  },
  rightColumnDesktop: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rightColumnMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  eventMiniCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 92,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  eventMiniCardDark: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
  },
  eventMiniCardMobile: {
    minWidth: '48%',
    flex: 0,
    flexGrow: 1,
  },
  eventMiniCopy: {
    flex: 1.3,
    paddingRight: 8,
  },
  eventMiniTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 5,
  },
  eventMiniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  eventMiniBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  eventMiniSub: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  eventMiniImgWrap: {
    width: 74,
    height: 74,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  eventMiniImg: {
    width: '100%',
    height: '100%',
  },
  textLight: {
    color: '#f8fafc',
  },
});
