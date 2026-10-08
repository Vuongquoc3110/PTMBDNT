import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { Header } from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { formatPrice, getProductFallbackImage, isInvalidOrBlockedImageUrl } from '@/data/products';
import { apiService, type Order } from '@/services/api';

type TabKey = 'overview' | 'orders' | 'warranty' | 'profile';
type OrderStatusFilter = 'all' | 'pending' | 'shipping' | 'completed' | 'cancelled' | 'returned';

export default function UserTabScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  const { user, isAdmin, isStaff, canManage, updateUserProfile, logout, isDark } = useAppContext();

  // Active Tab
  const [currentTab, setCurrentTab] = useState<TabKey>('overview');

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Dang Nguyen');
  const [email, setEmail] = useState(user?.email || 'dangnguyen@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '0988 888 888');
  const [address, setAddress] = useState(user?.address || '123 Nguyễn Trãi, Thanh Xuân, Hà Nội');
  const [city, setCity] = useState(user?.city || 'Hà Nội');
  const [savingProfile, setSavingProfile] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('all');

  // Modals & Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Sync profile when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || 'Dang Nguyen');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
    }
  }, [user]);

  // Load orders
  useEffect(() => {
    let isMounted = true;
    setLoadingOrders(true);
    apiService
      .getOrders(user?.id)
      .then((data) => {
        if (isMounted) {
          setOrders(data || []);
          setLoadingOrders(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOrders([]);
          setLoadingOrders(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const handleSaveProfile = async () => {
    if (phone.trim()) {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if (!phoneRegex.test(phone.trim())) {
        showToast('Số điện thoại không hợp lệ (cần 10 số, đầu 03, 05, 07, 08, 09)');
        return;
      }
    }

    setSavingProfile(true);
    try {
      await updateUserProfile({
        name,
        phone,
        address,
        city,
      });
      showToast('Đã lưu thông tin cá nhân thành công!');
    } catch {
      showToast('Cập nhật thất bại, vui lòng thử lại.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    logout();
    showToast('Đã đăng xuất khỏi tài khoản.');
    router.push('/login' as any);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status match
      if (orderStatusFilter !== 'all') {
        if (orderStatusFilter === 'pending' && !['pending', 'confirmed'].includes(order.status)) return false;
        if (orderStatusFilter === 'shipping' && order.status !== 'shipping') return false;
        if (orderStatusFilter === 'completed' && order.status !== 'completed') return false;
        if (orderStatusFilter === 'cancelled' && order.status !== 'cancelled') return false;
        if (orderStatusFilter === 'returned' && order.status !== 'returned') return false;
      }
      // Search match
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase().trim();
        const matchCode = (order.orderNumber || String(order.id)).toLowerCase().includes(q);
        const matchItem = order.items?.some((i) => i.name.toLowerCase().includes(q));
        return matchCode || matchItem;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const userInitial = useMemo(() => {
    const displayName = user?.name || name || 'Dang Nguyen';
    const parts = displayName.trim().split(' ');
    return parts[parts.length - 1]?.charAt(0)?.toUpperCase() || 'D';
  }, [user?.name, name]);

  const breadcrumbTitle = {
    overview: 'Tổng quan',
    orders: 'Đơn hàng của tôi',
    warranty: 'Yêu cầu bảo hành',
    profile: 'Thông tin cá nhân',
  }[currentTab];

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
            <Text style={styles.breadcrumbCurrent}>{breadcrumbTitle}</Text>
          </View>

          {/* MAIN 2-COLUMN LAYOUT */}
          <View style={[styles.mainLayout, { flexDirection: isDesktop ? 'row' : 'column' }]}>
            {/* LEFT COLUMN: MINIMALIST SIDEBAR CARD */}
            <View style={[styles.sidebarCard, isDesktop ? { width: 260 } : { width: '100%' }]}>
              {/* USER INFO HEADER */}
              <View style={styles.userHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{userInitial}</Text>
                </View>
                <View style={styles.userNameWrap}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user?.name || name || 'Dang Nguyen'}
                  </Text>
                  {isAdmin ? (
                    <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 3 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#b45309' }}>👑 Quản Trị Viên</Text>
                    </View>
                  ) : isStaff ? (
                    <View style={{ backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 3 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#1d4ed8' }}>👔 Nhân Viên</Text>
                    </View>
                  ) : (
                    <View style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 3 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748b' }}>👤 Khách Hàng</Text>
                    </View>
                  )}
                  <Pressable
                    style={styles.supportLink}
                    onPress={() => setSupportModalVisible(true)}
                  >
                    <Ionicons name="headset-outline" size={14} color="#dc2626" style={{ marginRight: 4 }} />
                    <Text style={styles.supportLinkText}>Liên hệ hỗ trợ</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.sidebarDivider} />

              {/* SIDEBAR NAVIGATION ITEMS */}
              <View style={styles.navMenu}>
                <Pressable
                  style={[styles.navItem, currentTab === 'overview' && styles.navItemActive]}
                  onPress={() => setCurrentTab('overview')}
                >
                  <Ionicons
                    name={currentTab === 'overview' ? 'grid' : 'grid-outline'}
                    size={18}
                    color={currentTab === 'overview' ? '#dc2626' : '#475569'}
                    style={styles.navItemIcon}
                  />
                  <Text style={[styles.navItemText, currentTab === 'overview' && styles.navItemTextActive]}>
                    Tổng quan
                  </Text>
                </Pressable>

                {isAdmin && (
                  <Pressable
                    style={[styles.navItem, { backgroundColor: '#fee2e2' }]}
                    onPress={() => router.push('/admin' as any)}
                  >
                    <Ionicons name="construct" size={18} color="#b91c1c" style={styles.navItemIcon} />
                    <Text style={[styles.navItemText, { color: '#b91c1c', fontWeight: '800' }]}>
                      Bảng Quản trị (Admin)
                    </Text>
                  </Pressable>
                )}

                {canManage && (
                  <Pressable
                    style={[styles.navItem, { backgroundColor: '#eff6ff' }]}
                    onPress={() => router.push('/staff' as any)}
                  >
                    <Ionicons name="briefcase-outline" size={18} color="#2563eb" style={styles.navItemIcon} />
                    <Text style={[styles.navItemText, { color: '#2563eb', fontWeight: '800' }]}>
                      Cổng Nhân viên (Staff)
                    </Text>
                  </Pressable>
                )}

                {!canManage ? (
                  <Pressable
                    style={[styles.navItem, currentTab === 'orders' && styles.navItemActive]}
                    onPress={() => setCurrentTab('orders')}
                  >
                    <Ionicons
                      name={currentTab === 'orders' ? 'bag-handle' : 'bag-handle-outline'}
                      size={18}
                      color={currentTab === 'orders' ? '#dc2626' : '#475569'}
                      style={styles.navItemIcon}
                    />
                    <Text style={[styles.navItemText, currentTab === 'orders' && styles.navItemTextActive]}>
                      Đơn hàng của tôi
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.navItem}
                    onPress={() => router.push(isAdmin ? ('/admin' as any) : ('/staff' as any))}
                  >
                    <Ionicons name="receipt-outline" size={18} color="#475569" style={styles.navItemIcon} />
                    <Text style={styles.navItemText}>
                      Duyệt đơn hàng khách
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  style={[styles.navItem, currentTab === 'warranty' && styles.navItemActive]}
                  onPress={() => setCurrentTab('warranty')}
                >
                  <Ionicons
                    name={currentTab === 'warranty' ? 'shield-checkmark' : 'shield-checkmark-outline'}
                    size={18}
                    color={currentTab === 'warranty' ? '#dc2626' : '#475569'}
                    style={styles.navItemIcon}
                  />
                  <Text style={[styles.navItemText, currentTab === 'warranty' && styles.navItemTextActive]}>
                    Bảo hành
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.navItem, currentTab === 'profile' && styles.navItemActive]}
                  onPress={() => setCurrentTab('profile')}
                >
                  <Ionicons
                    name={currentTab === 'profile' ? 'person' : 'person-outline'}
                    size={18}
                    color={currentTab === 'profile' ? '#dc2626' : '#475569'}
                    style={styles.navItemIcon}
                  />
                  <Text style={[styles.navItemText, currentTab === 'profile' && styles.navItemTextActive]}>
                    Thông tin cá nhân
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.navItem, { marginTop: 4 }]}
                  onPress={() => setLogoutModalVisible(true)}
                >
                  <Ionicons name="log-out-outline" size={18} color="#64748b" style={styles.navItemIcon} />
                  <Text style={styles.navItemText}>Đăng xuất</Text>
                </Pressable>
              </View>
            </View>

            {/* RIGHT COLUMN: MAIN CONTENT BY ACTIVE TAB */}
            <View style={[styles.rightContent, isDesktop ? { flex: 1 } : { width: '100%' }]}>
              {/* TAB 1: TỔNG QUAN */}
              {currentTab === 'overview' && (
                <View style={styles.tabPane}>
                  {/* VIP REGULAR BANNER */}
                  <View style={styles.vipBanner}>
                    <View style={styles.vipBannerHeader}>
                      <View style={styles.vipAvatarWrap}>
                        <Text style={styles.vipAvatarText}>{userInitial}</Text>
                      </View>
                      <View style={styles.vipInfo}>
                        <View style={styles.vipBadge}>
                          <Text style={styles.vipBadgeText}>🏆 Hạng REGULAR</Text>
                        </View>
                        <View style={styles.vipScoreRow}>
                          <Text style={styles.vipScore}>0 <Text style={{ fontSize: 13, fontWeight: '500' }}>điểm</Text></Text>
                          <Text style={styles.vipScoreSub}>Còn 15.000 điểm để lên hạng G-NEW</Text>
                        </View>
                      </View>
                    </View>

                    {/* PROGRESS BAR */}
                    <View style={styles.vipProgressWrap}>
                      <View style={styles.vipProgressLabelRow}>
                        <Text style={styles.vipProgressLabel}>Tiến độ lên G-NEW</Text>
                        <Text style={styles.vipProgressPercent}>0%</Text>
                      </View>
                      <View style={styles.vipProgressTrack}>
                        <View style={[styles.vipProgressFill, { width: '0%' }]} />
                      </View>
                    </View>

                    {/* WATERMARK TROPHY */}
                    <Ionicons name="trophy-outline" size={96} color="rgba(255,255,255,0.06)" style={styles.vipWatermark} />
                  </View>

                  {/* QUICK SUMMARY CARDS */}
                  <View style={styles.summaryGrid}>
                    {isAdmin && (
                      <Pressable
                        style={styles.summaryCard}
                        onPress={() => router.push('/admin' as any)}
                      >
                        <View style={[styles.summaryIcon, { backgroundColor: '#fee2e2' }]}>
                          <Ionicons name="construct" size={20} color="#dc2626" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.summaryTitle}>Bảng Quản trị (Admin)</Text>
                          <Text style={styles.summaryValue}>Doanh thu & Toàn quyền</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                      </Pressable>
                    )}

                    {canManage && (
                      <Pressable
                        style={styles.summaryCard}
                        onPress={() => router.push('/staff' as any)}
                      >
                        <View style={[styles.summaryIcon, { backgroundColor: '#dbeafe' }]}>
                          <Ionicons name="briefcase" size={20} color="#2563eb" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.summaryTitle}>Cổng Nhân viên (Staff)</Text>
                          <Text style={styles.summaryValue}>Duyệt đơn & Điều phối kho</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                      </Pressable>
                    )}

                    {!canManage && (
                      <Pressable
                        style={styles.summaryCard}
                        onPress={() => setCurrentTab('orders')}
                      >
                        <View style={[styles.summaryIcon, { backgroundColor: '#fee2e2' }]}>
                          <Ionicons name="bag-handle" size={20} color="#dc2626" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.summaryTitle}>Đơn hàng đã đặt</Text>
                          <Text style={styles.summaryValue}>{orders.length} đơn</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                      </Pressable>
                    )}

                    <Pressable
                      style={styles.summaryCard}
                      onPress={() => setCurrentTab('warranty')}
                    >
                      <View style={[styles.summaryIcon, { backgroundColor: '#fef3c7' }]}>
                        <Ionicons name="shield-checkmark" size={20} color="#d97706" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.summaryTitle}>Yêu cầu bảo hành</Text>
                        <Text style={styles.summaryValue}>0 yêu cầu</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                    </Pressable>

                    <Pressable
                      style={styles.summaryCard}
                      onPress={() => setCurrentTab('profile')}
                    >
                      <View style={[styles.summaryIcon, { backgroundColor: '#e0f2fe' }]}>
                        <Ionicons name="person" size={20} color="#0284c7" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.summaryTitle}>Thông tin tài khoản</Text>
                        <Text style={styles.summaryValue}>Đã cập nhật</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                    </Pressable>
                  </View>
                </View>
              )}

              {/* TAB 2: ĐƠN HÀNG CỦA TÔI */}
              {currentTab === 'orders' && (
                <View style={styles.tabCard}>
                  {/* TOP HEADER & SEARCH */}
                  <View style={[styles.tabCardHeader, !isDesktop && { flexDirection: 'column', alignItems: 'flex-start', gap: 12 }]}>
                    <Text style={styles.tabCardTitle}>Đơn hàng của tôi</Text>
                    <View style={[styles.searchBox, !isDesktop && { width: '100%' }]}>
                      <TextInput
                        style={styles.searchInput}
                        value={orderSearch}
                        onChangeText={setOrderSearch}
                        placeholder="Tìm theo tên đơn, mã đơn hoặc tên sản phẩm"
                        placeholderTextColor="#94a3b8"
                      />
                      <Ionicons name="search-outline" size={18} color="#64748b" />
                    </View>
                  </View>

                  {/* STATUS FILTER TABS */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.orderFilterTabs}
                  >
                    {[
                      { key: 'all', label: 'Tất cả' },
                      { key: 'pending', label: 'Đang xử lý' },
                      { key: 'shipping', label: 'Đang giao' },
                      { key: 'completed', label: 'Hoàn tất' },
                      { key: 'cancelled', label: 'Đã hủy' },
                      { key: 'returned', label: 'Trả hàng' },
                    ].map((tab) => {
                      const isActive = orderStatusFilter === tab.key;
                      return (
                        <Pressable
                          key={tab.key}
                          style={[styles.filterTabItem, isActive && styles.filterTabItemActive]}
                          onPress={() => setOrderStatusFilter(tab.key as OrderStatusFilter)}
                        >
                          <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                            {tab.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  {/* ORDERS CONTENT */}
                  {loadingOrders ? (
                    <View style={styles.loadingWrap}>
                      <ActivityIndicator size="small" color="#dc2626" />
                      <Text style={{ marginTop: 10, color: '#64748b', fontSize: 13 }}>Đang tải đơn hàng...</Text>
                    </View>
                  ) : filteredOrders.length > 0 ? (
                    <View style={styles.orderList}>
                      {filteredOrders.map((order) => (
                        <View key={order.id} style={styles.orderCard}>
                          <View style={styles.orderHeader}>
                            <Text style={styles.orderNumber}>Mã đơn: #{order.orderNumber || order.id}</Text>
                            <View style={styles.orderStatusBadge}>
                              <Text style={styles.orderStatusText}>
                                {order.status === 'completed'
                                  ? 'Hoàn tất'
                                  : order.status === 'shipping'
                                  ? 'Đang giao hàng'
                                  : order.status === 'cancelled'
                                  ? 'Đã hủy'
                                  : 'Đang xử lý'}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.orderItems}>
                            {order.items?.map((item, idx) => (
                              <View key={idx} style={styles.orderItemRow}>
                                <Image
                                  source={{
                                    uri: item.image && !isInvalidOrBlockedImageUrl(item.image)
                                      ? item.image
                                      : getProductFallbackImage(item),
                                  }}
                                  style={styles.orderItemImg}
                                />
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.orderItemName} numberOfLines={2}>{item.name}</Text>
                                  <Text style={styles.orderItemQty}>Số lượng: x{item.quantity}</Text>
                                </View>
                                <Text style={styles.orderItemPrice}>{formatPrice(item.price)}</Text>
                              </View>
                            ))}
                          </View>

                          <View style={styles.orderFooter}>
                            <Text style={styles.orderTotalLabel}>Tổng thanh toán:</Text>
                            <Text style={styles.orderTotalValue}>{formatPrice(order.totalAmount)}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : isAdmin ? (
                    <View style={styles.alertBox}>
                      <Text style={styles.alertTitle}>Tài khoản Quản trị viên (Admin)</Text>
                      <Text style={styles.alertSubtitle}>
                        Admin không có lịch sử mua hàng cá nhân. Nhấn vào nút bên dưới để chuyển sang Bảng Quản trị duyệt toàn bộ đơn hàng của khách.
                      </Text>
                      <Pressable
                        style={[styles.primaryBtn, { marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 16 }]}
                        onPress={() => router.push('/admin' as any)}
                      >
                        <Text style={styles.primaryBtnText}>Mở Trang Quản trị (Admin Panel) →</Text>
                      </Pressable>
                    </View>
                  ) : isStaff ? (
                    <View style={[styles.alertBox, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                      <Text style={[styles.alertTitle, { color: '#1d4ed8' }]}>Tài khoản Nhân viên (Staff)</Text>
                      <Text style={[styles.alertSubtitle, { color: '#3b82f6' }]}>
                        Tài khoản nghiệp vụ nội bộ. Vui lòng truy cập Cổng Nhân Viên để tiếp nhận, xử lý đơn hàng và điều phối kho.
                      </Text>
                      <Pressable
                        style={[styles.primaryBtn, { marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 16, backgroundColor: '#2563eb' }]}
                        onPress={() => router.push('/staff' as any)}
                      >
                        <Text style={styles.primaryBtnText}>Mở Cổng Nhân viên (Staff Portal) →</Text>
                      </Pressable>
                    </View>
                  ) : (
                    /* RED/PINK ALERT BOX AS IN SCREENSHOT */
                    <View style={styles.alertBox}>
                      <Text style={styles.alertTitle}>Chưa tải được danh sách đơn hàng</Text>
                      <Text style={styles.alertSubtitle}>Không tải được danh sách đơn hàng</Text>
                    </View>
                  )}
                </View>
              )}

              {/* TAB 3: BẢO HÀNH */}
              {currentTab === 'warranty' && (
                <View style={styles.tabCard}>
                  <Text style={styles.tabCardTitle}>Yêu cầu bảo hành</Text>

                  {/* ALERT BOX AS IN SCREENSHOT */}
                  <View style={[styles.alertBox, { marginTop: 16 }]}>
                    <Text style={styles.alertTitle}>Chưa tải được yêu cầu bảo hành</Text>
                    <Text style={styles.alertSubtitle}>Không tải được danh sách bảo hành</Text>
                  </View>

                  {/* WARRANTY POLICIES */}
                  <View style={styles.warrantyBox}>
                    <Text style={styles.warrantyHeading}>Chính sách bảo hành vàng tại cửa hàng:</Text>
                    <View style={styles.warrantyItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#16a34a" style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={styles.warrantyText}>100% linh kiện và máy tính nguyên bản, phân phối chính hãng bảo hành 12 - 36 tháng.</Text>
                    </View>
                    <View style={styles.warrantyItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#16a34a" style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={styles.warrantyText}>1 đổi 1 trong vòng 30 ngày đầu tiên nếu phát sinh bất kỳ lỗi phần cứng nào từ nhà sản xuất.</Text>
                    </View>
                    <View style={styles.warrantyItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#16a34a" style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={styles.warrantyText}>Hỗ trợ kiểm tra máy, cài đặt phần mềm và bảo dưỡng vệ sinh trọn đời.</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* TAB 4: THÔNG TIN CÁ NHÂN */}
              {currentTab === 'profile' && (
                <View style={styles.tabCard}>
                  <Text style={styles.tabCardTitle}>Thông tin cá nhân</Text>
                  <Text style={styles.tabCardSubtitle}>Quản lý thông tin hồ sơ để bảo mật tài khoản và giao nhận hàng thuận tiện.</Text>

                  <View style={styles.formGrid}>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Họ và tên</Text>
                      <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nhập họ và tên"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Email</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#f1f5f9' }]}
                        value={email}
                        editable={false}
                        placeholder="Địa chỉ email"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>

                    <View style={styles.fieldGroup}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.fieldLabel}>Số điện thoại</Text>
                        <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '600' }}>{phone.length}/10 số</Text>
                      </View>
                      <TextInput
                        style={styles.textInput}
                        value={phone}
                        onChangeText={(val) => setPhone(val.replace(/[^0-9]/g, '').slice(0, 10))}
                        placeholder="Nhập số điện thoại (10 chữ số)"
                        placeholderTextColor="#94a3b8"
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Địa chỉ giao hàng mặc định</Text>
                      <TextInput
                        style={styles.textInput}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Tỉnh / Thành phố</Text>
                      <TextInput
                        style={styles.textInput}
                        value={city}
                        onChangeText={setCity}
                        placeholder="Nhập tỉnh/thành phố"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>

                    <Pressable
                      style={[styles.primaryBtn, savingProfile && { opacity: 0.7 }]}
                      onPress={handleSaveProfile}
                      disabled={savingProfile}
                    >
                      {savingProfile ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.primaryBtnText}>Lưu thay đổi</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* SUPPORT MODAL */}
      <Modal visible={supportModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Liên hệ hỗ trợ</Text>
              <Pressable onPress={() => setSupportModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.supportRow}>
              <Ionicons name="call" size={22} color="#dc2626" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.supportLabel}>Tổng đài miễn phí</Text>
                <Text style={styles.supportValue}>1800 6868 (8h00 - 21h30)</Text>
              </View>
            </View>

            <View style={styles.supportRow}>
              <Ionicons name="chatbubbles" size={22} color="#059669" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.supportLabel}>Zalo hỗ trợ trực tiếp</Text>
                <Text style={styles.supportValue}>0909 123 456 (Hỗ trợ 24/7)</Text>
              </View>
            </View>

            <View style={styles.supportRow}>
              <Ionicons name="mail" size={22} color="#2563eb" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.supportLabel}>Email tiếp nhận</Text>
                <Text style={styles.supportValue}>cskh@dangvinhpc.vn</Text>
              </View>
            </View>

            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setSupportModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* LOGOUT CONFIRM MODAL */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="log-out" size={24} color="#dc2626" />
              </View>
              <Text style={styles.modalTitle}>Đăng xuất tài khoản</Text>
              <Text style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginTop: 6, lineHeight: 20 }}>
                Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc hiện tại?
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <Pressable
                style={[styles.modalActionBtn, { backgroundColor: '#f1f5f9' }]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={{ color: '#475569', fontWeight: '700', fontSize: 14 }}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.modalActionBtn, { backgroundColor: '#dc2626' }]}
                onPress={handleLogout}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Đăng xuất</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 60,
  },
  container: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
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
    shadowOpacity: 0.15,
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

  /* MAIN LAYOUT */
  mainLayout: {
    gap: 20,
    alignItems: 'flex-start',
  },

  /* SIDEBAR CARD */
  sidebarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  userNameWrap: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportLinkText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  navMenu: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: '#fef2f2',
  },
  navItemIcon: {
    marginRight: 10,
  },
  navItemText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  navItemTextActive: {
    color: '#dc2626',
    fontWeight: '700',
  },

  /* RIGHT CONTENT */
  rightContent: {
    gap: 16,
  },
  tabPane: {
    gap: 16,
  },

  /* VIP BANNER */
  vipBanner: {
    position: 'relative',
    backgroundColor: '#475569',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  vipBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    zIndex: 2,
  },
  vipAvatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipAvatarText: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '800',
  },
  vipInfo: {
    flex: 1,
    gap: 4,
  },
  vipBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  vipBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  vipScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  vipScore: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  vipScoreSub: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  vipProgressWrap: {
    marginTop: 18,
    zIndex: 2,
  },
  vipProgressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  vipProgressLabel: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  vipProgressPercent: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
  },
  vipProgressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  vipProgressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 99,
  },
  vipWatermark: {
    position: 'absolute',
    right: 12,
    bottom: -10,
    zIndex: 1,
  },

  /* SUMMARY GRID */
  summaryGrid: {
    gap: 10,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },

  /* TAB CARD (WHITE CONTAINER) */
  tabCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  tabCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  tabCardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: 320,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    marginRight: 6,
  },

  /* FILTER TABS */
  orderFilterTabs: {
    flexDirection: 'row',
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 16,
  },
  filterTabItem: {
    paddingVertical: 4,
  },
  filterTabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#dc2626',
  },
  filterTabText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#dc2626',
    fontWeight: '700',
  },

  /* ALERT BOX (AS IN SCREENSHOT) */
  alertBox: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991b1b',
  },
  alertSubtitle: {
    fontSize: 13,
    color: '#b91c1c',
  },

  /* ORDERS LIST */
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  orderList: {
    gap: 12,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderStatusBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  orderItems: {
    gap: 10,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderItemImg: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  orderItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  orderItemQty: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dc2626',
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  orderTotalLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  orderTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#dc2626',
  },

  /* WARRANTY CONTENT */
  warrantyBox: {
    marginTop: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  warrantyHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  warrantyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warrantyText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },

  /* FORM STYLES */
  formGrid: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  primaryBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  /* MODALS */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  supportLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  supportValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  modalCloseBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 14,
  },
  modalActionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
