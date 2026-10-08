import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { GEAR_CATEGORIES, isProductInCategory, type CategoryOption } from '@/constants/categories';
import { useAppContext } from '@/context/AppContext';
import { useProducts } from '@/hooks/useApi';
import { apiService } from '@/services/api';

interface FilterOption {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  badge?: string;
}

const filters: FilterOption[] = [
  { key: 'all', label: 'Tất cả', icon: 'apps-outline', color: '#2563eb' },
  { key: 'new', label: 'Mới', icon: 'sparkles-outline', color: '#2563eb', badge: 'NEW' },
  { key: 'hot', label: 'Hot', icon: 'flame-outline', color: '#ea580c', badge: 'HOT' },
  { key: 'sale', label: 'Sale', icon: 'pricetag-outline', color: '#dc2626', badge: 'GIẢM' },
  { key: 'featured', label: 'Phổ biến', icon: 'star-outline', color: '#7c3aed', badge: 'TOP' },
];

export default function CategoriesTabScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const numColumns = isDesktop ? 4 : 2;

  const { isDark } = useAppContext();
  const { products, loading: prodLoading } = useProducts();

  const [categoriesList, setCategoriesList] = useState<CategoryOption[]>(GEAR_CATEGORIES);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Tải danh mục từ API theo đúng cấu trúc thầy dạy (fetch, isMounted, try-catch-finally)
  const loadCategories = useCallback(async (isRefresh = false) => {
    let isMounted = true;
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingApi(true);
    }
    setErrorMessage(null);

    try {
      const url = `${apiService.getBaseURL()}/api/categories`;
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi ${response.status}`);
      }

      const result = await response.json();
      // Hỗ trợ cả định dạng wrapper { success, data } của thầy VÀ mảng thuần
      const rawData = Array.isArray(result) ? result : (result?.data || []);

      if (isMounted) {
        if (Array.isArray(rawData) && rawData.length > 0) {
          const mapped: CategoryOption[] = rawData.map((item: any) => {
            const fallback = GEAR_CATEGORIES.find((g) => g.id === item.id || g.category === item.id);
            return {
              id: String(item.id || item.slug),
              label: item.name || item.label || String(item.id),
              icon: fallback?.icon || (item.icon as any) || 'folder-outline',
              category: item.category || fallback?.category || String(item.id),
              q: item.q || fallback?.q,
            };
          });
          setCategoriesList(mapped);
          setIsApiConnected(true);
        } else {
          setCategoriesList(GEAR_CATEGORIES);
        }
        setErrorMessage(null);
      }
    } catch (error) {
      if (isMounted) {
        setErrorMessage(error instanceof Error ? error.message : 'Không thể kết nối API danh mục');
        setCategoriesList(GEAR_CATEGORIES); // Fallback an toàn, giữ app mượt mà
      }
    } finally {
      if (isMounted) {
        setIsLoadingApi(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Calculate matching products count for each synchronized category
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};

    categoriesList.forEach((cat) => {
      const matchingProds = products.filter((p: any) => {
        const pCat = (p.category || p.category_id || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const pDesc = (p.description || '').toLowerCase();

        // 1. Lọc theo trạng thái activeFilter (Mới, Hot, Giảm giá, Nổi bật)
        if (activeFilter === 'new' && !p.isNew) return false;
        if (activeFilter === 'hot' && !p.isHot) return false;
        if (activeFilter === 'sale' && !(p.isSale || (p.discount && p.discount > 0))) return false;
        if (activeFilter === 'featured' && !p.isFeatured) return false;

        return isProductInCategory(p, cat.id);
        /* eslint-disable */

        // 2. Phân loại chuẩn xác từng danh mục
        if (cat.id === 'laptop-gaming') {
          return (
            pCat.includes('laptop') &&
            (pName.includes('gaming') ||
              pName.includes('tuf') ||
              pName.includes('rog') ||
              pName.includes('nitro') ||
              pName.includes('legion') ||
              pName.includes('loq') ||
              pName.includes('helios') ||
              pName.includes('victus') ||
              pDesc.includes('gaming'))
          );
        }
        if (cat.id === 'laptop') {
          return pCat.includes('laptop');
        }
        if (cat.id === 'pc-gaming') {
          return (
            pCat.includes('gaming-pc') ||
            pCat.includes('gaming_pc') ||
            (pCat.includes('pc') && pName.includes('gaming'))
          );
        }
        if (cat.id === 'office-pc') {
          return pCat.includes('office-pc') || pCat.includes('office_pc');
        }
        if (cat.id === 'main-cpu-vga') {
          return (
            pCat.includes('cpu') ||
            pCat.includes('gpu') ||
            pCat.includes('mainboard') ||
            pCat.includes('vga')
          );
        }
        if (cat.id === 'case-psu-cooling') {
          return (
            pCat.includes('case') ||
            pCat.includes('psu') ||
            pCat.includes('cooling') ||
            pCat.includes('nguồn') ||
            pCat.includes('tản')
          );
        }
        if (cat.id === 'ram-storage') {
          return pCat.includes('ram') || pCat.includes('ssd') || pCat.includes('storage');
        }
        if (cat.id === 'audio-cam') {
          return (
            pCat.includes('audio') ||
            pCat.includes('webcam') ||
            pCat.includes('mic') ||
            pName.includes('loa') ||
            pName.includes('webcam') ||
            pName.includes('micro')
          );
        }
        if (cat.id === 'desk-chair') {
          return (
            pCat.includes('chair') ||
            pCat.includes('desk') ||
            pName.includes('ghế') ||
            pName.includes('bàn')
          );
        }
        if (cat.id === 'apple') {
          return (
            pCat.includes('apple') ||
            pName.includes('macbook') ||
            pName.includes('imac') ||
            pName.includes('mac mini')
          );
        }
        if (cat.id === 'accessories-console') {
          return pCat.includes('accessories') || pCat.includes('phụ kiện');
        }

        if (cat.category) {
          if (pCat.includes(cat.category) || cat.category.includes(pCat)) {
            if (cat.q) return pName.includes(cat.q) || pDesc.includes(cat.q);
            return true;
          }
        }

        if (cat.q) {
          return pName.includes(cat.q) || pDesc.includes(cat.q) || pCat.includes(cat.q);
        }

        return false;
        /* eslint-enable */
      });

      stats[cat.id] = matchingProds.length;
    });

    return stats;
  }, [products, activeFilter, categoriesList]);

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return categoriesList.filter((cat) => {
      if (!q) return true;
      return cat.label.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q);
    });
  }, [searchQuery, categoriesList]);

  // Total products matching the filter
  const totalMatchingProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeFilter === 'new') return p.isNew;
      if (activeFilter === 'hot') return p.isHot;
      if (activeFilter === 'sale') return p.isSale || (p.discount && p.discount > 0);
      if (activeFilter === 'featured') return p.isFeatured;
      return true;
    }).length;
  }, [products, activeFilter]);

  const activeFilterInfo = filters.find((f) => f.key === activeFilter) || filters[0];

  return (
    <View style={[styles.pageWrapper, isDark && styles.pageDark]}>
      <Header />

      <View style={[styles.container, isDark && styles.containerDark]}>
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
          <Text style={StyleSheet.flatten([styles.breadcrumbCurrent, isDark && styles.textDark])}>Danh mục sản phẩm</Text>
        </View>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={[styles.title, isDark && styles.textDark]}>Danh mục sản phẩm</Text>
            <Text style={[styles.subtitle, isDark && styles.textMutedDark]}>
              Khám phá linh kiện máy tính, laptop và gaming gear chính hãng
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={() => loadCategories(true)}
              style={[
                styles.headerBadge,
                isApiConnected ? styles.headerBadgeSuccess : (isDark ? styles.headerBadgeDark : null),
              ]}
            >
              <Text
                style={[
                  styles.headerBadgeText,
                  isApiConnected ? styles.textSuccess : (isDark ? { color: '#60a5fa' } : null),
                ]}
              >
                {isApiConnected ? '● API Online' : '○ Dữ liệu máy'}
              </Text>
            </Pressable>
            <View style={[styles.headerBadge, isDark && styles.headerBadgeDark]}>
              <Text style={[styles.headerBadgeText, isDark && { color: '#60a5fa' }]}>
                {filteredCategories.length} danh mục
              </Text>
            </View>
          </View>
        </View>

        {/* THÔNG BÁO KẾT NỐI API NẾU LỖI */}
        {errorMessage ? (
          <View style={styles.apiErrorBanner}>
            <Ionicons name="warning-outline" size={16} color="#e11d48" style={{ marginRight: 8 }} />
            <Text style={styles.apiErrorBannerText} numberOfLines={1}>
              {errorMessage} (Đang dùng dữ liệu dự phòng)
            </Text>
            <Pressable style={styles.apiRetryBtn} onPress={() => loadCategories(true)}>
              <Text style={styles.apiRetryBtnText}>Thử lại</Text>
            </Pressable>
          </View>
        ) : null}

      {/* SEARCH INPUT */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm nhanh danh mục (Laptop, PC, VGA, RAM...)"
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </Pressable>
        ) : null}
      </View>

      {/* FILTER BUTTONS ROW */}
      <View style={styles.filterRow}>
        {filters.map((item) => {
          const isActive = activeFilter === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setActiveFilter(item.key)}
              style={StyleSheet.flatten([
                styles.filterChip,
                isActive ? styles.filterChipActive : null,
              ])}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={isActive ? '#ffffff' : item.color}
                style={{ marginRight: 6 }}
              />
              <Text
                style={StyleSheet.flatten([
                  styles.filterText,
                  isActive ? styles.filterTextActive : null,
                ])}
              >
                {item.label}
              </Text>
              {item.badge && !isActive ? (
                <View style={StyleSheet.flatten([styles.miniBadge, { backgroundColor: item.color + '18' }])}>
                  <Text style={StyleSheet.flatten([styles.miniBadgeText, { color: item.color }])}>
                    {item.badge}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {/* FILTER STATUS BANNER */}
      {activeFilter !== 'all' ? (
        <View style={styles.activeFilterBanner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <Ionicons name={activeFilterInfo.icon} size={18} color={activeFilterInfo.color} />
            <Text style={styles.activeFilterBannerText}>
              Đang lọc theo:{' '}
              <Text style={{ fontWeight: '800', color: activeFilterInfo.color }}>
                {activeFilterInfo.label}
              </Text>{' '}
              ({totalMatchingProducts} sản phẩm)
            </Text>
          </View>
          <Pressable
            style={styles.viewAllBtn}
            onPress={() => {
              router.push({ pathname: '/products', params: { filter: activeFilter } } as any);
            }}
          >
            <Text style={styles.viewAllBtnText}>Xem tất cả</Text>
            <Ionicons name="arrow-forward" size={14} color="#2563eb" />
          </Pressable>
        </View>
      ) : null}

      {/* CATEGORIES GRID */}
      {prodLoading && categoriesList.length === 0 ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#64748b', fontSize: 14 }}>
            Đang tải danh mục sản phẩm từ API...
          </Text>
        </View>
      ) : filteredCategories.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>🔍</Text>
          <Text style={styles.emptyText}>Không tìm thấy danh mục phù hợp</Text>
          <Pressable style={styles.resetBtn} onPress={() => { setSearchQuery(''); setActiveFilter('all'); }}>
            <Text style={styles.resetBtnText}>Xem lại tất cả</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          key={`cols-${numColumns}`}
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadCategories(true)}
              colors={['#2563eb']}
              tintColor="#2563eb"
            />
          }
          renderItem={({ item }) => {
            const count = categoryStats[item.id] || 0;

            return (
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: '/products',
                    params: {
                      category: item.category || item.id,
                      q: item.q || undefined,
                      filter: activeFilter !== 'all' ? activeFilter : undefined,
                    },
                  } as any);
                }}
                style={StyleSheet.flatten([
                  styles.card,
                  isDesktop ? styles.cardDesktop : styles.cardMobile,
                ])}
              >
                <View style={styles.iconWrap}>
                  <Ionicons name={item.icon} size={24} color="#2563eb" />
                </View>
                <Text style={styles.name} numberOfLines={1}>
                  {item.label}
                </Text>
                <View style={styles.countRow}>
                  <Text style={styles.count}>
                    {count} sản phẩm
                  </Text>
                  {activeFilter !== 'all' && count > 0 ? (
                    <View style={StyleSheet.flatten([styles.tagBadge, { backgroundColor: activeFilterInfo.color + '18' }])}>
                      <Text style={StyleSheet.flatten([styles.tagBadgeText, { color: activeFilterInfo.color }])}>
                        {activeFilterInfo.label}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
          ListFooterComponent={
            <View style={{ marginTop: 30, marginHorizontal: -20 }}>
              <Footer />
            </View>
          }
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#f4f8ff',
  },
  pageDark: {
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f8ff',
    paddingHorizontal: 20,
    paddingTop: 16,
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
  headerBadgeDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  headerBadge: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    outlineStyle: 'none',
    outlineWidth: 0,
    borderWidth: 0,
  } as any,
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  miniBadge: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  activeFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  activeFilterBannerText: {
    fontSize: 13,
    color: '#1e40af',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  listContent: {
    paddingBottom: 30,
    gap: 14,
  },
  columnWrapper: {
    gap: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#60a5fa',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    cursor: 'pointer',
  } as any,
  cardDesktop: {
    flex: 1,
  },
  cardMobile: {
    flex: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  headerBadgeSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
  },
  textSuccess: {
    color: '#059669',
    fontWeight: '700',
  },
  apiErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  apiErrorBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#be123c',
    fontWeight: '500',
  },
  apiRetryBtn: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  apiRetryBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
