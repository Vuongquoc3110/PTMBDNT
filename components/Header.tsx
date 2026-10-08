import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Image,
    Platform,
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
  const { cartCount, user, wishlist, isDark, logout, isAdmin } = useAppContext();
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const blurTimeoutRef = useRef<any>(null);
  const accountWrapperRef = useRef<any>(null);

  // Close user menu on route changes
  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  // Click outside to close user dropdown on web
  useEffect(() => {
    if (!userMenuOpen) return;
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const handleDocumentClick = (e: any) => {
        if (accountWrapperRef.current && !accountWrapperRef.current.contains(e.target)) {
          setUserMenuOpen(false);
        }
      };
      const timer = setTimeout(() => {
        document.addEventListener('click', handleDocumentClick);
      }, 10);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleDocumentClick);
      };
    }
  }, [userMenuOpen]);

  const avatarLetter = (user?.name || user?.email || 'D').trim().charAt(0).toUpperCase();

  const displayName = user?.name
    ? user.name.trim().split(/\s+/)[0]
    : user?.email
    ? user.email.split('@')[0]
    : 'Tài khoản';

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    router.push('/(tabs)' as any);
  };

  const isHomeActive = pathname === '/' || pathname === '/(tabs)';
  const isWarrantyActive = pathname.startsWith('/warranty') || pathname.startsWith('/bao-hanh');
  const isPromosActive = pathname.includes('filter=sale');
  const isShowroomActive = pathname.startsWith('/showroom');
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
        <View style={StyleSheet.flatten([styles.navWrap, !isDesktop && { display: 'none' }])}>
          <Pressable
            style={StyleSheet.flatten([styles.navItem, isHomeActive && styles.navItemActive])}
            onPress={() => router.push('/(tabs)')}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Text
              style={StyleSheet.flatten([styles.navLink, isHomeActive && styles.navLinkActive])}
              {...({ dataSet: { navText: 'true' } } as any)}
            >
              Trang chủ
            </Text>
            {isHomeActive && <View style={styles.activeIndicator} />}
          </Pressable>

          <Pressable
            style={StyleSheet.flatten([styles.navItem, isShowroomActive && styles.navItemActive])}
            onPress={() => router.push('/showroom' as any)}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Text
              style={StyleSheet.flatten([styles.navLink, isShowroomActive && styles.navLinkActive])}
              {...({ dataSet: { navText: 'true' } } as any)}
            >
              Hệ thống Showroom
            </Text>
            {isShowroomActive && <View style={styles.activeIndicator} />}
          </Pressable>

          <Pressable
            style={StyleSheet.flatten([styles.navItem, isWarrantyActive && styles.navItemActive])}
            onPress={() => router.push('/warranty' as any)}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Text
              style={StyleSheet.flatten([styles.navLink, isWarrantyActive && styles.navLinkActive])}
              {...({ dataSet: { navText: 'true' } } as any)}
            >
              Bảo hành
            </Text>
            {isWarrantyActive && <View style={styles.activeIndicator} />}
          </Pressable>

          <Pressable
            style={StyleSheet.flatten([styles.navItem, isPromosActive && styles.navItemActive])}
            onPress={() => router.push({ pathname: '/products' as any, params: { filter: 'sale' } })}
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="flame" size={14} color={isPromosActive ? '#dc2626' : '#ea580c'} />
              <Text
                style={StyleSheet.flatten([styles.navLink, isPromosActive ? styles.navLinkActivePromo : { color: '#ea580c' }])}
                {...({ dataSet: { navText: 'true' } } as any)}
              >
                Khuyến mãi
              </Text>
            </View>
            {isPromosActive && <View style={StyleSheet.flatten([styles.activeIndicator, { backgroundColor: '#dc2626' }])} />}
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
            style={[styles.actionButton, !isDesktop && styles.actionButtonMobile]}
            onPress={() => router.push('/wishlist' as any)}
            accessibilityLabel="Danh sách yêu thích"
            {...({ dataSet: { navItem: 'true' } } as any)}
          >
            <Ionicons name="heart-outline" size={isDesktop ? 20 : 18} color="#334155" />
            {wishlist.length > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: '#e11d48' }]}>
                <Text style={styles.cartBadgeText}>{wishlist.length}</Text>
              </View>
            )}
          </Pressable>

          {/* CART BUTTON WITH BLUE PILL/BOX AND WHITE ICON */}
          <Pressable
            style={[styles.cartButton, !isDesktop && styles.cartButtonMobile]}
            onPress={() => router.push('/cart' as any)}
            accessibilityLabel="Giỏ hàng"
            {...({ dataSet: { accountBtn: 'true' } } as any)}
          >
            <Ionicons name="cart" size={isDesktop ? 20 : 18} color="#ffffff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>

          {/* USER ACCOUNT BUTTON & DROPDOWN */}
          <View
            ref={accountWrapperRef}
            style={styles.accountWrapper}
            {...({ dataSet: { accountWrapper: 'true' } } as any)}
          >
            <Pressable
              style={[
                styles.accountButton,
                !user && styles.loginButton,
                !isDesktop && styles.accountButtonMobile,
              ]}
              onPress={() => {
                if (!user) {
                  router.push('/login' as any);
                } else {
                  setUserMenuOpen((prev) => !prev);
                }
              }}
              accessibilityLabel={user ? `Tài khoản ${displayName}` : 'Đăng nhập'}
              {...({ dataSet: { accountBtn: 'true' } } as any)}
            >
              {user ? (
                <>
                  {user.avatar ? (
                    <Image source={{ uri: user.avatar }} style={[styles.accountAvatarImg, !isDesktop && styles.accountAvatarImgMobile]} />
                  ) : (
                    <View style={[styles.accountAvatarCircle, !isDesktop && styles.accountAvatarCircleMobile]}>
                      <Text style={[styles.accountAvatarText, !isDesktop && styles.accountAvatarTextMobile]}>{avatarLetter}</Text>
                    </View>
                  )}
                  {(!isDesktop && width < 420) ? null : (
                    <Text style={[styles.accountName, !isDesktop && styles.accountNameMobile]} numberOfLines={1}>
                      {displayName}
                    </Text>
                  )}
                  <Ionicons
                    name={userMenuOpen ? 'chevron-up' : 'chevron-down'}
                    size={isDesktop ? 14 : 12}
                    color="#ffffff"
                  />
                </>
              ) : (
                <>
                  <Ionicons name="person-outline" size={isDesktop ? 18 : 16} color="#ffffff" />
                  {isDesktop && <Text style={styles.loginText}>Đăng nhập</Text>}
                </>
              )}
            </Pressable>

            {/* BACKDROP OVERLAY FOR CLOSING DROPDOWN */}
            {userMenuOpen && (
              <Pressable
                style={[
                  styles.dropdownBackdrop,
                  Platform.OS === 'web'
                    ? ({ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 } as any)
                    : { position: 'absolute', top: -1000, bottom: -1000, left: -1000, right: -1000 },
                ]}
                onPress={() => setUserMenuOpen(false)}
              />
            )}

            {/* DROPDOWN MENU CARD */}
            {userMenuOpen && user && (
              <View style={[styles.userDropdown, isDark && styles.userDropdownDark]}>
                <View style={styles.userDropdownHeader}>
                  <Text style={[styles.dropdownUserName, isDark && styles.textLight]} numberOfLines={1}>
                    {user.name || 'Người dùng'}
                  </Text>
                  <Text style={styles.dropdownUserEmail} numberOfLines={1}>
                    {user.email || ''}
                  </Text>
                </View>

                <View style={[styles.dropdownDivider, isDark && styles.dropdownDividerDark]} />

                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    setUserMenuOpen(false);
                    router.push('/(tabs)/user' as any);
                  }}
                  {...({ dataSet: { userMenuItem: 'true' } } as any)}
                >
                  <Ionicons name="person-outline" size={18} color={isDark ? '#cbd5e1' : '#334155'} />
                  <Text style={[styles.dropdownItemText, isDark && styles.textLight]}>
                    Tài khoản của tôi
                  </Text>
                </Pressable>

                {!isAdmin ? (
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUserMenuOpen(false);
                      router.push('/(tabs)/explore' as any);
                    }}
                    {...({ dataSet: { userMenuItem: 'true' } } as any)}
                  >
                    <Ionicons name="bag-handle-outline" size={18} color={isDark ? '#cbd5e1' : '#334155'} />
                    <Text style={[styles.dropdownItemText, isDark && styles.textLight]}>
                      Đơn hàng của tôi
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUserMenuOpen(false);
                      router.push('/admin' as any);
                    }}
                    {...({ dataSet: { userMenuItem: 'true' } } as any)}
                  >
                    <Ionicons name="construct-outline" size={18} color="#dc2626" />
                    <Text style={[styles.dropdownItemText, { color: '#dc2626', fontWeight: '800' }]}>
                      Bảng Quản trị viên (Admin)
                    </Text>
                  </Pressable>
                )}

                <View style={[styles.dropdownDivider, isDark && styles.dropdownDividerDark]} />

                <Pressable
                  style={styles.dropdownItem}
                  onPress={handleLogout}
                  {...({ dataSet: { userMenuItem: 'true' } } as any)}
                >
                  <Ionicons name="exit-outline" size={18} color={isDark ? '#94a3b8' : '#475569'} />
                  <Text style={[styles.dropdownItemText, isDark && styles.textLight]}>
                    Đăng xuất
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
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
    outlineStyle: 'none',
    outlineWidth: 0,
    borderWidth: 0,
  } as any,
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
    gap: 8,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1002,
  },
  actionRowMobile: {
    gap: 6,
    position: 'absolute',
    top: 10,
    right: 12,
    alignItems: 'center',
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
  cartButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1d4ed8',
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  cartButtonMobile: {
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
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  accountWrapper: {
    position: 'relative',
    zIndex: 1003,
  },
  accountButton: {
    height: 40,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1d4ed8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  accountButtonMobile: {
    height: 34,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 6,
  },
  loginButton: {
    paddingHorizontal: 12,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  accountAvatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountAvatarCircleMobile: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  accountAvatarText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '800',
  },
  accountAvatarTextMobile: {
    fontSize: 11,
  },
  accountAvatarImg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  accountAvatarImgMobile: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  accountName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    maxWidth: 90,
  },
  accountNameMobile: {
    fontSize: 12,
    maxWidth: 60,
  },
  userDropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 240,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 14,
    zIndex: 9999,
  },
  userDropdownDark: {
    backgroundColor: '#18181b',
    borderColor: '#27272a',
  },
  userDropdownHeader: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
  },
  dropdownUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  dropdownUserEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  dropdownDividerDark: {
    backgroundColor: '#27272a',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  textLight: {
    color: '#f8fafc',
  },
  dropdownBackdrop: {
    backgroundColor: 'transparent',
    zIndex: 9998,
  },
});
