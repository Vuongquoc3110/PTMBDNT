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
      title: 'Quản lý mua sắm',
      items: [
        {
          icon: 'receipt-outline',
          iconBg: '#eff6ff',
          iconColor: '#2563eb',
          title: 'Đơn hàng của tôi',
          subtitle: 'Xem lịch sử và tra cứu 24 đơn hàng',
          badge: '2 Đang giao',
          action: () => router.push('/(tabs)/explore' as any),
        },
        {
          icon: 'heart-outline',
          iconBg: '#fff1f2',
          iconColor: '#e11d48',
          title: 'Danh sách yêu thích',
          subtitle: '12 sản phẩm đang quan tâm',
          badge: '12',
          action: () => router.push('/wishlist' as any),
        },
        {
          icon: 'location-outline',
          iconBg: '#f0fdf4',
          iconColor: '#16a34a',
          title: 'Địa chỉ nhận hàng',
          subtitle: addresses.find((a) => a.isDefault)?.address || profile.city,
          badge: `${addresses.length} địa chỉ`,
          action: () => setActiveModal('address'),
        },
        {
          icon: 'card-outline',
          iconBg: '#faf5ff',
          iconColor: '#9333ea',
          title: 'Phương thức thanh toán',
          subtitle: paymentMethods.find((p) => p.isDefault)?.name || 'Visa, MoMo',
          action: () => setActiveModal('payment'),
        },
      ],
    },
    {
      title: 'Tài khoản & Thiết lập',
      items: [
        {
          icon: 'construct-outline',
          iconBg: '#eff6ff',
          iconColor: '#2563eb',
          title: 'Trang Quản trị (Admin)',
          subtitle: 'Quản lý kho hàng, thêm sửa xóa sản phẩm & duyệt đơn',
          badge: 'Admin Panel',
          action: () => router.push('/admin' as any),
        },
        {
          icon: 'shield-checkmark-outline',
          iconBg: '#f0f9ff',
          iconColor: '#0284c7',
          title: 'Bảo mật & Mật khẩu',
          subtitle: twoFactorAuth ? 'Xác thực 2 lớp (2FA): Đang bật' : 'Chưa bật 2FA',
          action: () => setActiveModal('security'),
        },
        {
          icon: 'notifications-outline',
          iconBg: '#fffbeb',
          iconColor: '#d97706',
          title: 'Cài đặt thông báo',
          subtitle: orderNotifs ? 'Đang nhận thông báo vận chuyển & sale' : 'Đã tắt thông báo',
          action: () => setActiveModal('notifications'),
        },
        {
          icon: 'globe-outline',
          iconBg: '#eef2ff',
          iconColor: '#4f46e5',
          title: 'Ngôn ngữ & Khu vực',
          subtitle: currentLanguage === 'vi' ? 'Tiếng Việt (VN) • ₫ (VND)' : 'English (US) • $ (USD)',
          action: () => setActiveModal('language'),
        },
      ],
    },
    {
      title: 'Hỗ trợ & Chính sách',
      items: [
        {
          icon: 'headset-outline',
          iconBg: '#ecfeff',
          iconColor: '#0891b2',
          title: 'Trung tâm hỗ trợ 24/7',
          subtitle: 'Tổng đài miễn cước 1800 6868 & Chat trực tuyến',
          action: () => setActiveModal('support'),
        },
        {
          icon: 'refresh-circle-outline',
          iconBg: '#f0fdfa',
          iconColor: '#0d9488',
          title: 'Chính sách bảo hành & Đổi trả',
          subtitle: 'Bảo hành chính hãng 24-36 tháng, lỗi 1 đổi 1',
          action: () => setActiveModal('warranty'),
        },
        {
          icon: 'document-text-outline',
          iconBg: '#f8fafc',
          iconColor: '#64748b',
          title: 'Điều khoản dịch vụ',
          subtitle: 'Chính sách bảo vệ dữ liệu & quyền riêng tư',
          action: () => setActiveModal('terms'),
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
        <View style={[styles.mainLayout, isWideScreen && styles.mainLayoutWide]}>
          {/* LEFT COLUMN: Profile info, stats, order tracker */}
          <View style={[styles.leftColumn, isWideScreen && styles.columnHalf]}>
            {/* PROFILE CARD */}
            <View style={styles.profileCard}>
              <View style={styles.profileBgAccent} />
              <View style={styles.profileHeader}>
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
                  <View style={styles.onlineDot} />
                  <View style={styles.avatarBadge}>
                    <Ionicons name="camera" size={12} color="#ffffff" />
                  </View>
                </Pressable>

                <View style={styles.userInfo}>
                  <View style={styles.vipTagRow}>
                    <View
                      style={{
                        backgroundColor: isAdmin ? '#fee2e2' : '#eff6ff',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: isAdmin ? '#fecaca' : '#bfdbfe',
                      }}
                    >
                      <Text
                        style={{
                          color: isAdmin ? '#dc2626' : '#2563eb',
                          fontWeight: '800',
                          fontSize: 10,
                        }}
                      >
                        {isAdmin ? '🛡️ QUẢN TRỊ VIÊN' : '👤 KHÁCH HÀNG'}
                      </Text>
                    </View>
                    <Pressable style={styles.vipTag} onPress={() => setActiveModal('tier')}>
                      <Ionicons name="sparkles" size={11} color="#b45309" style={{ marginRight: 3 }} />
                      <Text style={styles.vipTagText}>VIP PLATINUM</Text>
                    </Pressable>
                    <Text style={styles.memberId}>ID: #{user?.id || 1}</Text>
                  </View>

                  <Text style={styles.userName}>{isLoggedOut ? 'Khách ghé thăm' : profile.name}</Text>
                  <Text style={styles.userEmail}>{isLoggedOut ? 'Chưa đăng nhập' : profile.email}</Text>
                  <Text style={styles.userPhone}>
                    {isLoggedOut ? 'Nhấn đăng nhập để dùng đầy đủ tính năng' : `${profile.phone} • ${profile.city}`}
                  </Text>
                </View>

                {!isLoggedOut && (
                  <Pressable
                    style={styles.editProfileBtn}
                    onPress={() => {
                      setEditName(profile.name);
                      setEditEmail(profile.email);
                      setEditPhone(profile.phone);
                      setEditCity(profile.city);
                      setActiveModal('editProfile');
                    }}
                  >
                    <Ionicons name="create-outline" size={18} color="#2563eb" />
                  </Pressable>
                )}
              </View>

              {/* WALLET / CASHBACK BAR */}
              <View style={styles.walletBar}>
                <View style={styles.walletItem}>
                  <Text style={styles.walletLabel}>Số dư ví DPC</Text>
                  <Text style={styles.walletValue}>{walletBalance.toLocaleString('vi-VN')} ₫</Text>
                </View>
                <View style={styles.walletDivider} />
                <View style={styles.walletItem}>
                  <Text style={styles.walletLabel}>Điểm thưởng</Text>
                  <Text style={styles.walletValue}>{rewardPoints.toLocaleString('vi-VN')} xu</Text>
                </View>
                <Pressable
                  style={styles.depositBtn}
                  onPress={() => {
                    setDepositAmount('500000');
                    setActiveModal('deposit');
                  }}
                >
                  <Ionicons name="add" size={14} color="#ffffff" />
                  <Text style={styles.depositText}>Nạp ví</Text>
                </Pressable>
              </View>
            </View>

            {/* QUICK STATS CARDS */}
            <View style={styles.statsGrid}>
              <Pressable
                style={[styles.statCard, { borderLeftColor: '#2563eb' }]}
                onPress={() => router.push('/(tabs)/explore' as any)}
              >
                <View style={[styles.statIconWrap, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="cube-outline" size={20} color="#2563eb" />
                </View>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statTitle}>Đơn hàng</Text>
              </Pressable>

              <Pressable
                style={[styles.statCard, { borderLeftColor: '#e11d48' }]}
                onPress={() => router.push('/wishlist' as any)}
              >
                <View style={[styles.statIconWrap, { backgroundColor: '#fff1f2' }]}>
                  <Ionicons name="heart-outline" size={20} color="#e11d48" />
                </View>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statTitle}>Yêu thích</Text>
              </Pressable>

              <Pressable
                style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}
                onPress={() => setActiveModal('voucher')}
              >
                <View style={[styles.statIconWrap, { backgroundColor: '#fffbeb' }]}>
                  <Ionicons name="ticket-outline" size={20} color="#d97706" />
                </View>
                <Text style={styles.statNumber}>{vouchers.length}</Text>
                <Text style={styles.statTitle}>Voucher</Text>
              </Pressable>

              <Pressable
                style={[styles.statCard, { borderLeftColor: '#9333ea' }]}
                onPress={() => setActiveModal('tier')}
              >
                <View style={[styles.statIconWrap, { backgroundColor: '#faf5ff' }]}>
                  <Ionicons name="ribbon-outline" size={20} color="#9333ea" />
                </View>
                <Text style={styles.statNumber}>Tier 3</Text>
                <Text style={styles.statTitle}>Hạng mức</Text>
              </Pressable>
            </View>

            {/* ORDER TRACKER STATUS STRIP */}
            <View style={styles.trackerCard}>
              <View style={styles.trackerHeader}>
                <Text style={styles.trackerHeaderTitle}>Trạng thái đơn hàng</Text>
                <Pressable onPress={() => router.push('/(tabs)/explore' as any)}>
                  <Text style={styles.trackerHeaderLink}>Lịch sử mua &gt;</Text>
                </Pressable>
              </View>

              <View style={styles.trackerSteps}>
                <Pressable
                  style={styles.trackerStep}
                  onPress={() => {
                    showToast('Đang mở 1 đơn hàng chờ xác nhận...');
                    router.push('/(tabs)/explore' as any);
                  }}
                >
                  <View style={styles.trackerIconWrap}>
                    <Ionicons name="time-outline" size={22} color="#475569" />
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>1</Text>
                    </View>
                  </View>
                  <Text style={styles.trackerStepText}>Chờ xác nhận</Text>
                </Pressable>

                <Pressable
                  style={styles.trackerStep}
                  onPress={() => {
                    showToast('Hiện không có đơn chờ lấy hàng');
                    router.push('/(tabs)/explore' as any);
                  }}
                >
                  <View style={styles.trackerIconWrap}>
                    <Ionicons name="archive-outline" size={22} color="#475569" />
                  </View>
                  <Text style={styles.trackerStepText}>Chờ lấy hàng</Text>
                </Pressable>

                <Pressable
                  style={styles.trackerStep}
                  onPress={() => {
                    showToast('Đang mở 2 đơn hàng đang vận chuyển...');
                    router.push('/(tabs)/explore' as any);
                  }}
                >
                  <View style={[styles.trackerIconWrap, styles.trackerIconActive]}>
                    <Ionicons name="bicycle-outline" size={22} color="#2563eb" />
                    <View style={[styles.stepBadge, { backgroundColor: '#2563eb' }]}>
                      <Text style={styles.stepBadgeText}>2</Text>
                    </View>
                  </View>
                  <Text style={[styles.trackerStepText, { color: '#2563eb', fontWeight: '700' }]}>
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
                    <Ionicons name="star-outline" size={22} color="#475569" />
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>3</Text>
                    </View>
                  </View>
                  <Text style={styles.trackerStepText}>Đánh giá</Text>
                </Pressable>
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

  /* PROFILE CARD */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  profileBgAccent: {
    height: 70,
    backgroundColor: '#1e293b',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -35,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: '#cbd5e1',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
    paddingTop: 36,
  },
  vipTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  vipTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  vipTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400e',
    letterSpacing: 0.5,
  },
  memberId: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '500',
  },
  editProfileBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    marginTop: 24,
  },
  walletBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  walletItem: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  walletValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  walletDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 12,
  },
  depositBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 4,
  },
  depositText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* STATS GRID */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },

  /* ORDER TRACKER STRIP */
  trackerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackerHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  trackerHeaderLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  trackerSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackerStep: {
    alignItems: 'center',
    flex: 1,
  },
  trackerIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  trackerIconActive: {
    backgroundColor: '#dbeafe',
  },
  stepBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  stepBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  trackerStepText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },

  /* SETTINGS GROUPS */
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  menuList: {
    backgroundColor: '#ffffff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemPressed: {
    backgroundColor: '#f8fafc',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
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
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },

  /* LOGOUT BUTTON */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff1f2',
    borderWidth: 1.5,
    borderColor: '#fecdd3',
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 6,
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
