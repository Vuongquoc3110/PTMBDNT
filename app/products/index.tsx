import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View
} from 'react-native';

import { Header } from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { formatPrice } from '@/data/products';
import { useProducts } from '@/hooks/useApi';

const categoryOptions = [
  { id: 'Laptop', label: 'Laptop', icon: 'laptop-outline' },
  { id: 'Gaming PC', label: 'PC Gaming', icon: 'desktop-outline' },
  { id: 'Office PC', label: 'PC Văn Phòng', icon: 'business-outline' },
  { id: 'CPU', label: 'CPU', icon: 'hardware-chip-outline' },
  { id: 'GPU', label: 'GPU (Card)', icon: 'game-controller-outline' },
  { id: 'RAM', label: 'RAM', icon: 'albums-outline' },
  { id: 'SSD', label: 'SSD', icon: 'save-outline' },
  { id: 'Monitor', label: 'Màn hình', icon: 'tv-outline' },
  { id: 'Keyboard', label: 'Bàn phím', icon: 'keypad-outline' },
];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

function ProductGridItem({
  item,
  isFav,
  toggleFavorite,
  showToast,
}: {
  item: any;
  isFav: boolean;
  toggleFavorite: (id: string, e: any) => void;
  showToast: (msg: string) => void;
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 920;

  const badgeText = item.discount
    ? `−${item.discount}%`
    : item.isNew
    ? 'MỚI'
    : item.isHot
    ? 'HOT'
    : '';

  return (
    <View style={[styles.cardCol, isMobile && styles.cardColMobile]}>
      <Link href={{ pathname: '/products/[id]', params: { id: item.id } }} asChild>
        <Pressable
          style={styles.productCard}
          {...({ dataSet: { productCard: 'true' } } as any)}
        >
          {/* PRODUCT IMAGE & BADGES */}
          <View style={[styles.cardImageWrapper, isMobile && styles.cardImageWrapperMobile]}>
            <Image
              source={{ uri: item.image || DEFAULT_IMAGE }}
              style={styles.cardImage}
              {...({ dataSet: { productImg: 'true' } } as any)}
            />
            {badgeText ? (
              <View
                style={[
                  styles.cardBadge,
                  { backgroundColor: item.discount ? '#dc2626' : item.isNew ? '#2563eb' : '#ea580c' },
                ]}
              >
                <Text style={styles.cardBadgeText}>{badgeText}</Text>
              </View>
            ) : null}

            <Pressable
              style={styles.cardFavoriteBtn}
              {...({ dataSet: { productFav: 'true' } } as any)}
              onPress={(e) => toggleFavorite(item.id, e)}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={18}
                color={isFav ? '#e11d48' : '#475569'}
              />
            </Pressable>
          </View>

          {/* PRODUCT CONTENT */}
          <View style={[styles.cardBody, isMobile && styles.cardBodyMobile]}>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text
              style={styles.cardName}
              numberOfLines={2}
              {...({ dataSet: { productName: 'true' } } as any)}
            >
              {item.name}
            </Text>

            <View style={styles.cardRatingRow}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name="star"
                    size={12}
                    color={s <= Math.floor(item.rating) ? '#f59e0b' : '#cbd5e1'}
                  />
                ))}
              </View>
              <Text style={styles.ratingNumber}>{item.rating}</Text>
              <Text style={styles.reviewCount}>({item.reviewCount})</Text>
            </View>

            {item.features && item.features.length > 0 && (
              <Text style={styles.cardSpecs} numberOfLines={1}>
                {item.features.slice(0, 3).join(' • ')}
              </Text>
            )}

            <View style={styles.cardPriceRow}>
              <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
              {item.oldPrice ? (
                <Text style={styles.cardOldPrice}>{formatPrice(item.oldPrice)}</Text>
              ) : null}
            </View>

            {/* ADD TO CART BUTTON */}
            <Pressable
              style={styles.cardCartBtn}
              onPress={(e) => {
                e?.stopPropagation?.();
                showToast(`Đã thêm "${item.name}" vào giỏ hàng!`);
              }}
            >
              <Ionicons name="cart-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.cardCartBtnText}>Thêm vào giỏ</Text>
            </Pressable>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

