import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  badge?: string;
  action: () => void;
}

type ModalType =
  | 'none'
  | 'deposit'
  | 'editProfile'
  | 'voucher'
  | 'tier'
  | 'address'
  | 'payment'
  | 'security'
  | 'notifications'
  | 'language'
  | 'support'
  | 'warranty'
  | 'terms'
  | 'logoutConfirm';

import { useAppContext } from '@/context/AppContext';
import { apiService } from '@/services/api';

export default function UserTabScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 860;

  const { user, isAdmin, updateUserProfile, logout } = useAppContext();

  // User profile state
  const [profile, setProfile] = useState({
    name: user?.name || 'Khách ghé thăm',
    email: user?.email || 'Chưa đăng nhập',
    phone: user?.phone || 'Đăng nhập để dùng đầy đủ tính năng',
    city: user?.city || '',
  });
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editCity, setEditCity] = useState(profile.city);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || 'Người dùng',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
      });
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
      setEditCity(user.city || '');
    } else {
      setProfile({
        name: 'Khách ghé thăm',
        email: 'Chưa đăng nhập',
        phone: 'Đăng nhập để dùng đầy đủ tính năng',
        city: '',
      });
    }
  }, [user]);

  // Financial state
  const [walletBalance, setWalletBalance] = useState(1850000);
  const [rewardPoints, setRewardPoints] = useState(3240);
  const [depositAmount, setDepositAmount] = useState('500000');
  const [depositMethod, setDepositMethod] = useState<'momo' | 'vnpay' | 'bank'>('momo');

  // Address state
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      tag: 'Nhà riêng',
      address: 'Số 128 Nguyễn Trãi, P. Thượng Đình, Q. Thanh Xuân, Hà Nội',
      isDefault: true,
      receiver: 'Nguyễn Văn A - 0988 888 888',
    },
    {
      id: '2',
      tag: 'Công ty',
      address: 'Tòa nhà FPT Tower, Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
      isDefault: false,
      receiver: 'Nguyễn Văn A (Phòng IT) - 0988 888 888',
    },
  ]);
  const [newAddrText, setNewAddrText] = useState('');

  // Payment state
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'Visa', name: 'Visa Platinum •••• 4242', isDefault: true, icon: 'card-outline' as const },
    { id: '2', type: 'MoMo', name: 'Ví MoMo (0988 888 888)', isDefault: false, icon: 'wallet-outline' as const },
    { id: '3', type: 'VNPay', name: 'VNPay QR Tự động', isDefault: false, icon: 'qr-code-outline' as const },
  ]);

  // Settings state
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(true);
  const [techNewsNotifs, setTechNewsNotifs] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>('vi');

  // Vouchers state
  const [vouchers, setVouchers] = useState([
    { code: 'FREESHIP', title: 'Miễn phí vận chuyển', desc: 'Giảm 30.000₫ đơn từ 200k', expiry: 'Còn hiệu lực' },
    { code: 'WELCOME50', title: 'Ưu đãi Khách hàng mới', desc: 'Giảm 50.000₫ cho đơn từ 500k', expiry: 'Còn hiệu lực' },
    { code: 'GIAM100K', title: 'Ưu đãi Đơn lớn', desc: 'Giảm 100.000₫ cho đơn từ 2.000.000₫', expiry: 'Còn hiệu lực' },
  ]);

  useEffect(() => {
    apiService.getVouchers().then((list) => {
      if (list && list.length > 0) {
        setVouchers(
          list.map((v) => ({
            code: v.code,
            title: v.label || v.code,
            desc: `Giảm ${v.discount.toLocaleString('vi-VN')}₫ cho đơn từ ${v.minOrder.toLocaleString('vi-VN')}₫`,
            expiry: v.expiryDate || 'Đang áp dụng',
          }))
        );
      }
    }).catch(() => {});
  }, []);

  // Modal and toast state
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [toastMessage, setToastMessage] = useState('');
  const isLoggedOut = !user;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleDepositSubmit = () => {
    const amount = parseInt(depositAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      showToast('Vui lòng chọn hoặc nhập số tiền hợp lệ');
      return;
    }
    setWalletBalance((prev) => prev + amount);
    setRewardPoints((prev) => prev + Math.floor(amount / 1000));
    setActiveModal('none');
    showToast(`Đã nạp thành công ${amount.toLocaleString('vi-VN')} ₫ vào Ví DPC!`);
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        name: editName,
        phone: editPhone,
        city: editCity,
      });
      setProfile({
        name: editName,
        email: editEmail,
        phone: editPhone,
        city: editCity,
      });
      setActiveModal('none');
      showToast('Hồ sơ cá nhân đã được cập nhật thành công!');
    } catch {
      showToast('Không thể cập nhật thông tin, vui lòng thử lại');
    }
  };

  const handleAddAddress = () => {
    if (!newAddrText.trim()) return;
    const newId = Date.now().toString();
    setAddresses((prev) => [
      ...prev,
      {
        id: newId,
        tag: 'Địa chỉ mới',
        address: newAddrText.trim(),
        isDefault: false,
        receiver: `${profile.name} - ${profile.phone}`,
      },
    ]);
    setNewAddrText('');
    showToast('Đã thêm địa chỉ giao hàng mới!');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast('Đã đổi địa chỉ giao hàng mặc định!');
  };

  const setDefaultPayment = (id: string) => {
    setPaymentMethods((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
    showToast('Đã đặt phương thức thanh toán mặc định!');
  };

  const copyVoucherCode = (code: string) => {
    showToast(`Đã lưu mã [${code}] vào bộ nhớ tạm!`);
  };

  const handleLogout = () => {
    logout();
    setActiveModal('none');
    showToast('Bạn đã đăng xuất khỏi hệ thống.');
    router.push('/login');
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Dịch vụ & Mua sắm',
      items: [
        {
          icon: 'receipt-outline',
          iconBg: '#e0f2fe',
          iconColor: '#0284c7',
          title: 'Đơn hàng của tôi',
          subtitle: 'Tra cứu hành trình và lịch sử 24 đơn hàng',
          badge: '2 Đang giao',
          action: () => router.push('/(tabs)/explore' as any),
        },
        {
          icon: 'heart-outline',
          iconBg: '#ffe4e6',
          iconColor: '#e11d48',
          title: 'Danh sách yêu thích',
          subtitle: '12 linh kiện & máy tính đang theo dõi',
          badge: '12 mục',
          action: () => router.push('/wishlist' as any),
        },
        {
          icon: 'location-outline',
          iconBg: '#dcfce7',
          iconColor: '#16a34a',
          title: 'Sổ địa chỉ nhận hàng',
          subtitle: addresses.find((a) => a.isDefault)?.address || profile.city,
          badge: `${addresses.length} địa chỉ`,
          action: () => setActiveModal('address'),
        },
        {
          icon: 'card-outline',
          iconBg: '#f3e8ff',
          iconColor: '#9333ea',
          title: 'Phương thức thanh toán',
          subtitle: paymentMethods.find((p) => p.isDefault)?.name || 'Visa, MoMo',
          action: () => setActiveModal('payment'),
        },
      ],
    },
    {
      title: 'Bảo hành & Kỹ thuật Hi-End',
      items: [
        {
          icon: 'shield-checkmark-outline',
          iconBg: '#e0e7ff',
          iconColor: '#4338ca',
          title: 'Tra cứu bảo hành Serial/IMEI',
          subtitle: 'Bảo hành chính hãng 24-36 tháng, 1 đổi 1',
          badge: 'Bảo hành VIP',
          action: () => setActiveModal('warranty'),
        },
        {
          icon: 'headset-outline',
          iconBg: '#ccfbf1',
          iconColor: '#0f766e',
          title: 'Kỹ thuật viên tư vấn 24/7',
          subtitle: 'Hotline 1800 6868 & hỗ trợ cấu hình máy',
          badge: 'Hỗ trợ kỹ thuật',
          action: () => setActiveModal('support'),
        },
        {
          icon: 'document-text-outline',
          iconBg: '#f1f5f9',
          iconColor: '#475569',
          title: 'Chính sách đổi trả & Quyền riêng tư',
          subtitle: 'Cam kết 100% linh kiện chính hãng',
          action: () => setActiveModal('terms'),
        },
      ],
    },
    {
      title: 'Hệ thống & Thiết lập',
      items: [
        ...(isAdmin
          ? [
              {
                icon: 'construct-outline' as const,
                iconBg: '#fee2e2',
                iconColor: '#b91c1c',
                title: 'Bảng Quản trị viên (Admin Panel)',
                subtitle: 'Quản lý kho máy tính, thêm sản phẩm & duyệt đơn',
                badge: 'Admin Center',
                action: () => router.push('/admin' as any),
              },
            ]
          : []),
        {
          icon: 'lock-closed-outline',
          iconBg: '#e0f2fe',
          iconColor: '#0369a1',
          title: 'Bảo mật tài khoản & 2FA',
          subtitle: twoFactorAuth ? 'Xác thực 2 lớp (2FA): Đang bật an toàn' : 'Chưa kích hoạt 2FA',
          action: () => setActiveModal('security'),
        },
        {
          icon: 'notifications-outline',
          iconBg: '#fef3c7',
          iconColor: '#b45309',
          title: 'Cài đặt thông báo & Tin công nghệ',
          subtitle: orderNotifs ? 'Nhận thông báo đơn hàng & tin deal sốc' : 'Đã tắt thông báo',
          action: () => setActiveModal('notifications'),
        },
        {
          icon: 'globe-outline',
          iconBg: '#ede9fe',
          iconColor: '#6d28d9',
          title: 'Ngôn ngữ & Khu vực',
          subtitle: currentLanguage === 'vi' ? 'Tiếng Việt (VN) • ₫ (VND)' : 'English (US) • $ (USD)',
          action: () => setActiveModal('language'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* FLOATING TOAST FEEDBACK */}
      {toastMessage ? (
        <View style={styles.toastContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {isAdmin ? (
          <View style={[styles.mainLayout, isWideScreen && styles.mainLayoutWide, { justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }]}>
            <View style={{ width: '100%', maxWidth: 460, backgroundColor: '#ffffff', borderRadius: 24, padding: 32, alignItems: 'center', borderColor: '#e2e8f0', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20 }}>
              <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <Ionicons name="shield-checkmark" size={36} color="#dc2626" />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>
                {profile.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20, backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                <Ionicons name="flash" size={14} color="#dc2626" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#dc2626' }}>QUẢN TRỊ VIÊN HỆ THỐNG</Text>
              </View>
              <Text style={{ fontSize: 15, color: '#64748b', marginBottom: 32, textAlign: 'center', lineHeight: 24 }}>
                <Text style={{ fontWeight: '600' }}>Email:</Text> {profile.email}{'\n'}
                <Text style={{ fontWeight: '600' }}>Điện thoại:</Text> {profile.phone || 'Chưa cập nhật'}
              </Text>
              <View style={{ width: '100%', gap: 12 }}>
                <Pressable
                  style={{ backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}
                  onPress={() => router.push('/admin' as any)}
                >
                  <Ionicons name="construct-outline" size={20} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Vào Trang Quản Trị (Admin Panel)</Text>
                </Pressable>
                <Pressable
                  style={{ backgroundColor: '#f1f5f9', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}
                  onPress={() => setActiveModal('logoutConfirm')}
                >
                  <Ionicons name="log-out-outline" size={20} color="#e11d48" />
                  <Text style={{ color: '#e11d48', fontSize: 15, fontWeight: '700' }}>Đăng xuất tài khoản</Text>
                </Pressable>
              </View>
            </View>
            <View style={[styles.versionFooter, { marginTop: 40 }]}>
              <Text style={styles.versionText}>DANGVINHPC Admin System • Phiên bản 2.5.0</Text>
              <Text style={styles.copyrightText}>© 2026 DANGVINHPC Co., Ltd.</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.mainLayout, isWideScreen && styles.mainLayoutWide]}>
            {/* LEFT COLUMN: Profile info, stats, order tracker, VIP perks */}
            <View style={[styles.leftColumn, isWideScreen && styles.columnHalf]}>
              {/* 1. VIP GAMER & PRO MEMBER PASS */}
              <View style={styles.vipPassCard}>
                {/* Decorative Cyber Glow */}
                <View style={styles.vipPassGlow} />

                {/* Card Header Row: Brand & Tier */}
                <View style={styles.vipPassTopRow}>
                  <View style={styles.vipBrandBadge}>
                    <Ionicons name="hardware-chip" size={15} color="#38bdf8" />
                    <Text style={styles.vipBrandText}>DANGVINHPC • PRO PASS</Text>
                  </View>

                  <Pressable style={styles.vipTierPill} onPress={() => setActiveModal('tier')}>
                    <Ionicons name="sparkles" size={12} color="#f59e0b" />
                    <Text style={styles.vipTierText}>VIP PLATINUM</Text>
                  </Pressable>
                </View>

                {/* User Bio Row */}
                <View style={styles.vipUserRow}>
                  <Pressable
                    style={styles.avatarWrapper}
                    onPress={() => {
                      setEditName(profile.name);
                      setEditEmail(profile.email);
                      setEditPhone(profile.phone);
                      setEditCity(profile.city);
                      setActiveModal('editProfile');
                    }}
                  >
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.onlinePulse} />
                    <View style={styles.avatarCameraBadge}>
                      <Ionicons name="camera" size={11} color="#ffffff" />
                    </View>
                  </Pressable>

                  <View style={styles.vipUserInfo}>
                    <View style={styles.userNameBadgeRow}>
                      <Text style={styles.vipUserName} numberOfLines={1}>
                        {isLoggedOut ? 'Khách ghé thăm' : profile.name}
                      </Text>
                      {isAdmin && (
                        <View style={styles.adminMiniTag}>
                          <Text style={styles.adminMiniTagText}>🛡️ ADMIN</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.vipUserEmail}>
                      {isLoggedOut ? 'Chưa đăng nhập' : profile.email}
                    </Text>
                    <Text style={styles.vipUserSub}>
                      <Ionicons name="location-sharp" size={12} color="#64748b" />{' '}
                      {isLoggedOut ? 'Đăng nhập để nhận ưu đãi' : `${profile.phone} • ${profile.city || 'TP. Hồ Chí Minh'}`}
                    </Text>
                  </View>

                  {!isLoggedOut && (
                    <Pressable
                      style={styles.editProfileGlassBtn}
                      onPress={() => {
                        setEditName(profile.name);
                        setEditEmail(profile.email);
                        setEditPhone(profile.phone);
                        setEditCity(profile.city);
                        setActiveModal('editProfile');
                      }}
                    >
                      <Ionicons name="create-outline" size={18} color="#38bdf8" />
                    </Pressable>
                  )}
                </View>

                {/* VIP XP Level Progress Bar */}
                <View style={styles.vipLevelBlock}>
                  <View style={styles.vipLevelHeader}>
                    <Text style={styles.vipLevelLabel}>Hạng thành viên: Tier 3 • VIP Platinum</Text>
                    <Text style={styles.vipLevelExp}>3.240 / 5.000 XP (65%)</Text>
                  </View>
                  <View style={styles.vipProgressBarBg}>
                    <View style={styles.vipProgressBarFill} />
                  </View>
                  <Text style={styles.vipNextTierNote}>
                    ⚡ Còn 1.760 XP nữa để thăng hạng VIP Diamond (Đặc quyền giảm 8% trọn đời)
                  </Text>
                </View>

                {/* Integrated Glassmorphic Wallet & Coins Hub */}
                <View style={styles.vipWalletHub}>
                  <View style={styles.walletHubCol}>
                    <View style={styles.walletHubTitleRow}>
                      <Ionicons name="wallet" size={14} color="#38bdf8" />
                      <Text style={styles.walletHubTitle}>Số dư ví DPC</Text>
                    </View>
                    <Text style={styles.walletHubAmount}>{walletBalance.toLocaleString('vi-VN')} ₫</Text>
                  </View>

                  <View style={styles.walletHubDivider} />

                  <View style={styles.walletHubCol}>
                    <View style={styles.walletHubTitleRow}>
                      <Ionicons name="star" size={14} color="#f59e0b" />
                      <Text style={styles.walletHubTitle}>Điểm thưởng</Text>
                    </View>
                    <Text style={styles.walletHubCoins}>{rewardPoints.toLocaleString('vi-VN')} xu</Text>
                    <Text style={styles.walletHubSubNote}>≈ 32.400 ₫ mua sắm</Text>
                  </View>

                  <View style={styles.walletHubActionCol}>
                    <Pressable
                      style={styles.depositGlassBtn}
                      onPress={() => {
                        setDepositAmount('500000');
                        setActiveModal('deposit');
                      }}
                    >
                      <Ionicons name="add-circle" size={16} color="#ffffff" />
                      <Text style={styles.depositGlassBtnText}>Nạp ví</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* 2. HIGH-TECH TELEMETRY STAT CARDS */}
              <View style={styles.statsGrid}>
                <Pressable
                  style={styles.statCard}
                  onPress={() => router.push('/(tabs)/explore' as any)}
                >
                  <View style={[styles.statIconWrap, { backgroundColor: '#e0f2fe' }]}>
                    <Ionicons name="cube" size={20} color="#0284c7" />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>24</Text>
                    <Text style={styles.statTitle}>Đơn hàng</Text>
                    <View style={[styles.statPill, { backgroundColor: '#f0fdf4' }]}>
                      <Text style={[styles.statPillText, { color: '#16a34a' }]}>2 đang giao 🚚</Text>
                    </View>
                  </View>
                </Pressable>

                <Pressable
                  style={styles.statCard}
                  onPress={() => router.push('/wishlist' as any)}
                >
                  <View style={[styles.statIconWrap, { backgroundColor: '#ffe4e6' }]}>
                    <Ionicons name="heart" size={20} color="#e11d48" />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statTitle}>Yêu thích</Text>
                    <View style={[styles.statPill, { backgroundColor: '#fef2f2' }]}>
                      <Text style={[styles.statPillText, { color: '#ef4444' }]}>3 đang sale 🔥</Text>
                    </View>
                  </View>
                </Pressable>

                <Pressable
                  style={styles.statCard}
                  onPress={() => setActiveModal('voucher')}
                >
                  <View style={[styles.statIconWrap, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="ticket" size={20} color="#d97706" />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>{vouchers.length}</Text>
                    <Text style={styles.statTitle}>Voucher</Text>
                    <View style={[styles.statPill, { backgroundColor: '#fffbeb' }]}>
                      <Text style={[styles.statPillText, { color: '#b45309' }]}>Tối đa 200k 🎟️</Text>
                    </View>
                  </View>
                </Pressable>

                <Pressable
                  style={styles.statCard}
                  onPress={() => setActiveModal('tier')}
                >
                  <View style={[styles.statIconWrap, { backgroundColor: '#f3e8ff' }]}>
                    <Ionicons name="shield-checkmark" size={20} color="#9333ea" />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>Tier 3</Text>
                    <Text style={styles.statTitle}>Hạng mức</Text>
                    <View style={[styles.statPill, { backgroundColor: '#faf5ff' }]}>
                      <Text style={[styles.statPillText, { color: '#7e22ce' }]}>Giảm 5% VIP ⭐</Text>
                    </View>
                  </View>
                </Pressable>
              </View>

              {/* 3. SMART ORDER LOGISTICS TRACKER */}
              <View style={styles.trackerCard}>
                <View style={styles.trackerHeader}>
                  <View style={styles.trackerTitleGroup}>
                    <Ionicons name="navigate-circle" size={20} color="#0284c7" />
                    <Text style={styles.trackerHeaderTitle}>Tiến độ đơn hàng trực tiếp</Text>
                  </View>
                  <Pressable
                    style={styles.trackerLinkWrap}
                    onPress={() => router.push('/(tabs)/explore' as any)}
                  >
                    <Text style={styles.trackerHeaderLink}>Tất cả đơn hàng</Text>
                    <Ionicons name="chevron-forward" size={14} color="#0284c7" />
                  </Pressable>
                </View>

                {/* Flow Steps with connected line */}
                <View style={styles.trackerStepsContainer}>
                  <View style={styles.trackerProgressLine} />

                  <Pressable
                    style={styles.trackerStep}
                    onPress={() => {
                      showToast('Đang mở đơn hàng chờ duyệt...');
                      router.push('/(tabs)/explore' as any);
                    }}
                  >
                    <View style={styles.trackerIconWrap}>
                      <Ionicons name="receipt-outline" size={20} color="#475569" />
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>1</Text>
                      </View>
                    </View>
                    <Text style={styles.trackerStepText}>Chờ duyệt</Text>
                  </Pressable>

                  <Pressable
                    style={styles.trackerStep}
                    onPress={() => {
                      showToast('Hiện không có đơn chờ lấy hàng');
                      router.push('/(tabs)/explore' as any);
                    }}
                  >
                    <View style={styles.trackerIconWrap}>
                      <Ionicons name="cube-outline" size={20} color="#475569" />
                    </View>
                    <Text style={styles.trackerStepText}>Đóng gói</Text>
                  </Pressable>

                  <Pressable
                    style={styles.trackerStep}
                    onPress={() => {
                      showToast('Đang mở 2 đơn hàng đang vận chuyển...');
                      router.push('/(tabs)/explore' as any);
                    }}
                  >
                    <View style={[styles.trackerIconWrap, styles.trackerIconActive]}>
                      <Ionicons name="bicycle" size={22} color="#0284c7" />
                      <View style={[styles.stepBadge, { backgroundColor: '#0284c7' }]}>
                        <Text style={styles.stepBadgeText}>2</Text>
                      </View>
                    </View>
                    <Text style={[styles.trackerStepText, styles.trackerStepTextActive]}>
                      Đang giao
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.trackerStep}
                    onPress={() => {
                      showToast('Đang mở 3 đơn hàng chờ đánh giá...');
                      router.push('/(tabs)/explore' as any);
                    }}
                  >
                    <View style={styles.trackerIconWrap}>
                      <Ionicons name="star" size={20} color="#eab308" />
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>3</Text>
                      </View>
                    </View>
                    <Text style={styles.trackerStepText}>Đánh giá</Text>
                  </Pressable>
                </View>

                {/* Active Delivery Status Banner */}
                <Pressable
                  style={styles.liveDeliveryBanner}
                  onPress={() => router.push('/(tabs)/explore' as any)}
                >
                  <View style={styles.liveDeliveryIconBox}>
                    <Ionicons name="flash" size={16} color="#0284c7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.liveDeliveryTitle}>Đơn hàng #ORD-20260810-002 đang trên đường giao</Text>
                    <Text style={styles.liveDeliverySubtitle}>
                      Viettel Post • Dự kiến giao trước 18:00 hôm nay tại địa chỉ của bạn
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color="#0284c7" />
                </Pressable>
              </View>

              {/* 4. EXCLUSIVE HI-END STORE PRIVILEGES */}
              <View style={styles.perksCard}>
                <View style={styles.perksHeader}>
                  <Ionicons name="diamond" size={18} color="#0ea5e9" />
                  <Text style={styles.perksTitle}>Đặc Quyền DPC VIP Club</Text>
                </View>

                <View style={styles.perksGrid}>
                  <View style={styles.perkItem}>
                    <View style={[styles.perkIcon, { backgroundColor: '#eff6ff' }]}>
                      <Ionicons name="shield-checkmark" size={18} color="#2563eb" />
                    </View>
                    <View style={styles.perkTextGroup}>
                      <Text style={styles.perkName}>Bảo hành 1 đổi 1</Text>
                      <Text style={styles.perkDesc}>36 tháng tận nơi, đổi mới 30 ngày</Text>
                    </View>
                  </View>

                  <View style={styles.perkItem}>
                    <View style={[styles.perkIcon, { backgroundColor: '#ecfeff' }]}>
                      <Ionicons name="snow" size={18} color="#0891b2" />
                    </View>
                    <View style={styles.perkTextGroup}>
                      <Text style={styles.perkName}>Vệ sinh PC trọn đời</Text>
                      <Text style={styles.perkDesc}>Tra keo Thermal Grizzly miễn phí</Text>
                    </View>
                  </View>

                  <View style={styles.perkItem}>
                    <View style={[styles.perkIcon, { backgroundColor: '#f0fdf4' }]}>
                      <Ionicons name="rocket" size={18} color="#16a34a" />
                    </View>
                    <View style={styles.perkTextGroup}>
                      <Text style={styles.perkName}>Freeship hỏa tốc 2H</Text>
                      <Text style={styles.perkDesc}>Áp dụng mọi linh kiện & PC Case</Text>
                    </View>
                  </View>

                  <View style={styles.perkItem}>
                    <View style={[styles.perkIcon, { backgroundColor: '#faf5ff' }]}>
                      <Ionicons name="color-wand" size={18} color="#9333ea" />
                    </View>
                    <View style={styles.perkTextGroup}>
                      <Text style={styles.perkName}>Cân màu & Ép xung</Text>
                      <Text style={styles.perkDesc}>Kỹ thuật viên căn chỉnh màn hình</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN: Settings Groups & Logout */}
            <View style={[styles.rightColumn, isWideScreen && styles.columnHalf]}>
              {menuSections.map((section, secIdx) => (
                <View key={secIdx} style={styles.sectionCard}>
                  <Text style={styles.sectionHeading}>{section.title}</Text>
                  <View style={styles.menuList}>
                    {section.items.map((item, idx) => (
                      <Pressable
                        key={idx}
                        onPress={item.action}
                        style={({ pressed }) => [
                          styles.menuItem,
                          idx < section.items.length - 1 && styles.menuItemBorder,
                          pressed && styles.menuItemPressed,
                        ]}
                      >
                        <View style={[styles.menuIconContainer, { backgroundColor: item.iconBg }]}>
                          <Ionicons name={item.icon} size={20} color={item.iconColor} />
                        </View>

                        <View style={styles.menuTextCol}>
                          <Text style={styles.menuTitle}>{item.title}</Text>
                          {item.subtitle ? (
                            <Text style={styles.menuSubtitle} numberOfLines={1}>
                              {item.subtitle}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.menuRightCol}>
                          {item.badge ? (
                            <View style={styles.pillBadge}>
                              <Text style={styles.pillBadgeText}>{item.badge}</Text>
                            </View>
                          ) : null}
                          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}

              {/* LOGOUT OR LOGIN BUTTON */}
              {isLoggedOut ? (
                <Pressable
                  style={[styles.logoutBtn, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}
                  onPress={() => router.push('/login' as any)}
                >
                  <Ionicons name="log-in-outline" size={20} color="#2563eb" style={{ marginRight: 8 }} />
                  <Text style={[styles.logoutBtnText, { color: '#2563eb' }]}>Đăng nhập lại</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
                  onPress={() => setActiveModal('logoutConfirm')}
                >
                  <Ionicons name="log-out-outline" size={20} color="#e11d48" style={{ marginRight: 8 }} />
                  <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
                </Pressable>
              )}

              {/* FOOTER APP VERSION */}
              <View style={styles.versionFooter}>
                <Text style={styles.versionText}>DANGVINHPC Shopping App • Phiên bản 2.5.0</Text>
                <Text style={styles.copyrightText}>© 2026 DANGVINHPC Co., Ltd. Đã đăng ký bản quyền.</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ==================== ALL INTERACTIVE MODALS ==================== */}

      {/* 1. DEPOSIT MODAL */}
      <Modal visible={activeModal === 'deposit'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nạp tiền vào Ví DPC</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle}>Số dư hiện tại: {walletBalance.toLocaleString('vi-VN')} ₫</Text>

            <Text style={styles.inputLabel}>Chọn số tiền nạp nhanh:</Text>
            <View style={styles.chipsRow}>
              {['100000', '200000', '500000', '1000000'].map((amt) => (
                <Pressable
                  key={amt}
                  style={[styles.amountChip, depositAmount === amt && styles.amountChipActive]}
                  onPress={() => setDepositAmount(amt)}
                >
                  <Text style={[styles.amountChipText, depositAmount === amt && styles.amountChipTextActive]}>
                    {parseInt(amt, 10).toLocaleString('vi-VN')} ₫
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Hoặc nhập số tiền:</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={depositAmount}
              onChangeText={setDepositAmount}
              placeholder="VD: 500000"
            />

            <Text style={styles.inputLabel}>Phương thức thanh toán:</Text>
            <View style={styles.methodList}>
              {[
                { id: 'momo', name: 'Ví điện tử MoMo', icon: 'wallet-outline' as const },
                { id: 'vnpay', name: 'VNPay Cổng thanh toán', icon: 'qr-code-outline' as const },
                { id: 'bank', name: 'Chuyển khoản Vietcombank', icon: 'card-outline' as const },
              ].map((m) => (
                <Pressable
                  key={m.id}
                  style={[styles.methodItem, depositMethod === m.id && styles.methodItemActive]}
                  onPress={() => setDepositMethod(m.id as any)}
                >
                  <Ionicons
                    name={m.icon}
                    size={20}
                    color={depositMethod === m.id ? '#2563eb' : '#64748b'}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.methodText, depositMethod === m.id && styles.methodTextActive]}>
                    {m.name}
                  </Text>
                  {depositMethod === m.id && <Ionicons name="checkmark-circle" size={18} color="#2563eb" />}
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.modalPrimaryBtn} onPress={handleDepositSubmit}>
              <Text style={styles.modalPrimaryBtnText}>Xác nhận nạp tiền</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 2. EDIT PROFILE MODAL */}
      <Modal visible={activeModal === 'editProfile'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Họ và tên:</Text>
            <TextInput style={styles.textInput} value={editName} onChangeText={setEditName} />

            <Text style={styles.inputLabel}>Email liên hệ:</Text>
            <TextInput style={styles.textInput} value={editEmail} onChangeText={setEditEmail} />

            <Text style={styles.inputLabel}>Số điện thoại:</Text>
            <TextInput style={styles.textInput} value={editPhone} onChangeText={setEditPhone} />

            <Text style={styles.inputLabel}>Tỉnh / Thành phố:</Text>
            <TextInput style={styles.textInput} value={editCity} onChangeText={setEditCity} />

            <Pressable style={styles.modalPrimaryBtn} onPress={handleSaveProfile}>
              <Text style={styles.modalPrimaryBtnText}>Lưu thay đổi</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 3. VOUCHER MODAL */}
      <Modal visible={activeModal === 'voucher'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kho Voucher của bạn ({vouchers.length})</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 360 }}>
              {vouchers.map((v, i) => (
                <View key={i} style={styles.voucherCard}>
                  <View style={styles.voucherLeft}>
                    <Text style={styles.voucherCode}>{v.code}</Text>
                    <Text style={styles.voucherTitle}>{v.title}</Text>
                    <Text style={styles.voucherDesc}>{v.desc}</Text>
                    <Text style={styles.voucherExpiry}>⏳ {v.expiry}</Text>
                  </View>
                  <Pressable style={styles.copyBtn} onPress={() => copyVoucherCode(v.code)}>
                    <Text style={styles.copyBtnText}>Lưu mã</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>

            <Pressable
              style={[styles.modalPrimaryBtn, { marginTop: 14 }]}
              onPress={() => {
                setActiveModal('none');
                router.push('/products' as any);
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Mua sắm áp dụng mã ngay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 4. TIER / PRIVILEGES MODAL */}
      <Modal visible={activeModal === 'tier'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đặc quyền VIP PLATINUM</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.tierProgressBox}>
              <Text style={styles.tierTitle}>Hạng mức chi tiêu năm 2026</Text>
              <Text style={styles.tierAmount}>18.500.000 ₫ / 30.000.000 ₫</Text>
              <View style={styles.tierProgressBar}>
                <View style={[styles.tierProgressFill, { width: '62%' }]} />
              </View>
              <Text style={styles.tierSub}>Còn 11.500.000 ₫ để nâng cấp lên hạng DIAMOND</Text>
            </View>

            <Text style={[styles.inputLabel, { marginTop: 14 }]}>Quyền lợi đặc quyền của bạn:</Text>
            {[
              '⭐ Giảm thêm 3% cho toàn bộ đơn hàng linh kiện và phụ kiện.',
              '🚀 Miễn phí vận chuyển hỏa tốc trong nội thành 2h.',
              '🛠️ Đổi mới sản phẩm lỗi trong vòng 30 ngày (miễn phí thẩm định).',
              '🎁 Tặng Voucher sinh nhật 500.000 ₫.',
            ].map((text, idx) => (
              <View key={idx} style={styles.benefitRow}>
                <Text style={styles.benefitText}>{text}</Text>
              </View>
            ))}

            <Pressable style={[styles.modalPrimaryBtn, { marginTop: 14 }]} onPress={() => setActiveModal('none')}>
              <Text style={styles.modalPrimaryBtnText}>Đã hiểu</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 5. ADDRESS MODAL */}
      <Modal visible={activeModal === 'address'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sổ địa chỉ nhận hàng</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 260 }}>
              {addresses.map((addr) => (
                <Pressable
                  key={addr.id}
                  style={[styles.addressItem, addr.isDefault && styles.addressItemDefault]}
                  onPress={() => setDefaultAddress(addr.id)}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.addressTagRow}>
                      <Text style={styles.addressTag}>{addr.tag}</Text>
                      {addr.isDefault && <Text style={styles.addressDefaultBadge}>Mặc định</Text>}
                    </View>
                    <Text style={styles.addressReceiver}>{addr.receiver}</Text>
                    <Text style={styles.addressText}>{addr.address}</Text>
                  </View>
                  <Ionicons
                    name={addr.isDefault ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={addr.isDefault ? '#2563eb' : '#94a3b8'}
                  />
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Thêm địa chỉ mới:</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                placeholder="Nhập số nhà, tên đường, phường, quận..."
                value={newAddrText}
                onChangeText={setNewAddrText}
              />
              <Pressable style={styles.addBtn} onPress={handleAddAddress}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addBtnText}>Thêm</Text>
              </Pressable>
            </View>

            <Pressable style={[styles.modalPrimaryBtn, { marginTop: 14 }]} onPress={() => setActiveModal('none')}>
              <Text style={styles.modalPrimaryBtnText}>Xong</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 6. PAYMENT MODAL */}
      <Modal visible={activeModal === 'payment'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phương thức thanh toán</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            {paymentMethods.map((pm) => (
              <Pressable
                key={pm.id}
                style={[styles.addressItem, pm.isDefault && styles.addressItemDefault]}
                onPress={() => setDefaultPayment(pm.id)}
              >
                <Ionicons name={pm.icon} size={24} color="#2563eb" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressReceiver}>{pm.name}</Text>
                  {pm.isDefault && <Text style={styles.addressDefaultBadge}>Phương thức mặc định</Text>}
                </View>
                <Ionicons
                  name={pm.isDefault ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={pm.isDefault ? '#2563eb' : '#94a3b8'}
                />
              </Pressable>
            ))}

            <Pressable
              style={[styles.modalPrimaryBtn, { marginTop: 14 }]}
              onPress={() => {
                setActiveModal('none');
                showToast('Đã lưu cấu hình thanh toán thành công!');
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Lưu thiết lập</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 7. SECURITY MODAL */}
      <Modal visible={activeModal === 'security'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bảo mật tài khoản</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Xác thực 2 yếu tố (2FA)</Text>
                <Text style={styles.switchDesc}>Gửi mã OTP xác nhận khi đăng nhập trên thiết bị mới</Text>
              </View>
              <Switch
                value={twoFactorAuth}
                onValueChange={(val) => {
                  setTwoFactorAuth(val);
                  showToast(val ? 'Đã kích hoạt bảo mật 2FA' : 'Đã tắt bảo mật 2FA');
                }}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Đăng nhập sinh trắc học</Text>
                <Text style={styles.switchDesc}>Dùng Vân tay / FaceID để mở app và duyệt thanh toán nhanh</Text>
              </View>
              <Switch
                value={biometrics}
                onValueChange={(val) => {
                  setBiometrics(val);
                  showToast(val ? 'Đã bật FaceID/Vân tay' : 'Đã tắt sinh trắc học');
                }}
              />
            </View>

            <Pressable
              style={[styles.modalPrimaryBtn, { marginTop: 14 }]}
              onPress={() => {
                setActiveModal('none');
                showToast('Cài đặt bảo mật đã được cập nhật');
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Hoàn tất</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 8. NOTIFICATIONS MODAL */}
      <Modal visible={activeModal === 'notifications'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cài đặt thông báo</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Cập nhật trạng thái đơn hàng</Text>
                <Text style={styles.switchDesc}>Báo khi đơn được đóng gói, bàn giao và shipper đang giao</Text>
              </View>
              <Switch value={orderNotifs} onValueChange={setOrderNotifs} />
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Khuyến mãi & Flash Sale</Text>
                <Text style={styles.switchDesc}>Nhận thông báo khi sản phẩm trong danh sách yêu thích giảm giá</Text>
              </View>
              <Switch value={promoNotifs} onValueChange={setPromoNotifs} />
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Tin tức công nghệ mới</Text>
                <Text style={styles.switchDesc}>Ra mắt CPU, GPU và laptop thế hệ mới nhất</Text>
              </View>
              <Switch value={techNewsNotifs} onValueChange={setTechNewsNotifs} />
            </View>

            <Pressable
              style={[styles.modalPrimaryBtn, { marginTop: 14 }]}
              onPress={() => {
                setActiveModal('none');
                showToast('Đã lưu cấu hình thông báo!');
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Lưu cài đặt</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 9. LANGUAGE MODAL */}
      <Modal visible={activeModal === 'language'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn ngôn ngữ & Khu vực</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            {[
              { code: 'vi', name: 'Tiếng Việt (Việt Nam)', currency: '₫ (VND)' },
              { code: 'en', name: 'English (United States)', currency: '$ (USD)' },
            ].map((lang) => (
              <Pressable
                key={lang.code}
                style={[styles.addressItem, currentLanguage === lang.code && styles.addressItemDefault]}
                onPress={() => {
                  setCurrentLanguage(lang.code as any);
                  showToast(`Đã chuyển sang ${lang.name}`);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressReceiver}>{lang.name}</Text>
                  <Text style={styles.addressText}>Đơn vị tiền tệ: {lang.currency}</Text>
                </View>
                <Ionicons
                  name={currentLanguage === lang.code ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={currentLanguage === lang.code ? '#2563eb' : '#94a3b8'}
                />
              </Pressable>
            ))}

            <Pressable style={[styles.modalPrimaryBtn, { marginTop: 14 }]} onPress={() => setActiveModal('none')}>
              <Text style={styles.modalPrimaryBtnText}>Áp dụng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 10. SUPPORT MODAL */}
      <Modal visible={activeModal === 'support'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trung tâm hỗ trợ 24/7</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.supportCard}>
              <Ionicons name="call" size={28} color="#2563eb" style={{ marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.supportCardTitle}>Tổng đài tư vấn miễn cước</Text>
                <Text style={styles.supportCardDesc}>1800 6868 (8:00 - 22:00 hàng ngày)</Text>
              </View>
              <Pressable
                style={styles.actionPillBtn}
                onPress={() => showToast('Đang kết nối đến tổng đài 1800 6868...')}
              >
                <Text style={styles.actionPillBtnText}>Gọi ngay</Text>
              </Pressable>
            </View>

            <View style={styles.supportCard}>
              <Ionicons name="chatbubbles" size={28} color="#059669" style={{ marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.supportCardTitle}>Chat kỹ thuật viên trực tuyến</Text>
                <Text style={styles.supportCardDesc}>Phản hồi trong vòng 1-2 phút</Text>
              </View>
              <Pressable
                style={[styles.actionPillBtn, { backgroundColor: '#059669' }]}
                onPress={() => showToast('Kỹ thuật viên DPC đang kết nối với bạn...')}
              >
                <Text style={styles.actionPillBtnText}>Nhắn tin</Text>
              </Pressable>
            </View>

            <View style={styles.supportCard}>
              <Ionicons name="mail" size={28} color="#7c3aed" style={{ marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.supportCardTitle}>Email khiếu nại & phản hồi</Text>
                <Text style={styles.supportCardDesc}>support@dangvinhpc.vn</Text>
              </View>
              <Pressable
                style={[styles.actionPillBtn, { backgroundColor: '#7c3aed' }]}
                onPress={() => showToast('Đã sao chép email: support@dangvinhpc.vn')}
              >
                <Text style={styles.actionPillBtnText}>Gửi mail</Text>
              </Pressable>
            </View>

            <Pressable style={[styles.modalPrimaryBtn, { marginTop: 14 }]} onPress={() => setActiveModal('none')}>
              <Text style={styles.modalPrimaryBtnText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 11. WARRANTY MODAL */}
      <Modal visible={activeModal === 'warranty'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chính sách bảo hành & Đổi trả</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.policyHeading}>1. Đổi mới 30 ngày đầu tiên</Text>
              <Text style={styles.policyText}>
                Sản phẩm linh kiện máy tính, laptop nếu gặp lỗi phần cứng do nhà sản xuất trong vòng 30 ngày kể từ khi nhận hàng sẽ được đổi mới 100% không phát sinh chi phí.
              </Text>

              <Text style={styles.policyHeading}>2. Bảo hành chính hãng 24 - 36 tháng</Text>
              <Text style={styles.policyText}>
                Tất cả CPU, GPU, RAM, SSD, Màn hình phân phối tại DANGVINHPC đều là hàng chính hãng có tem bảo hành điện tử theo số Serial trên hệ thống.
              </Text>

              <Text style={styles.policyHeading}>3. Hỗ trợ mượn máy thay thế</Text>
              <Text style={styles.policyText}>
                Khách hàng VIP khi bảo hành PC hoặc laptop trong thời gian chờ đợi sẽ được trung tâm hỗ trợ thiết bị thay thế phục vụ công việc tạm thời.
              </Text>
            </ScrollView>

            <Pressable style={[styles.modalPrimaryBtn, { marginTop: 14 }]} onPress={() => setActiveModal('none')}>
              <Text style={styles.modalPrimaryBtnText}>Đã rõ thông tin</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 12. TERMS MODAL */}
      <Modal visible={activeModal === 'terms'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Điều khoản & Quyền riêng tư</Text>
              <Pressable onPress={() => setActiveModal('none')}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.policyHeading}>1. Bảo vệ dữ liệu cá nhân</Text>
              <Text style={styles.policyText}>
                DANGVINHPC cam kết không chia sẻ hoặc cung cấp thông tin tài khoản, số điện thoại hay lịch sử giao dịch cho bất kỳ bên thứ ba nào.
              </Text>

              <Text style={styles.policyHeading}>2. An toàn giao dịch trực tuyến</Text>
              <Text style={styles.policyText}>
                Mọi giao dịch qua thẻ quốc tế hoặc cổng thanh toán điện tử đều được mã hóa bằng chuẩn SSL 256-bit cao cấp nhất.
              </Text>
            </ScrollView>

            <Pressable style={[styles.modalPrimaryBtn, { marginTop: 14 }]} onPress={() => setActiveModal('none')}>
              <Text style={styles.modalPrimaryBtnText}>Tôi đồng ý</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 13. LOGOUT CONFIRMATION MODAL */}
      <Modal visible={activeModal === 'logoutConfirm'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { alignItems: 'center' }]}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#fee2e2',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Ionicons name="log-out" size={30} color="#ef4444" />
            </View>

            <Text style={[styles.modalTitle, { textAlign: 'center', marginBottom: 6 }]}>Xác nhận đăng xuất?</Text>
            <Text style={[styles.modalSubtitle, { textAlign: 'center', marginBottom: 20 }]}>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản "{profile.name}"?
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
              <Pressable
                style={[styles.modalPrimaryBtn, { flex: 1, backgroundColor: '#f1f5f9' }]}
                onPress={() => setActiveModal('none')}
              >
                <Text style={[styles.modalPrimaryBtnText, { color: '#475569' }]}>Hủy bỏ</Text>
              </Pressable>

              <Pressable
                style={[styles.modalPrimaryBtn, { flex: 1, backgroundColor: '#ef4444' }]}
                onPress={handleLogout}
              >
                <Text style={styles.modalPrimaryBtnText}>Đăng xuất</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  mainLayout: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    gap: 20,
  },
  mainLayoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    width: '100%',
    gap: 18,
  },
  rightColumn: {
    width: '100%',
    gap: 18,
  },
  columnHalf: {
    flex: 1,
  },

  /* TOAST NOTIFICATION */
  toastContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 999,
    backgroundColor: '#0f172a',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  /* 1. VIP GAMER & PRO MEMBER PASS CARD */
  vipPassCard: {
    backgroundColor: '#0b1120',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
    padding: 22,
    position: 'relative',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 6,
  },
  vipPassGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
  },
  vipPassTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  vipBrandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  vipBrandText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  vipTierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  vipTierText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vipUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2.5,
    borderColor: '#0284c7',
    backgroundColor: '#1e293b',
  },
  onlinePulse: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#0b1120',
  },
  avatarCameraBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#0284c7',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0b1120',
  },
  vipUserInfo: {
    flex: 1,
  },
  userNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  vipUserName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  adminMiniTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  adminMiniTagText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '800',
  },
  vipUserEmail: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 3,
  },
  vipUserSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },
  editProfileGlassBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  vipLevelBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  vipLevelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vipLevelLabel: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
  },
  vipLevelExp: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
  },
  vipProgressBarBg: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  vipProgressBarFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#0284c7',
    borderRadius: 4,
  },
  vipNextTierNote: {
    fontSize: 11,
    color: '#94a3b8',
  },
  vipWalletHub: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  walletHubCol: {
    flex: 1,
  },
  walletHubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  walletHubTitle: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  walletHubAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  walletHubCoins: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fbbf24',
  },
  walletHubSubNote: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  walletHubDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  walletHubActionCol: {
    marginLeft: 8,
  },
  depositGlassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#0284c7',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  depositGlassBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* 2. HIGH-TECH TELEMETRY STAT CARDS */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    flexDirection: 'column',
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  statTitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 1,
  },
  statPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  statPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* 3. SMART ORDER LOGISTICS TRACKER */
  trackerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  trackerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackerHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  trackerLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  trackerHeaderLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284c7',
  },
  trackerStepsContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  trackerProgressLine: {
    position: 'absolute',
    top: 22,
    left: '12%',
    right: '12%',
    height: 3,
    backgroundColor: '#f1f5f9',
    zIndex: 0,
  },
  trackerStep: {
    alignItems: 'center',
    flex: 1,
    zIndex: 1,
  },
  trackerIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  trackerIconActive: {
    backgroundColor: '#e0f2fe',
    borderColor: '#bae6fd',
  },
  stepBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  stepBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  trackerStepText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  trackerStepTextActive: {
    color: '#0284c7',
    fontWeight: '800',
  },
  liveDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  liveDeliveryIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDeliveryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369a1',
  },
  liveDeliverySubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },

  /* 4. EXCLUSIVE HI-END STORE PRIVILEGES */
  perksCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  perksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  perksTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  perksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  perkItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  perkIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkTextGroup: {
    flex: 1,
  },
  perkName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  perkDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },

  /* 5. RIGHT COLUMN MENU SECTIONS */
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  menuList: {
    backgroundColor: '#ffffff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  menuItemPressed: {
    backgroundColor: '#f1f5f9',
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  menuRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284c7',
  },

  /* LOGOUT BUTTON */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff1f2',
    borderWidth: 1.5,
    borderColor: '#fecdd3',
    borderRadius: 18,
    paddingVertical: 15,
    marginTop: 4,
  },
  logoutBtnPressed: {
    backgroundColor: '#ffe4e6',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e11d48',
  },

  /* VERSION FOOTER */
  versionFooter: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  copyrightText: {
    fontSize: 11,
    color: '#cbd5e1',
  },

  /* MODAL STYLES */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 6,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  amountChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  amountChipActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  amountChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  amountChipTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  methodList: {
    gap: 8,
    marginBottom: 16,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  methodItemActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  methodText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  methodTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  modalPrimaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* VOUCHER CARD STYLES */
  voucherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 12,
    marginBottom: 10,
  },
  voucherLeft: {
    flex: 1,
  },
  voucherCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#b45309',
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  voucherDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  voucherExpiry: {
    fontSize: 11,
    color: '#d97706',
    marginTop: 4,
    fontWeight: '600',
  },
  copyBtn: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* TIER STYLES */
  tierProgressBox: {
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3e8ff',
    padding: 16,
  },
  tierTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7e22ce',
  },
  tierAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#581c87',
    marginTop: 4,
  },
  tierProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e9d5ff',
    marginVertical: 8,
    overflow: 'hidden',
  },
  tierProgressFill: {
    height: '100%',
    backgroundColor: '#9333ea',
    borderRadius: 4,
  },
  tierSub: {
    fontSize: 11,
    color: '#6b21a8',
  },
  benefitRow: {
    paddingVertical: 6,
  },
  benefitText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },

  /* ADDRESS / PAYMENT STYLES */
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  addressItemDefault: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  addressTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  addressTag: {
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#334155',
  },
  addressDefaultBadge: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addressReceiver: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  addressText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* SWITCH ROW */
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  switchDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    paddingRight: 10,
  },

  /* SUPPORT STYLES */
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginBottom: 10,
  },
  supportCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  supportCardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  actionPillBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionPillBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* POLICY STYLES */
  policyHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 10,
    marginBottom: 4,
  },
  policyText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
