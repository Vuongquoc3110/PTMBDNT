import { apiService, type OrderItem, type User } from '@/services/api';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

export interface CartItem {
  id: string;
  name: string;
  spec?: string;
  price: number;
  oldPrice?: number;
  qty: number;
  stock?: number;
  image: string;
  category?: string;
  selected: boolean;
}

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  isStaff: boolean;
  canManage: boolean;
  themeMode: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: Record<string, any>) => Promise<any>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;

  cartItems: CartItem[];
  addToCart: (product: any, qty?: number, config?: string, customPrice?: number) => boolean;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleSelectCartItem: (id: string) => void;
  toggleSelectAllCart: (select: boolean) => void;
  cartCount: number;
  cartTotal: number;
  appliedVoucher: { code: string; discount: number; minOrder?: number; label?: string } | null;
  setAppliedVoucher: React.Dispatch<React.SetStateAction<{ code: string; discount: number; minOrder?: number; label?: string } | null>>;
  usedVouchers: string[];
  markVoucherAsUsed: (code: string) => Promise<void>;
  refreshUsedVouchers: () => Promise<void>;

  wishlist: string[];
  toggleWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;

  selectedCategories: string[];
  toggleCategoryFilter: (category: string) => void;
  clearCategoryFilter: () => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'promart_user',
  CART: 'promart_cart',
  WISHLIST: 'promart_wishlist',
  THEME: 'promart_theme',
};

const DEFAULT_USER: User = {
  id: 1,
  email: 'nguyenvana@gmail.com',
  name: 'Nguyễn Văn A',
  role: 'customer',
  phone: '0909 123 456',
  address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1',
  city: 'TP. Hồ Chí Minh',
  avatar: '',
};

