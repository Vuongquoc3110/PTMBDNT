import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { Header } from '@/components/Header';
import { InvoiceModal } from '@/components/InvoiceModal';
import { formatPrice, products as fallbackProducts, getProductFallbackImage, isInvalidOrBlockedImageUrl } from '@/data/products';
import { apiService, type Order } from '@/services/api';
import { useAppContext } from '@/context/AppContext';
import { playSuccessChime } from '@/utils/sound';
import { formatUnitCodes, ensureDeviceUnits } from '@/utils/deviceUnits';

const RETURN_REASONS = [
  'Lỗi phần cứng / Không lên nguồn',
  'Trầy xước, móp méo khi vận chuyển',
  'Giao sai mẫu mã hoặc sai cấu hình',
  'Thiếu linh kiện, phụ kiện hoặc quà tặng',
  'Lý do khác',
];

const SOLUTION_TYPES = [
  { id: 'exchange', label: '1 Đổi 1 Máy Mới', desc: 'Đổi máy mới cùng mẫu mã nếu lỗi NSX trong 30 ngày', icon: 'sync-outline' },
  { id: 'repair', label: 'Bảo Hành Sửa Chữa', desc: 'Kỹ thuật viên chính hãng kiểm tra & sửa chữa', icon: 'construct-outline' },
  { id: 'refund', label: 'Hoàn Tiền & Trả Hàng', desc: 'Hoàn tiền về STK ngân hàng theo chính sách', icon: 'cash-outline' },
];

const REVIEW_QUICK_TAGS = [
  'Đóng gói rất cẩn thận 📦',
  'Giao hàng hỏa tốc ⚡',
  'Máy chạy cực mượt ❄️',
  'Đúng thông số mô tả 100% ✨',
  'Hàng chính hãng tem chuẩn 🛡️',
  'Tư vấn kỹ thuật nhiệt tình 💬',
];

export function calculateWarrantyInfo(orderDateStr?: string, item?: any) {
  const nameLower = (item?.name || '').toLowerCase();
  let months = item?.warrantyMonths || 24;
  if (!item?.warrantyMonths) {
    if (nameLower.includes('laptop') || nameLower.includes('macbook')) {
      months = 24;
    } else if (
      nameLower.includes('màn hình') ||
      nameLower.includes('monitor') ||
      nameLower.includes('rtx') ||
      nameLower.includes('vga') ||
      nameLower.includes('card') ||
      nameLower.includes('pc') ||
      nameLower.includes('cpu') ||
      nameLower.includes('main')
    ) {
      months = 36;
    } else if (nameLower.includes('chuột') || nameLower.includes('bàn phím') || nameLower.includes('tai nghe')) {
      months = 12;
    }
  }

  const orderDate = orderDateStr ? new Date(orderDateStr) : new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const formatD = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

  const purchaseStr = item?.purchaseDate || formatD(orderDate);
  const expiryDate = new Date(orderDate);
  expiryDate.setMonth(expiryDate.getMonth() + months);
  const expiryStr = item?.warrantyExpiry || formatD(expiryDate);
  const range = item?.warrantyRange || `${purchaseStr} đến ${expiryStr}`;

  const diffMs = expiryDate.getTime() - Date.now();
  const remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return {
    months,
    label: `${months} Tháng`,
    purchaseStr,
    expiryStr,
    range,
    remainingDays,
    isValid: remainingDays > 0,
  };
}

const statusConfig: Record<
  string,
  { label: string; desc: string; color: string; bg: string; border: string; stepIndex: number; icon: keyof typeof Ionicons.glyphMap }
> = {
  pending: {
    label: 'Chờ xác nhận',
    desc: 'Đơn hàng đang chờ nhân viên DANGVINHPC kiểm tra và đóng gói',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    stepIndex: 1,
    icon: 'time',
  },
  confirmed: {
    label: 'Đã xác nhận',
    desc: 'Đơn hàng đã được duyệt và đang chuẩn bị xuất kho',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    stepIndex: 2,
    icon: 'checkmark-circle',
  },
  shipping: {
    label: 'Đang giao hàng',
    desc: 'Đơn hàng đang trên đường vận chuyển tới địa chỉ của bạn',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    stepIndex: 3,
    icon: 'bicycle',
  },
  delivered: {
    label: 'Đã giao tới nơi (Chờ bạn nhận hàng)',
    desc: 'Bưu tá đã giao kiện hàng đến địa chỉ của bạn. Hãy kiểm tra sản phẩm và bấm Đã nhận được hàng!',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    stepIndex: 3,
    icon: 'location',
  },
  completed: {
    label: 'Giao hàng thành công',
    desc: 'Đơn hàng đã được giao và bạn đã xác nhận nhận hàng. Cảm ơn bạn đã mua sắm!',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    stepIndex: 4,
    icon: 'checkmark-done-circle',
  },
  cancelled: {
    label: 'Đã hủy đơn',
    desc: 'Đơn hàng này đã được hủy bởi khách hàng hoặc quản trị viên',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    stepIndex: 0,
    icon: 'close-circle',
  },
};

const paymentLabels: Record<string, { name: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  cod: { name: 'Thanh toán tiền mặt khi nhận hàng (COD)', icon: 'cash-outline', color: '#16a34a' },
  banking: { name: 'Chuyển khoản VNPAY / Ngân hàng', icon: 'qr-code-outline', color: '#2563eb' },
  vnpay: { name: 'VNPAY QR Cổng thanh toán', icon: 'card-outline', color: '#2563eb' },
  momo: { name: 'Ví điện tử MoMo', icon: 'wallet-outline', color: '#d946ef' },
};