export default function ProductsPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 920;
  const params = useLocalSearchParams<{ q?: string; category?: string; filter?: string }>();

  const { products: apiProducts, loading: productsLoading } = useProducts();
  const { toggleWishlist, isWishlisted } = useAppContext();

  const [search, setSearch] = useState(typeof params.q === 'string' ? params.q : '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    typeof params.category === 'string' && params.category ? [params.category] : [],
  );
  const [activeFilter, setActiveFilter] = useState<string>(params.filter || '');
  const [onlySale, setOnlySale] = useState(params.filter === 'sale');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'low' | 'high' | 'rating'>('featured');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setSearch(typeof params.q === 'string' ? params.q : '');
  }, [params.q]);

  useEffect(() => {
    setSelectedCategories(
      typeof params.category === 'string' && params.category ? [params.category] : [],
    );
  }, [params.category]);

  useEffect(() => {
    setActiveFilter(params.filter || '');
    setOnlySale(params.filter === 'sale');
  }, [params.filter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const toggleFavorite = (id: string, e: any) => {
    e?.stopPropagation?.();
    const wasFav = isWishlisted(id);
    toggleWishlist(id);
    showToast(!wasFav ? 'Đã thêm vào danh sách yêu thích!' : 'Đã xóa khỏi yêu thích');
  };

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    let result = [...apiProducts];

    if (activeFilter === 'sale' || onlySale) {
      result = result.filter((item) => (item.discount && item.discount > 0) || item.isSale);
    } else if (activeFilter === 'new') {
      result = result.filter((item) => item.isNew);
    } else if (activeFilter === 'hot') {
      result = result.filter((item) => item.isHot);
    } else if (activeFilter === 'featured') {
      result = result.filter((item) => item.isFeatured);
    }

    if (normalized) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(normalized) ||
        (item.category && item.category.toLowerCase().includes(normalized)) ||
        (item.category_id && item.category_id.toLowerCase().includes(normalized))
      );
    }

    if (selectedCategories.length > 0) {
      const selectedLower = selectedCategories.map((c) => c.toLowerCase());
      result = result.filter((item) =>
        selectedLower.includes(item.category?.toLowerCase() || '') ||
        selectedLower.includes(item.category_id?.toLowerCase() || '')
      );
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case 'low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
        break;
    }

    return result;
  }, [search, selectedCategories, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setOnlySale(false);
    setSortBy('featured');
    showToast('Đã xóa bộ lọc tìm kiếm');
  };

  const sortLabels: Record<string, string> = {
    featured: 'Nổi bật nhất',
    newest: 'Hàng mới về',
    low: 'Giá: Thấp đến Cao',
    high: 'Giá: Cao đến Thấp',
    rating: 'Đánh giá cao',
  };

  return (
    <View style={styles.page}>
      <Header />

      {/* TOAST NOTIFICATION */}
      {toast ? (
        <View style={styles.toastWrap}>
          <Ionicons name="checkmark-circle" size={18} color="#22c55e" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, !isDesktop && styles.contentMobile]}
      >
        {/* TOP BAR / BREADCRUMB */}
        <View style={[styles.topBar, !isDesktop && styles.topBarMobile]}>
          <View style={styles.topBarLeft}>
            <View style={[styles.breadcrumbRow, !isDesktop && styles.breadcrumbRowMobile]}>
              <Link href="/(tabs)" style={styles.breadcrumbLink}>
                Trang chủ
              </Link>
              <Text style={styles.breadcrumbSep}>/</Text>
              <Text style={styles.breadcrumbCurrent}>Danh sách sản phẩm</Text>
            </View>
            <Text style={[styles.pageTitle, !isDesktop && styles.pageTitleMobile]}>Sản phẩm công nghệ</Text>
            <Text style={[styles.pageSubtitle, !isDesktop && styles.pageSubtitleMobile]}>
              Máy tính, linh kiện phần cứng và phụ kiện chính hãng tại DANGVINHPC
            </Text>
          </View>
          <View style={styles.resultCountBadge}>
            <Text style={styles.resultCountText}>{filteredProducts.length} sản phẩm</Text>
          </View>
        </View>

        {/* SEARCH AND SORT TOOLBAR */}
        <View style={[styles.toolbar, !isDesktop && styles.toolbarMobile]}>
          <View style={[styles.searchBox, !isDesktop && styles.searchBoxMobile]}>
            <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm kiếm máy tính, CPU, card đồ họa, màn hình..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </Pressable>
            )}
          </View>

          {/* SORT DROPDOWN CONTAINER */}
          <View style={styles.sortContainer}>
            <Pressable
              style={[styles.sortTrigger, !isDesktop && styles.sortTriggerMobile]}
              onPress={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <Text style={styles.sortTriggerLabel}>Sắp xếp: </Text>
              <Text style={styles.sortTriggerValue}>{sortLabels[sortBy]}</Text>
              <Ionicons
                name={isSortDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#64748b"
                style={{ marginLeft: 6 }}
              />
            </Pressable>

            {isSortDropdownOpen && (
              <View style={styles.sortMenu}>
                {(['featured', 'newest', 'low', 'high', 'rating'] as const).map((opt) => (
                  <Pressable
                    key={opt}
                    style={[styles.sortMenuItem, sortBy === opt && styles.sortMenuItemActive]}
                    onPress={() => {
                      setSortBy(opt);
                      setIsSortDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[styles.sortMenuItemText, sortBy === opt && styles.sortMenuItemTextActive]}
                    >
                      {sortLabels[opt]}
                    </Text>
                    {sortBy === opt && <Ionicons name="checkmark" size={16} color="#2563eb" />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ACTIVE FILTER BANNER */}
        {(search.trim().length > 0 || selectedCategories.length > 0 || onlySale) && (
          <View style={styles.activeFilterBanner}>
            <View style={styles.activeFilterLeft}>
              <Ionicons name="funnel" size={16} color="#2563eb" style={{ marginRight: 4 }} />
              <Text style={styles.activeFilterTitle}>Đang lọc:</Text>
              {onlySale && (
                <View style={[styles.filterChip, { borderColor: '#fed7aa', backgroundColor: '#fff7ed' }]}>
                  <Ionicons name="flame" size={14} color="#ea580c" style={{ marginRight: 4 }} />
                  <Text style={[styles.filterChipText, { color: '#ea580c' }]}>Khuyến mãi giảm sốc</Text>
                  <Pressable onPress={() => setOnlySale(false)} hitSlop={6}>
                    <Ionicons name="close" size={14} color="#ea580c" style={{ marginLeft: 4 }} />
                  </Pressable>
                </View>
              )}
              {search.trim().length > 0 && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Từ khóa: "{search.trim()}"</Text>
                  <Pressable onPress={() => setSearch('')} hitSlop={6}>
                    <Ionicons name="close" size={14} color="#64748b" style={{ marginLeft: 4 }} />
                  </Pressable>
                </View>
              )}
              {selectedCategories.map((cat) => (
                <View key={cat} style={styles.filterChip}>
                  <Text style={styles.filterChipText}>{cat}</Text>
                  <Pressable onPress={() => toggleCategory(cat)} hitSlop={6}>
                    <Ionicons name="close" size={14} color="#64748b" style={{ marginLeft: 4 }} />
                  </Pressable>
                </View>
              ))}
            </View>
            <Pressable onPress={clearFilters} style={styles.clearAllBtn}>
              <Text style={styles.clearAllBtnText}>Xóa tất cả</Text>
            </Pressable>
          </View>
        )}

        {/* MAIN BODY LAYOUT */}
        <View style={[styles.mainLayout, !isDesktop && styles.mainLayoutMobile]}>
          {/* SIDEBAR FILTER PANEL */}
          <View style={[styles.filterSidebar, !isDesktop && styles.filterSidebarMobile]}>
            <View style={styles.filterHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="filter" size={18} color="#2563eb" />
                <Text style={styles.filterHeaderTitle}>Bộ lọc danh mục</Text>
              </View>
              {(selectedCategories.length > 0 || search.length > 0) && (
                <Pressable onPress={clearFilters}>
                  <Text style={styles.clearFilterText}>Xóa tất cả</Text>
                </Pressable>
              )}
            </View>

            <View style={[styles.categoryList, !isDesktop && styles.categoryListMobile]}>
              {categoryOptions.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <Pressable
                    key={cat.id}
                    style={[styles.categoryRow, !isDesktop && styles.categoryRowMobile, isSelected && styles.categoryRowActive]}
                    onPress={() => toggleCategory(cat.id)}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                      {isSelected && <Ionicons name="checkmark" size={12} color="#ffffff" />}
                    </View>
                    <Ionicons
                      name={cat.icon as any}
                      size={18}
                      color={isSelected ? '#2563eb' : '#64748b'}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelActive]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* QUICK PROMO BADGE */}
            <View style={styles.promoSidebarBox}>
              <Ionicons name="flash" size={20} color="#ea580c" />
              <Text style={styles.promoSidebarTitle}>Flash Sale hôm nay</Text>
              <Text style={styles.promoSidebarDesc}>Giảm tới 24% linh kiện PC</Text>
            </View>
          </View>

          {/* PRODUCTS LIST CONTAINER */}
          <View style={styles.productsArea}>
            {filteredProducts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={56} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm nào</Text>
                <Text style={styles.emptyDesc}>Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc</Text>
                <Pressable style={styles.resetFilterBtn} onPress={clearFilters}>
                  <Text style={styles.resetFilterBtnText}>Xóa bộ lọc</Text>
                </Pressable>
              </View>
            ) : (
              <View style={[styles.productsGrid, !isDesktop && styles.productsGridMobile]}>
                {filteredProducts.map((item) => {
                  const isFav = isWishlisted(item.id);
                  const badgeText = item.discount
                    ? `−${item.discount}%`
                    : item.isNew
                    ? 'MỚI'
                    : item.isHot
                    ? 'HOT'
                    : '';

                  return (
                    <ProductGridItem
                      key={item.id}
                      item={item}
                      isFav={isFav}
                      toggleFavorite={toggleFavorite}
                      showToast={showToast}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
    maxWidth: 1300,
    width: '100%',
    alignSelf: 'center',
  },
  contentMobile: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 88,
  },

  /* TOAST */
  toastWrap: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    zIndex: 999,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  /* TOP BAR */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  topBarMobile: {
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  topBarLeft: {
    flex: 1,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  breadcrumbRowMobile: {
    marginBottom: 4,
  },
  breadcrumbLink: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  breadcrumbSep: {
    fontSize: 13,
    color: '#94a3b8',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  pageTitleMobile: {
    fontSize: 22,
    letterSpacing: 0,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  pageSubtitleMobile: {
    fontSize: 12,
    lineHeight: 17,
    maxWidth: '92%',
  },
  resultCountBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },

  /* TOOLBAR */
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  toolbarMobile: {
    gap: 8,
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    minWidth: 260,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    height: 46,
    shadowColor: '#0f172a',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  searchBoxMobile: {
    minWidth: '100%',
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  sortContainer: {
    position: 'relative',
    zIndex: 50,
  },
  sortTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 46,
    shadowColor: '#0f172a',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  sortTriggerMobile: {
    minWidth: '100%',
    justifyContent: 'space-between',
  },
  sortTriggerLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  sortTriggerValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  sortMenu: {
    position: 'absolute',
    top: 52,
    right: 0,
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 100,
  },
  sortMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sortMenuItemActive: {
    backgroundColor: '#eff6ff',
  },
  sortMenuItemText: {
    fontSize: 13,
    color: '#334155',
  },
  sortMenuItemTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },

  /* MAIN LAYOUT */
  mainLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  mainLayoutMobile: {
    flexDirection: 'column',
  },

  /* SIDEBAR */
  filterSidebar: {
    width: 260,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  filterSidebarMobile: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 10,
  },
  filterHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  clearFilterText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  categoryList: {
    gap: 4,
  },
  categoryListMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  categoryRowMobile: {
    width: '48%',
    paddingHorizontal: 6,
  },
  categoryRowActive: {
    backgroundColor: '#eff6ff',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#ffffff',
  },
  checkboxActive: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  categoryLabelActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  promoSidebarBox: {
    marginTop: 16,
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffedd5',
    padding: 12,
  },
  promoSidebarTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#c2410c',
    marginTop: 4,
  },
  promoSidebarDesc: {
    fontSize: 12,
    color: '#9a3412',
    marginTop: 2,
  },

  /* PRODUCTS AREA */
  productsArea: {
    flex: 1,
    width: '100%',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
  },
  productsGridMobile: {
    gap: 10,
    justifyContent: 'space-between',
  },
  cardCol: {
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 260,
    maxWidth: 320,
  },
  cardColMobile: {
    minWidth: '47%',
    maxWidth: '48.5%',
    flexGrow: 0,
  },
  productCard: {
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
  productCardHovered: {
    borderColor: '#93c5fd',
    shadowColor: '#2563eb',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  cardImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  cardImageWrapperMobile: {
    height: 132,
  },
  cardNameHovered: {
    color: '#2563eb',
  },
  cardCartBtnHovered: {
    backgroundColor: '#1d4ed8',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  cardFavoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardBody: {
    padding: 14,
  },
  cardBodyMobile: {
    padding: 10,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
    minHeight: 40,
  },
  cardRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 2,
  },
  reviewCount: {
    fontSize: 11,
    color: '#94a3b8',
  },
  cardSpecs: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 10,
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardOldPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  cardCartBtn: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCartBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* EMPTY STATE */
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 14,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  resetFilterBtn: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetFilterBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* ACTIVE FILTER BANNER */
  activeFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  activeFilterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  activeFilterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  clearAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  clearAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
    textDecorationLine: 'underline',
  },
});