const INITIAL_CART: CartItem[] = [
  {
    id: 'lap-001',
    name: 'Pro Gaming Laptop X15',
    spec: 'Intel Core i7-13700H • RTX 4070 8GB • 32GB RAM • 1TB SSD',
    price: 18990000,
    oldPrice: 20990000,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    category: 'Laptop',
    selected: true,
  },
  {
    id: 'ram-001',
    name: 'Corsair Vengeance RGB Pro 32GB DDR5',
    spec: 'DDR5 5600MHz • Dual Channel 2x16GB • Dynamic RGB',
    price: 3990000,
    oldPrice: 4490000,
    qty: 2,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
    category: 'RAM',
    selected: true,
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return null;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        const saved = localStorage.getItem(STORAGE_KEYS.CART);
        if (saved) {
          try { return JSON.parse(saved); } catch {}
        }
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        if (saved) {
          try { return JSON.parse(saved); } catch {}
        }
      }
    }
    return [];
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    }
    return 'light';
  });

  const isDark = themeMode === 'dark';

  const toggleTheme = () => {
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  // Sync to localStorage
  useEffect(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.CART);
        localStorage.removeItem(STORAGE_KEYS.WISHLIST);
        setCartItems([]);
        setWishlist([]);
      }
    } else if (!user) {
      setCartItems([]);
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    }
    // Also sync to backend API if user is logged in
    if (user?.id) {
      const orderItems: OrderItem[] = cartItems.map((c) => ({
        productId: c.id.split('::')[0],
        name: c.name,
        price: c.price,
        quantity: c.qty,
        image: c.image,
        selectedConfig: c.spec,
      }));
      apiService.updateCart(user.id, {
        items: orderItems,
        totalItems: cartItems.reduce((s, i) => s + i.qty, 0),
        totalPrice: cartItems.reduce((s, i) => s + i.price * i.qty, 0),
      }).catch(() => {});
    }
  }, [cartItems, user?.id]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined' && typeof document !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
      document.documentElement.dataset.appTheme = themeMode;
      document.body.style.backgroundColor = themeMode === 'dark' ? '#0b1120' : '#ffffff';
    }
  }, [themeMode]);

  // Sync initial cart & wishlist from backend on mount if available
  useEffect(() => {
    if (user?.id) {
      apiService.getCart(user.id).then((data) => {
        if (data?.items && data.items.length > 0) {
          setCartItems(data.items.map((it) => ({
            id: it.productId,
            name: it.name,
            price: it.price,
            qty: it.quantity,
            image: it.image || '',
            selected: true,
          })));
        }
      }).catch(() => {});

      apiService.getWishlist(user.id).then((items) => {
        if (items && items.length > 0) {
          setWishlist(items.map((i) => i.id));
        }
      }).catch(() => {});
    }
  }, [user?.id]);

  const login = async (email: string, pass: string) => {
    const loggedUser = await apiService.loginUser(email, pass);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (data: Record<string, any>) => {
    const res = await apiService.registerUser(data);
    return res;
  };

  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; minOrder?: number; label?: string } | null>(null);
  const [usedVouchers, setUsedVouchers] = useState<string[]>([]);

  const refreshUsedVouchers = useCallback(async () => {
    if (user?.id) {
      try {
        const used = await apiService.getUsedVouchers(user.id);
        setUsedVouchers(used.map((c) => c.toUpperCase()));
      } catch {
        setUsedVouchers([]);
      }
    } else {
      setUsedVouchers([]);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshUsedVouchers();
  }, [refreshUsedVouchers]);

  const markVoucherAsUsed = async (code: string) => {
    const clean = code.trim().toUpperCase();
    setUsedVouchers((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
    if (appliedVoucher?.code.toUpperCase() === clean) {
      setAppliedVoucher(null);
    }
    if (user?.id) {
      try {
        await apiService.useVoucher(user.id, clean);
      } catch {}
    }
  };

  const logout = () => {
    setUser(null);
    setCartItems([]);
    setWishlist([]);
    setAppliedVoucher(null);
    setUsedVouchers([]);
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    const res = await apiService.updateUser(user.id, data);
    setUser((prev) => (prev ? { ...prev, ...data, ...(res.user || {}) } : null));
  };

  const addToCart = (product: any, qty = 1, config?: string, customPrice?: number): boolean => {
    if (!user) {
      return false;
    }
    const availableStock = product.stock !== undefined ? product.stock : 999;
    if (availableStock <= 0) {
      return false;
    }

    const itemPrice = typeof customPrice === 'number' && customPrice > 0 ? customPrice : product.price;
    const itemOldPrice =
      product.oldPrice && typeof customPrice === 'number' && customPrice > product.price
        ? product.oldPrice + (customPrice - product.price)
        : product.oldPrice;

    const cartItemId = config ? `${product.id}::${config}` : product.id;

    let success = true;
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === cartItemId || (item.id === product.id && item.spec === config)
      );
      if (existing) {
        const newQty = existing.qty + qty;
        if (newQty > availableStock) {
          success = false;
          return prev;
        }
        return prev.map((item) =>
          item.id === cartItemId || (item.id === product.id && item.spec === config)
            ? { ...item, qty: newQty, stock: availableStock, price: itemPrice }
            : item
        );
      }
      if (qty > availableStock) {
        success = false;
        return prev;
      }
      const newItem: CartItem = {
        id: cartItemId,
        name: product.name,
        spec: config || (Array.isArray(product.features) ? product.features.slice(0, 3).join(' • ') : product.description?.slice(0, 60)),
        price: itemPrice,
        oldPrice: itemOldPrice,
        qty: qty,
        stock: availableStock,
        image: product.image || (product.images && product.images[0]) || '',
        category: product.category,
        selected: true,
      };
      return [newItem, ...prev];
    });
    return success;
  };

  const updateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const maxStock = item.stock !== undefined ? item.stock : 999;
            const newQty = Math.min(maxStock, Math.max(1, item.qty + delta));
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    if (user?.id) {
      apiService.clearCart(user.id).catch(() => {});
    }
  };

  const toggleSelectCartItem = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleSelectAllCart = (select: boolean) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  const toggleWishlist = (productId: string): boolean => {
    if (!user) {
      return false;
    }
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        if (user?.id) apiService.removeFromWishlist(user.id, productId).catch(() => {});
        return prev.filter((id) => id !== productId);
      } else {
        if (user?.id) apiService.addToWishlist(user.id, productId).catch(() => {});
        return [...prev, productId];
      }
    });
    return true;
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  const isAdmin = Boolean(user && user.role === 'admin');
  const isStaff = Boolean(user && user.role === 'staff');
  const canManage = Boolean(user && (user.role === 'admin' || user.role === 'staff'));

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategoryFilter = (category: string) => {
    const norm = category.trim().toLowerCase().replace(/[\s_-]+/g, '');
    setSelectedCategories((prev) =>
      prev.some((c) => c.trim().toLowerCase().replace(/[\s_-]+/g, '') === norm)
        ? prev.filter((c) => c.trim().toLowerCase().replace(/[\s_-]+/g, '') !== norm)
        : [...prev, category]
    );
  };

  const clearCategoryFilter = () => {
    setSelectedCategories([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        isStaff,
        canManage,
        themeMode,
        isDark,
        toggleTheme,
        login,
        register,
        logout,
        updateUserProfile,
        cartItems,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleSelectCartItem,
        toggleSelectAllCart,
        cartCount,
        cartTotal,
        appliedVoucher,
        setAppliedVoucher,
        usedVouchers,
        markVoucherAsUsed,
        refreshUsedVouchers,
        wishlist,
        toggleWishlist,
        isWishlisted,
        selectedCategories,
        toggleCategoryFilter,
        clearCategoryFilter,
        setSelectedCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
