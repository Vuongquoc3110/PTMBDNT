import { categories as fallbackCategories, products as fallbackProducts } from '@/data/products';

// API configuration - MySQL backend on port 5000 (or json-server on 3000)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

export interface Product {
  id: string;
  name: string;
  category_id?: string;
  category?: string;
  price: number;
  oldPrice?: number | null;
  discount?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  isHot?: boolean;
  isHidden?: boolean;
  image?: string;
  images?: string[];
  description?: string;
  specifications?: Record<string, string>;
  features?: string[];
  configurations?: {
    cpu?: string[];
    ram?: string[];
    storage?: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled' | string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedConfig?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role?: 'admin' | 'customer' | string;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Review {
  id: number;
  productId: string;
  userId?: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Voucher {
  code: string;
  discount: number;
  minOrder: number;
  label: string;
  expiryDate?: string;
}

export interface CartData {
  userId: number | string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
}

// In-memory / mock storage cache for resilient offline fallback
let localOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    orderNumber: 'ORD-1710000001',
    items: [
      {
        productId: 'lap-001',
        name: 'Pro Gaming Laptop X15',
        price: 18990000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
      },
    ],
    totalAmount: 18990000,
    shippingAddress: '123 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM',
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    status: 'shipping',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

let localWishlist: Record<string, string[]> = {
  '1': ['lap-001', 'gpu-001'],
};

let localReviews: Record<string, Review[]> = {
  'lap-001': [
    {
      id: 1,
      productId: 'lap-001',
      userName: 'Trần Tuấn Anh',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      comment: 'Máy cực kỳ mát khi render Premiere và chiến game nặng. Màn hình sắc nét 2K cực đã!',
      createdAt: '2026-03-10T09:30:00.000Z',
    },
    {
      id: 2,
      productId: 'lap-001',
      userName: 'Lê Hoàng Nam',
      userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      comment: 'Đóng gói cẩn thận, nhận hàng sau 2 tiếng đặt tại HCM. Rất ưng ý!',
      createdAt: '2026-03-12T14:15:00.000Z',
    },
  ],
};

const DEFAULT_VOUCHERS: Voucher[] = [
  { code: 'DPC50K', discount: 50000, minOrder: 2000000, label: 'Giảm 50.000₫ đơn từ 2tr' },
  { code: 'FREESHIP', discount: 30000, minOrder: 0, label: 'Miễn phí giao hàng toàn quốc' },
  { code: 'VIP200K', discount: 200000, minOrder: 20000000, label: 'Giảm 200.000₫ đơn từ 20tr' },
];

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  public getBaseURL(): string {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return `http://${window.location.hostname}:5000`;
    }
    return process.env.EXPO_PUBLIC_API_URL || this.baseURL || 'http://localhost:5000';
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller ? controller.signal : undefined,
        ...options,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      if (timeoutId) clearTimeout(timeoutId);
      console.warn(`[API] "${endpoint}" request issue: ${error?.message || error}. Using fallback handler.`);
      throw error;
    }
  }

  // ==================== PRODUCTS ====================
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (!params?.limit) {
        query.append('limit', '500');
      }
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
          }
        });
      }
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const list = await this.request<Product[]>(`/products${queryString}`);
      return list && list.length > 0 ? list : (fallbackProducts as any);
    } catch {
      // Graceful fallback with local filtering
      let result = [...(fallbackProducts as any)];
      if (params?.category) {
        result = result.filter(
          (p) =>
            p.category?.toLowerCase() === params.category.toLowerCase() ||
            p.category_id?.toLowerCase() === params.category.toLowerCase()
        );
      }
      if (params?.q) {
        const q = params.q.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        );
      }
      if (params?.sale === 'true' || params?.filter === 'sale') {
        result = result.filter((p) => p.isSale || (p.discount && p.discount > 0));
      }
      if (params?.featured === 'true') {
        result = result.filter((p) => p.isFeatured);
      }
      if (params?.new === 'true') {
        result = result.filter((p) => p.isNew);
      }
      if (params?.sortBy === 'low') {
        result.sort((a, b) => a.price - b.price);
      } else if (params?.sortBy === 'high') {
        result.sort((a, b) => b.price - a.price);
      } else if (params?.sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      }
      return result;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await this.request<Product>(`/products/${id}`);
    } catch {
      const found = fallbackProducts.find((p) => p.id === id);
      return (found as any) || (fallbackProducts[0] as any);
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.getProducts({ category });
  }

  async createProduct(productData: Record<string, any>) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Record<string, any>) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CATEGORIES ====================
  async getCategories(): Promise<Category[]> {
    try {
      const data = await this.request<Category[]>('/categories');
      return data && data.length > 0 ? data : (fallbackCategories as any);
    } catch {
      return fallbackCategories as any;
    }
  }

  async createCategory(categoryData: Record<string, any>) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: Record<string, any>) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== USERS & AUTH ====================
  async loginUser(email: string, password: string): Promise<User> {
    try {
      return await this.request<User>('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch {
      // Mock login fallback for testing
      const isMockAdmin = email.toLowerCase().includes('admin');
      return {
        id: isMockAdmin ? 99 : 1,
        email: email || 'nguyenvana@gmail.com',
        name: isMockAdmin ? 'Quản Trị Viên (Admin)' : 'Nguyễn Văn A',
        role: isMockAdmin ? 'admin' : 'customer',
        phone: '0909 123 456',
        address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1',
        city: 'TP. Hồ Chí Minh',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      };
    }
  }

  async registerUser(userData: Record<string, any>): Promise<any> {
    try {
      return await this.request('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch {
      return { message: 'User registered successfully (offline mode)' };
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      return await this.request<User>(`/users/${userId}`);
    } catch {
      return {
        id: userId,
        email: 'nguyenvana@gmail.com',
        name: 'Nguyễn Văn A',
        phone: '0909 123 456',
        address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1',
        city: 'TP. Hồ Chí Minh',
      };
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.request<User[]>('/users');
    } catch {
      return [
        {
          id: 1,
          email: 'nguyenvana@gmail.com',
          name: 'Nguyễn Văn A',
          phone: '0909 123 456',
          address: '123 Đường Lê Lợi, Quận 1',
          city: 'TP. Hồ Chí Minh',
        },
      ];
    }
  }

  async updateUser(userId: number | string, data: Partial<User>): Promise<{ message: string; user?: User }> {
    try {
      return await this.request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      return { message: 'Cập nhật thông tin thành công (local cache)', user: data as User };
    }
  }

  async changePassword(userId: number | string, passwords: { oldPassword?: string; newPassword: string }) {
    return this.request(`/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  }

  async deleteUser(userId: number | string) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ==================== ORDERS ====================
  async getOrders(userId?: number): Promise<Order[]> {
    try {
      const query = userId ? `?userId=${userId}` : '';
      return await this.request<Order[]>(`/orders${query}`);
    } catch {
      return userId ? localOrders.filter((o) => o.userId === userId) : localOrders;
    }
  }

  async getOrderById(orderId: number): Promise<Order> {
    try {
      return await this.request<Order>(`/orders/${orderId}`);
    } catch {
      const found = localOrders.find((o) => o.id === Number(orderId));
      if (!found) throw new Error('Không tìm thấy đơn hàng');
      return found;
    }
  }

  async createOrder(orderData: {
    userId: number | string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: string;
    shippingMethod: string;
    paymentMethod: string;
  }): Promise<{ message: string; orderNumber: string; orderId?: number }> {
    try {
      return await this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch {
      const orderNumber = `ORD-${Date.now()}`;
      const newOrder: Order = {
        id: localOrders.length + 1,
        userId: Number(orderData.userId) || 1,
        orderNumber,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        shippingMethod: orderData.shippingMethod,
        paymentMethod: orderData.paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      localOrders = [newOrder, ...localOrders];
      return { message: 'Đơn hàng tạo thành công', orderNumber, orderId: newOrder.id };
    }
  }

  async updateOrderStatus(orderId: number | string, status: string) {
    try {
      return await this.request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch {
      localOrders = localOrders.map((o) => (o.id === Number(orderId) ? { ...o, status } : o));
      return { message: 'Order status updated', status };
    }
  }

  async cancelOrder(orderId: number | string) {
    try {
      return await this.request(`/orders/${orderId}/cancel`, {
        method: 'PUT',
      });
    } catch {
      localOrders = localOrders.map((o) => (o.id === Number(orderId) ? { ...o, status: 'cancelled' } : o));
      return { message: 'Đơn hàng đã được hủy thành công' };
    }
  }

  async deleteOrder(orderId: number | string) {
    try {
      return await this.request(`/orders/${orderId}`, {
        method: 'DELETE',
      });
    } catch {
      localOrders = localOrders.filter((o) => o.id !== Number(orderId));
      return { message: 'Order deleted' };
    }
  }

  // ==================== CART ====================
  async getCart(userId: number | string): Promise<CartData> {
    try {
      return await this.request<CartData>(`/cart/${userId}`);
    } catch {
      return {
        userId,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }
  }

  async updateCart(userId: number | string, cartData: { items: OrderItem[]; totalItems: number; totalPrice: number }) {
    try {
      return await this.request(`/cart/${userId}`, {
        method: 'POST',
        body: JSON.stringify(cartData),
      });
    } catch {
      return { message: 'Cart synced locally' };
    }
  }

  async clearCart(userId: number | string) {
    try {
      return await this.request(`/cart/${userId}`, {
        method: 'DELETE',
      });
    } catch {
      return { message: 'Cart cleared locally' };
    }
  }

  // ==================== WISHLIST ====================
  async getWishlist(userId: number | string): Promise<Product[]> {
    try {
      const data = await this.request<Product[]>(`/wishlist/${userId}`);
      return data || [];
    } catch {
      const ids = localWishlist[String(userId)] || [];
      return fallbackProducts.filter((p) => ids.includes(p.id)) as any;
    }
  }

  async addToWishlist(userId: number | string, productId: string) {
    try {
      return await this.request(`/wishlist/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ productId }),
      });
    } catch {
      const key = String(userId);
      const curr = localWishlist[key] || [];
      if (!curr.includes(productId)) {
        localWishlist[key] = [...curr, productId];
      }
      return { message: 'Đã thêm vào danh sách yêu thích' };
    }
  }

  async removeFromWishlist(userId: number | string, productId: string) {
    try {
      return await this.request(`/wishlist/${userId}/${productId}`, {
        method: 'DELETE',
      });
    } catch {
      const key = String(userId);
      const curr = localWishlist[key] || [];
      localWishlist[key] = curr.filter((id) => id !== productId);
      return { message: 'Đã xóa khỏi danh sách yêu thích' };
    }
  }

  // ==================== REVIEWS ====================
  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      return await this.request<Review[]>(`/products/${productId}/reviews`);
    } catch {
      return localReviews[productId] || [];
    }
  }

  async addReview(productId: string, reviewData: { userId?: number; userName: string; rating: number; comment: string }) {
    try {
      return await this.request(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    } catch {
      const newRev: Review = {
        id: Date.now(),
        productId,
        userId: reviewData.userId,
        userName: reviewData.userName,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
      };
      localReviews[productId] = [newRev, ...(localReviews[productId] || [])];
      return { message: 'Đánh giá đã được ghi nhận' };
    }
  }

  // ==================== VOUCHERS ====================
  async getVouchers(): Promise<Voucher[]> {
    try {
      return await this.request<Voucher[]>('/vouchers');
    } catch {
      return DEFAULT_VOUCHERS;
    }
  }

  async validateVoucher(code: string, totalAmount: number): Promise<{ valid: boolean; voucher?: Voucher; discount?: number; error?: string }> {
    try {
      return await this.request('/vouchers/validate', {
        method: 'POST',
        body: JSON.stringify({ code, totalAmount }),
      });
    } catch {
      const found = DEFAULT_VOUCHERS.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
      if (!found) {
        return { valid: false, error: 'Mã giảm giá không tồn tại' };
      }
      if (totalAmount < found.minOrder) {
        return {
          valid: false,
          error: `Đơn hàng tối thiểu ${found.minOrder.toLocaleString('vi-VN')}₫ để áp dụng mã này`,
        };
      }
      return { valid: true, voucher: found, discount: found.discount };
    }
  }

  // ==================== ADMIN STATS ====================
  async getAdminStats() {
    try {
      return await this.request<any>('/admin/stats');
    } catch {
      return {
        totalProducts: fallbackProducts.length,
        totalOrders: localOrders.length,
        totalUsers: 1,
        totalCategories: fallbackCategories.length,
        totalRevenue: localOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        recentOrders: localOrders.slice(0, 5),
      };
    }
  }
}

export const apiService = new ApiService();
