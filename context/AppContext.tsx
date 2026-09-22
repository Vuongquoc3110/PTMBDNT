import { apiService, type OrderItem, type User } from '@/services/api';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

export interface CartItem {
  id: string;
  name: string;
  spec?: string;
  price: number;
  oldPrice?: number;
  qty: number;
  image: string;
  category?: string;
  selected: boolean;
}

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: Record<string, any>) => Promise<any>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;

  cartItems: CartItem[];
  addToCart: (product: any, qty?: number, config?: string) => boolean;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleSelectCartItem: (id: string) => void;
  toggleSelectAllCart: (select: boolean) => void;
  cartCount: number;
  cartTotal: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'promart_user',
  CART: 'promart_cart',
  WISHLIST: 'promart_wishlist',
};

const DEFAULT_USER: User = {
  id: 1,
  email: 'nguyenvana@gmail.com',
  name: 'Nguyễn Văn A',
  role: 'customer',
  phone: '0909 123 456',
  address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1',
  city: 'TP. Hồ Chí Minh',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
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
        productId: c.id,
        name: c.name,
        price: c.price,
        quantity: c.qty,
        image: c.image,
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

  const logout = () => {
    setUser(null);
    setCartItems([]);
    setWishlist([]);
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

  const addToCart = (product: any, qty = 1, config?: string): boolean => {
    if (!user) {
      return false;
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        spec: config || (Array.isArray(product.features) ? product.features.slice(0, 3).join(' • ') : product.description?.slice(0, 60)),
        price: product.price,
        oldPrice: product.oldPrice,
        qty: qty,
        image: product.image || (product.images && product.images[0]) || '',
        category: product.category,
        selected: true,
      };
      return [newItem, ...prev];
    });
    return true;
  };

  const updateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.qty + delta);
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

  const isAdmin = Boolean(
    user && (user.role === 'admin' || user.email === 'admin@promart.vn')
  );

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
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
        wishlist,
        toggleWishlist,
        isWishlisted,
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
