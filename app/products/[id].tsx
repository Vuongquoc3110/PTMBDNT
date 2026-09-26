import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';
import { formatPrice, products, type Product } from '@/data/products';
import { useAppContext } from '@/context/AppContext';
import { useProduct, useProductReviews } from '@/hooks/useApi';
import { apiService } from '@/services/api';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 960;

  const { addToCart, toggleWishlist, isWishlisted, user } = useAppContext();
  const { product: apiProduct } = useProduct(id || '');

  const product = useMemo(() => {
    return apiProduct ?? products.find((item) => item.id === id) ?? products[0];
  }, [apiProduct, id]);

  const { reviews: apiReviews, refetch: refetchReviews } = useProductReviews(product.id);
  const isFav = isWishlisted(product.id);

  const [reviewInput, setReviewInput] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');


  const galleryImages = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'];
  }, [product]);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Configuration options state
  const [selectedCpu, setSelectedCpu] = useState(product.configurations?.cpu?.[0] || '');
  const [selectedRam, setSelectedRam] = useState(product.configurations?.ram?.[0] || '');
  const [selectedStorage, setSelectedStorage] = useState(product.configurations?.storage?.[0] || '');

  // Related products
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : product.discount || 0;

  const savings = product.oldPrice && product.oldPrice > product.price
    ? product.oldPrice - product.price
    : 0;

  // Fallback specifications if empty
  const displaySpecs: Record<string, string> = useMemo(() => {
    if (product.specifications && Object.keys(product.specifications).length > 0) {
      return product.specifications;
    }
    // Contextual smart specs
    const cat = (product.category || (product as any).category_id || '').toLowerCase();
    if (cat.includes('laptop')) {
      return {
        'Vi xử lý (CPU)': selectedCpu || 'Intel Core i7 thế hệ mới',
        'Bộ nhớ RAM': selectedRam || '16GB DDR5 5600MHz (Nâng cấp tối đa 64GB)',
        'Ổ cứng': selectedStorage || '512GB NVMe PCIe Gen 4 SSD',
        'Màn hình': '14.0 inch 2.8K (2880 x 1800) OLED 120Hz 100% DCI-P3',
        'Card đồ họa': 'Intel Iris Xe / NVIDIA RTX Series',
        'Trọng lượng': '1.38 kg (Siêu mỏng nhẹ hợp kim nhôm)',
        'Pin': '75 Wh, sạc nhanh Type-C 65W',
        'Hệ điều hành': 'Windows 11 Home bản quyền',
        'Bảo hành': '24 tháng chính hãng tại TTBH ủy quyền',
      };
    }
    if (cat.includes('gpu') || cat.includes('card')) {
      return {
        'Chipset': 'NVIDIA GeForce RTX Series',
        'Bộ nhớ VRAM': '16GB GDDR6X 256-bit',
        'Cổng xuất hình': '3x DisplayPort 1.4a, 1x HDMI 2.1a',
        'Nguồn đề xuất': '750W - 850W Gold',
        'Tản nhiệt': '3 Quạt Axial-tech Fan + Buồng hơi đồng',
        'Bảo hành': '36 tháng chính hãng',
      };
    }
    return {
      'Thương hiệu': 'Chính Hãng Phân Phối',
      'Xuất xứ': 'Chính hãng tem phân phối Việt Nam',
      'Tình trạng': 'Mới 100% nguyên seal',
      'Phụ kiện': 'Đầy đủ phụ kiện theo hộp tiêu chuẩn',
      'Bảo hành': '24 - 36 tháng chính hãng',
    };
  }, [product, selectedCpu, selectedRam, selectedStorage]);

  return (
    <View style={styles.page}>
      <Header />

      {/* TOAST NOTIFICATION */}
      {toast ? (
        <View style={styles.toastWrap}>
          <Ionicons name="checkmark-circle" size={18} color="#22c55e" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* BREADCRUMB & BACK BUTTON */}
          <View style={styles.breadcrumbBar}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#2563eb" />
              <Text style={styles.backBtnText}>Quay lại</Text>
            </Pressable>

            <View style={styles.breadcrumbPath}>
              <Link href="/(tabs)" style={styles.breadcrumbLink}>Trang chủ</Link>
              <Text style={styles.breadcrumbSep}>/</Text>
              <Link href={'/products' as any} style={styles.breadcrumbLink}>Sản phẩm</Link>
              <Text style={styles.breadcrumbSep}>/</Text>
              <Text style={styles.breadcrumbCategory}>{product.category}</Text>
              <Text style={styles.breadcrumbSep}>/</Text>
              <Text style={styles.breadcrumbCurrent} numberOfLines={1}>{product.name}</Text>
            </View>
          </View>

          {/* MAIN 2-COLUMN SECTION */}
          <View style={[styles.mainLayout, { flexDirection: isDesktop ? 'row' : 'column' }]}>
            {/* LEFT COLUMN: HERO GALLERY & COMMITMENTS */}
            <View style={[styles.leftColumn, isDesktop && { width: '48%' }]}>
              {/* HERO MAIN IMAGE */}
              <View style={styles.heroImageCard}>
                <Image
                  source={{ uri: galleryImages[selectedImageIndex] || galleryImages[0] }}
                  style={styles.heroImage}
                  resizeMode="contain"
                />

                {discountPercent > 0 && (
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeText}>GIẢM {discountPercent}%</Text>
                  </View>
                )}

                <Pressable
                  style={[styles.heroFavBtn, isFav && styles.heroFavBtnActive]}
                  onPress={() => {
                    if (!user) {
                      setAuthModalMessage('Bạn cần đăng nhập tài khoản để thêm sản phẩm vào danh sách yêu thích.');
                      setAuthModalVisible(true);
                      return;
                    }
                    toggleWishlist(product.id);
                    showToast(!isFav ? 'Đã thêm vào danh sách yêu thích!' : 'Đã bỏ yêu thích');
                  }}
                >
                  <Ionicons
                    name={isFav ? 'heart' : 'heart-outline'}
                    size={22}
                    color={isFav ? '#e11d48' : '#475569'}
                  />
                </Pressable>
              </View>

              {/* THUMBNAILS CAROUSEL */}
              {galleryImages.length > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbnailRow}
                >
                  {galleryImages.map((img, idx) => {
                    const isSelected = selectedImageIndex === idx;
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => setSelectedImageIndex(idx)}
                        style={[
                          styles.thumbnailBox,
                          isSelected && styles.thumbnailBoxActive,
                        ]}
                      >
                        <Image source={{ uri: img }} style={styles.thumbnailImg} resizeMode="cover" />
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}

              {/* TRUST & POLICY COMMITMENTS */}
              <View style={styles.commitmentsCard}>
                <View style={styles.commitItem}>
                  <View style={styles.commitIconWrap}>
                    <Ionicons name="shield-checkmark" size={20} color="#2563eb" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commitTitle}>100% Chính hãng</Text>
                    <Text style={styles.commitDesc}>Bảo đảm hàng chuẩn, đền bù 200% nếu phát hiện giả</Text>
                  </View>
                </View>

                <View style={styles.commitDivider} />

                <View style={styles.commitItem}>
                  <View style={styles.commitIconWrap}>
                    <Ionicons name="sync" size={20} color="#16a34a" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commitTitle}>1 Đổi 1 trong 30 ngày</Text>
                    <Text style={styles.commitDesc}>Đổi mới ngay lập tức nếu lỗi từ nhà sản xuất</Text>
                  </View>
                </View>

                <View style={styles.commitDivider} />

                <View style={styles.commitItem}>
                  <View style={styles.commitIconWrap}>
                    <Ionicons name="airplane" size={20} color="#ea580c" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commitTitle}>Giao hàng hỏa tốc</Text>
                    <Text style={styles.commitDesc}>Miễn phí vận chuyển toàn quốc, kiểm tra trước khi nhận</Text>
                  </View>
                </View>

                <View style={styles.commitDivider} />

                <View style={styles.commitItem}>
                  <View style={styles.commitIconWrap}>
                    <Ionicons name="construct" size={20} color="#9333ea" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commitTitle}>Hỗ trợ kỹ thuật trọn đời</Text>
                    <Text style={styles.commitDesc}>Cài đặt phần mềm, vệ sinh bảo dưỡng định kỳ miễn phí</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN: PRODUCT INFO & PURCHASE CONTROLS */}
            <View style={[styles.rightColumn, isDesktop && { width: '50%' }]}>
              <View style={styles.productPurchaseCard}>
                {/* CATEGORY PILL & SKU */}
                <View style={styles.metaHeaderRow}>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{(product.category || (product as any).category_id || 'Sản phẩm').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.skuText}>Mã SP: {product.id.toUpperCase()}</Text>
                </View>

                {/* PRODUCT TITLE */}
                <Text style={styles.productTitle}>{product.name}</Text>

                {/* RATING & SOCIAL PROOF */}
                <View style={styles.socialProofRow}>
                  <View style={styles.starsWrap}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons
                        key={s}
                        name="star"
                        size={15}
                        color={s <= Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'}
                      />
                    ))}
                  </View>
                  <Text style={styles.ratingScore}>{product.rating}</Text>
                  <Text style={styles.dotSep}>•</Text>
                  <Text style={styles.reviewCountText}>{product.reviewCount} đánh giá</Text>
                  <Text style={styles.dotSep}>•</Text>
                  <Text style={styles.soldCountText}>Đã bán 180+</Text>
                </View>

                {/* HERO PRICING BOX */}
                <View style={styles.pricingBox}>
                  <View style={styles.priceMainRow}>
                    <Text style={styles.currentPriceText}>{formatPrice(product.price)}</Text>
                    {product.oldPrice ? (
                      <Text style={styles.oldPriceText}>{formatPrice(product.oldPrice)}</Text>
                    ) : null}
                  </View>

                  {savings > 0 && (
                    <View style={styles.savingsRow}>
                      <Ionicons name="pricetag" size={14} color="#16a34a" />
                      <Text style={styles.savingsText}>
                        Tiết kiệm: {formatPrice(savings)} (-{discountPercent}%)
                      </Text>
                    </View>
                  )}

                  <View style={styles.stockStatusRow}>
                    <View
                      style={[
                        styles.stockIndicator,
                        { backgroundColor: product.stock > 0 ? '#16a34a' : '#ef4444' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.stockStatusText,
                        { color: product.stock > 0 ? '#16a34a' : '#ef4444' },
                      ]}
                    >
                      {product.stock > 0
                        ? `Còn hàng (Sẵn sàng giao ngay tại kho)`
                        : 'Tạm hết hàng'}
                    </Text>
                  </View>
                </View>

                {/* PROMOTION SPECIAL OFFER BOX */}
                <View style={styles.promotionBox}>
                  <View style={styles.promoHeader}>
                    <Ionicons name="gift" size={18} color="#dc2626" />
                    <Text style={styles.promoHeaderTitle}>Ưu đãi đặc quyền tại DANGVINHPC</Text>
                  </View>
                  <View style={styles.promoItem}>
                    <Text style={styles.promoBullet}>🎁</Text>
                    <Text style={styles.promoItemText}>
                      Tặng kèm <Text style={{ fontWeight: '700' }}>Balo Laptop Chống Sốc</Text> trị giá 450.000₫
                    </Text>
                  </View>
                  <View style={styles.promoItem}>
                    <Text style={styles.promoBullet}>🖱️</Text>
                    <Text style={styles.promoItemText}>
                      Tặng <Text style={{ fontWeight: '700' }}>Chuột Gaming Không Dây Silent</Text> trị giá 250.000₫
                    </Text>
                  </View>
                  <View style={styles.promoItem}>
                    <Text style={styles.promoBullet}>💳</Text>
                    <Text style={styles.promoItemText}>
                      Hỗ trợ trả góp <Text style={{ fontWeight: '700', color: '#dc2626' }}>0% Lãi Suất</Text> qua thẻ tín dụng
                    </Text>
                  </View>
                </View>

                {/* CONFIGURATION VARIANTS */}
                {product.configurations?.cpu && product.configurations.cpu.length > 0 && (
                  <View style={styles.variantSection}>
                    <Text style={styles.variantLabel}>Tùy chọn CPU:</Text>
                    <View style={styles.variantRow}>
                      {product.configurations.cpu.map((cpu) => {
                        const isSelected = selectedCpu === cpu;
                        return (
                          <Pressable
                            key={cpu}
                            onPress={() => setSelectedCpu(cpu)}
                            style={[
                              styles.variantChip,
                              isSelected && styles.variantChipActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.variantChipText,
                                isSelected && styles.variantChipTextActive,
                              ]}
                            >
                              {isSelected ? `✓ ${cpu}` : cpu}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {product.configurations?.ram && product.configurations.ram.length > 0 && (
                  <View style={styles.variantSection}>
                    <Text style={styles.variantLabel}>Tùy chọn RAM:</Text>
                    <View style={styles.variantRow}>
                      {product.configurations.ram.map((ram) => {
                        const isSelected = selectedRam === ram;
                        return (
                          <Pressable
                            key={ram}
                            onPress={() => setSelectedRam(ram)}
                            style={[
                              styles.variantChip,
                              isSelected && styles.variantChipActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.variantChipText,
                                isSelected && styles.variantChipTextActive,
                              ]}
                            >
                              {isSelected ? `✓ ${ram}` : ram}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {product.configurations?.storage && product.configurations.storage.length > 0 && (
                  <View style={styles.variantSection}>
                    <Text style={styles.variantLabel}>Dung lượng ổ cứng:</Text>
                    <View style={styles.variantRow}>
                      {product.configurations.storage.map((st) => {
                        const isSelected = selectedStorage === st;
                        return (
                          <Pressable
                            key={st}
                            onPress={() => setSelectedStorage(st)}
                            style={[
                              styles.variantChip,
                              isSelected && styles.variantChipActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.variantChipText,
                                isSelected && styles.variantChipTextActive,
                              ]}
                            >
                              {isSelected ? `✓ ${st}` : st}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* QUANTITY STEPPER */}
                <View style={styles.quantitySection}>
                  <Text style={styles.variantLabel}>Số lượng đặt mua:</Text>
                  <View style={styles.stepperContainer}>
                    <Pressable
                      style={styles.stepperBtn}
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Ionicons name="remove" size={18} color="#334155" />
                    </Pressable>
                    <View style={styles.stepperValueBox}>
                      <Text style={styles.stepperValueText}>{quantity}</Text>
                    </View>
                    <Pressable
                      style={[styles.stepperBtn, { backgroundColor: '#eff6ff' }]}
                      onPress={() => setQuantity(quantity + 1)}
                    >
                      <Ionicons name="add" size={18} color="#2563eb" />
                    </Pressable>
                  </View>
                </View>

                {/* CALL TO ACTION BUTTONS */}
                <View style={styles.actionButtonsRow}>
                  <Pressable
                    style={styles.addToCartBtn}
                    onPress={() => {
                      if (!user) {
                        router.push('/login' as any);
                        return;
                      }
                      const spec = [selectedCpu, selectedRam, selectedStorage].filter(Boolean).join(' • ');
                      addToCart(product, quantity, spec);
                      showToast(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng!`);
                    }}
                  >
                    <Ionicons name="cart-outline" size={20} color="#2563eb" />
                    <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
                  </Pressable>

                  <Pressable
                    style={styles.buyNowBtn}
                    onPress={() => {
                      if (!user) {
                        router.push('/login' as any);
                        return;
                      }
                      const spec = [selectedCpu, selectedRam, selectedStorage].filter(Boolean).join(' • ');
                      addToCart(product, quantity, spec);
                      router.push('/cart' as any);
                    }}
                  >
                    <Ionicons name="flash" size={20} color="#ffffff" />
                    <Text style={styles.buyNowText}>Mua ngay</Text>
                  </Pressable>
                </View>

                {/* HOTLINE SUPPORT FOOTER */}
                <View style={styles.hotlineNote}>
                  <Ionicons name="call-outline" size={16} color="#64748b" />
                  <Text style={styles.hotlineNoteText}>
                    Tổng đài tư vấn bán hàng miễn phí: <Text style={{ fontWeight: '800', color: '#2563eb' }}>1900 8888</Text> (8:00 - 21:30)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* DETAILED INFORMATION TABS SECTION */}
          <View style={styles.detailsSection}>
            <View style={styles.tabHeadersRow}>
              <Pressable
                style={[styles.tabHeaderBtn, activeTab === 'desc' && styles.tabHeaderBtnActive]}
                onPress={() => setActiveTab('desc')}
              >
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={activeTab === 'desc' ? '#2563eb' : '#64748b'}
                />
                <Text style={[styles.tabHeaderText, activeTab === 'desc' && styles.tabHeaderTextActive]}>
                  Mô tả & Tính năng nổi bật
                </Text>
              </Pressable>

              <Pressable
                style={[styles.tabHeaderBtn, activeTab === 'specs' && styles.tabHeaderBtnActive]}
                onPress={() => setActiveTab('specs')}
              >
                <Ionicons
                  name="hardware-chip-outline"
                  size={18}
                  color={activeTab === 'specs' ? '#2563eb' : '#64748b'}
                />
                <Text style={[styles.tabHeaderText, activeTab === 'specs' && styles.tabHeaderTextActive]}>
                  Thông số kỹ thuật
                </Text>
              </Pressable>

              <Pressable
                style={[styles.tabHeaderBtn, activeTab === 'reviews' && styles.tabHeaderBtnActive]}
                onPress={() => setActiveTab('reviews')}
              >
                <Ionicons
                  name="star-outline"
                  size={18}
                  color={activeTab === 'reviews' ? '#2563eb' : '#64748b'}
                />
                <Text style={[styles.tabHeaderText, activeTab === 'reviews' && styles.tabHeaderTextActive]}>
                  Đánh giá ({product.reviewCount})
                </Text>
              </Pressable>
            </View>

            {/* TAB CONTENT: DESCRIPTION */}
            {activeTab === 'desc' && (
              <View style={styles.tabBody}>
                {displaySpecs && Object.keys(displaySpecs).length > 0 && (
                  <View style={styles.techSpecsBox}>
                    <View style={styles.techSpecsBadge}>
                      <Ionicons name="hardware-chip" size={16} color="#fff" />
                      <Text style={styles.techSpecsBadgeText}>THÔNG SỐ SẢN PHẨM</Text>
                    </View>
                    <Text style={styles.techSpecsBoxIntro}>
                      Các thông số cấu hình của <Text style={styles.techSpecsBoxIntroHighlight}>{product.name}</Text>
                    </Text>
                    
                    <View style={styles.techSpecsList}>
                      {Object.entries(displaySpecs).slice(0, 10).map(([k, v], idx) => {
                        const isLast = idx === Math.min(Object.keys(displaySpecs).length, 10) - 1;
                        return (
                          <View key={k} style={[styles.techSpecsListItem, isLast && { borderBottomWidth: 0, paddingBottom: 0 }]}>
                            <Ionicons name="checkmark-sharp" size={20} color="#16a34a" style={{ marginTop: 2 }} />
                            <Text style={styles.techSpecsListText}>
                              <Text style={{ fontWeight: '700', color: '#1f2937' }}>{k}: </Text>
                              {v}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}

                <Text style={[styles.descTitle, { marginTop: 32 }]}>Tổng quan sản phẩm</Text>
                <Text style={styles.descParagraph}>
                  {product.description ||
                    `${product.name} là dòng sản phẩm hàng đầu trong phân khúc ${product.category}, được tối ưu hóa tối đa cho nhu cầu làm việc cường độ cao, đồ họa chuyên nghiệp và giải trí đỉnh cao.`}
                </Text>

                <Text style={[styles.descTitle, { marginTop: 24 }]}>Các tính năng đột phá</Text>
                <View style={styles.featuresGrid}>
                  {(product.features && product.features.length > 0
                    ? product.features
                    : [
                        'Hiệu năng đột phá với vi xử lý thế hệ mới',
                        'Thiết kế sang trọng, hoàn thiện sắc sảo từng chi tiết',
                        'Màn hình chuẩn màu đồ họa, độ sáng cao chống chói',
                        'Thời lượng pin bền bỉ, tích hợp sạc nhanh thông minh',
                        'Hệ thống tản nhiệt kép thông minh, vận hành êm ái',
                      ]
                  ).map((feature, idx) => (
                    <View key={idx} style={styles.featureCard}>
                      <View style={styles.featureCheckWrap}>
                        <Ionicons name="checkmark" size={16} color="#16a34a" />
                      </View>
                      <Text style={styles.featureCardText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* TAB CONTENT: SPECIFICATIONS TABLE */}
            {activeTab === 'specs' && (
              <View style={styles.tabBody}>
                <Text style={styles.descTitle}>Bảng cấu hình chi tiết</Text>
                <View style={styles.specsTableWrap}>
                  {Object.entries(displaySpecs).map(([k, v], idx) => {
                    const isEven = idx % 2 === 0;
                    const isLast = idx === Object.entries(displaySpecs).length - 1;
                    return (
                      <View
                        key={k}
                        style={[
                          styles.specsTableRow,
                          { backgroundColor: isEven ? '#ffffff' : '#f8fafc' },
                          isLast && { borderBottomWidth: 0 }
                        ]}
                      >
                        <Text style={styles.specsTableKey}>{k}</Text>
                        <Text style={styles.specsTableVal}>{v}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* TAB CONTENT: CUSTOMER REVIEWS */}
            {activeTab === 'reviews' && (
              <View style={styles.tabBody}>
                <View style={styles.reviewOverviewCard}>
                  <View style={styles.reviewScoreBox}>
                    <Text style={styles.reviewScoreLarge}>{product.rating}</Text>
                    <View style={{ flexDirection: 'row', gap: 2, marginVertical: 4 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons key={s} name="star" size={16} color="#f59e0b" />
                      ))}
                    </View>
                    <Text style={styles.reviewScoreSub}>Dựa trên {product.reviewCount} lượt mua</Text>
                  </View>

                  <View style={styles.reviewBreakdown}>
                    {[
                      { star: 5, pct: '88%' },
                      { star: 4, pct: '10%' },
                      { star: 3, pct: '2%' },
                      { star: 2, pct: '0%' },
                      { star: 1, pct: '0%' },
                    ].map((item) => (
                      <View key={item.star} style={styles.reviewBarRow}>
                        <Text style={styles.reviewBarStar}>{item.star} sao</Text>
                        <View style={styles.reviewBarTrack}>
                          <View style={[styles.reviewBarFill, { width: item.pct as any }]} />
                        </View>
                        <Text style={styles.reviewBarPct}>{item.pct}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* ADD NEW REVIEW FORM */}
                <View style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 }}>Gửi đánh giá của bạn</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, color: '#475569' }}>Đánh giá sao:</Text>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Pressable key={s} onPress={() => setReviewRating(s)}>
                        <Ionicons name="star" size={24} color={s <= reviewRating ? '#f59e0b' : '#cbd5e1'} />
                      </Pressable>
                    ))}
                  </View>
                  <TextInput
                    placeholder="Viết nhận xét trải nghiệm sử dụng của bạn..."
                    placeholderTextColor="#94a3b8"
                    value={reviewInput}
                    onChangeText={setReviewInput}
                    multiline
                    style={{
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: '#cbd5e1',
                      borderRadius: 12,
                      padding: 12,
                      minHeight: 80,
                      textAlignVertical: 'top',
                      marginBottom: 12,
                    }}
                  />
                  <Pressable
                    style={{
                      backgroundColor: '#2563eb',
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      borderRadius: 10,
                      alignSelf: 'flex-start',
                    }}
                    disabled={submittingReview}
                    onPress={async () => {
                      if (!user) {
                        setAuthModalMessage('Bạn cần đăng nhập tài khoản để viết đánh giá cho sản phẩm.');
                        setAuthModalVisible(true);
                        return;
                      }
                      if (!reviewInput.trim()) {
                        showToast('Vui lòng nhập nội dung đánh giá');
                        return;
                      }
                      try {
                        setSubmittingReview(true);
                        await apiService.addReview(product.id, {
                          userId: user?.id,
                          userName: user?.name || 'Khách hàng',
                          rating: reviewRating,
                          comment: reviewInput.trim(),
                        });
                        setReviewInput('');
                        refetchReviews();
                        showToast('Cảm ơn bạn! Đánh giá đã được đăng tải');
                      } catch {
                        showToast('Không thể gửi đánh giá, vui lòng thử lại');
                      } finally {
                        setSubmittingReview(false);
                      }
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>
                      {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </Text>
                  </Pressable>
                </View>

                {/* VERIFIED CUSTOMER REVIEWS LIST */}
                <View style={styles.verifiedReviewsList}>
                  {(apiReviews && apiReviews.length > 0
                    ? apiReviews.map((rev) => ({
                        name: rev.userName,
                        badge: 'Đã mua tại DANGVINHPC',
                        time: new Date(rev.createdAt).toLocaleDateString('vi-VN'),
                        rating: Math.round(rev.rating),
                        comment: rev.comment,
                      }))
                    : [
                        {
                          name: 'Hoàng Minh Tuấn',
                          badge: 'Đã mua tại DANGVINHPC',
                          time: '3 ngày trước',
                          rating: 5,
                          comment:
                            'Máy dùng cực kỳ mượt mà, đóng gói cẩn thận 2 lớp chống sốc. Nhân viên tư vấn nhiệt tình, giao hàng chỉ sau 1 ngày!',
                        },
                        {
                          name: 'Trần Quỳnh Nga',
                          badge: 'Đã mua tại DANGVINHPC',
                          time: '1 tuần trước',
                          rating: 5,
                          comment:
                            'Màn hình hiển thị quá xuất sắc, thiết kế rất sang trọng và nhẹ nhàng để mang đi làm hàng ngày. Rất hài lòng.',
                        },
                      ]
                  ).map((rev, i) => (
                    <View key={i} style={styles.customerReviewCard}>
                      <View style={styles.revUserHeader}>
                        <View style={styles.revAvatar}>
                          <Text style={styles.revAvatarText}>{rev.name[0]}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.revUserName}>{rev.name}</Text>
                          <View style={styles.revBadgeRow}>
                            <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
                            <Text style={styles.revBadgeText}>{rev.badge}</Text>
                            <Text style={styles.revTimeText}>• {rev.time}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 2 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Ionicons key={s} name="star" size={13} color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'} />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.revCommentText}>{rev.comment}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <View style={styles.relatedHeader}>
                <View>
                  <Text style={styles.relatedTitle}>Sản phẩm liên quan</Text>
                  <Text style={styles.relatedSub}>Khách hàng xem sản phẩm này cũng thường chọn mua</Text>
                </View>
                <Link href={'/products' as any} style={styles.viewAllRelatedLink}>
                  Xem tất cả →
                </Link>
              </View>

              <View style={styles.relatedGrid}>
                {relatedProducts.map((p) => (
                  <View key={p.id} style={styles.relatedCardCol}>
                    <ProductCard product={p} />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <AuthRequiredModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        message={authModalMessage}
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
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /* TOAST */
  toastWrap: {
    position: 'absolute',
    top: 75,
    right: 20,
    zIndex: 999,
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
    borderColor: '#e2e8f0',
  },
  toastText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* BREADCRUMB */
  breadcrumbBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  breadcrumbPath: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    fontSize: 13,
    color: '#64748b',
  },
  breadcrumbSep: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  breadcrumbCategory: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    maxWidth: 320,
  },

  /* MAIN 2-COLUMN LAYOUT */
  mainLayout: {
    gap: 28,
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  leftColumn: {
    width: '100%',
  },
  rightColumn: {
    width: '100%',
  },

  /* HERO IMAGE GALLERY */
  heroImageCard: {
    width: '100%',
    height: 420,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
    shadowColor: '#60a5fa',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 2,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroFavBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 2,
  },
  heroFavBtnActive: {
    backgroundColor: '#ffe4e6',
  },

  /* THUMBNAIL ROW */
  thumbnailRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  thumbnailBox: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    padding: 4,
  },
  thumbnailBoxActive: {
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  /* COMMITMENTS CARD */
  commitmentsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  commitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  commitIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  commitDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  commitDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },

  /* RIGHT: PRODUCT PURCHASE CARD */
  productPurchaseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    shadowColor: '#60a5fa',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  metaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1d4ed8',
    letterSpacing: 0.5,
  },
  skuText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 34,
  },

  socialProofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  starsWrap: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f59e0b',
  },
  dotSep: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  reviewCountText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  soldCountText: {
    fontSize: 13,
    color: '#64748b',
  },

  /* PRICING HERO BOX */
  pricingBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginTop: 16,
  },
  priceMainRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    flexWrap: 'wrap',
  },
  currentPriceText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#dc2626',
  },
  oldPriceText: {
    fontSize: 18,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },
  stockStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockStatusText: {
    fontSize: 13,
    fontWeight: '700',
  },

  /* PROMOTION BOX */
  promotionBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 14,
    marginTop: 16,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  promoHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#b91c1c',
  },
  promoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  promoBullet: {
    fontSize: 13,
  },
  promoItemText: {
    fontSize: 12,
    color: '#451a03',
    flex: 1,
    lineHeight: 18,
  },

  /* VARIANTS */
  variantSection: {
    marginTop: 16,
  },
  variantLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  variantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  variantChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  variantChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  variantChipTextActive: {
    color: '#1d4ed8',
    fontWeight: '800',
  },

  /* QUANTITY */
  quantitySection: {
    marginTop: 18,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 44,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  stepperValueBox: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },

  /* ACTION BUTTONS */
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buyNowText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },

  hotlineNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  hotlineNoteText: {
    fontSize: 12,
    color: '#64748b',
  },

  /* DETAILS TABS SECTION */
  detailsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  tabHeadersRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  tabHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabHeaderBtnActive: {
    borderBottomColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  tabHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  tabHeaderTextActive: {
    color: '#2563eb',
    fontWeight: '800',
  },
  tabBody: {
    padding: 24,
  },
  techSpecsBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  techSpecsBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  techSpecsBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  techSpecsBoxIntro: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 4,
  },
  techSpecsBoxIntroHighlight: {
    color: '#0f172a',
    fontWeight: '800',
  },
  techSpecsList: {
    marginTop: 8,
  },
  techSpecsListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  techSpecsListText: {
    flex: 1,
    color: '#475569',
    fontSize: 13,
    lineHeight: 20,
  },
  descTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
  },
  descParagraph: {
    fontSize: 14,
    lineHeight: 24,
    color: '#475569',
  },
  featuresGrid: {
    gap: 10,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureCheckWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },

  /* SPECS TABLE */
  specsTableWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  specsTableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  specsTableKey: {
    width: '35%',
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  specsTableVal: {
    width: '65%',
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },

  /* REVIEWS */
  reviewOverviewCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    gap: 28,
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  reviewScoreBox: {
    alignItems: 'center',
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  reviewScoreLarge: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0f172a',
  },
  reviewScoreSub: {
    fontSize: 12,
    color: '#64748b',
  },
  reviewBreakdown: {
    flex: 1,
    minWidth: 240,
    gap: 6,
  },
  reviewBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewBarStar: {
    fontSize: 12,
    color: '#475569',
    width: 42,
  },
  reviewBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  reviewBarFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 4,
  },
  reviewBarPct: {
    fontSize: 11,
    color: '#64748b',
    width: 32,
    textAlign: 'right',
  },
  verifiedReviewsList: {
    gap: 16,
  },
  customerReviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  revUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  revAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  revAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
  },
  revUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  revBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  revBadgeText: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '600',
  },
  revTimeText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  revCommentText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
  },

  /* RELATED PRODUCTS */
  relatedSection: {
    marginTop: 10,
  },
  relatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  relatedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  relatedSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  viewAllRelatedLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  relatedCardCol: {
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 260,
    maxWidth: 290,
  },
});

