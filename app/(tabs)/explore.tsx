import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { Header } from '@/components/Header';
import { OrderCardSkeleton } from '@/components/SkeletonLoader';
import { useAppContext } from '@/context/AppContext';
import { formatPrice, getProductFallbackImage, isInvalidOrBlockedImageUrl } from '@/data/products';
import { apiService, type Order } from '@/services/api';
import { playSuccessChime } from '@/utils/sound';

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  pending: {
    label: 'Chờ xác nhận',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: 'time-outline',
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: 'checkmark-circle-outline',
  },
  shipping: {
    label: 'Đang giao hàng',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: 'bicycle-outline',
  },
  delivered: {
    label: 'Đã giao tới nơi',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: 'location-outline',
  },
  completed: {
    label: 'Đã hoàn thành',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: 'checkmark-done-outline',
  },
  cancelled: {
    label: 'Đã hủy',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: 'close-circle-outline',
  },
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Hôm nay';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Gần đây';
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

function parseOrderItems(rawItems: any): any[] {
  if (!rawItems) return [];
  if (Array.isArray(rawItems)) return rawItems;
  if (typeof rawItems === 'string') {
    try {
      const parsed = JSON.parse(rawItems);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function getOrderTimelineEvents(order?: Order | null) {
  if (!order) return [];
  const baseTime = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
  const formatEventTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} • ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const isPending = order.status === 'pending';
  const isConfirmed = ['confirmed', 'shipping', 'delivered', 'completed'].includes(order.status);
  const isShipping = ['shipping', 'delivered', 'completed'].includes(order.status);
  const isDelivered = ['delivered', 'completed'].includes(order.status);
  const isCompleted = order.status === 'completed';
  const isCancelled = order.status === 'cancelled';

  if (isCancelled) {
    return [
      {
        step: 1,
        title: 'Khách đặt đơn thành công',
        time: formatEventTime(baseTime),
        desc: 'Đơn hàng đã được khởi tạo và ghi nhận trên hệ thống DANGVINHPC.',
        location: 'Cổng mua sắm trực tuyến DANGVINHPC',
        isDone: true,
        isCurrent: false,
        icon: 'bag-check-outline',
        color: '#2563eb',
      },
      {
        step: 2,
        title: 'Đơn hàng đã hủy',
        time: formatEventTime(baseTime + 15 * 60 * 1000),
        desc: 'Đơn hàng đã được hủy theo yêu cầu của khách hàng hoặc quản trị viên.',
        location: 'Trung tâm xử lý đơn hàng DANGVINHPC',
        isDone: true,
        isCurrent: true,
        icon: 'close-circle-outline',
        color: '#dc2626',
      },
    ];
  }

  return [
    {
      step: 1,
      title: 'Khách đặt đơn thành công',
      time: formatEventTime(baseTime),
      desc: 'Đơn hàng được khởi tạo thành công và chuyển thông tin đến bộ phận kho DANGVINHPC.',
      location: 'Cổng mua sắm trực tuyến DANGVINHPC',
      isDone: true,
      isCurrent: isPending,
      icon: 'bag-check-outline',
      color: '#2563eb',
    },
    {
      step: 2,
      title: 'Kho xác nhận & Đóng gói sản phẩm',
      time: formatEventTime(baseTime + 35 * 60 * 1000),
      desc: 'Kho tổng kiểm tra linh kiện/máy, in phiếu bảo hành, dán tem niêm phong và bọc chống sốc 3 lớp an toàn.',
      location: 'Kho tổng DANGVINHPC (191 Nguyễn Thị Duệ / TP.HCM)',
      isDone: isConfirmed,
      isCurrent: order.status === 'confirmed',
      icon: 'cube-outline',
      color: '#0284c7',
    },
    {
      step: 3,
      title: 'Bàn giao Shipper xuất kho vận chuyển',
      time: formatEventTime(baseTime + 2 * 3600 * 1000 + 15 * 60 * 1000),
      desc: 'Bưu tá DPC Express đã nhận kiện hàng từ kho tổng và bắt đầu xuất phát trên tuyến giao.',
      location: 'Trung tâm điều phối bưu cục DPC Express',
      isDone: isShipping,
      isCurrent: order.status === 'shipping',
      icon: 'bicycle-outline',
      color: '#7c3aed',
    },
    {
      step: 4,
      title: 'Bưu tá phát hàng đến bạn',
      time: formatEventTime(baseTime + 5 * 3600 * 1000 + 40 * 60 * 1000),
      desc: 'Bưu tá Nguyễn Văn Hưng (0912.868.555) đang liên hệ và phát máy tận tay khách nhận.',
      location: order.shippingAddress ? order.shippingAddress.split(',')[1]?.trim() || 'Tuyến phát nội thành' : 'Địa chỉ nhận hàng của bạn',
      isDone: isDelivered,
      isCurrent: order.status === 'delivered',
      icon: 'home-outline',
      color: '#059669',
    },
    {
      step: 5,
      title: 'Giao hàng thành công & Hoàn tất',
      time: formatEventTime(baseTime + 6 * 3600 * 1000 + 10 * 60 * 1000),
      desc: 'Khách hàng đã kiểm tra ngoại quan máy và xác nhận nhận hàng nguyên vẹn.',
      location: 'Hoàn tất giao hàng',
      isDone: isCompleted,
      isCurrent: isCompleted,
      icon: 'checkmark-done-circle-outline',
      color: '#16a34a',
    },
  ];
}

export default function OrdersTabScreen() {
  const router = useRouter();
  const { user, addToCart, isAdmin, isDark } = useAppContext();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // Nếu là Admin, tự động chuyển thẳng sang Bảng Quản trị (Admin Panel)
  useEffect(() => {
    if (isAdmin) {
      router.replace('/admin' as any);
    }
  }, [isAdmin]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadOrders = useCallback(async (isRefresh = false) => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await apiService.getOrders(user.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadOrders(true);
    }, [loadOrders])
  );

  useEffect(() => {
    loadOrders();

    // Auto-polling 4s một lần để cập nhật trạng thái đơn hàng thời gian thực
    const interval = setInterval(() => {
      loadOrders(true);
    }, 4000);

    // Đồng bộ tức thì giữa các tab (Cross-tab broadcast khi khách đặt đơn mới hoặc nhân viên/admin đổi trạng thái)
    if (typeof window !== 'undefined') {
      const handleSync = () => loadOrders(true);
      window.addEventListener('focus', handleSync);
      window.addEventListener('dpc_order_created', handleSync);
      window.addEventListener('dpc_order_updated', handleSync);
      let bc: BroadcastChannel | null = null;
      try {
        bc = new BroadcastChannel('dpc_order_sync');
        bc.onmessage = () => loadOrders(true);
      } catch {}
      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleSync);
        window.removeEventListener('dpc_order_created', handleSync);
        window.removeEventListener('dpc_order_updated', handleSync);
        if (bc) bc.close();
      };
    }

    return () => clearInterval(interval);
  }, [loadOrders]);

  const counts = useMemo(() => {
    const list = orders || [];
    return {
      all: list.length,
      pending: list.filter((o) => o?.status === 'pending' || o?.status === 'confirmed').length,
      shipping: list.filter((o) => o?.status === 'shipping' || o?.status === 'delivered').length,
      completed: list.filter((o) => o?.status === 'completed').length,
    };
  }, [orders]);

  const filters = useMemo(() => [
    { key: 'all', label: 'Tất cả', count: counts.all },
    { key: 'pending', label: 'Chờ xác nhận & Chuẩn bị', count: counts.pending },
    { key: 'shipping', label: 'Đang giao', count: counts.shipping },
    { key: 'completed', label: 'Hoàn thành', count: counts.completed },
  ], [counts]);

  const filteredOrders = useMemo(() => {
    const list = orders || [];
    if (activeFilter === 'all') return list;
    if (activeFilter === 'pending') {
      return list.filter((o) => o?.status === 'pending' || o?.status === 'confirmed');
    }
    if (activeFilter === 'shipping') {
      return list.filter((o) => o?.status === 'shipping' || o?.status === 'delivered');
    }
    return list.filter((o) => o?.status === activeFilter);
  }, [orders, activeFilter]);

  const totalSpent = useMemo(() => {
    return (orders || [])
      .filter((o) => o && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o?.totalAmount) || 0), 0);
  }, [orders]);

  // Review Modal State
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMedia, setReviewMedia] = useState<{ uri: string; type: 'image' | 'video'; name: string }[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Return / Warranty Modal State
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Lỗi kỹ thuật / Lỗi phần cứng không hoạt động');
  const [returnDesc, setReturnDesc] = useState('');
  const [returnPhone, setReturnPhone] = useState(user?.phone || '');
  const [returnMedia, setReturnMedia] = useState<{ uri: string; type: 'image' | 'video'; name: string }[]>([]);
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Tracking Journey Modal State
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handlePickReviewMedia = () => {
    if (reviewMedia.length >= 5) {
      alert('Bạn chỉ có thể tải lên tối đa 5 hình ảnh hoặc video minh họa.');
      return;
    }

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*';
      input.multiple = true;
      input.onchange = (e: any) => {
        const files: File[] = Array.from(e.target.files || []);
        const allowed = files.slice(0, 5 - reviewMedia.length);
        allowed.forEach((file) => {
          const isVideo = file.type.startsWith('video');
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            if (dataUrl) {
              setReviewMedia((prev) => [
                ...prev,
                { uri: dataUrl, type: isVideo ? 'video' : 'image', name: file.name },
              ]);
            }
          };
          reader.readAsDataURL(file);
        });
      };
      input.click();
    }
  };

  const handleRemoveReviewMedia = (idx: number) => {
    setReviewMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddPresetReviewPhoto = (url: string, name: string) => {
    if (reviewMedia.length >= 5) {
      alert('Bạn chỉ có thể tải lên tối đa 5 hình ảnh hoặc video.');
      return;
    }
    setReviewMedia((prev) => [...prev, { uri: url, type: 'image', name }]);
  };

  const handlePickMedia = () => {
    if (returnMedia.length >= 5) {
      alert('Bạn chỉ có thể tải lên tối đa 5 hình ảnh hoặc video minh chứng lỗi.');
      return;
    }

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*';
      input.multiple = true;
      input.onchange = (e: any) => {
        const files: File[] = Array.from(e.target.files || []);
        const allowed = files.slice(0, 5 - returnMedia.length);
        allowed.forEach((file) => {
          const isVideo = file.type.startsWith('video');
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            if (dataUrl) {
              setReturnMedia((prev) => [
                ...prev,
                { uri: dataUrl, type: isVideo ? 'video' : 'image', name: file.name },
              ]);
            }
          };
          reader.readAsDataURL(file);
        });
      };
      input.click();
    }
  };

  const handleRemoveMedia = (idx: number) => {
    setReturnMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleConfirmReceived = async (order: Order, e?: any) => {
    e?.stopPropagation?.();
    const ok = typeof window !== 'undefined'
      ? window.confirm(`Xác nhận bạn đã nhận được kiện hàng #${order.orderNumber} và sản phẩm nguyên vẹn?`)
      : true;
    if (!ok) return;

    try {
      await apiService.confirmOrderReceived(order.id || order.orderNumber);
      playSuccessChime();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id || o.orderNumber === order.orderNumber
            ? { ...o, status: 'completed' }
            : o
        )
      );
      showToast('🎉 Xác nhận đã nhận hàng thành công! Mời bạn đánh giá sản phẩm hoặc yêu cầu đổi mới.');
      setTimeout(() => loadOrders(true), 400);
    } catch (err: any) {
      alert('Lỗi xác nhận: ' + (err.message || 'Thất bại'));
    }
  };

  const handleOpenReview = (order: Order, e?: any) => {
    e?.stopPropagation?.();
    setReviewOrder(order);
    setSelectedProductIndex(0);
    setReviewRating(5);
    setReviewComment('');
    setReviewMedia([]);
  };

  const handleOpenReturn = (order: Order, e?: any) => {
    e?.stopPropagation?.();
    const createdDate = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
    const diffDays = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      alert('Đơn hàng đã quá hạn 30 ngày đổi trả theo chính sách. Vui lòng liên hệ trung tâm bảo hành DANGVINHPC (1800 6868) để được bảo hành chính hãng!');
      return;
    }
    setReturnOrder(order);
    setReturnReason('Lỗi kỹ thuật / Lỗi phần cứng không hoạt động');
    setReturnDesc('');
    setReturnPhone(user?.phone || '');
    setReturnMedia([]);
  };

  const handleSubmitReview = async () => {
    if (!reviewOrder) return;
    const items = parseOrderItems(reviewOrder.items);
    const selectedItem = items[selectedProductIndex] || items[0];
    const targetProdId = selectedItem?.productId || selectedItem?.id || 'lap-001';

    try {
      setSubmittingReview(true);
      await apiService.addReview(targetProdId, {
        userId: user?.id,
        userName: user?.name || 'Khách hàng DANGVINHPC',
        userAvatar: user?.avatar,
        rating: reviewRating,
        comment: reviewComment.trim() || 'Sản phẩm tuyệt vời, đóng gói chắc chắn, giao hàng siêu nhanh!',
        orderId: reviewOrder.id || reviewOrder.orderNumber,
        images: reviewMedia.map((m) => m.uri),
      });

      playSuccessChime();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === reviewOrder.id || o.orderNumber === reviewOrder.orderNumber
            ? { ...o, isReviewed: true }
            : o
        )
      );

      setReviewOrder(null);
      setReviewMedia([]);
      showToast('🎉 Đánh giá sản phẩm thành công! Cảm ơn phản hồi của bạn.');
    } catch (err: any) {
      alert('Lỗi gửi đánh giá: ' + (err.message || 'Thất bại'));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitReturn = async () => {
    if (!returnOrder) return;
    if (!returnPhone.trim()) {
      alert('Vui lòng nhập số điện thoại để kỹ thuật viên liên hệ');
      return;
    }
    if (returnMedia.length === 0) {
      alert('Vui lòng tải lên ít nhất 1 hình ảnh hoặc video minh chứng tình trạng máy/linh kiện bị lỗi để kỹ thuật viên kiểm tra!');
      return;
    }

    try {
      setSubmittingReturn(true);
      await apiService.requestReturn(returnOrder.id || returnOrder.orderNumber, {
        userId: user?.id,
        reason: returnReason,
        description: returnDesc.trim() || returnReason,
        contactPhone: returnPhone.trim(),
        mediaUrls: returnMedia.map((m) => m.uri),
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === returnOrder.id || o.orderNumber === returnOrder.orderNumber
            ? { ...o, returnStatus: 'pending', returnReason, returnMedia: returnMedia.map((m) => m.uri) }
            : o
        )
      );

      setReturnOrder(null);
      showToast('📦 Đã gửi yêu cầu đổi trả kèm minh chứng! Kỹ thuật viên DANGVINHPC sẽ liên hệ trong 24h.');
    } catch (err: any) {
      alert('Lỗi gửi yêu cầu: ' + (err.message || 'Thất bại'));
    } finally {
      setSubmittingReturn(false);
    }
  };

  const handleReorder = (order: Order, e: any) => {
    e?.stopPropagation?.();
    const items = parseOrderItems(order.items);
    if (items.length > 0) {
      items.forEach((item) => {
        const itemImage =
          item?.image && !isInvalidOrBlockedImageUrl(item.image)
            ? item.image
            : getProductFallbackImage({ id: item?.productId, name: item?.name });

        addToCart({
          id: item?.productId || 'reorder',
          name: item?.name || 'Sản phẩm',
          price: Number(item?.price) || 0,
          image: itemImage,
          qty: Number(item?.quantity) || 1,
          spec: item?.selectedConfig || '',
          category: 'Tech',
          selected: true,
        });
      });
      router.push('/cart' as any);
    }
  };

  const handleOpenDetail = (orderId: number | string) => {
    router.push({
      pathname: '/orders/[id]',
      params: { id: String(orderId) },
    } as any);
  };

  if (isAdmin) {
    return (
      <View style={[styles.centerState, { padding: 24 }]}>
        <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Ionicons name="shield-checkmark" size={36} color="#dc2626" />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>
          Tài khoản Quản trị viên (Admin)
        </Text>
        <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', maxWidth: 460, lineHeight: 22, marginBottom: 24 }}>
          Bạn đang đăng nhập với tư cách Quản trị viên DANGVINHPC. Trang này dành cho khách hàng cá nhân. Vui lòng vào Bảng Quản trị để quản lý kho máy tính và duyệt đơn hàng của toàn bộ khách hàng.
        </Text>
        <Pressable
          style={{ backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
          onPress={() => router.replace('/admin' as any)}
        >
          <Ionicons name="construct-outline" size={18} color="#ffffff" />
          <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 15 }}>Chuyển đến Bảng Quản trị (Admin Panel)</Text>
        </Pressable>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.pageWrapper, isDark && styles.pageDark]}>
        <Header />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24, minHeight: 460 }]}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: isDark ? '#1e293b' : '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Ionicons name="receipt-outline" size={36} color="#2563eb" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: isDark ? '#f8fafc' : '#0f172a', marginBottom: 8, textAlign: 'center' }}>
            Bạn chưa đăng nhập
          </Text>
          <Text style={{ fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', textAlign: 'center', maxWidth: 360, lineHeight: 22, marginBottom: 24 }}>
            Khách vãng lai chỉ có quyền xem sản phẩm. Vui lòng đăng nhập tài khoản để đặt hàng và theo dõi đơn hàng của bạn.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Pressable
              style={{ backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 }}
              onPress={() => router.push('/login' as any)}
            >
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>Đăng nhập ngay</Text>
            </Pressable>
            <Pressable
              style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={{ color: isDark ? '#cbd5e1' : '#475569', fontWeight: '600', fontSize: 14 }}>Khám phá sản phẩm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.pageWrapper, isDark && styles.pageDark]}>
        <Header />
        <View style={[styles.container, isDesktop && styles.contentDesktop, { padding: 16 }]}>
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerState}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" style={{ marginBottom: 12 }} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadOrders(false)}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.pageWrapper, isDark && styles.pageDark]}>
      <Header />
      <ScrollView
        style={[styles.container, isDark && styles.containerDark]}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadOrders(true)} />}
      >
        {/* BREADCRUMB / VỀ TRANG CHỦ */}
        <View style={styles.breadcrumbBar}>
          <Pressable
            style={StyleSheet.flatten([styles.breadcrumbTouch, isDark && styles.breadcrumbTouchDark])}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="home-outline" size={14} color={isDark ? '#60a5fa' : '#2563eb'} style={{ marginRight: 6 }} />
            <Text style={StyleSheet.flatten([styles.breadcrumbLink, isDark && { color: '#60a5fa' }])}>Trang chủ</Text>
          </Pressable>
          <Text style={StyleSheet.flatten([styles.breadcrumbSep, isDark && styles.textMutedDark])}>/</Text>
          <Text style={StyleSheet.flatten([styles.breadcrumbCurrent, isDark && styles.textDark])}>Đơn hàng của tôi</Text>
        </View>

        {/* 1. CLEAN MODERN HEADER */}
        <View style={styles.headerBlock}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Đơn hàng của tôi</Text>
          <Text style={styles.subtitle}>
            Theo dõi hành trình vận chuyển và quản lý hóa đơn mua sắm
          </Text>
        </View>

        {totalSpent > 0 && (
          <View style={styles.summaryBadge}>
            <Ionicons name="wallet-outline" size={15} color="#2563eb" />
            <Text style={styles.summaryBadgeText}>
              Đã tích lũy: <Text style={{ fontWeight: '800', color: '#1d4ed8' }}>{formatPrice(totalSpent)}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* 2. MINIMALIST SEGMENTED TABS */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <Pressable
                key={f.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {f.label}
                </Text>
                {f.count > 0 && (
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                      {f.count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. ORDER CARDS LIST */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="bag-handle-outline" size={44} color="#94a3b8" />
          </View>
          <Text style={styles.emptyTitle}>Chưa có đơn hàng nào ở mục này</Text>
          <Text style={styles.emptySubtitle}>
            Hàng ngàn máy tính, linh kiện PC và phụ kiện chính hãng đang chờ bạn khám phá.
          </Text>
          <Pressable style={styles.shopNowBtn} onPress={() => router.push('/products' as any)}>
            <Ionicons name="cart" size={16} color="#ffffff" />
            <Text style={styles.shopNowBtnText}>Khám phá sản phẩm ngay</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.orderListWrap}>
          {filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.pending;
            const items = parseOrderItems(order.items);
            const firstItem = items[0];
            const otherItemsCount = Math.max(0, items.length - 1);
            const totalQuantity = items.reduce((sum: number, it: any) => sum + (Number(it?.quantity) || 1), 0) || 1;

            const itemImage =
              firstItem?.image && !isInvalidOrBlockedImageUrl(firstItem.image)
                ? firstItem.image
                : getProductFallbackImage({
                    id: firstItem?.productId,
                    name: firstItem?.name || order.orderNumber,
                  });

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* CARD HEADER */}
                <View style={styles.orderCardHeader}>
                  <View style={styles.orderNumberGroup}>
                    <Ionicons name="receipt-outline" size={16} color="#2563eb" />
                    <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
                    <Text style={styles.orderHeaderDot}>•</Text>
                    <Text style={styles.orderDateText}>{formatDate(order.createdAt)}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: statusInfo.bg, borderColor: statusInfo.border },
                    ]}
                  >
                    <Ionicons name={statusInfo.icon} size={13} color={statusInfo.color} style={{ marginRight: 4 }} />
                    <Text style={[styles.statusPillText, { color: statusInfo.color }]}>
                      {order.status === 'completed'
                        ? 'Đã nhận hàng'
                        : order.status === 'delivered'
                        ? 'Đã giao tới nơi (Chờ nhận)'
                        : order.status === 'confirmed'
                        ? 'Đang chuẩn bị hàng'
                        : statusInfo.label}
                    </Text>
                  </View>
                </View>

                {/* CARD BODY: ITEM DETAILS WITH THUMBNAIL */}
                <Pressable
                  style={styles.orderItemBody}
                  onPress={() => handleOpenDetail(order.id)}
                >
                  <Image
                    source={{ uri: itemImage }}
                    style={styles.itemThumb}
                    resizeMode="contain"
                    {...({ referrerPolicy: 'no-referrer' } as any)}
                  />

                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {firstItem?.name || 'Sản phẩm công nghệ DANGVINHPC'}
                    </Text>

                    <View style={styles.itemMetaRow}>
                      {firstItem?.selectedConfig ? (
                        <View style={styles.configPill}>
                          <Text style={styles.configPillText}>{firstItem.selectedConfig}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.itemQuantityText}>
                        Số lượng: <Text style={{ fontWeight: '700', color: '#0f172a' }}>x{firstItem?.quantity || 1}</Text>
                      </Text>
                    </View>

                    {otherItemsCount > 0 && (
                      <Text style={styles.moreItemsText}>
                        +{otherItemsCount} sản phẩm khác trong đơn hàng này
                      </Text>
                    )}
                  </View>

                  <View style={styles.itemPriceCol}>
                    <Text style={styles.itemPriceValue}>
                      {formatPrice(firstItem?.price || order.totalAmount)}
                    </Text>
                  </View>
                </Pressable>

                {/* DELIVERY ADDRESS ROW */}
                {order.shippingAddress ? (
                  <View style={styles.orderAddressRow}>
                    <Ionicons name="location-outline" size={14} color="#64748b" />
                    <Text style={styles.orderAddressText} numberOfLines={1}>
                      <Text style={{ fontWeight: '700', color: '#475569' }}>Giao đến: </Text>
                      {order.shippingAddress}
                    </Text>
                  </View>
                ) : null}

                {/* RETURN STATUS BANNER */}
                {order.returnStatus ? (
                  <View
                    style={[
                      styles.returnStatusBanner,
                      order.returnStatus === 'pending' && styles.returnStatusBannerPending,
                      order.returnStatus === 'approved' && styles.returnStatusBannerApproved,
                      order.returnStatus === 'rejected' && styles.returnStatusBannerRejected,
                    ]}
                  >
                    <Ionicons
                      name={
                        order.returnStatus === 'pending'
                          ? 'hourglass-outline'
                          : order.returnStatus === 'approved'
                          ? 'shield-checkmark-outline'
                          : 'alert-circle-outline'
                      }
                      size={16}
                      color={
                        order.returnStatus === 'pending'
                          ? '#d97706'
                          : order.returnStatus === 'approved'
                          ? '#16a34a'
                          : '#dc2626'
                      }
                      style={{ marginRight: 8, marginTop: 1 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.returnBannerTitle,
                          order.returnStatus === 'pending' && { color: '#92400e' },
                          order.returnStatus === 'approved' && { color: '#166534' },
                          order.returnStatus === 'rejected' && { color: '#991b1b' },
                        ]}
                      >
                        {order.returnStatus === 'pending'
                          ? 'Yêu cầu đổi trả đang được xét duyệt'
                          : order.returnStatus === 'approved'
                          ? 'Yêu cầu đổi trả đã được CHẤP THUẬN'
                          : 'Yêu cầu đổi trả KHÔNG ĐƯỢC CHẤP THUẬN'}
                      </Text>
                      <Text style={styles.returnBannerDesc}>
                        {order.returnStatus === 'pending'
                          ? `Lý do: ${order.returnReason || 'Đổi mới lỗi sản phẩm'}. Kỹ thuật viên DANGVINHPC sẽ liên hệ trong 24h.`
                          : order.returnStatus === 'approved'
                          ? 'Bưu tá DPC Express sẽ liên hệ bạn để nhận máy và tiến hành đổi mới / hoàn tiền.'
                          : 'Sản phẩm không thuộc phạm vi lỗi đổi mới theo quy định. Vui lòng liên hệ hotline 1800 6868.'}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* DELIVERY NOTICE WHEN DELIVERED OR SHIPPING */}
                {order.status === 'delivered' || order.status === 'shipping' ? (
                  <Pressable
                    style={[
                      styles.deliveryNoticeBox,
                      order.status === 'shipping' && styles.deliveryNoticeBoxShipping,
                    ]}
                    onPress={() => setTrackingOrder(order)}
                    accessibilityRole="button"
                    accessibilityLabel="Xem lịch sử hành trình đơn hàng"
                  >
                    <Ionicons
                      name={order.status === 'delivered' ? 'checkmark-circle' : 'bicycle'}
                      size={20}
                      color={order.status === 'delivered' ? '#16a34a' : '#7c3aed'}
                      style={{ marginRight: 8, marginTop: 1 }}
                    />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Text style={[styles.deliveryNoticeTitle, order.status === 'shipping' && { color: '#6d28d9' }]}>
                          {order.status === 'delivered' ? 'Bưu tá đã giao hàng thành công!' : 'Đơn hàng đang trên đường vận chuyển'}
                        </Text>
                        <View style={styles.trackingHintBadge}>
                          <Text style={styles.trackingHintText}>Xem hành trình ↗</Text>
                        </View>
                      </View>
                      <Text style={[styles.deliveryNoticeDesc, order.status === 'shipping' && { color: '#5b21b6' }]}>
                        {order.status === 'delivered'
                          ? 'Kiện hàng đã được giao đến bạn. Bấm vào đây để xem chi tiết lịch sử vận chuyển hoặc bấm "Đã nhận hàng" nhé!'
                          : 'Bưu tá DPC Express đang vận chuyển. Bấm vào đây để xem lịch sử xuất kho, bưu tá lấy hàng và hành trình chi tiết.'}
                      </Text>
                    </View>
                  </Pressable>
                ) : null}

                {/* CARD FOOTER */}
                <View style={styles.orderCardFooter}>
                  <View style={styles.totalAmountGroup}>
                    <Text style={styles.totalAmountLabel}>
                      Tổng thanh toán ({totalQuantity} món):
                    </Text>
                    <Text style={styles.totalAmountValue}>
                      {formatPrice(order.totalAmount)}
                    </Text>
                  </View>

                  <View style={styles.actionBtnGroup}>
                    {/* Xem chi tiết */}
                    <Pressable
                      style={styles.detailOutlineBtn}
                      onPress={() => handleOpenDetail(order.id)}
                    >
                      <Text style={styles.detailOutlineBtnText}>Xem chi tiết</Text>
                    </Pressable>

                    {order.status === 'completed' ? (
                      <>
                        {/* Nút Đánh giá */}
                        {order.isReviewed ? (
                          <View style={styles.reviewedBadge}>
                            <Ionicons name="star" size={13} color="#f59e0b" style={{ marginRight: 4 }} />
                            <Text style={styles.reviewedBadgeText}>Đã đánh giá</Text>
                          </View>
                        ) : (
                          <Pressable
                            style={styles.reviewOutlineBtn}
                            onPress={(e) => handleOpenReview(order, e)}
                          >
                            <Ionicons name="star" size={13} color="#f59e0b" style={{ marginRight: 4 }} />
                            <Text style={styles.reviewOutlineBtnText}>Đánh giá</Text>
                          </Pressable>
                        )}

                        {/* Nút Đổi trả / Hoàn tiền */}
                        {order.returnStatus === 'pending' ? (
                          <View style={styles.returnPendingBadge}>
                            <Ionicons name="time-outline" size={13} color="#d97706" style={{ marginRight: 4 }} />
                            <Text style={styles.returnPendingBadgeText}>Chờ duyệt đổi trả</Text>
                          </View>
                        ) : order.returnStatus === 'approved' ? (
                          <View style={styles.returnApprovedBadge}>
                            <Ionicons name="checkmark-circle" size={13} color="#16a34a" style={{ marginRight: 4 }} />
                            <Text style={styles.returnApprovedBadgeText}>Đã duyệt đổi trả</Text>
                          </View>
                        ) : order.returnStatus === 'rejected' ? (
                          <View style={styles.returnRejectedBadge}>
                            <Ionicons name="close-circle" size={13} color="#dc2626" style={{ marginRight: 4 }} />
                            <Text style={styles.returnRejectedBadgeText}>Từ chối đổi trả</Text>
                          </View>
                        ) : (
                          <Pressable
                            style={styles.returnOutlineBtn}
                            onPress={(e) => handleOpenReturn(order, e)}
                          >
                            <Ionicons name="swap-horizontal-outline" size={14} color="#475569" style={{ marginRight: 4 }} />
                            <Text style={styles.returnOutlineBtnText}>Đổi trả hàng</Text>
                          </Pressable>
                        )}

                        <Pressable
                          style={styles.reorderPrimaryBtn}
                          onPress={(e) => handleReorder(order, e)}
                        >
                          <Ionicons name="refresh" size={14} color="#ffffff" style={{ marginRight: 4 }} />
                          <Text style={styles.reorderPrimaryBtnText}>Mua lại</Text>
                        </Pressable>
                      </>
                    ) : order.status === 'shipping' || order.status === 'delivered' ? (
                      <>
                        <Pressable
                          style={styles.detailOutlineBtn}
                          onPress={() => setTrackingOrder(order)}
                        >
                          <Ionicons name="location-outline" size={14} color="#2563eb" style={{ marginRight: 4 }} />
                          <Text style={styles.detailOutlineBtnText}>Theo dõi</Text>
                        </Pressable>

                        <Pressable
                          style={[styles.reorderPrimaryBtn, { backgroundColor: '#16a34a' }]}
                          onPress={(e) => handleConfirmReceived(order, e)}
                        >
                          <Ionicons name="checkmark-done" size={15} color="#ffffff" style={{ marginRight: 4 }} />
                          <Text style={styles.reorderPrimaryBtnText}>Đã nhận hàng</Text>
                        </Pressable>
                      </>
                    ) : order.status === 'confirmed' ? (
                      <>
                        <Pressable
                          style={styles.detailOutlineBtn}
                          onPress={() => setTrackingOrder(order)}
                        >
                          <Ionicons name="cube-outline" size={14} color="#0284c7" style={{ marginRight: 4 }} />
                          <Text style={[styles.detailOutlineBtnText, { color: '#0284c7' }]}>Đang chuẩn bị hàng</Text>
                        </Pressable>
                        <Pressable
                          style={styles.detailOutlineBtn}
                          onPress={() => handleOpenDetail(order.id)}
                        >
                          <Text style={styles.detailOutlineBtnText}>Xem chi tiết</Text>
                        </Pressable>
                      </>
                    ) : (
                      <Pressable
                        style={styles.reorderPrimaryBtn}
                        onPress={() => handleOpenDetail(order.id)}
                      >
                        <Text style={styles.reorderPrimaryBtnText}>Chi tiết đơn</Text>
                        <Ionicons name="chevron-forward" size={14} color="#ffffff" style={{ marginLeft: 2 }} />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
      </ScrollView>

      {/* TOAST THÔNG BÁO TỨC THÌ */}
      {toastMsg ? (
        <View style={styles.toastWrap}>
          <Ionicons name="checkmark-circle" size={18} color="#22c55e" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      ) : null}

      {/* MODAL: ĐÁNH GIÁ SẢN PHẨM */}
      <Modal visible={!!reviewOrder} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isDark && styles.modalCardDark]}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={[styles.modalTitle, isDark && styles.textDark]}>Đánh giá sản phẩm</Text>
                <Text style={styles.modalSubTitle}>Đơn hàng #{reviewOrder?.orderNumber}</Text>
              </View>
              <Pressable onPress={() => setReviewOrder(null)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
              {/* Product preview */}
              {(() => {
                const items = parseOrderItems(reviewOrder?.items);
                const currentProd = items[selectedProductIndex] || items[0];
                const pImg = currentProd?.image && !isInvalidOrBlockedImageUrl(currentProd.image)
                  ? currentProd.image
                  : getProductFallbackImage({ id: currentProd?.productId, name: currentProd?.name });

                return (
                  <View>
                    {items.length > 1 && (
                      <View style={{ marginBottom: 12 }}>
                        <Text style={styles.inputLabel}>Chọn sản phẩm cần đánh giá:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                          {items.map((it: any, idx: number) => (
                            <Pressable
                              key={idx}
                              style={[
                                styles.prodSelectChip,
                                selectedProductIndex === idx && styles.prodSelectChipActive,
                              ]}
                              onPress={() => setSelectedProductIndex(idx)}
                            >
                              <Text
                                style={[
                                  styles.prodSelectChipText,
                                  selectedProductIndex === idx && styles.prodSelectChipTextActive,
                                ]}
                                numberOfLines={1}
                              >
                                {it.name}
                              </Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    <View style={styles.reviewProdPreview}>
                      <Image source={{ uri: pImg }} style={styles.reviewProdImg} resizeMode="contain" />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.reviewProdName, isDark && styles.textDark]} numberOfLines={2}>
                          {currentProd?.name}
                        </Text>
                        <Text style={styles.reviewProdPrice}>
                          {formatPrice(currentProd?.price || 0)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })()}

              {/* Star Rating Selection */}
              <View style={styles.starSection}>
                <Text style={styles.starPrompt}>Bạn đánh giá chất lượng sản phẩm thế nào?</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable key={star} onPress={() => setReviewRating(star)} style={{ padding: 4 }}>
                      <Ionicons
                        name={star <= reviewRating ? 'star' : 'star-outline'}
                        size={36}
                        color={star <= reviewRating ? '#f59e0b' : '#cbd5e1'}
                      />
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.starLabelText}>
                  {reviewRating === 5
                    ? '⭐⭐⭐⭐⭐ Tuyệt vời! Rất hài lòng'
                    : reviewRating === 4
                    ? '⭐⭐⭐⭐ Hài lòng với sản phẩm'
                    : reviewRating === 3
                    ? '⭐⭐⭐ Bình thường'
                    : reviewRating === 2
                    ? '⭐⭐ Chưa thực sự hài lòng'
                    : '⭐ Rất thất vọng về sản phẩm'}
                </Text>
              </View>

              {/* Quick Tags */}
              <View style={styles.tagSection}>
                <Text style={styles.tagPrompt}>Gợi ý nhận xét nhanh:</Text>
                <View style={styles.tagsWrap}>
                  {[
                    'Chất lượng tuyệt vời 💯',
                    'Đóng gói 2 lớp cẩn thận 📦',
                    'Giao hàng siêu tốc 🚀',
                    'Hàng chính hãng chuẩn chỉ 🛡️',
                    'Kỹ thuật viên tư vấn nhiệt tình 👨‍💻',
                  ].map((tag, tIdx) => (
                    <Pressable
                      key={tIdx}
                      style={styles.quickTagBtn}
                      onPress={() => {
                        setReviewComment((prev) => (prev ? `${prev}, ${tag}` : tag));
                      }}
                    >
                      <Text style={styles.quickTagBtnText}>{tag}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Comment Input */}
              <View style={{ marginTop: 14 }}>
                <Text style={styles.inputLabel}>Nhận xét chi tiết của bạn:</Text>
                <TextInput
                  style={[styles.modalTextarea, isDark && styles.modalTextareaDark]}
                  multiline
                  numberOfLines={4}
                  placeholder="Hãy chia sẻ trải nghiệm sử dụng thực tế của bạn để giúp các khách hàng khác nhé..."
                  placeholderTextColor="#94a3b8"
                  value={reviewComment}
                  onChangeText={setReviewComment}
                />
              </View>

              {/* Tải ảnh / video mở hộp & sử dụng thực tế */}
              <View style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={styles.inputLabel}>Hình ảnh / Video thực tế khi nhận máy:</Text>
                  <Text style={{ fontSize: 11, color: '#64748b' }}>{reviewMedia.length}/5 file</Text>
                </View>

                {/* Upload Button */}
                <Pressable
                  style={[styles.uploadMediaBox, isDark && styles.uploadMediaBoxDark]}
                  onPress={handlePickReviewMedia}
                >
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="camera" size={24} color="#2563eb" />
                  </View>
                  <Text style={[styles.uploadBoxTitle, isDark && styles.textDark]}>
                    Bấm để tải ảnh chụp hoặc video unboxing thực tế
                  </Text>
                  <Text style={styles.uploadBoxSub}>
                    Chia sẻ hình ảnh mở hộp, độ sắc nét màn hình, góc setup để nhận thêm voucher 20.000₫ (Hỗ trợ JPG, PNG, MP4, MOV)
                  </Text>
                </Pressable>

                {/* Gợi ý ảnh mẫu test nhanh */}
                <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Gợi ý ảnh mẫu:</Text>
                  {[
                    { label: '📦 Ảnh mở hộp', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80' },
                    { label: '✨ Ảnh lên đèn RGB', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
                    { label: '🖥️ Ảnh góc làm việc', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
                  ].map((preset, pIdx) => (
                    <Pressable
                      key={pIdx}
                      style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe' }}
                      onPress={() => handleAddPresetReviewPhoto(preset.url, preset.label)}
                    >
                      <Text style={{ fontSize: 11, color: '#2563eb', fontWeight: '600' }}>+ {preset.label}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* Danh sách ảnh / video đã chọn */}
                {reviewMedia.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    {reviewMedia.map((m, mIdx) => (
                      <View key={mIdx} style={styles.mediaThumbCard}>
                        {m.type === 'video' ? (
                          <View style={styles.videoPlaceholder}>
                            <Ionicons name="videocam" size={26} color="#ffffff" />
                            <Text style={styles.videoTagText}>Video</Text>
                          </View>
                        ) : (
                          <Image source={{ uri: m.uri }} style={styles.mediaThumbImg} resizeMode="cover" />
                        )}
                        <Pressable
                          style={styles.mediaRemoveBtn}
                          onPress={() => handleRemoveReviewMedia(mIdx)}
                          hitSlop={8}
                        >
                          <Ionicons name="close" size={13} color="#ffffff" />
                        </Pressable>
                        <Text style={styles.mediaNameText} numberOfLines={1}>
                          {m.name || `Minh chứng ${mIdx + 1}`}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooterBtns}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setReviewOrder(null)}
                disabled={submittingReview}
              >
                <Text style={styles.modalCancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSubmitBtn, submittingReview && { opacity: 0.6 }]}
                onPress={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>Gửi đánh giá ngay</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: YÊU CẦU ĐỔI TRẢ & HOÀN TIỀN */}
      <Modal visible={!!returnOrder} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isDark && styles.modalCardDark]}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={[styles.modalTitle, isDark && styles.textDark]}>Yêu cầu Đổi trả / Bảo hành</Text>
                <Text style={styles.modalSubTitle}>Đơn hàng #{returnOrder?.orderNumber}</Text>
              </View>
              <Pressable onPress={() => setReturnOrder(null)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Chính sách bảo hành vàng */}
              <View style={styles.returnPolicyBox}>
                <Ionicons name="shield-checkmark" size={18} color="#16a34a" style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.returnPolicyTitle}>Chính sách đổi trả vàng tại DANGVINHPC:</Text>
                  <Text style={styles.returnPolicyDesc}>
                    • 1 đổi 1 trong vòng 30 ngày đối với lỗi phần cứng từ nhà sản xuất.{'\n'}
                    • Miễn phí bưu tá đến tận nơi nhận máy kiểm tra và giao máy mới.{'\n'}
                    • Cam kết xử lý và phản hồi nhanh chóng trong vòng 24 giờ.
                  </Text>
                </View>
              </View>

              {/* Chọn lý do đổi trả */}
              <View style={{ marginTop: 6 }}>
                <Text style={styles.inputLabel}>Lý do đổi trả / bảo hành (*):</Text>
                {[
                  'Lỗi kỹ thuật / Lỗi phần cứng không hoạt động',
                  'Sản phẩm bị nứt vỡ, móp méo khi vận chuyển',
                  'Giao sai mẫu mã hoặc thiếu phụ kiện',
                  'Sản phẩm không đúng thông số kỹ thuật công bố',
                ].map((r, rIdx) => {
                  const isChosen = returnReason === r;
                  return (
                    <Pressable
                      key={rIdx}
                      style={[styles.reasonOptionRow, isChosen && styles.reasonOptionRowActive]}
                      onPress={() => setReturnReason(r)}
                    >
                      <Ionicons
                        name={isChosen ? 'radio-button-on' : 'radio-button-off'}
                        size={18}
                        color={isChosen ? '#2563eb' : '#94a3b8'}
                        style={{ marginRight: 10 }}
                      />
                      <Text style={[styles.reasonOptionText, isChosen && styles.reasonOptionTextActive]}>
                        {r}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Mô tả chi tiết */}
              <View style={{ marginTop: 12 }}>
                <Text style={styles.inputLabel}>Mô tả chi tiết tình trạng lỗi:</Text>
                <TextInput
                  style={[styles.modalTextarea, isDark && styles.modalTextareaDark]}
                  multiline
                  numberOfLines={3}
                  placeholder="Mô tả cụ thể hiện tượng lỗi, đèn báo, màn hình, phụ kiện để kỹ thuật viên kiểm tra trước..."
                  placeholderTextColor="#94a3b8"
                  value={returnDesc}
                  onChangeText={setReturnDesc}
                />
              </View>

              {/* Tải ảnh / video minh chứng tình trạng máy */}
              <View style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={styles.inputLabel}>Ảnh / Video minh chứng tình trạng máy (*):</Text>
                  <Text style={{ fontSize: 11, color: '#64748b' }}>{returnMedia.length}/5 file</Text>
                </View>

                {/* Upload Button */}
                <Pressable
                  style={[styles.uploadMediaBox, isDark && styles.uploadMediaBoxDark]}
                  onPress={handlePickMedia}
                >
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="cloud-upload" size={24} color="#2563eb" />
                  </View>
                  <Text style={[styles.uploadBoxTitle, isDark && styles.textDark]}>
                    Bấm để tải ảnh chụp hoặc video quay lỗi laptop / linh kiện
                  </Text>
                  <Text style={styles.uploadBoxSub}>
                    Chụp rõ tem niêm phong DANGVINHPC, màn hình, vết nứt, hoặc video máy không lên nguồn (Hỗ trợ JPG, PNG, MP4, MOV)
                  </Text>
                </Pressable>

                {/* Uploaded Media Thumbnails */}
                {returnMedia.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    {returnMedia.map((m, mIdx) => (
                      <View key={mIdx} style={styles.mediaThumbCard}>
                        {m.type === 'video' ? (
                          <View style={styles.videoPlaceholder}>
                            <Ionicons name="videocam" size={26} color="#ffffff" />
                            <Text style={styles.videoTagText}>Video</Text>
                          </View>
                        ) : (
                          <Image source={{ uri: m.uri }} style={styles.mediaThumbImg} resizeMode="cover" />
                        )}
                        <Pressable
                          style={styles.mediaRemoveBtn}
                          onPress={() => handleRemoveMedia(mIdx)}
                          hitSlop={8}
                        >
                          <Ionicons name="close" size={13} color="#ffffff" />
                        </Pressable>
                        <Text style={styles.mediaNameText} numberOfLines={1}>
                          {m.name || `Minh chứng ${mIdx + 1}`}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Số điện thoại liên hệ */}
              <View style={{ marginTop: 12 }}>
                <Text style={styles.inputLabel}>Số điện thoại để kỹ thuật viên liên hệ:</Text>
                <TextInput
                  style={[styles.modalInput, isDark && styles.modalInputDark]}
                  keyboardType="phone-pad"
                  placeholder="0988 123 456"
                  placeholderTextColor="#94a3b8"
                  value={returnPhone}
                  onChangeText={setReturnPhone}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooterBtns}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setReturnOrder(null)}
                disabled={submittingReturn}
              >
                <Text style={styles.modalCancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSubmitBtn, { backgroundColor: '#dc2626' }, submittingReturn && { opacity: 0.6 }]}
                onPress={handleSubmitReturn}
                disabled={submittingReturn}
              >
                {submittingReturn ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>Gửi yêu cầu đổi trả</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 3. MODAL: LỊCH SỬ HÀNH TRÌNH VẬN CHUYỂN (TRACKING TIMELINE) */}
      {/* ========================================================= */}
      <Modal
        visible={!!trackingOrder}
        transparent
        animationType="fade"
        onRequestClose={() => setTrackingOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.trackingModalCard, isDark && styles.modalCardDark]}>
            {/* MODAL HEADER */}
            <View style={styles.trackingModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.trackingHeaderIconCircle}>
                  <Ionicons name="navigate" size={20} color="#2563eb" />
                </View>
                <View>
                  <Text style={[styles.trackingHeaderTitle, isDark && styles.textLight]}>
                    Hành trình đơn hàng
                  </Text>
                  <Text style={styles.trackingHeaderSubtitle}>
                    Mã đơn: #{trackingOrder?.orderNumber || trackingOrder?.id}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setTrackingOrder(null)}
                style={styles.modalCloseCircle}
                accessibilityLabel="Đóng lịch sử đơn hàng"
              >
                <Ionicons name="close" size={20} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={styles.trackingModalScroll} showsVerticalScrollIndicator={false}>
              {/* SUMMARY INFO STRIP */}
              <View style={[styles.trackingSummaryCard, isDark && { backgroundColor: '#0f172a', borderColor: '#334155' }]}>
                <View style={styles.trackingSummaryRow}>
                  <View style={styles.trackingSummaryCol}>
                    <Text style={styles.trackingSummaryLabel}>Đơn vị giao vận</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <Ionicons name="flash" size={13} color="#f59e0b" />
                      <Text style={[styles.trackingSummaryVal, { color: '#2563eb', fontWeight: '800' }]}>
                        DPC Express Hỏa Tốc
                      </Text>
                    </View>
                  </View>
                  <View style={styles.trackingSummaryDivider} />
                  <View style={styles.trackingSummaryCol}>
                    <Text style={styles.trackingSummaryLabel}>Mã vận đơn</Text>
                    <Text style={[styles.trackingSummaryVal, isDark && styles.textLight, { marginTop: 3 }]}>
                      DPC-VN-{String(trackingOrder?.orderNumber || trackingOrder?.id || '88392102').replace(/[^0-9]/g, '').slice(-8) || '88392102'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.trackingSummaryDividerHoriz, isDark && { backgroundColor: '#334155' }]} />

                <View style={styles.shipperInfoRow}>
                  <View style={styles.shipperAvatar}>
                    <Ionicons name="bicycle" size={18} color="#2563eb" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.shipperName, isDark && styles.textLight]}>
                      Bưu tá: Nguyễn Văn Hưng
                    </Text>
                    <Text style={styles.shipperPhone}>
                      Hotline shipper: <Text style={{ fontWeight: '700', color: '#2563eb' }}>0912.868.555</Text>
                    </Text>
                  </View>
                  <Pressable
                    style={styles.callShipperBtn}
                    onPress={() => alert('Đang kết nối tới bưu tá phát hàng: 0912.868.555 (DPC Express)')}
                  >
                    <Ionicons name="call" size={13} color="#ffffff" style={{ marginRight: 4 }} />
                    <Text style={styles.callShipperBtnText}>Gọi shipper</Text>
                  </Pressable>
                </View>
              </View>

              {/* VERTICAL TIMELINE LIST */}
              <View style={styles.timelineWrap}>
                <Text style={[styles.timelineSectionTitle, isDark && styles.textLight]}>
                  Chi tiết từng mốc thời gian xử lý:
                </Text>

                {getOrderTimelineEvents(trackingOrder).map((ev, index, arr) => {
                  const isLast = index === arr.length - 1;
                  return (
                    <View key={index} style={styles.timelineItemRow}>
                      {/* LEFT COLUMN: ICONS AND CONNECTOR LINE */}
                      <View style={styles.timelineLineCol}>
                        <View
                          style={[
                            styles.timelineNodeCircle,
                            ev.isDone && { backgroundColor: ev.color, borderColor: ev.color },
                            ev.isCurrent && styles.timelineNodeCircleCurrent,
                            !ev.isDone && { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
                          ]}
                        >
                          <Ionicons
                            name={(ev.icon as any) || 'checkmark'}
                            size={13}
                            color={ev.isDone ? '#ffffff' : '#94a3b8'}
                          />
                        </View>
                        {!isLast && (
                          <View
                            style={[
                              styles.timelineConnector,
                              ev.isDone && { backgroundColor: '#93c5fd' },
                            ]}
                          />
                        )}
                      </View>

                      {/* RIGHT COLUMN: EVENT CONTENT */}
                      <View style={[styles.timelineContentBox, isLast && { paddingBottom: 6 }]}>
                        <View style={styles.timelineTopRow}>
                          <Text
                            style={[
                              styles.timelineEventTitle,
                              isDark && styles.textLight,
                              ev.isCurrent && { color: ev.color, fontWeight: '800' },
                            ]}
                          >
                            {ev.title}
                          </Text>
                          <Text style={styles.timelineEventTime}>
                            {ev.time}
                          </Text>
                        </View>

                        <Text style={[styles.timelineEventDesc, isDark && styles.textMutedDark]}>
                          {ev.desc}
                        </Text>

                        {ev.location ? (
                          <View style={styles.timelineLocationRow}>
                            <Ionicons name="location-sharp" size={12} color="#64748b" style={{ marginRight: 4 }} />
                            <Text style={styles.timelineLocationText}>
                              {ev.location}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {/* MODAL FOOTER ACTIONS */}
            <View style={styles.trackingModalFooter}>
              <Pressable
                style={styles.trackingCloseBtn}
                onPress={() => setTrackingOrder(null)}
              >
                <Text style={styles.trackingCloseBtnText}>Đóng</Text>
              </Pressable>

              {(trackingOrder?.status === 'shipping' || trackingOrder?.status === 'delivered') && (
                <Pressable
                  style={styles.trackingConfirmBtn}
                  onPress={() => {
                    const target = trackingOrder;
                    setTrackingOrder(null);
                    handleConfirmReceived(target);
                  }}
                >
                  <Ionicons name="checkmark-done" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.trackingConfirmBtnText}>Tôi đã nhận hàng</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  pageDark: {
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  breadcrumbBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  breadcrumbTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 9,
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 90,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  contentDesktop: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },

  /* HEADER */
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  headerTitleWrap: {
    flex: 1,
    minWidth: 240,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 18,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  summaryBadgeText: {
    fontSize: 12,
    color: '#1e40af',
  },

  /* TABS */
  tabsContainer: {
    marginBottom: 16,
  },
  tabsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  tabLabelActive: {
    color: '#ffffff',
  },
  tabBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tabBadgeTextActive: {
    color: '#ffffff',
  },

  /* ORDER CARD */
  orderListWrap: {
    gap: 14,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  orderNumberGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  orderNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderHeaderDot: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  orderDateText: {
    fontSize: 12,
    color: '#64748b',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* ORDER BODY */
  orderItemBody: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
    alignItems: 'center',
  },
  itemThumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
    marginBottom: 4,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  configPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  configPillText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  itemQuantityText: {
    fontSize: 12,
    color: '#64748b',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 5,
  },
  itemPriceCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemPriceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  orderAddressText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },

  /* DELIVERY NOTICE */
  deliveryNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  deliveryNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  deliveryNoticeDesc: {
    fontSize: 12,
    color: '#15803d',
    lineHeight: 17,
  },

  /* ORDER FOOTER */
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexWrap: 'wrap',
    gap: 12,
  },
  totalAmountGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  totalAmountLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  totalAmountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#dc2626',
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailOutlineBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  detailOutlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  reorderPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  reorderPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* EMPTY STATE */
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 12,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 19,
    marginBottom: 20,
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  shopNowBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* REVIEW & RETURN BUTTONS */
  reviewOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
    backgroundColor: '#fffbeb',
  },
  reviewOutlineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d97706',
  },
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#fef3c7',
  },
  reviewedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  returnOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  returnOutlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  returnPendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  returnPendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  returnApprovedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  returnApprovedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  returnRejectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  returnRejectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
  },

  /* RETURN STATUS BANNER */
  returnStatusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  returnStatusBannerPending: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  returnStatusBannerApproved: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  returnStatusBannerRejected: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  returnBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  returnBannerDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
  },

  /* MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 520,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  modalCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSubTitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  reviewProdPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  reviewProdImg: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  reviewProdName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewProdPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 2,
  },
  prodSelectChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: 160,
  },
  prodSelectChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  prodSelectChipText: {
    fontSize: 11,
    color: '#64748b',
  },
  prodSelectChipTextActive: {
    fontWeight: '700',
    color: '#2563eb',
  },
  starSection: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  starPrompt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  starLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#d97706',
    marginTop: 6,
  },
  tagSection: {
    marginTop: 12,
  },
  tagPrompt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickTagBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickTagBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  modalTextarea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    textAlignVertical: 'top',
    minHeight: 70,
  },
  modalTextareaDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    color: '#f8fafc',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  modalInputDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    color: '#f8fafc',
  },
  modalFooterBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  modalSubmitBtn: {
    flex: 1.6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* RETURN POLICY */
  returnPolicyBox: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  returnPolicyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 3,
  },
  returnPolicyDesc: {
    fontSize: 11,
    color: '#15803d',
    lineHeight: 16,
  },
  reasonOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    marginBottom: 4,
  },
  reasonOptionRowActive: {
    backgroundColor: '#eff6ff',
  },
  reasonOptionText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  reasonOptionTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },

  /* UPLOAD MEDIA BOX */
  uploadMediaBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93c5fd',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadMediaBoxDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderColor: '#3b82f6',
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
    textAlign: 'center',
  },
  uploadBoxSub: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 380,
    lineHeight: 16,
  },
  mediaThumbCard: {
    width: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  mediaThumbImg: {
    width: '100%',
    height: 60,
  },
  videoPlaceholder: {
    width: '100%',
    height: 60,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  mediaRemoveBtn: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#dc2626',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaNameText: {
    fontSize: 10,
    color: '#475569',
    padding: 3,
    textAlign: 'center',
  },

  /* TOAST */
  toastWrap: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* TRACKING MODAL & JOURNEY TIMELINE */
  deliveryNoticeBoxShipping: {
    backgroundColor: '#f5f3ff',
    borderColor: '#ddd6fe',
  },
  trackingHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trackingHintText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16a34a',
  },
  trackingModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 540,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  trackingModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  trackingHeaderIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  trackingHeaderSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  modalCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingModalScroll: {
    maxHeight: 460,
  },
  trackingSummaryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 16,
  },
  trackingSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingSummaryCol: {
    flex: 1,
  },
  trackingSummaryLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  trackingSummaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  trackingSummaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 10,
  },
  trackingSummaryDividerHoriz: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  shipperInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shipperAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipperName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  shipperPhone: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  callShipperBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  callShipperBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  timelineWrap: {
    paddingTop: 2,
  },
  timelineSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 14,
  },
  timelineItemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineLineCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineNodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineNodeCircleCurrent: {
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    minHeight: 46,
    backgroundColor: '#e2e8f0',
    marginVertical: 2,
  },
  timelineContentBox: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  timelineEventTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  timelineEventTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },
  timelineEventDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
    marginTop: 2,
  },
  timelineLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timelineLocationText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  trackingModalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  trackingCloseBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingCloseBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  trackingConfirmBtn: {
    flex: 1.6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingConfirmBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
