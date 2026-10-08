import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAppContext } from '@/context/AppContext';

export function Footer() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 920;
  const isTablet = width >= 640 && width < 920;
  const { isDark } = useAppContext();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.footerContainer, isDark && styles.footerContainerDark]}>
      <View style={styles.footerInner}>
        {/* ==================== 5 COLUMNS TOP SECTION ==================== */}
        <View
          style={[
            styles.columnsGrid,
            isDesktop
              ? styles.columnsGridDesktop
              : isTablet
              ? styles.columnsGridTablet
              : styles.columnsGridMobile,
          ]}
        >
          {/* CỘT 1: VỀ DANGVINHPC */}
          <View style={styles.col}>
            <Text style={[styles.colTitle, isDark && styles.textLight]}>VỀ DANGVINHPC</Text>
            <View style={styles.linkList}>
              <Pressable onPress={() => router.push('/showroom' as any)}>
                <Text style={styles.linkText}>Giới thiệu</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/showroom' as any)}>
                <Text style={styles.linkText}>Hệ thống Showroom</Text>
              </Pressable>
              <Pressable onPress={() => handleOpenLink('https://dangvinhpc.vn/tuyen-dung')}>
                <Text style={styles.linkText}>Tuyển dụng</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/(tabs)' as any)}>
                <Text style={styles.linkText}>Tin công nghệ</Text>
              </Pressable>
            </View>
          </View>

          {/* CỘT 2: CHÍNH SÁCH */}
          <View style={styles.col}>
            <Text style={[styles.colTitle, isDark && styles.textLight]}>CHÍNH SÁCH</Text>
            <View style={styles.linkList}>
              <Pressable onPress={() => router.push('/warranty' as any)}>
                <Text style={styles.linkText}>Chính sách bảo hành</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/checkout' as any)}>
                <Text style={styles.linkText}>Chính sách thanh toán</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/cart' as any)}>
                <Text style={styles.linkText}>Chính sách giao hàng</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/(tabs)/user' as any)}>
                <Text style={styles.linkText}>Chính sách bảo mật</Text>
              </Pressable>
            </View>
          </View>

          {/* CỘT 3: THÔNG TIN */}
          <View style={styles.col}>
            <Text style={[styles.colTitle, isDark && styles.textLight]}>THÔNG TIN</Text>
            <View style={styles.linkList}>
              <Pressable onPress={() => router.push('/showroom' as any)}>
                <Text style={styles.linkText}>Hệ thống cửa hàng</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/(tabs)' as any)}>
                <Text style={styles.linkText}>Hướng dẫn mua hàng</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/warranty' as any)}>
                <Text style={styles.linkText}>Tra cứu địa chỉ bảo hành</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/showroom' as any)}>
                <Text style={styles.linkText}>Trả góp 0% lãi suất</Text>
              </Pressable>
            </View>
          </View>

          {/* CỘT 4: TỔNG ĐÀI HỖ TRỢ */}
          <View style={[styles.col, styles.colSupport]}>
            <Text style={[styles.colTitle, isDark && styles.textLight]}>TỔNG ĐÀI HỖ TRỢ (8:00 - 21:00)</Text>
            <View style={styles.supportList}>
              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>Mua hàng:</Text>
                <Pressable onPress={() => handleOpenLink('tel:19005301')}>
                  <Text style={styles.supportNumber}>1900.5301</Text>
                </Pressable>
              </View>

              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>Bảo hành:</Text>
                <Pressable onPress={() => handleOpenLink('tel:19005325')}>
                  <Text style={styles.supportNumber}>1900.5325</Text>
                </Pressable>
              </View>

              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>Khiếu nại:</Text>
                <Pressable onPress={() => handleOpenLink('tel:18006173')}>
                  <Text style={styles.supportNumber}>1800.6173</Text>
                </Pressable>
              </View>

              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>Email:</Text>
                <Pressable onPress={() => handleOpenLink('mailto:cskh@dangvinhpc.vn')}>
                  <Text style={styles.supportNumber}>cskh@dangvinhpc.vn</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* CỘT 5: ĐƠN VỊ VẬN CHUYỂN & THANH TOÁN */}
          <View style={[styles.col, styles.colPartners]}>
            {/* ĐƠN VỊ VẬN CHUYỂN */}
            <Text style={[styles.colTitle, isDark && styles.textLight]}>ĐƠN VỊ VẬN CHUYỂN</Text>
            <View style={styles.badgeRow}>
              {/* GHN */}
              <View style={[styles.partnerBadge, { backgroundColor: '#ea580c' }]}>
                <Text style={[styles.partnerBadgeText, { color: '#ffffff', fontWeight: '900' }]}>GHN</Text>
                <Text style={{ fontSize: 8, color: '#ffedd5', fontWeight: '700' }}>Express</Text>
              </View>
              {/* EMS */}
              <View style={[styles.partnerBadge, { backgroundColor: '#fef08a', borderColor: '#facc15' }]}>
                <Text style={[styles.partnerBadgeText, { color: '#b91c1c', fontWeight: '900' }]}>EMS</Text>
                <Text style={{ fontSize: 8, color: '#1e3a8a', fontWeight: '700' }}>VIETNAM</Text>
              </View>
              {/* DPC EXPRESS */}
              <View style={[styles.partnerBadge, { backgroundColor: '#dc2626' }]}>
                <Text style={[styles.partnerBadgeText, { color: '#ffffff', fontWeight: '900' }]}>DPC</Text>
                <Text style={{ fontSize: 8, color: '#fee2e2', fontWeight: '700' }}>FAST</Text>
              </View>
              {/* VIETTEL POST */}
              <View style={[styles.partnerBadge, { backgroundColor: '#b91c1c' }]}>
                <Text style={[styles.partnerBadgeText, { color: '#ffffff', fontWeight: '900' }]}>VIETTEL</Text>
                <Text style={{ fontSize: 8, color: '#fef2f2', fontWeight: '700' }}>POST</Text>
              </View>
            </View>

            {/* CÁCH THỨC THANH TOÁN */}
            <Text style={[styles.colTitle, { marginTop: 18 }, isDark && styles.textLight]}>CÁCH THỨC THANH TOÁN</Text>
            <View style={styles.badgeRow}>
              {/* INTERNET BANKING */}
              <View style={[styles.payBadge, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                <Ionicons name="phone-portrait-outline" size={13} color="#059669" />
                <Text style={[styles.payBadgeText, { color: '#065f46' }]}>i-Banking</Text>
              </View>
              {/* JCB */}
              <View style={[styles.payBadge, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                <Text style={[styles.payBadgeText, { color: '#1d4ed8', fontWeight: '900' }]}>JCB</Text>
              </View>
              {/* MASTERCARD */}
              <View style={[styles.payBadge, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ea580c', marginRight: -4 }} />
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#eab308' }} />
                </View>
                <Text style={[styles.payBadgeText, { color: '#9a3412', fontSize: 10 }]}>Master</Text>
              </View>
              {/* ZALOPAY */}
              <View style={[styles.payBadge, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                <Text style={[styles.payBadgeText, { color: '#15803d', fontWeight: '800' }]}>ZaloPay</Text>
              </View>
              {/* TIỀN MẶT */}
              <View style={[styles.payBadge, { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }]}>
                <Ionicons name="cash-outline" size={13} color="#475569" />
                <Text style={[styles.payBadgeText, { color: '#334155' }]}>Tiền mặt</Text>
              </View>
              {/* TRẢ GÓP 0% */}
              <View style={[styles.payBadge, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                <Text style={[styles.payBadgeText, { color: '#dc2626', fontWeight: '900' }]}>0%</Text>
                <Text style={[styles.payBadgeText, { color: '#991b1b', fontSize: 10 }]}>Trả góp</Text>
              </View>
              {/* VISA */}
              <View style={[styles.payBadge, { backgroundColor: '#eff6ff', borderColor: '#93c5fd' }]}>
                <Text style={[styles.payBadgeText, { color: '#1e40af', fontWeight: '900', fontStyle: 'italic' }]}>VISA</Text>
              </View>
              {/* MOMO */}
              <View style={[styles.payBadge, { backgroundColor: '#fdf2f8', borderColor: '#fbcfe8' }]}>
                <Text style={[styles.payBadgeText, { color: '#be185d', fontWeight: '900' }]}>MoMo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ==================== DIVIDER ==================== */}
        <View style={styles.footerDivider} />

        {/* ==================== BOTTOM ROW: SOCIALS & BỘ CÔNG THƯƠNG ==================== */}
        <View
          style={[
            styles.bottomRow,
            !isDesktop && { flexDirection: 'column', gap: 16, alignItems: 'flex-start' },
          ]}
        >
          {/* BÊN TRÁI: KẾT NỐI VỚI CHÚNG TÔI */}
          <View style={styles.socialGroup}>
            <Text style={[styles.socialTitle, isDark && styles.textLight]}>KẾT NỐI VỚI CHÚNG TÔI</Text>
            <View style={styles.socialIconsRow}>
              {/* Facebook */}
              <Pressable
                style={[styles.socialCircle, { backgroundColor: '#1877f2' }]}
                onPress={() => handleOpenLink('https://facebook.com')}
                accessibilityLabel="Facebook DANGVINHPC"
              >
                <Ionicons name="logo-facebook" size={18} color="#ffffff" />
              </Pressable>

              {/* TikTok */}
              <Pressable
                style={[styles.socialCircle, { backgroundColor: '#000000' }]}
                onPress={() => handleOpenLink('https://tiktok.com')}
                accessibilityLabel="TikTok DANGVINHPC"
              >
                <Ionicons name="logo-tiktok" size={17} color="#ffffff" />
              </Pressable>

              {/* YouTube */}
              <Pressable
                style={[styles.socialCircle, { backgroundColor: '#ef4444' }]}
                onPress={() => handleOpenLink('https://youtube.com')}
                accessibilityLabel="YouTube DANGVINHPC"
              >
                <Ionicons name="logo-youtube" size={17} color="#ffffff" />
              </Pressable>

              {/* Zalo */}
              <Pressable
                style={[styles.socialCircle, { backgroundColor: '#0068ff' }]}
                onPress={() => handleOpenLink('https://zalo.me')}
                accessibilityLabel="Zalo DANGVINHPC"
              >
                <Text style={styles.zaloText}>Zalo</Text>
              </Pressable>

              {/* Group */}
              <Pressable
                style={[styles.socialCircle, { backgroundColor: '#0284c7' }]}
                onPress={() => handleOpenLink('https://facebook.com')}
                accessibilityLabel="Cộng đồng DANGVINHPC"
              >
                <Ionicons name="people" size={17} color="#ffffff" />
              </Pressable>
            </View>
          </View>

          {/* BÊN PHẢI: HUY HIỆU ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG */}
          <Pressable
            style={styles.govBadge}
            onPress={() => handleOpenLink('http://online.gov.vn')}
            accessibilityLabel="Đã thông báo Bộ Công Thương"
          >
            {/* Round Cyan Checkmark Emblem */}
            <View style={styles.govCheckCircle}>
              <Ionicons name="checkmark" size={18} color="#ffffff" />
            </View>
            {/* Navy Text Box */}
            <View style={styles.govTextBox}>
              <Text style={styles.govTextLine1}>ĐÃ THÔNG BÁO</Text>
              <Text style={styles.govTextLine2}>BỘ CÔNG THƯƠNG</Text>
            </View>
          </Pressable>
        </View>

        {/* ==================== ADDRESS & COPYRIGHT ==================== */}
        <View style={styles.copyrightRow}>
          <Text style={styles.copyrightText}>
            © 2026 DANGVINHPC - Cửa hàng máy tính & thiết bị công nghệ Hi-End hàng đầu Việt Nam.
          </Text>
          <Text style={styles.addressText}>
            Địa chỉ Showroom: 191 Nguyễn Thị Duệ, Phường Thanh Bình, Thành phố Hải Dương.
          </Text>
          <Text style={styles.licenseText}>
            Hotline: 1800 6868 • Email: cskh@dangvinhpc.vn • Giấy chứng nhận ĐKKD số: 0108888888 do Sở KH&ĐT Hải Dương cấp.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 36,
    paddingBottom: 40,
    width: '100%',
  },
  footerContainerDark: {
    backgroundColor: '#09090b',
    borderTopColor: '#27272a',
  },
  footerInner: {
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  /* 5 COLUMNS */
  columnsGrid: {
    width: '100%',
    gap: 24,
  },
  columnsGridDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  columnsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  columnsGridMobile: {
    flexDirection: 'column',
  },

  col: {
    flex: 1,
    minWidth: 160,
  },
  colSupport: {
    minWidth: 220,
  },
  colPartners: {
    minWidth: 240,
  },

  colTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.3,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  textLight: {
    color: '#f8fafc',
  },

  linkList: {
    gap: 9,
  },
  linkText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    lineHeight: 18,
  },

  /* SUPPORT COLUMN */
  supportList: {
    gap: 8,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supportLabel: {
    fontSize: 13,
    color: '#475569',
    width: 68,
  },
  supportNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284c7',
  },

  /* BADGES */
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  partnerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },

  payBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
  },
  payBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* DIVIDER */
  footerDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginTop: 28,
    marginBottom: 20,
  },

  /* BOTTOM ROW */
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
  },
  socialTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  socialIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zaloText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },

  /* BỘ CÔNG THƯƠNG BADGE */
  govBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 8,
  },
  govCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0ea5e9',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  govTextBox: {
    alignItems: 'flex-start',
  },
  govTextLine1: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  govTextLine2: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  /* COPYRIGHT & SHOWROOM ADDRESS */
  copyrightRow: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    gap: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  licenseText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 16,
  },
});
