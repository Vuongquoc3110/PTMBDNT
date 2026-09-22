import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { useCategories, useProducts } from '@/hooks/useApi';

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

  const { categories, loading: catLoading } = useCategories();
  const { products, loading: prodLoading } = useProducts();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate matching products count for each category based on active filter
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};

    categories.forEach((cat) => {
      const catId = (cat.id || cat.name || '').toLowerCase();
      const matchingProds = products.filter((p) => {
        const pCat = (p.category || (p as any).category_id || '').toLowerCase();
        const matchesCategory = pCat.includes(catId) || catId.includes(pCat);
        if (!matchesCategory) return false;

        if (activeFilter === 'new') return p.isNew;
        if (activeFilter === 'hot') return p.isHot;
        if (activeFilter === 'sale') return p.isSale || (p.discount && p.discount > 0);
        if (activeFilter === 'featured') return p.isFeatured;
        return true;
      });

      stats[cat.id] = matchingProds.length;
    });

    return stats;
  }, [categories, products, activeFilter]);

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return categories.filter((cat) => {
      if (!q) return true;
      return cat.name.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q);
    });
  }, [categories, searchQuery]);

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

  const getCategoryIconName = (item: any): keyof typeof Ionicons.glyphMap => {
    if (item.icon && item.icon.includes('-outline')) return item.icon as any;
    const id = (item.id || '').toLowerCase();
    if (id.includes('laptop')) return 'laptop-outline';
    if (id.includes('pc') || id.includes('desktop')) return 'desktop-outline';
    if (id.includes('cpu')) return 'hardware-chip-outline';
    if (id.includes('gpu') || id.includes('card')) return 'game-controller-outline';
    if (id.includes('ram')) return 'albums-outline';
    if (id.includes('ssd') || id.includes('storage')) return 'save-outline';
    if (id.includes('monitor')) return 'tv-outline';
    if (id.includes('gear') || id.includes('keyboard')) return 'keypad-outline';
    return 'grid-outline';
  };

  const loading = catLoading || prodLoading;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Danh mục sản phẩm</Text>
          <Text style={styles.subtitle}>
            Khám phá linh kiện máy tính, laptop và gaming gear chính hãng
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{filteredCategories.length} danh mục</Text>
        </View>
      </View>

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
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#64748b', fontSize: 14 }}>
            Đang tải danh mục sản phẩm...
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
          renderItem={({ item }) => {
            const count = categoryStats[item.id] !== undefined ? categoryStats[item.id] : item.count;
            const iconName = getCategoryIconName(item);

            return (
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: '/products',
                    params: {
                      category: item.id || item.name,
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
                  <Ionicons name={iconName} size={24} color="#2563eb" />
                </View>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8ff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  headerBadge: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfeafc',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerBadgeText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfeafc',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfeafc',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  miniBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  activeFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  activeFilterBannerText: {
    fontSize: 13,
    color: '#334155',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 12,
  },
  resetBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfeafc',
    borderRadius: 18,
    padding: 16,
  },
  cardDesktop: {
    width: '23.5%',
  },
  cardMobile: {
    width: '48%',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  count: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
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
});
