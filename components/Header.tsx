import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    useWindowDimensions,
} from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { formatPrice } from '@/data/products';
import { apiService, type Product } from '@/services/api';

const POPULAR_SEARCHES = ['Laptop Gaming', 'RTX 4090', 'RAM DDR5', 'Màn hình 4K', 'MacBook', 'Bàn phím cơ'];

export function Header() {
  const { cartCount, user, wishlist, isDark, toggleTheme } = useAppContext();
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const blurTimeoutRef = useRef<any>(null);

  const isHomeActive = pathname === '/' || pathname === '/(tabs)';
  const isCategoriesActive = pathname.includes('categories');
  const isPromosActive = pathname.includes('filter=sale');
  const isProductsActive = pathname.startsWith('/products') && !isPromosActive;

  useEffect(() => {
    const q = search.trim();
    if (!q) {
      setMatchingProducts([]);
      return;
    }
    const timer = setTimeout(() => {
      apiService.getProducts({ q, limit: 5 }).then((res) => {
        setMatchingProducts(res.slice(0, 5));
      }).catch(() => setMatchingProducts([]));
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearchSubmit = (query?: string) => {
    const target = (query !== undefined ? query : search).trim();
    setIsFocused(false);
    if (!target) {
      router.push('/products' as any);
      return;
    }
    router.push({
      pathname: '/products' as any,
      params: { q: target },
    });
  };

  const handleSelectProduct = (id: string) => {
    setIsFocused(false);
    router.push({
      pathname: '/products/[id]' as any,
      params: { id },
    });
  };

  const handleSelectKeyword = (keyword: string) => {
    setSearch(keyword);
    handleSearchSubmit(keyword);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark, !isDesktop && styles.containerMobile]}>
      <View style={[styles.inner, !isDesktop && styles.innerMobile]}>
        {/* BRAND LOGO FOR DESKTOP & MOBILE */}
        <Pressable style={[styles.brandContainer, !isDesktop && styles.brandContainerMobile]} onPress={() => router.push('/(tabs)')}>
          <View style={[styles.brandBadge, !isDesktop && styles.brandBadgeMobile]}>
            <Ionicons name="hardware-chip" size={isDesktop ? 18 : 16} color="#ffffff" />
          </View>
          <View>
            <Text style={[styles.brandTitle, !isDesktop && styles.brandTitleMobile]}>
              DANGVINH<Text style={styles.brandTitleHighlight}>PC</Text>
            </Text>
            {isDesktop && <Text style={styles.brandSub}>Hi-End Store</Text>}
          </View>
        </Pressable>

        {/* NAVIGATION LINKS WITH ACTIVE STATE & INTERACTION */}
        <View style={[styles.navWrap, !isDesktop && { display: 'none' }]}>
          <Pressable
            style={[styles.navItem, isHomeActive && styles.navItemActive]}
            onPress={() => router.push('/(tabs)')}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Text
              style={[styles.navLink, isHomeActive && styles.navLinkActive]}
              {...({ dataSet: { navText: 'true' } } as any)}
            >
              Trang chủ
            </Text>
            {isHomeActive && <View style={styles.activeIndicator} />}
          </Pressable>

          <Pressable
            style={[styles.navItem, isProductsActive && styles.navItemActive]}
            onPress={() => router.push('/products' as any)}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Text
              style={[styles.navLink, isProductsActive && styles.navLinkActive]}
              {...({ dataSet: { navText: 'true' } } as any)}
            >
              Sản phẩm
            </Text>
            {isProductsActive && <View style={styles.activeIndicator} />}
          </Pressable>

          <Pressable
            style={[styles.navItem, isCategoriesActive && styles.navItemActive]}
            onPress={() => router.push('/categories' as any)}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Text
              style={[styles.navLink, isCategoriesActive && styles.navLinkActive]}
              {...({ dataSet: { navText: 'true' } } as any)}
            >
              Danh mục
            </Text>
            {isCategoriesActive && <View style={styles.activeIndicator} />}
          </Pressable>

          <Pressable
            style={[styles.navItem, isPromosActive && styles.navItemActive]}
            onPress={() => router.push({ pathname: '/products' as any, params: { filter: 'sale' } })}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="flame" size={14} color={isPromosActive ? '#dc2626' : '#ea580c'} />
              <Text
                style={[styles.navLink, isPromosActive ? styles.navLinkActivePromo : { color: '#ea580c' }]}
                {...({ dataSet: { navText: 'true' } } as any)}
              >
                Khuyến mãi
              </Text>
            </View>
            {isPromosActive && <View style={[styles.activeIndicator, { backgroundColor: '#dc2626' }]} />}
          </Pressable>
        </View>

        {/* SEARCH BAR CONTAINER WITH AUTOCOMPLETE DROPDOWN */}
        <View style={[styles.searchContainer, !isDesktop && styles.searchContainerMobile]}>
          <View style={[styles.searchWrap, !isDesktop && styles.searchWrapMobile, isFocused && styles.searchWrapFocused]}>
            <Pressable onPress={() => handleSearchSubmit()} hitSlop={8}>
              <Ionicons name="search-outline" size={18} color={isFocused ? '#2563eb' : '#94a3b8'} style={styles.searchIcon} />
            </Pressable>
            <TextInput
              placeholder="Tìm kiếm sản phẩm, CPU, laptop..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              onFocus={() => {
                if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                setIsFocused(true);
              }}
              onBlur={() => {
                // Give user enough time to click suggestion items before closing
                blurTimeoutRef.current = setTimeout(() => {
                  setIsFocused(false);
                }, 220);
              }}
              onSubmitEditing={() => handleSearchSubmit()}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </Pressable>
            )}
          </View>

          {/* AUTOCOMPLETE POPUP DROPDOWN */}
          {isFocused && (
            <View style={styles.dropdown}>
              {search.trim().length > 0 ? (
                // WHEN TYPING: SHOW MATCHING PRODUCTS
                <View>
                  <View style={styles.dropdownHeader}>
                    <Text style={styles.dropdownTitle}>
                      {matchingProducts.length > 0
                        ? `Gợi ý sản phẩm (${matchingProducts.length})`
                        : 'Không có kết quả'}
                    </Text>
                  </View>

                  {matchingProducts.map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectProduct(item.id)}
                    >
                      <Image source={{ uri: item.image }} style={styles.suggestionImg} />
                      <View style={styles.suggestionInfo}>
                        <Text style={styles.suggestionCategory}>{item.category}</Text>
                        <Text style={styles.suggestionName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.suggestionPrice}>{formatPrice(item.price)}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                    </Pressable>
                  ))}

                  {matchingProducts.length === 0 && (
                    <View style={styles.emptySuggestion}>
                      <Ionicons name="alert-circle-outline" size={24} color="#94a3b8" />
                      <Text style={styles.emptySuggestionText}>
                        Không tìm thấy sản phẩm nào khớp với "{search}"
                      </Text>
                    </View>
                  )}

                  <Pressable
                    style={styles.viewAllBtn}
                    onPress={() => handleSearchSubmit()}
                  >
                    <Text style={styles.viewAllBtnText}>
                      Xem tất cả kết quả cho "{search.trim()}" →
                    </Text>
                  </Pressable>
                </View>
              ) : (
                // WHEN FOCUSED BUT EMPTY: SHOW POPULAR SEARCH CHIPS
                <View>
                  <View style={styles.dropdownHeader}>
                    <Ionicons name="flame" size={16} color="#ea580c" style={{ marginRight: 6 }} />
                    <Text style={styles.dropdownTitle}>Tìm kiếm phổ biến</Text>
                  </View>
                  <View style={styles.chipsWrap}>
                    {POPULAR_SEARCHES.map((keyword) => (
                      <Pressable
                        key={keyword}
                        style={styles.searchChip}
                        onPress={() => handleSelectKeyword(keyword)}
                      >
                        <Ionicons name="trending-up-outline" size={13} color="#2563eb" style={{ marginRight: 4 }} />
                        <Text style={styles.searchChipText}>{keyword}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={[styles.actionRow, !isDesktop && styles.actionRowMobile]}>
          <Pressable
            style={[styles.actionButton, isDark && styles.actionButtonDark, !isDesktop && styles.actionButtonMobile]}
            onPress={toggleTheme}
            accessibilityLabel={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={isDark ? '#fbbf24' : '#334155'} />
          </Pressable>

          <Pressable
            style={[styles.actionButton, !isDesktop && styles.actionButtonMobile]}
            onPress={() => router.push('/wishlist' as any)}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Ionicons name="heart-outline" size={20} color="#334155" />
            {wishlist.length > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: '#e11d48' }]}>
                <Text style={styles.cartBadgeText}>{wishlist.length}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/cart' as any)}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Ionicons name="cart-outline" size={20} color="#334155" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push(user ? ('/(tabs)/user' as any) : ('/login' as any))}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={{ width: 26, height: 26, borderRadius: 13 }} />
            ) : (
              <Ionicons name={user ? "person" : "person-outline"} size={20} color={user ? "#2563eb" : "#334155"} />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1000,
  },
  containerDark: {
    backgroundColor: '#111827',
    borderBottomColor: '#263449',
  },
  containerMobile: {
    shadowRadius: 4,
  },
  inner: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  innerMobile: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 8,
    flexWrap: 'wrap',
    position: 'relative',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
    paddingRight: 8,
  },
  brandContainerMobile: {
    gap: 6,
    paddingRight: 4,
  },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  brandBadgeMobile: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  brandTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandTitleMobile: {
    fontSize: 15,
  },
  brandTitleHighlight: {
    color: '#2563eb',
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
    marginTop: -2,
  },
  navWrap: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
  },
  navLink: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  navLinkActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  navLinkActivePromo: {
    color: '#dc2626',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    left: 12,
    right: 12,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#2563eb',
  },
  searchContainer: {
    position: 'relative',
    zIndex: 1001,
  },
  searchContainerMobile: {
    flexBasis: '100%',
    width: '100%',
    marginTop: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dfeafc',
    paddingHorizontal: 12,
    minWidth: 260,
    height: 42,
  },
  searchWrapMobile: {
    minWidth: 0,
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchWrapFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
    shadowColor: '#2563eb',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    minWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    padding: 12,
    zIndex: 9999,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dropdownTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 10,
    backgroundColor: '#ffffff',
    marginBottom: 2,
  },
  suggestionImg: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  suggestionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 2,
  },
  suggestionPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 2,
  },
  emptySuggestion: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptySuggestionText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  viewAllBtn: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  viewAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 4,
  },
  searchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  searchChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionRowMobile: {
    gap: 6,
    position: 'absolute',
    top: 10,
    right: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dfeafc',
  },
  actionButtonDark: {
    backgroundColor: '#1f2937',
    borderColor: '#334155',
  },
  actionButtonMobile: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
});