const shippingLabels: Record<string, string> = {
  standard: 'Giao hàng tiêu chuẩn (1 - 3 ngày làm việc)',
  express: 'Giao hàng hỏa tốc (Trong vòng 24 giờ)',
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} lúc ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

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
      location: 'Trung tâm khai thác bưu cục DPC Express',
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

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 960;

  const { addToCart, user } = useAppContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadOrder = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError('Không tìm thấy thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleCancelOrder = async () => {
    if (!order) return;

    if (order.status === 'shipping') {
      showToast('Đơn hàng đang trên đường vận chuyển, bạn không thể tự hủy đơn hàng!');
      return;
    }

    if (order.status !== 'pending') {
      showToast('Chỉ có thể tự hủy đơn hàng khi đơn còn ở trạng thái Chờ xác nhận!');
      return;
    }

    if (typeof window !== 'undefined') {
      const confirm = window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${order.orderNumber} không?`);
      if (!confirm) return;
    }

    try {
      setCancelling(true);
      await apiService.cancelOrder(order.id);
      setOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
      showToast('Đã hủy đơn hàng thành công!');
    } catch (e: any) {
      showToast(e.message || 'Không thể hủy đơn hàng lúc này');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((it) => {
      const p = fallbackProducts.find((x) => x.id === it.productId || x.name === it.name) || {
        id: it.productId,
        name: it.name,
        price: it.price,
        image: it.image,
      };
      addToCart(p, it.quantity);
    });
    showToast('Đã thêm các sản phẩm vào giỏ hàng!');
    setTimeout(() => {
      router.push('/cart' as any);
    }, 800);
  };

  // States & handlers cho Yêu cầu đổi trả / Bảo hành
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [returnReason, setReturnReason] = useState(RETURN_REASONS[0]);
  const [returnDescription, setReturnDescription] = useState('');
  const [returnSolutionType, setReturnSolutionType] = useState<'exchange' | 'repair' | 'refund'>('exchange');
  const [returnPhone, setReturnPhone] = useState(user?.phone || '');
  const [returnBankInfo, setReturnBankInfo] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);

  // States & handlers cho Đánh giá sản phẩm
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewProductId, setReviewProductId] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSelectedTags, setReviewSelectedTags] = useState<string[]>([]);
  const [reviewMedia, setReviewMedia] = useState<{ uri: string; type: 'image' | 'video'; name: string }[]>([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Xác nhận đã nhận được hàng
  const [confirmingReceipt, setConfirmingReceipt] = useState(false);

  // Mở modal đổi trả
  const handleOpenReturnModal = () => {
    setReturnPhone(user?.phone || '');
    setReturnDescription('');
    setReturnReason(RETURN_REASONS[0]);
    setReturnSolutionType('exchange');
    setReturnModalVisible(true);
  };

  // Mở modal đánh giá
  const handleOpenReviewModal = (initProductId?: string) => {
    const defaultPid = initProductId || order?.items?.[0]?.productId || '';
    setReviewProductId(defaultPid);
    setReviewRating(5);
    setReviewComment('');
    setReviewSelectedTags([]);
    setReviewMedia([]);
    setReviewModalVisible(true);
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
      alert('Tối đa 5 hình ảnh/video.');
      return;
    }
    setReviewMedia((prev) => [...prev, { uri: url, type: 'image', name }]);
  };

  // Gửi yêu cầu đổi trả
  const handleSendReturn = async () => {
    if (!order) return;
    if (!returnDescription.trim()) {
      showToast('Vui lòng nhập mô tả chi tiết tình trạng lỗi sản phẩm!');
      return;
    }
    if (!returnPhone.trim()) {
      showToast('Vui lòng nhập số điện thoại để kỹ thuật viên liên hệ!');
      return;
    }
    if (returnSolutionType === 'refund' && !returnBankInfo.trim()) {
      showToast('Vui lòng nhập thông tin Số tài khoản & Ngân hàng nhận tiền hoàn!');
      return;
    }

    try {
      setReturnSubmitting(true);
      await apiService.requestReturn(order.id, {
        userId: user?.id,
        reason: returnReason,
        description: returnDescription.trim(),
        solutionType: returnSolutionType,
        bankInfo: returnBankInfo.trim(),
        contactPhone: returnPhone.trim(),
      });

      playSuccessChime();
      setOrder((prev) => (prev ? {
        ...prev,
        returnStatus: 'pending',
        returnReason: returnReason,
      } : null));
      setReturnModalVisible(false);
      setReturnDescription('');
      showToast('Đã gửi yêu cầu đổi trả / bảo hành thành công!');
    } catch (err: any) {
      showToast('Lỗi gửi yêu cầu: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setReturnSubmitting(false);
    }
  };

  // Gửi đánh giá sản phẩm
  const handleSendReview = async () => {
    if (!order) return;
    if (!reviewComment.trim() && reviewSelectedTags.length === 0) {
      showToast('Vui lòng nhập nhận xét hoặc chọn ít nhất 1 tiêu chí nhanh!');
      return;
    }

    const targetProduct = order.items.find((it) => it.productId === reviewProductId) || order.items[0];
    const pid = targetProduct?.productId || 'lap-001';

    const fullComment = [
      reviewSelectedTags.length > 0 ? `[Tiêu chí: ${reviewSelectedTags.join(', ')}]` : '',
      reviewComment.trim(),
    ].filter(Boolean).join('\n\n');

    try {
      setReviewSubmitting(true);
      await apiService.addReview(pid, {
        userId: user?.id,
        userName: user?.name || 'Khách hàng',
        userAvatar: user?.avatar,
        rating: reviewRating,
        comment: fullComment,
        orderId: order.id,
        images: reviewMedia.map((m) => m.uri),
      });

      playSuccessChime();
      setOrder((prev) => (prev ? { ...prev, isReviewed: true } : null));
      setReviewModalVisible(false);
      setReviewComment('');
      setReviewSelectedTags([]);
      setReviewMedia([]);
      showToast('Cảm ơn bạn! Đánh giá đã được đăng tải thành công ⭐');
    } catch (err: any) {
      showToast('Lỗi gửi đánh giá: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Xác nhận đã nhận được hàng (fix triệt để 403 Forbidden)
  const handleConfirmReceived = async () => {
    if (!order) return;
    const ok = typeof window !== 'undefined'
      ? window.confirm(`Xác nhận bạn đã nhận được kiện hàng #${order.orderNumber} từ bưu tá?`)
      : true;
    if (!ok) return;

    try {
      setConfirmingReceipt(true);
      await apiService.confirmOrderReceived(order.id);
      playSuccessChime();
      setOrder((prev) => (prev ? { ...prev, status: 'completed' } : null));
      showToast('🎉 Xác nhận nhận hàng thành công! Đơn hàng đã hoàn tất.');
    } catch (err: any) {
      showToast('Lỗi: ' + (err.message || 'Không thể xác nhận lúc này'));
    } finally {
      setConfirmingReceipt(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.page}>
        <Header />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
        </View>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.page}>
        <Header />
        <View style={styles.centerBox}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="receipt-outline" size={48} color="#94a3b8" />
          </View>
          <Text style={styles.emptyTitle}>Không tìm thấy đơn hàng</Text>
          <Text style={styles.emptySubtitle}>
            {error || 'Mã đơn hàng không tồn tại hoặc bạn không có quyền xem đơn này.'}
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/(tabs)/explore' as any)}>
            <Ionicons name="arrow-back" size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.primaryBtnText}>Xem danh sách đơn hàng</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const paymentInfo = paymentLabels[order.paymentMethod] || {
    name: order.paymentMethod,
    icon: 'cash-outline',
    color: '#475569',
  };

  const steps = [
    { key: 1, title: 'Đặt hàng', icon: 'bag-check-outline' },
    { key: 2, title: 'Xác nhận', icon: 'cube-outline' },
    { key: 3, title: 'Vận chuyển', icon: 'bicycle-outline' },
    { key: 4, title: 'Thành công', icon: 'checkmark-done-circle-outline' },
  ];

  return (
    <View style={styles.page}>
      <Header />

      {/* TOAST ALERT */}
      {toast ? (
        <View style={styles.toastWrap}>
          <Ionicons name="information-circle" size={20} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* TOP BREADCRUMB BAR */}
          <View style={styles.breadcrumbBar}>
            <View style={styles.breadcrumbLeft}>
              <Pressable style={styles.backBtn} onPress={() => router.push('/(tabs)/explore' as any)}>
                <Ionicons name="arrow-back" size={18} color="#2563eb" />
                <Text style={styles.backBtnText}>Danh sách đơn</Text>
              </Pressable>

              <View style={styles.breadcrumbPath}>
                <Pressable onPress={() => router.push('/(tabs)')}><Text style={styles.breadcrumbLink}>Trang chủ</Text></Pressable>
                <Text style={styles.breadcrumbSep}>/</Text>
                <Pressable onPress={() => router.push('/(tabs)/explore' as any)}><Text style={styles.breadcrumbLink}>Đơn hàng</Text></Pressable>
                <Text style={styles.breadcrumbSep}>/</Text>
                <Text style={styles.breadcrumbCurrent}>#{order.orderNumber}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Pressable
                style={[styles.orderNumberBadge, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', flexDirection: 'row', alignItems: 'center' }]}
                onPress={() => setInvoiceModalVisible(true)}
              >
                <Ionicons name="receipt-outline" size={13} color="#16a34a" style={{ marginRight: 4 }} />
                <Text style={[styles.orderNumberBadgeText, { color: '#16a34a' }]}>IN HÓA ĐƠN VAT</Text>
              </Pressable>

              <View style={styles.orderNumberBadge}>
                <Text style={styles.orderNumberBadgeText}>MÃ ĐƠN: {order.orderNumber}</Text>
              </View>
            </View>
          </View>

          {/* STATUS HERO BANNER */}
          <View style={[styles.statusHero, { backgroundColor: statusInfo.bg, borderColor: statusInfo.border }]}>
            <View style={styles.statusHeroTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={[styles.statusIconWrap, { backgroundColor: '#ffffff', shadowColor: statusInfo.color }]}>
                  <Ionicons name={statusInfo.icon} size={28} color={statusInfo.color} />
                </View>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                    <View style={[styles.statusPill, { backgroundColor: statusInfo.color }]}>
                      <Text style={styles.statusPillText}>Đơn #{order.id}</Text>
                    </View>
                  </View>
                  <Text style={styles.statusDesc}>{statusInfo.desc}</Text>
                </View>
              </View>

              <View style={styles.orderDateCol}>
                <Text style={styles.orderDateLabel}>Thời gian tạo đơn</Text>
                <Text style={styles.orderDateValue}>{formatDate(order.createdAt)}</Text>
              </View>
            </View>

            {/* PROGRESS STEPPER (IF NOT CANCELLED) */}
            {order.status !== 'cancelled' ? (
              <View style={styles.stepperWrap}>
                <View style={styles.stepperLineTrack}>
                  <View
                    style={[
                      styles.stepperLineFill,
                      {
                        width:
                          statusInfo.stepIndex === 1
                            ? '12%'
                            : statusInfo.stepIndex === 2
                            ? '42%'
                            : statusInfo.stepIndex === 3
                            ? '75%'
                            : '100%',
                      },
                    ]}
                  />
                </View>

                <View style={styles.stepperStepsRow}>
                  {steps.map((st) => {
                    const isPassed = statusInfo.stepIndex >= st.key;
                    const isCurrent = statusInfo.stepIndex === st.key;
                    return (
                      <View key={st.key} style={styles.stepItem}>
                        <View
                          style={[
                            styles.stepCircle,
                            isPassed && styles.stepCirclePassed,
                            isCurrent && styles.stepCircleCurrent,
                          ]}
                        >
                          <Ionicons
                            name={isPassed ? 'checkmark' : (st.icon as any)}
                            size={14}
                            color={isPassed ? '#ffffff' : '#94a3b8'}
                          />
                        </View>
                        <Text
                          style={[
                            styles.stepLabel,
                            isPassed && styles.stepLabelPassed,
                            isCurrent && styles.stepLabelCurrent,
                          ]}
                        >
                          {st.title}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>

          {/* RETURN / WARRANTY STATUS BANNER (IF ANY) */}
          {order.returnStatus ? (
            <View
              style={[
                styles.returnBanner,
                order.returnStatus === 'approved' && styles.returnBannerApproved,
                order.returnStatus === 'rejected' && styles.returnBannerRejected,
              ]}
            >
              <View
                style={[
                  styles.returnBannerIconBox,
                  order.returnStatus === 'approved' && { backgroundColor: '#dcfce7' },
                  order.returnStatus === 'rejected' && { backgroundColor: '#fee2e2' },
                ]}
              >
                <Ionicons
                  name={
                    order.returnStatus === 'approved'
                      ? 'checkmark-circle'
                      : order.returnStatus === 'rejected'
                      ? 'close-circle'
                      : 'swap-horizontal'
                  }
                  size={24}
                  color={
                    order.returnStatus === 'approved'
                      ? '#16a34a'
                      : order.returnStatus === 'rejected'
                      ? '#dc2626'
                      : '#d97706'
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <Text
                    style={[
                      styles.returnBannerTitle,
                      order.returnStatus === 'approved' && { color: '#15803d' },
                      order.returnStatus === 'rejected' && { color: '#b91c1c' },
                      order.returnStatus === 'pending' && { color: '#b45309' },
                    ]}
                  >
                    {order.returnStatus === 'approved'
                      ? 'Yêu cầu đổi trả / bảo hành đã được DUYỆT'
                      : order.returnStatus === 'rejected'
                      ? 'Yêu cầu đổi trả / bảo hành bị TỪ CHỐI'
                      : 'Đang xử lý yêu cầu đổi trả / bảo hành'}
                  </Text>
                  <View
                    style={[
                      styles.returnBadge,
                      order.returnStatus === 'approved' && { backgroundColor: '#dcfce7' },
                      order.returnStatus === 'rejected' && { backgroundColor: '#fee2e2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.returnBadgeText,
                        order.returnStatus === 'approved' && { color: '#16a34a' },
                        order.returnStatus === 'rejected' && { color: '#dc2626' },
                      ]}
                    >
                      {order.returnStatus === 'pending' ? 'ĐANG XỬ LÝ' : order.returnStatus === 'approved' ? 'CHẤP THUẬN' : 'TỪ CHỐI'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.returnBannerDesc}>
                  {order.returnStatus === 'approved'
                    ? 'DANGVINHPC đã chấp thuận yêu cầu đổi trả của bạn. Kỹ thuật viên sẽ sớm liên hệ theo số điện thoại nhận hàng để thực hiện đổi máy/bảo hành.'
                    : order.returnStatus === 'rejected'
                    ? 'Yêu cầu không đủ điều kiện theo chính sách bảo hành/đổi trả của DANGVINHPC. Vui lòng liên hệ hotline 1900 8888 để được giải đáp.'
                    : `Lý do: "${order.returnReason || 'Kiểm tra lỗi sản phẩm'}". Bộ phận CSKH & Kỹ thuật đang kiểm tra hồ sơ và sẽ liên hệ trong 24 giờ làm việc.`}
                </Text>
              </View>
            </View>
          ) : null}

          {/* MAIN 2-COLUMN LAYOUT */}
          <View style={[styles.mainGrid, { flexDirection: isDesktop ? 'row' : 'column' }]}>
            {/* LEFT COLUMN: PRODUCTS & TIMELINE */}
            <View style={[styles.leftCol, isDesktop && { flex: 1.5 }]}>
              {/* PRODUCTS LIST CARD */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="cube" size={20} color="#2563eb" />
                    <Text style={styles.cardTitle}>
                      Danh sách sản phẩm ({order.items.length})
                    </Text>
                  </View>
                  <Text style={styles.cardSubCount}>Kiểm tra đóng gói chính hãng</Text>
                </View>

                <View style={styles.itemsList}>
                  {order.items.map((item, idx) => {
                    // Fallback lookup image if not present in item
                    const matchingProduct = fallbackProducts.find(
                      (p) => p.id === item.productId || p.name === item.name
                    );
                    let imageUri = item.image || matchingProduct?.image || '';
                    if (!imageUri || isInvalidOrBlockedImageUrl(imageUri)) {
                      imageUri = matchingProduct
                        ? getProductFallbackImage(matchingProduct)
                        : 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80';
                    }

                    return (
                      <View
                        key={idx}
                        style={[
                          styles.productRow,
                          idx < order.items.length - 1 && styles.productRowBorder,
                        ]}
                      >
                        <Image source={{ uri: imageUri }} style={styles.productThumb} />

                        <View style={styles.productInfo}>
                          <Text style={styles.productCategory}>
                            {matchingProduct?.category || 'Linh Kiện Cao Cấp'}
                          </Text>
                          <Text style={styles.productName} numberOfLines={2}>
                            {item.name}
                          </Text>
                          {item.selectedConfig ? (
                            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 4 }} numberOfLines={1}>
                              {item.selectedConfig}
                            </Text>
                          ) : null}

                          {/* THỜI HẠN BẢO HÀNH DỰ KIẾN TỪNG SẢN PHẨM & MÃ SERIAL/IMEI */}
                          {(() => {
                            const w = calculateWarrantyInfo(order.createdAt, item);
                            const hasUnits = item.deviceUnits && item.deviceUnits.length > 0;
                            const isOrderCompleted = order.status === 'completed';
                            const isCancelled = order.status === 'cancelled';

                            if (isCancelled) {
                              return (
                                <View style={{ marginVertical: 4 }}>
                                  <View style={[styles.itemWarrantyBadge, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                                    <Ionicons name="close-circle" size={12} color="#dc2626" />
                                    <Text style={[styles.itemWarrantyText, { color: '#dc2626' }]}>
                                      Đơn hàng đã hủy (Không kích hoạt bảo hành)
                                    </Text>
                                  </View>
                                </View>
                              );
                            }

                            // Chỉ hiển thị Mã bảo hành & Thời hạn kích hoạt chính thức khi khách hàng đã NHẬN ĐƠN (completed)
                            if (!isOrderCompleted) {
                              return (
                                <View style={{ gap: 4, marginVertical: 5 }}>
                                  <View style={[styles.itemWarrantyBadge, { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }]}>
                                    <Ionicons name="shield-outline" size={12} color="#475569" />
                                    <Text style={[styles.itemWarrantyText, { color: '#475569' }]}>
                                      Bảo hành chính hãng: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{w.label}</Text>
                                    </Text>
                                  </View>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 2 }}>
                                    <Ionicons name="time-outline" size={12} color="#64748b" />
                                    <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '500' }}>
                                      Mã bảo hành sẽ được cấp sau khi bạn nhận đơn hàng
                                    </Text>
                                  </View>
                                </View>
                              );
                            }

                            return (
                              <View style={{ gap: 5, marginTop: 5, marginBottom: 5 }}>
                                <View style={styles.itemWarrantyBadge}>
                                  <Ionicons name="shield-checkmark" size={12} color="#16a34a" />
                                  <Text style={styles.itemWarrantyText}>
                                    Thời hạn BH: <Text style={{ fontWeight: '700', color: '#15803d' }}>{w.range}</Text>
                                  </Text>
                                </View>

                                {(() => {
                                  const units = ensureDeviceUnits(item);
                                  return units.map((u, uIdx) => (
                                    <View
                                      key={uIdx}
                                      style={{
                                        backgroundColor: '#f8fafc',
                                        borderWidth: 1,
                                        borderColor: '#e2e8f0',
                                        borderRadius: 8,
                                        padding: 8,
                                        gap: 4,
                                        marginTop: 2,
                                      }}
                                    >
                                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                          <Ionicons name="hardware-chip-outline" size={13} color="#059669" />
                                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>IMEI máy:</Text>
                                          <Text selectable style={{ fontSize: 12, fontWeight: '800', color: '#059669', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
                                            {u.manufacturerSerial}
                                          </Text>
                                        </View>
                                        <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                          <Text style={{ fontSize: 9, fontWeight: '700', color: '#059669' }}>🔒 Cố định</Text>
                                        </View>
                                      </View>

                                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                          <Ionicons name="barcode-outline" size={12} color="#2563eb" />
                                          <Text style={{ fontSize: 10, color: '#64748b' }}>Mã BH:</Text>
                                          <Text selectable style={{ fontSize: 11, fontWeight: '700', color: '#2563eb', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
                                            {u.code}
                                          </Text>
                                        </View>
                                        <Pressable
                                          onPress={() => router.push({ pathname: '/warranty', params: { query: u.manufacturerSerial || u.code } } as any)}
                                          style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 }}
                                        >
                                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#2563eb' }}>Tra cứu bảo hành</Text>
                                          <Ionicons name="arrow-forward" size={11} color="#2563eb" />
                                        </Pressable>
                                      </View>
                                    </View>
                                  ));
                                })()}
                                )}
                              </View>
                            );
                          })()}

                          <View style={styles.productPriceRow}>
                            <Text style={styles.unitPrice}>
                              {formatPrice(item.price)}
                            </Text>
                            <View style={styles.quantityTag}>
                              <Text style={styles.quantityText}>x{item.quantity}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.productSubtotalCol}>
                          <Text style={styles.subtotalText}>
                            {formatPrice(item.price * item.quantity)}
                          </Text>
                          {item.productId && (
                            <Pressable
                              onPress={() => router.push({ pathname: '/products/[id]', params: { id: item.productId } } as any)}
                              style={styles.viewProductLink}
                            >
                              <Text style={styles.viewProductLinkText}>Xem chi tiết</Text>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* THÔNG TIN BẢO HÀNH ĐIỆN TỬ CHÍNH HÃNG */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons
                      name={order.status === 'completed' ? 'shield-checkmark' : 'shield-outline'}
                      size={20}
                      color={order.status === 'completed' ? '#16a34a' : '#64748b'}
                    />
                    <Text style={styles.cardTitle}>Thời hạn bảo hành điện tử chính hãng</Text>
                  </View>
                  {order.status === 'completed' ? (
                    <Pressable
                      style={styles.lookupWarrantyBtn}
                      onPress={() => router.push({ pathname: '/warranty', params: { q: order.orderNumber || order.id } } as any)}
                    >
                      <Text style={styles.lookupWarrantyBtnText}>Tra cứu chi tiết →</Text>
                    </Pressable>
                  ) : null}
                </View>
                <View style={styles.warrantyCardBody}>
                  <Text style={styles.warrantyCardDesc}>
                    {order.status === 'completed'
                      ? 'Thiết bị đã được kích hoạt bảo hành điện tử chính hãng tại DANGVINHPC sau khi nhận hàng thành công. Thời hạn bảo hành được tính từ ngày kích hoạt đến ngày hết hạn bảo hành.'
                      : order.status === 'cancelled'
                      ? 'Đơn hàng đã hủy. Quyền lợi bảo hành điện tử không áp dụng cho đơn hàng này.'
                      : 'Thiết bị áp dụng chính sách bảo hành chính hãng. Mã bảo hành và thời hạn hiệu lực sẽ được tự động kích hoạt ngay sau khi bạn nhận đơn hàng thành công.'}
                  </Text>
                  <View style={{ gap: 10, marginTop: 10 }}>
                    {order.items.map((it, idx) => {
                      const w = calculateWarrantyInfo(order.createdAt, it);
                      return (
                        <View key={idx} style={styles.warrantyRowItem}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.warrantyProdName} numberOfLines={1}>{it.name}</Text>
                            {order.status === 'completed' ? (
                              <>
                                <Text style={styles.warrantyRangeText}>
                                  Thời hạn bảo hành: <Text style={{ fontWeight: '800', color: '#15803d' }}>{w.range}</Text>
                                </Text>
                                <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                  Kích hoạt từ: <Text style={{ fontWeight: '700', color: '#334155' }}>{w.purchaseStr}</Text> • Hạn bảo hành: <Text style={{ fontWeight: '700', color: '#334155' }}>{w.expiryStr}</Text> ({w.label})
                                </Text>
                              </>
                            ) : order.status === 'cancelled' ? (
                              <Text style={{ fontSize: 12, color: '#dc2626', fontWeight: '600', marginTop: 2 }}>
                                Đã hủy đơn • Không kích hoạt
                              </Text>
                            ) : (
                              <>
                                <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600', marginTop: 2 }}>
                                  Gói bảo hành: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{w.label}</Text>
                                </Text>
                                <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                  ⏳ Mã bảo hành sẽ được cấp sau khi bạn nhận đơn hàng
                                </Text>
                              </>
                            )}
                          </View>
                          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                            {order.status === 'completed' ? (
                              <View style={[styles.warrantyStatusPill, { backgroundColor: w.isValid ? '#dcfce7' : '#fee2e2' }]}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: w.isValid ? '#15803d' : '#b91c1c' }}>
                                  {w.isValid ? `Còn ${w.remainingDays} ngày` : 'Hết hạn'}
                                </Text>
                              </View>
                            ) : order.status === 'cancelled' ? (
                              <View style={[styles.warrantyStatusPill, { backgroundColor: '#fee2e2' }]}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#b91c1c' }}>
                                  Đã hủy
                                </Text>
                              </View>
                            ) : (
                              <View style={[styles.warrantyStatusPill, { backgroundColor: '#f1f5f9' }]}>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>
                                  Chờ nhận hàng
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* TIMELINE & TRACKING NOTE */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="navigate" size={20} color="#2563eb" />
                    <Text style={styles.cardTitle}>Lịch sử hành trình giao hàng</Text>
                  </View>
                  <View style={{ backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#bfdbfe' }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#2563eb' }}>
                      DPC-VN-{String(order.orderNumber || order.id || '88392102').replace(/[^0-9]/g, '').slice(-8) || '88392102'}
                    </Text>
                  </View>
                </View>

                {/* SHIPPER & CARRIER STRIP */}
                {(() => {
                  const isCancelled = order.status === 'cancelled';
                  if (isCancelled) return null;

                  const isShippingOrDelivered = ['shipping', 'delivered', 'completed'].includes(order.status);

                  if (isShippingOrDelivered) {
                    return (
                      <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: '#bbf7d0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="bicycle" size={18} color="#16a34a" />
                          </View>
                          <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={{ fontSize: 12, fontWeight: '700', color: '#0f172a' }}>
                                DPC Express • Bưu tá Nguyễn Văn Hưng
                              </Text>
                              <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                                <Text style={{ fontSize: 10, fontWeight: '700', color: '#15803d' }}>Đang phát</Text>
                              </View>
                            </View>
                            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                              Hotline shipper: <Text style={{ fontWeight: '700', color: '#16a34a' }}>0912.868.555</Text>
                            </Text>
                          </View>
                        </View>
                        <Pressable
                          style={{ backgroundColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                          onPress={() => alert('Liên hệ bưu tá phát hàng: 0912 868 555 (DPC Express)')}
                        >
                          <Ionicons name="call" size={13} color="#ffffff" />
                          <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>Gọi shipper</Text>
                        </Pressable>
                      </View>
                    );
                  }

                  // Trạng thái pending hoặc confirmed: chưa bàn giao cho shipper
                  return (
                    <View style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="cube-outline" size={18} color="#2563eb" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#0f172a' }}>
                          {order.status === 'confirmed' ? 'Đang chuẩn bị & Đóng gói tại kho' : 'Chờ xác nhận đơn hàng'}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                          Thông tin bưu tá và số điện thoại liên hệ sẽ tự động hiển thị khi đơn hàng được bàn giao xuất kho vận chuyển.
                        </Text>
                      </View>
                    </View>
                  );
                })()}

                <View style={styles.timelineList}>
                  {getOrderTimelineEvents(order).map((ev, idx, arr) => {
                    const isLast = idx === arr.length - 1;
                    return (
                      <View key={idx} style={styles.timelineNode}>
                        <View style={{ alignItems: 'center', width: 26 }}>
                          <View
                            style={[
                              styles.timelineDotCircle,
                              {
                                backgroundColor: ev.isDone ? ev.color : '#f1f5f9',
                                borderColor: ev.isDone ? ev.color : '#cbd5e1',
                                borderWidth: 2,
                              },
                              ev.isCurrent && { shadowColor: ev.color, shadowOpacity: 0.4, elevation: 4 },
                            ]}
                          >
                            <Ionicons
                              name={(ev.icon as any) || 'checkmark'}
                              size={12}
                              color={ev.isDone ? '#ffffff' : '#94a3b8'}
                            />
                          </View>
                          {!isLast && (
                            <View
                              style={{
                                width: 2,
                                flex: 1,
                                minHeight: 38,
                                backgroundColor: ev.isDone ? '#93c5fd' : '#e2e8f0',
                                marginVertical: 2,
                              }}
                            />
                          )}
                        </View>
                        <View style={[styles.timelineContent, { paddingBottom: isLast ? 4 : 14 }]}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                            <Text
                              style={[
                                styles.timelineAction,
                                ev.isCurrent && { color: ev.color, fontWeight: '800' },
                              ]}
                            >
                              {ev.title}
                            </Text>
                            <Text style={styles.timelineTime}>{ev.time}</Text>
                          </View>
                          <Text style={styles.timelineSub}>{ev.desc}</Text>
                          {ev.location ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                              <Ionicons name="location-sharp" size={11} color="#64748b" />
                              <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '500' }}>{ev.location}</Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN: SHIPPING, PAYMENT, TOTAL & ACTIONS */}
            <View style={[styles.rightCol, isDesktop && { flex: 1 }]}>
              {/* SHIPPING ADDRESS CARD */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="location" size={18} color="#2563eb" />
                    <Text style={styles.cardTitle}>Thông tin nhận hàng</Text>
                  </View>
                </View>

                <View style={styles.addressBox}>
                  <View style={styles.addressUserRow}>
                    <Text style={styles.addressName}>{user?.name || 'Khách hàng'}</Text>
                    <Text style={styles.addressPhone}>({user?.phone || '0909 123 456'})</Text>
                  </View>
                  <Text style={styles.addressDetail}>{order.shippingAddress}</Text>
                  <View style={styles.safeBadge}>
                    <Ionicons name="shield-checkmark" size={14} color="#16a34a" />
                    <Text style={styles.safeBadgeText}>Giao hàng bảo hiểm 100% giá trị linh kiện</Text>
                  </View>
                </View>
              </View>

              {/* PAYMENT & LOGISTICS CARD */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="card" size={18} color="#2563eb" />
                    <Text style={styles.cardTitle}>Vận chuyển & Thanh toán</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Đơn vị giao hàng</Text>
                  <Text style={styles.detailValue}>
                    {shippingLabels[order.shippingMethod] || 'Giao hàng tiêu chuẩn DPC Express'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hình thức thanh toán</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                    <Ionicons name={paymentInfo.icon} size={16} color={paymentInfo.color} />
                    <Text style={[styles.detailValue, { color: paymentInfo.color }]}>
                      {paymentInfo.name}
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0, marginBottom: 0 }]}>
                  <Text style={styles.detailLabel}>Tình trạng thanh toán</Text>
                  <View
                    style={[
                      styles.paymentStatusBadge,
                      {
                        backgroundColor:
                          order.paymentMethod === 'cod' && order.status !== 'completed'
                            ? '#fffbeb'
                            : '#f0fdf4',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.paymentStatusText,
                        {
                          color:
                            order.paymentMethod === 'cod' && order.status !== 'completed'
                              ? '#d97706'
                              : '#16a34a',
                        },
                      ]}
                    >
                      {order.paymentMethod === 'cod' && order.status !== 'completed'
                        ? 'Thanh toán khi nhận hàng'
                        : 'Đã hoàn tất thanh toán'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* PAYMENT SUMMARY CARD */}
              <View style={[styles.card, styles.summaryCard]}>
                <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Bảng tính chi phí</Text>

                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Tạm tính tiền hàng</Text>
                  <Text style={styles.costVal}>
                    {formatPrice(order.totalAmount)}
                  </Text>
                </View>

                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Phí giao hàng toàn quốc</Text>
                  <Text style={[styles.costVal, { color: '#16a34a' }]}>MIỄN PHÍ</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.finalTotalRow}>
                  <View>
                    <Text style={styles.finalTotalLabel}>Tổng thanh toán</Text>
                    <Text style={styles.vatNote}>(Đã bao gồm thuế GTGT VAT)</Text>
                  </View>
                  <Text style={styles.finalTotalVal}>
                    {formatPrice(order.totalAmount)}
                  </Text>
                </View>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.actionsWrap}>
                <Pressable style={styles.reorderBtn} onPress={handleReorder}>
                  <Ionicons name="reload" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.reorderBtnText}>Mua lại đơn hàng này</Text>
                </Pressable>

                {order.status === 'completed' && (
                  <View style={{ gap: 8, marginTop: 4 }}>
                    <Pressable
                      style={[
                        styles.reorderBtn,
                        order.isReviewed
                          ? { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', shadowOpacity: 0 }
                          : { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', shadowColor: '#f59e0b', shadowOpacity: 0.15 }
                      ]}
                      onPress={() => handleOpenReviewModal()}
                    >
                      <Ionicons
                        name={order.isReviewed ? 'checkmark-circle' : 'star'}
                        size={17}
                        color={order.isReviewed ? '#16a34a' : '#d97706'}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={[styles.reorderBtnText, { color: order.isReviewed ? '#16a34a' : '#d97706' }]}>
                        {order.isReviewed ? 'Đã đánh giá đơn hàng ⭐' : 'Đánh giá sản phẩm ⭐'}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.reorderBtn,
                        order.returnStatus
                          ? { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', shadowOpacity: 0 }
                          : { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', shadowOpacity: 0 }
                      ]}
                      onPress={handleOpenReturnModal}
                    >
                      <Ionicons
                        name="swap-horizontal"
                        size={17}
                        color={order.returnStatus ? '#2563eb' : '#475569'}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={[styles.reorderBtnText, { color: order.returnStatus ? '#2563eb' : '#475569' }]}>
                        {order.returnStatus === 'pending'
                          ? 'Tiến độ đổi trả (Đang chờ duyệt ⏳)'
                          : order.returnStatus === 'approved'
                          ? 'Tiến độ đổi trả (Đã chấp thuận ✅)'
                          : order.returnStatus === 'rejected'
                          ? 'Tiến độ đổi trả (Bị từ chối ❌)'
                          : 'Yêu cầu đổi trả / Bảo hành'}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.reorderBtn,
                        { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', shadowOpacity: 0 }
                      ]}
                      onPress={() => setInvoiceModalVisible(true)}
                    >
                      <Ionicons
                        name="receipt-outline"
                        size={17}
                        color="#16a34a"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={[styles.reorderBtnText, { color: '#16a34a' }]}>
                        Xuất / In hóa đơn bán hàng & bảo hành
                      </Text>
                    </Pressable>
                  </View>
                )}

                {order.status === 'pending' ? (
                  <Pressable
                    style={[styles.cancelBtn, cancelling && { opacity: 0.6 }]}
                    onPress={handleCancelOrder}
                    disabled={cancelling}
                  >
                    <Ionicons name="close-circle-outline" size={18} color="#dc2626" style={{ marginRight: 8 }} />
                    <Text style={styles.cancelBtnText}>
                      {cancelling ? 'Đang xử lý...' : 'Hủy đơn hàng này'}
                    </Text>
                  </Pressable>
                ) : order.status === 'shipping' || order.status === 'delivered' ? (
                  <View style={{ gap: 8 }}>
                    <View style={[styles.shippingNoticeBox, order.status === 'delivered' && { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                      <Ionicons
                        name={order.status === 'delivered' ? 'checkmark-circle' : 'bicycle'}
                        size={20}
                        color={order.status === 'delivered' ? '#16a34a' : '#7c3aed'}
                        style={{ marginTop: 2 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.shippingNoticeTitle, order.status === 'delivered' && { color: '#15803d' }]}>
                          {order.status === 'delivered' ? 'Bưu tá đã giao hàng thành công!' : 'Đang trên đường vận chuyển'}
                        </Text>
                        <Text style={[styles.shippingNoticeDesc, order.status === 'delivered' && { color: '#166534' }]}>
                          {order.status === 'delivered'
                            ? 'Bưu tá báo đã giao kiện máy đến bạn. Hãy kiểm tra sản phẩm và bấm "Đã nhận được hàng" bên dưới để hoàn tất đơn nhé.'
                            : 'Đơn hàng đã bàn giao cho bưu tá đi giao. Khi nhận máy, bạn hãy bấm nút bên dưới nhé.'}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      style={[styles.reorderBtn, { backgroundColor: '#16a34a' }, confirmingReceipt && { opacity: 0.7 }]}
                      onPress={handleConfirmReceived}
                      disabled={confirmingReceipt}
                    >
                      {confirmingReceipt ? (
                        <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                      ) : (
                        <Ionicons name="checkmark-done" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                      )}
                      <Text style={styles.reorderBtnText}>
                        {confirmingReceipt ? 'Đang xác nhận...' : 'Đã nhận được hàng'}
                      </Text>
                    </Pressable>
                  </View>
                ) : null}

                <View style={styles.supportBox}>
                  <Ionicons name="headset-outline" size={18} color="#64748b" />
                  <Text style={styles.supportText}>
                    Cần hỗ trợ về đơn hàng? Gọi ngay{' '}
                    <Text style={{ fontWeight: '800', color: '#2563eb' }}>1900 8888</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ==================== MODAL: YÊU CẦU ĐỔI TRẢ & BẢO HÀNH ==================== */}
      <Modal visible={returnModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.modalIconBadge, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="swap-horizontal" size={20} color="#2563eb" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Yêu Cầu Đổi Trả / Bảo Hành</Text>
                  <Text style={styles.modalHeaderSubtitle}>Đơn hàng #{order.orderNumber}</Text>
                </View>
              </View>
              <Pressable onPress={() => setReturnModalVisible(false)} hitSlop={10} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBodyScroll} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* CAM KẾT CHÍNH SÁCH */}
              <View style={styles.modalPolicyBanner}>
                <Ionicons name="shield-checkmark" size={18} color="#16a34a" />
                <Text style={styles.modalPolicyText}>
                  Chính sách DANGVINHPC: 1 đổi 1 trong 30 ngày nếu phát hiện lỗi phần cứng NSX. Hỗ trợ kỹ thuật kiểm tra và thu hồi máy tận nơi.
                </Text>
              </View>

              {/* 1. HÌNH THỨC GIẢI QUYẾT */}
              <Text style={styles.modalSectionLabel}>1. Bạn mong muốn giải pháp nào?</Text>
              <View style={styles.solutionList}>
                {SOLUTION_TYPES.map((sol) => {
                  const isSelected = returnSolutionType === sol.id;
                  return (
                    <Pressable
                      key={sol.id}
                      style={[styles.solutionCard, isSelected && styles.solutionCardActive]}
                      onPress={() => setReturnSolutionType(sol.id as any)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={[styles.solutionIconBox, isSelected && styles.solutionIconBoxActive]}>
                          <Ionicons name={sol.icon as any} size={18} color={isSelected ? '#2563eb' : '#64748b'} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.solutionTitle, isSelected && styles.solutionTitleActive]}>{sol.label}</Text>
                          <Text style={styles.solutionDesc}>{sol.desc}</Text>
                        </View>
                      </View>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* 2. LÝ DO ĐỔI TRẢ */}
              <Text style={[styles.modalSectionLabel, { marginTop: 16 }]}>2. Lý do đổi trả / bảo hành:</Text>
              <View style={styles.reasonList}>
                {RETURN_REASONS.map((r) => {
                  const isSelected = returnReason === r;
                  return (
                    <Pressable
                      key={r}
                      style={[styles.reasonChip, isSelected && styles.reasonChipActive]}
                      onPress={() => setReturnReason(r)}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={16}
                        color={isSelected ? '#2563eb' : '#94a3b8'}
                      />
                      <Text style={[styles.reasonChipText, isSelected && styles.reasonChipTextActive]}>{r}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* 3. MÔ TẢ CHI TIẾT */}
              <Text style={[styles.modalSectionLabel, { marginTop: 16 }]}>3. Mô tả chi tiết vấn đề gặp phải:</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="VD: Máy bật không lên nguồn sau khi sạc, màn hình bị sọc đen góc trái, hoặc giao sai model..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                value={returnDescription}
                onChangeText={setReturnDescription}
              />

              {/* 4. SỐ ĐIỆN THOẠI LIÊN HỆ */}
              <Text style={[styles.modalSectionLabel, { marginTop: 14 }]}>4. Số điện thoại kỹ thuật viên liên hệ:</Text>
              <TextInput
                style={styles.modalSingleInput}
                placeholder="Nhập số điện thoại của bạn"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                value={returnPhone}
                onChangeText={setReturnPhone}
              />

              {/* 5. NẾU CHỌN HOÀN TIỀN: NHẬP SỐ TÀI KHOẢN */}
              {returnSolutionType === 'refund' && (
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.modalSectionLabel}>5. Thông tin tài khoản nhận tiền hoàn:</Text>
                  <TextInput
                    style={styles.modalSingleInput}
                    placeholder="VD: Vietcombank - 0123456789 - NGUYEN VAN A"
                    placeholderTextColor="#94a3b8"
                    value={returnBankInfo}
                    onChangeText={setReturnBankInfo}
                  />
                </View>
              )}
            </ScrollView>

            {/* MODAL ACTIONS */}
            <View style={styles.modalActionsRow}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setReturnModalVisible(false)}
                disabled={returnSubmitting}
              >
                <Text style={styles.modalCancelBtnText}>Hủy bỏ</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSubmitBtn, returnSubmitting && { opacity: 0.7 }]}
                onPress={handleSendReturn}
                disabled={returnSubmitting}
              >
                {returnSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 6 }} />
                ) : (
                  <Ionicons name="paper-plane" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                )}
                <Text style={styles.modalSubmitBtnText}>
                  {returnSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: ĐÁNH GIÁ SẢN PHẨM ==================== */}
      <Modal visible={reviewModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.modalIconBadge, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="star" size={20} color="#d97706" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Đánh Giá Sản Phẩm</Text>
                  <Text style={styles.modalHeaderSubtitle}>Đơn hàng #{order.orderNumber}</Text>
                </View>
              </View>
              <Pressable onPress={() => setReviewModalVisible(false)} hitSlop={10} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBodyScroll} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* CHỌN SẢN PHẨM ĐÁNH GIÁ (NẾU ĐƠN CÓ NHIỀU MÓN) */}
              {order.items.length > 1 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.modalSectionLabel}>Chọn sản phẩm muốn đánh giá:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {order.items.map((it) => {
                        const isChosen = reviewProductId === it.productId;
                        return (
                          <Pressable
                            key={it.productId}
                            style={[styles.productSelectChip, isChosen && styles.productSelectChipActive]}
                            onPress={() => setReviewProductId(it.productId)}
                          >
                            <Text style={[styles.productSelectChipText, isChosen && styles.productSelectChipTextActive]} numberOfLines={1}>
                              {it.name}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              )}

              {/* RATING STARS SELECTOR */}
              <View style={styles.starRatingBox}>
                <Text style={styles.modalSectionLabel}>Mức độ hài lòng của bạn:</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      onPress={() => setReviewRating(star)}
                      style={styles.starTouchItem}
                      hitSlop={6}
                    >
                      <Ionicons
                        name={star <= reviewRating ? 'star' : 'star-outline'}
                        size={36}
                        color={star <= reviewRating ? '#f59e0b' : '#cbd5e1'}
                      />
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.starRatingLabel}>
                  {reviewRating === 5 && '⭐⭐⭐⭐⭐ Tuyệt vời! Rất hài lòng'}
                  {reviewRating === 4 && '⭐⭐⭐⭐ Hài lòng! Máy chạy ổn định'}
                  {reviewRating === 3 && '⭐⭐⭐ Bình thường! Tạm được'}
                  {reviewRating === 2 && '⭐⭐ Chưa hài lòng! Cần cải thiện'}
                  {reviewRating === 1 && '⭐ Rất tệ! Không như mong đợi'}
                </Text>
              </View>

              {/* QUICK TAGS */}
              <Text style={[styles.modalSectionLabel, { marginTop: 16 }]}>Tiêu chí đánh giá nhanh:</Text>
              <View style={styles.quickTagsGrid}>
                {REVIEW_QUICK_TAGS.map((tag) => {
                  const isSelected = reviewSelectedTags.includes(tag);
                  return (
                    <Pressable
                      key={tag}
                      style={[styles.quickTagBtn, isSelected && styles.quickTagBtnActive]}
                      onPress={() => {
                        if (isSelected) {
                          setReviewSelectedTags((prev) => prev.filter((t) => t !== tag));
                        } else {
                          setReviewSelectedTags((prev) => [...prev, tag]);
                        }
                      }}
                    >
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                        size={15}
                        color={isSelected ? '#2563eb' : '#64748b'}
                      />
                      <Text style={[styles.quickTagText, isSelected && styles.quickTagTextActive]}>{tag}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* DETAILED COMMENT TEXTAREA */}
              <Text style={[styles.modalSectionLabel, { marginTop: 16 }]}>Nhận xét chi tiết trải nghiệm của bạn:</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Chia sẻ cảm nhận về hiệu năng, thiết kế máy, nhiệt độ, dịch vụ giao hàng..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                value={reviewComment}
                onChangeText={setReviewComment}
              />

              {/* Tải ảnh / video mở hộp & sử dụng thực tế */}
              <View style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={styles.modalSectionLabel}>Hình ảnh / Video thực tế khi nhận máy:</Text>
                  <Text style={{ fontSize: 11, color: '#64748b' }}>{reviewMedia.length}/5 file</Text>
                </View>

                {/* Upload Button */}
                <Pressable
                  style={styles.uploadMediaBox}
                  onPress={handlePickReviewMedia}
                >
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="camera" size={24} color="#2563eb" />
                  </View>
                  <Text style={styles.uploadBoxTitle}>
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
                          {m.name || `File ${mIdx + 1}`}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            </ScrollView>

            {/* MODAL ACTIONS */}
            <View style={styles.modalActionsRow}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setReviewModalVisible(false)}
                disabled={reviewSubmitting}
              >
                <Text style={styles.modalCancelBtnText}>Đóng</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSubmitBtn, { backgroundColor: '#d97706' }, reviewSubmitting && { opacity: 0.7 }]}
                onPress={handleSendReview}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 6 }} />
                ) : (
                  <Ionicons name="star" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                )}
                <Text style={styles.modalSubmitBtnText}>
                  {reviewSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: IN & XUẤT HÓA ĐƠN BÁN HÀNG ==================== */}
      <InvoiceModal
        visible={invoiceModalVisible}
        onClose={() => setInvoiceModalVisible(false)}
        order={order}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    minHeight: 400,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    maxWidth: 400,
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  /* BREADCRUMB */
  breadcrumbBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  breadcrumbLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 6,
  },
  backBtnText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
  breadcrumbPath: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breadcrumbLink: {
    fontSize: 13,
    color: '#64748b',
  },
  breadcrumbSep: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderNumberBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orderNumberBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },

  /* STATUS HERO BANNER */
  statusHero: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statusHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statusIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  statusDesc: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  orderDateCol: {
    alignItems: 'flex-end',
  },
  orderDateLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  orderDateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },

  /* STEPPER */
  stepperWrap: {
    marginTop: 10,
    position: 'relative',
  },
  stepperLineTrack: {
    position: 'absolute',
    top: 14,
    left: '8%',
    right: '8%',
    height: 3,
    backgroundColor: '#cbd5e1',
    zIndex: 1,
  },
  stepperLineFill: {
    height: 3,
    backgroundColor: '#2563eb',
  },
  stepperStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
  },
  stepItem: {
    alignItems: 'center',
    width: 70,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepCirclePassed: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  stepCircleCurrent: {
    borderColor: '#2563eb',
    transform: [{ scale: 1.15 }],
  },
  stepLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelPassed: {
    color: '#334155',
  },
  stepLabelCurrent: {
    color: '#2563eb',
    fontWeight: '800',
  },

  /* MAIN GRID */
  mainGrid: {
    gap: 20,
  },
  leftCol: {
    gap: 20,
  },
  rightCol: {
    gap: 20,
  },

  /* CARDS */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardSubCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  /* PRODUCT ROW */
  itemsList: {},
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  productThumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  itemWarrantyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 2,
    marginBottom: 5,
  },
  itemWarrantyText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '500',
  },
  lookupWarrantyBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  lookupWarrantyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  warrantyCardBody: {},
  warrantyCardDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 4,
  },
  warrantyRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  warrantyProdName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  warrantyRangeText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  warrantyStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 19,
    marginBottom: 6,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitPrice: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  quantityTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  productSubtotalCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  subtotalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  viewProductLink: {
    marginTop: 2,
  },
  viewProductLinkText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },

  /* TIMELINE */
  timelineList: {
    paddingLeft: 4,
  },
  timelineNode: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  timelineDotCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineAction: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  timelineSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 18,
  },
  timelineTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },

  /* ADDRESS */
  addressBox: {},
  addressUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  addressPhone: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  addressDetail: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 10,
  },
  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  safeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },

  /* DETAILS */
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  paymentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* SUMMARY */
  summaryCard: {
    backgroundColor: '#ffffff',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  costLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  costVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  finalTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  vatNote: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  finalTotalVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#dc2626',
  },

  /* ACTIONS */
  actionsWrap: {
    gap: 12,
  },
  reorderBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  reorderBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  cancelBtnText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
  shippingNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    padding: 14,
    borderRadius: 14,
  },
  shippingNoticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7c3aed',
    marginBottom: 2,
  },
  shippingNoticeDesc: {
    fontSize: 12,
    color: '#6b21a8',
    lineHeight: 18,
  },
  supportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
  },
  supportText: {
    fontSize: 13,
    color: '#64748b',
  },

  /* TOAST */
  toastWrap: {
    position: 'absolute',
    top: 75,
    right: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    zIndex: 9999,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* RETURN STATUS BANNER */
  returnBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 16,
    marginBottom: 20,
  },
  returnBannerApproved: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  returnBannerRejected: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  returnBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#b45309',
  },
  returnBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#fef3c7',
  },
  returnBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#d97706',
    letterSpacing: 0.5,
  },
  returnBannerDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },

  /* MODAL OVERLAY & CONTAINER */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    maxWidth: 580,
    width: '100%',
    maxHeight: '90%',
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 16,
  },
  modalIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalHeaderSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBodyScroll: {
    maxHeight: 480,
  },
  modalPolicyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalPolicyText: {
    fontSize: 12,
    color: '#15803d',
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },

  /* SOLUTION LIST */
  solutionList: {
    gap: 8,
  },
  solutionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  solutionCardActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  solutionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  solutionIconBoxActive: {
    backgroundColor: '#dbeafe',
  },
  solutionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  solutionTitleActive: {
    color: '#1d4ed8',
  },
  solutionDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#2563eb',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },

  /* REASON LIST */
  reasonList: {
    gap: 6,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  reasonChipActive: {
    borderColor: '#93c5fd',
    backgroundColor: '#f0f9ff',
  },
  reasonChipText: {
    fontSize: 13,
    color: '#475569',
  },
  reasonChipTextActive: {
    color: '#1d4ed8',
    fontWeight: '600',
  },

  /* INPUTS */
  modalTextInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0f172a',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalSingleInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0f172a',
  },

  /* MODAL ACTIONS */
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 10,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  modalCancelBtnText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  modalSubmitBtnText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },

  /* REVIEW MODAL STYLES */
  productSelectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    maxWidth: 240,
  },
  productSelectChipActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  productSelectChipText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  productSelectChipTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  starRatingBox: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fffdf5',
    borderWidth: 1,
    borderColor: '#fef3c7',
    borderRadius: 16,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  starTouchItem: {
    padding: 2,
  },
  starRatingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b45309',
    marginTop: 2,
  },
  quickTagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  quickTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  quickTagBtnActive: {
    borderColor: '#93c5fd',
    backgroundColor: '#eff6ff',
  },
  quickTagText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  quickTagTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },

  /* UPLOAD MEDIA BOX (REVIEW MODAL) */
  uploadMediaBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93c5fd',
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 10,
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
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaNameText: {
    fontSize: 10,
    color: '#475569',
    padding: 4,
    textAlign: 'center',
  },
});
