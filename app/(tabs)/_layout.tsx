import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { GEAR_CATEGORIES, normalizeCategory } from '@/constants/categories';
import { useAppContext } from '@/context/AppContext';

function CategoryFilterSidebar({ isCollapsed, setIsCollapsed }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedCategories, setSelectedCategories, clearCategoryFilter, isDark } = useAppContext();

  const handleToggle = (categoryId: string) => {
    // If clicking the active category, deselect to return to all products/home
    if (selectedCategories.includes(categoryId)) {
      clearCategoryFilter();
    } else {
      setSelectedCategories([categoryId]);
    }
    // If not already on home tabs, navigate there so user sees results
    if (pathname !== '/' && pathname !== '/(tabs)') {
      router.push('/(tabs)' as any);
    }
  };

  const isChecked = (catId: string) => {
    const norm = normalizeCategory(catId);
    return selectedCategories.some((c) => normalizeCategory(c) === norm);
  };

  return (
    <View style={[styles.sidebar, isDark && styles.sidebarDark, { width: isCollapsed ? 68 : 240 }]}>
      {/* SIDEBAR HEADER */}
      <View style={[styles.sidebarHeader, isCollapsed && styles.sidebarHeaderCollapsed]}>
        {!isCollapsed ? (
          <View style={styles.headerTitleWrap}>
            <View style={[styles.headerBadge, isDark && styles.headerBadgeDark]}>
              <Ionicons name="grid" size={13} color={isDark ? '#60a5fa' : '#2563eb'} />
            </View>
            <Text style={[styles.headerTitle, isDark && styles.textLight]}>DANH MỤC</Text>
          </View>
        ) : (
          <Ionicons name="grid" size={18} color="#2563eb" />
        )}

        <View style={styles.headerRight}>
          {!isCollapsed && selectedCategories.length > 0 && (
            <Pressable onPress={clearCategoryFilter} style={[styles.clearBtn, isDark && styles.clearBtnDark]} hitSlop={6}>
              <Text style={[styles.clearBtnText, isDark && styles.clearBtnTextDark]}>✕ Xóa lọc</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => setIsCollapsed(!isCollapsed)}
            style={[styles.collapseBtn, isDark && styles.collapseBtnDark]}
            accessibilityLabel={isCollapsed ? 'Mở rộng danh mục' : 'Thu gọn danh mục'}
          >
            <Ionicons
              name={isCollapsed ? 'chevron-forward' : 'chevron-back'}
              size={14}
              color={isDark ? '#cbd5e1' : '#64748b'}
            />
          </Pressable>
        </View>
      </View>

      {/* CATEGORY LIST WITH BLUE ACCENT (MATCHING BRAND THEME) */}
      <ScrollView
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {GEAR_CATEGORIES.map((cat) => {
          const selected = isChecked(cat.id);
          return (
            <Pressable
              key={cat.id}
              onPress={() => handleToggle(cat.id)}
              style={[
                styles.categoryRow,
                selected && styles.categoryRowActive,
                selected && isDark && styles.categoryRowActiveDark,
                isCollapsed && styles.categoryRowCollapsed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={cat.label}
              {...({ dataSet: { categorySidebarItem: 'true' } } as any)}
            >
              <View
                style={[
                  styles.iconBox,
                  isDark && styles.iconBoxDark,
                  selected && styles.iconBoxActive,
                  selected && isDark && styles.iconBoxActiveDark,
                ]}
                {...({ dataSet: { categorySidebarIcon: 'true' } } as any)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={15}
                  color={selected ? '#2563eb' : (isDark ? '#60a5fa' : '#2563eb')}
                />
              </View>

              {!isCollapsed && (
                <>
                  <Text
                    style={[
                      styles.categoryLabel,
                      isDark && styles.textLight,
                      selected && styles.categoryLabelActive,
                      selected && isDark && styles.categoryLabelActiveDark,
                    ]}
                    numberOfLines={1}
                    {...({ dataSet: { categorySidebarText: 'true' } } as any)}
                  >
                    {cat.label}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={selected ? '#2563eb' : (isDark ? '#64748b' : '#94a3b8')}
                    style={styles.chevron}
                    {...({ dataSet: { categorySidebarArrow: 'true' } } as any)}
                  />
                </>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function TabLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const pathname = usePathname();

  const isHomePage = Boolean(
    pathname === '/' ||
    pathname === '/(tabs)' ||
    pathname === '/(tabs)/index' ||
    pathname === '/index'
  );
  const showSidebar = isDesktop && isHomePage;

  const tabsContent = (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isDesktop ? { display: 'none' } : {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Phân loại',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );

  if (isDesktop) {
    return (
      <View style={[styles.layoutWrapper, !showSidebar && { backgroundColor: '#ffffff' }]}>
        {showSidebar && (
          <CategoryFilterSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        )}
        <View style={styles.mainContent}>
          {tabsContent}
        </View>
      </View>
    );
  }

  return tabsContent;
}

const styles = StyleSheet.create({
  layoutWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f8ff',
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    paddingTop: 16,
    paddingHorizontal: 8,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  sidebarDark: {
    backgroundColor: '#111827',
    borderRightColor: '#1f2937',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sidebarHeaderCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    borderBottomWidth: 0,
    marginBottom: 12,
    gap: 8,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeDark: {
    backgroundColor: '#1e3a8a30',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  clearBtnDark: {
    backgroundColor: '#1e3a8a30',
    borderColor: '#1e40af',
  },
  clearBtnText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
  },
  clearBtnTextDark: {
    color: '#60a5fa',
  },
  collapseBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapseBtnDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  categoryScroll: {
    flex: 1,
  },
  categoryScrollContent: {
    paddingBottom: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7.5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
    gap: 10,
  },
  categoryRowActive: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  categoryRowActiveDark: {
    backgroundColor: '#1e3a8a35',
    borderColor: '#1e40af',
  },
  categoryRowCollapsed: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    gap: 0,
    paddingVertical: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDark: {
    backgroundColor: '#172554',
    borderColor: '#1e3a8a',
  },
  iconBoxActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },
  iconBoxActiveDark: {
    backgroundColor: '#1e40af50',
    borderColor: '#3b82f6',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    letterSpacing: -0.2,
  },
  categoryLabelActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  categoryLabelActiveDark: {
    color: '#60a5fa',
  },
  chevron: {
    marginLeft: 'auto',
  },
  textLight: {
    color: '#f8fafc',
  },
});
