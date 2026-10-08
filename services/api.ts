import { categories as fallbackCategories, products as fallbackProducts, normalizeProductImages } from '@/data/products';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

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
    gpu?: string[];
    colors?: string[];
    ramDetails?: { label: string; priceDelta: number }[];
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

export type SupportSender = 'customer' | 'admin' | 'bot';
export type SupportStatus = 'open' | 'answered' | 'closed';

export interface SupportMessage {
  id: number;
  ticketId: number;
  sender: SupportSender;
  text: string;
  createdAt: string;
}

export interface SupportTicket {
  id: number;
  sessionId: string;
  userId?: number | null;
  customerName?: string | null;
  customerContact?: string | null;
  status: SupportStatus;
  unreadByAdmin: number;
  unreadByCustomer: number;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string | null;
  lastSender?: SupportSender | null;
  messageCount?: number;
  messages?: SupportMessage[];
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
  { code: 'DPC30K', discount: 30000, minOrder: 500000, label: 'Giảm 30.000₫ cho đơn từ 500k', expiryDate: '2026-12-31' },
  { code: 'FREESHIP', discount: 30000, minOrder: 0, label: 'Miễn phí giao hàng toàn quốc 30k', expiryDate: '2026-12-31' },
  { code: 'DPC50K', discount: 50000, minOrder: 2000000, label: 'Giảm 50.000₫ cho đơn từ 2 triệu', expiryDate: '2026-12-31' },
  { code: 'VIP100K', discount: 100000, minOrder: 5000000, label: 'Giảm 100.000₫ cho đơn từ 5 triệu', expiryDate: '2026-12-31' },
  { code: 'VIP200K', discount: 200000, minOrder: 20000000, label: 'Giảm 200.000₫ cho đơn từ 20 triệu', expiryDate: '2026-12-31' },
];

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  public getBaseURL(): string {
    if (process.env.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
      return `http://${window.location.hostname}:5000`;
    }
    // Tự động nhận diện IP máy tính host khi chạy qua Expo Go trên điện thoại thật
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:5000`;
    }
    // Android Emulator sử dụng 10.0.2.2 để trỏ về localhost máy host
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000';
    }
    return this.baseURL || 'http://localhost:5000';
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('promart_user');
        if (saved) {
          const u = JSON.parse(saved);
          if (u?.id === 100) {
            u.id = 1;
            window.localStorage.setItem('promart_user', JSON.stringify(u));
          } else if (u?.id === 99) {
            u.id = 2;
            window.localStorage.setItem('promart_user', JSON.stringify(u));
          }
          if (u?.id) {
            headers['x-user-id'] = String(u.id);
          }
          if (u?.email) {
            headers['x-user-email'] = String(u.email);
          }
          if (u?.role) {
            headers['x-user-role'] = String(u.role);
          }
        }
      } catch {}
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(url, {
        signal: controller ? controller.signal : undefined,
        ...options,
        headers,
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
      return list && list.length > 0
        ? normalizeProductImages(list)
        : normalizeProductImages(fallbackProducts as any);
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
      return normalizeProductImages(result);
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await this.request<Product>(`/products/${id}`);
      return product ? normalizeProductImages([product])[0] : null;
    } catch {
      const found = fallbackProducts.find((p) => p.id === id);
      return found ? (normalizeProductImages([found as any])[0] as any) : null;
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
      const res = await this.request<any>('/categories');
      const list = Array.isArray(res) ? res : (res?.data || []);
      return list && list.length > 0 ? list : (fallbackCategories as any);
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
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Thử gửi request đăng nhập lên backend MySQL trước tiên
    try {
      return await this.request<User>('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password }),
      });
    } catch (err: any) {
      if (
        err?.message &&
        (err.message.includes('Invalid credentials') ||
          err.message.includes('không chính xác') ||
          err.message.includes('không đúng') ||
          err.message.includes('401'))
      ) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      // 2. Chế độ offline dự phòng: nếu mất mạng hoặc máy chủ chưa bật
      if (cleanEmail === 'admin@promart.vn' || cleanEmail === 'admin@dangvinhpc.vn') {
        if (password === '1') {
          return {
            id: cleanEmail === 'admin@promart.vn' ? 1 : 2,
            email: cleanEmail,
            name: 'Quản Trị Viên DANGVINHPC',
            role: 'admin',
            phone: '0900 000 000',
            address: '191 Nguyễn Thị Duệ, Phường Thanh Bình',
            city: 'TP. Hải Dương',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
          };
        } else {
          throw new Error('Mật khẩu Admin không đúng');
        }
      }

      if (cleanEmail === 'staff@dangvinhpc.vn' || cleanEmail === 'kho@dangvinhpc.vn') {
        if (password === '1') {
          return {
            id: cleanEmail === 'staff@dangvinhpc.vn' ? 30 : 31,
            email: cleanEmail,
            name: cleanEmail === 'staff@dangvinhpc.vn' ? 'Nhân Viên Kinh Doanh DANGVINHPC' : 'Nhân Viên Quản Lý Kho DANGVINHPC',
            role: 'staff',
            phone: cleanEmail === 'staff@dangvinhpc.vn' ? '0900 111 222' : '0900 111 333',
            address: '191 Nguyễn Thị Duệ, Phường Thanh Bình',
            city: 'TP. Hải Dương',
            avatar: cleanEmail === 'staff@dangvinhpc.vn'
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          };
        } else {
          throw new Error('Mật khẩu Nhân viên không đúng');
        }
      }

      // Kiểm tra trong danh sách tài khoản đã đăng ký offline ở localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const saved = window.localStorage.getItem('promart_registered_users');
          if (saved) {
            const list: any[] = JSON.parse(saved);
            const found = list.find((u) => u.email && u.email.toLowerCase() === cleanEmail);
            if (found) {
              if (found.password && found.password !== password) {
                throw new Error('Mật khẩu không đúng');
              }
              return {
                id: found.id,
                email: found.email,
                name: found.name || 'Người dùng',
                phone: found.phone || '',
                role: found.role || 'customer',
                address: found.address || '',
                city: found.city || '',
              };
            }
          }
        } catch (e: any) {
          if (e?.message === 'Mật khẩu không đúng') throw e;
        }
      }

      // Mock customer fallback chỉ cho tài khoản mẫu mặc định khi offline
      if (cleanEmail === 'nguyenvana@gmail.com') {
        return {
          id: 1,
          email: 'nguyenvana@gmail.com',
          name: 'Nguyễn Văn A',
          role: 'customer',
          phone: '0909 123 456',
          address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1',
          city: 'TP. Hồ Chí Minh',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        };
      }

      throw new Error(err?.message || 'Không thể kết nối đến máy chủ xác thực');
    }
  }

  async registerUser(userData: Record<string, any>): Promise<any> {
    const cleanEmail = String(userData.email || '').trim().toLowerCase();
    const cleanPhone = String(userData.phone || '').replace(/\D/g, '');

    try {
      return await this.request('/users/register', {
        method: 'POST',
        body: JSON.stringify({
          ...userData,
          email: cleanEmail,
          phone: cleanPhone,
        }),
      });
    } catch (err: any) {
      // Nếu server trả về lỗi nghiệp vụ (ví dụ: email/sđt đã tồn tại), BẮT BUỘC ném lỗi lên UI!
      const msg = err?.message || '';
      if (
        msg.includes('đã được sử dụng') ||
        msg.includes('đã được đăng ký') ||
        msg.includes('Duplicate') ||
        msg.includes('hợp lệ')
      ) {
        throw err;
      }

      // Nếu đang chạy chế độ offline / local: Kiểm tra trùng lặp email và số điện thoại
      let localUsers: any[] = [];
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const saved = window.localStorage.getItem('promart_registered_users');
          if (saved) localUsers = JSON.parse(saved);
        } catch {}
      }

      const allUsers = [
        { email: 'nguyenvana@gmail.com', phone: '0909123456' },
        { email: 'admin@promart.vn', phone: '0900000000' },
        ...localUsers,
      ];

      // 1. Kiểm tra trùng Email
      const emailExists = allUsers.some((u) => u.email && u.email.toLowerCase() === cleanEmail);
      if (emailExists) {
        throw new Error('Địa chỉ email này đã được sử dụng cho tài khoản khác');
      }

      // 2. Kiểm tra trùng Số điện thoại
      if (cleanPhone) {
        const phoneExists = allUsers.some(
          (u) => u.phone && u.phone.replace(/\D/g, '') === cleanPhone
        );
        if (phoneExists) {
          throw new Error('Số điện thoại này đã được đăng ký cho tài khoản khác');
        }
      }

      // Lưu tài khoản mới vào localStorage
      const newUser = {
        id: Date.now(),
        email: cleanEmail,
        name: userData.name || '',
        phone: cleanPhone,
        password: userData.password || '',
        role: (cleanEmail === 'admin@promart.vn' || cleanEmail === 'admin@dangvinhpc.vn') ? 'admin' : 'customer',
      };
      localUsers.push(newUser);
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem('promart_registered_users', JSON.stringify(localUsers));
        } catch {}
      }

      return { message: 'Đăng ký tài khoản thành công', user: newUser };
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
          email: 'admin@promart.vn',
          name: 'Quản Trị Viên DANGVINHPC',
          phone: '0900 000 000',
          address: '191 Nguyễn Thị Duệ, Phường Thanh Bình',
          city: 'TP. Hải Dương',
          role: 'admin',
        },
        {
          id: 30,
          email: 'staff@dangvinhpc.vn',
          name: 'Nhân Viên Kinh Doanh DANGVINHPC',
          phone: '0900 111 222',
          address: '191 Nguyễn Thị Duệ, Phường Thanh Bình',
          city: 'TP. Hải Dương',
          role: 'staff',
        },
        {
          id: 3,
          email: 'nguyenvana@gmail.com',
          name: 'Nguyễn Văn A',
          phone: '0909 123 456',
          address: '123 Đường Lê Lợi, Quận 1',
          city: 'TP. Hồ Chí Minh',
          role: 'customer',
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
    voucherCode?: string;
  }): Promise<{ message: string; orderNumber: string; orderId?: number }> {
    try {
      const res = await this.request<any>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      if (orderData.voucherCode && orderData.userId) {
        this.useVoucher(orderData.userId, orderData.voucherCode, res.orderId).catch(() => {});
      }
      return res;
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
      if (orderData.voucherCode && orderData.userId) {
        this.useVoucher(orderData.userId, orderData.voucherCode, newOrder.id).catch(() => {});
      }
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
      const existing = localOrders.find((o) => o.id === Number(orderId));
      if (existing && (existing.status === 'completed' || existing.status === 'cancelled')) {
        throw new Error(
          `Đơn hàng đã ${existing.status === 'completed' ? 'giao thành công' : 'bị hủy'}, trạng thái đã được khóa cố định!`
        );
      }
      const ALLOWED_TRANSITIONS: Record<string, string[]> = {
        pending: ['confirmed', 'shipping', 'cancelled'],
        confirmed: ['shipping', 'completed', 'cancelled'],
        shipping: ['completed', 'cancelled'],
        completed: [],
        cancelled: [],
      };
      if (existing && ALLOWED_TRANSITIONS[existing.status] && !ALLOWED_TRANSITIONS[existing.status].includes(status)) {
        throw new Error(`Không thể chuyển trạng thái từ "${existing.status}" sang "${status}"!`);
      }
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
      const existing = localOrders.find((o) => o.id === Number(orderId));
      if (existing && existing.status !== 'pending') {
        throw new Error('Chỉ có thể hủy đơn hàng đang chờ xác nhận (pending)!');
      }
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

  async validateVoucher(code: string, totalAmount: number, userId?: number | string): Promise<{ valid: boolean; voucher?: Voucher; discount?: number; error?: string }> {
    try {
      return await this.request('/vouchers/validate', {
        method: 'POST',
        body: JSON.stringify({ code, totalAmount, userId }),
      });
    } catch (err: any) {
      const cleanCode = code.trim().toUpperCase();

      // Check if user has already used this voucher in localStorage
      if (userId && typeof window !== 'undefined' && window.localStorage) {
        try {
          const used = JSON.parse(window.localStorage.getItem(`promart_used_vouchers_${userId}`) || '[]');
          if (Array.isArray(used) && used.includes(cleanCode)) {
            return {
              valid: false,
              error: `Tài khoản của bạn đã sử dụng mã giảm giá "${cleanCode}" rồi`,
            };
          }
        } catch {}
      }

      const found = DEFAULT_VOUCHERS.find((v) => v.code.toUpperCase() === cleanCode);
      if (!found) {
        return { valid: false, error: err?.message || 'Mã giảm giá không tồn tại' };
      }
      if (found.expiryDate) {
        const today = new Date().toISOString().slice(0, 10);
        if (found.expiryDate < today) {
          return {
            valid: false,
            error: `Mã giảm giá "${found.code}" đã hết hạn sử dụng vào ngày ${found.expiryDate}`,
          };
        }
      }
      if (totalAmount < found.minOrder) {
        return {
          valid: false,
          error: `Đơn hàng tối thiểu ${found.minOrder.toLocaleString('vi-VN')}₫ để áp dụng mã này (còn thiếu ${(found.minOrder - totalAmount).toLocaleString('vi-VN')}₫)`,
        };
      }
      return { valid: true, voucher: found, discount: found.discount };
    }
  }

  async getUsedVouchers(userId: number | string): Promise<string[]> {
    try {
      const res = await this.request<string[]>(`/vouchers/user/${userId}`);
      if (Array.isArray(res)) {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(`promart_used_vouchers_${userId}`, JSON.stringify(res));
        }
        return res;
      }
      return [];
    } catch {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const saved = window.localStorage.getItem(`promart_used_vouchers_${userId}`);
          if (saved) return JSON.parse(saved);
        } catch {}
      }
      return [];
    }
  }

  async useVoucher(userId: number | string, code: string, orderId?: number): Promise<any> {
    const cleanCode = code.trim().toUpperCase();
    // Update local storage immediately for seamless offline/fallback experience
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `promart_used_vouchers_${userId}`;
        const curr = JSON.parse(window.localStorage.getItem(key) || '[]');
        if (!curr.includes(cleanCode)) {
          window.localStorage.setItem(key, JSON.stringify([...curr, cleanCode]));
        }
      } catch {}
    }
    try {
      return await this.request('/vouchers/use', {
        method: 'POST',
        body: JSON.stringify({ userId, code: cleanCode, orderId }),
      });
    } catch {
      return { message: 'Đã lưu sử dụng voucher' };
    }
  }

  async createVoucher(voucher: Voucher): Promise<any> {
    try {
      return await this.request('/vouchers', {
        method: 'POST',
        body: JSON.stringify(voucher),
      });
    } catch {
      // Local fallback
      const idx = DEFAULT_VOUCHERS.findIndex(v => v.code.toUpperCase() === voucher.code.toUpperCase());
      if (idx >= 0) {
        DEFAULT_VOUCHERS[idx] = voucher;
      } else {
        DEFAULT_VOUCHERS.unshift(voucher);
      }
      return { message: 'Đã lưu voucher thành công', code: voucher.code };
    }
  }

  async deleteVoucher(code: string): Promise<any> {
    try {
      return await this.request(`/vouchers/${encodeURIComponent(code)}`, {
        method: 'DELETE',
      });
    } catch {
      const idx = DEFAULT_VOUCHERS.findIndex(v => v.code.toUpperCase() === code.toUpperCase());
      if (idx >= 0) DEFAULT_VOUCHERS.splice(idx, 1);
      return { message: 'Đã xóa voucher thành công' };
    }
  }

  async updateUserRole(userId: number | string, role: 'admin' | 'staff' | 'customer'): Promise<any> {
    return await this.request(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async createStaffUser(userData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: 'staff' | 'admin' | 'customer';
    address?: string;
    city?: string;
  }): Promise<any> {
    return await this.request('/users/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // ==================== SUPPORT (CHATBOT -> ADMIN) ====================
  async createSupportTicket(payload: {
    sessionId: string;
    message: string;
    botReply?: string;
    userId?: number | null;
    customerName?: string;
    customerContact?: string;
  }): Promise<SupportTicket> {
    return await this.request<SupportTicket>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getSupportTicketBySession(sessionId: string): Promise<SupportTicket | null> {
    return await this.request<SupportTicket | null>(`/support/tickets?sessionId=${encodeURIComponent(sessionId)}`);
  }

  async getSupportTickets(status: SupportStatus | 'all' = 'all'): Promise<SupportTicket[]> {
    return await this.request<SupportTicket[]>(`/support/tickets?status=${status}`);
  }

  async getSupportTicket(id: number, reader?: 'admin' | 'customer'): Promise<SupportTicket> {
    return await this.request<SupportTicket>(`/support/tickets/${id}${reader ? `?reader=${reader}` : ''}`);
  }

  async sendSupportMessage(id: number, sender: 'customer' | 'admin', text: string): Promise<SupportTicket> {
    return await this.request<SupportTicket>(`/support/tickets/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ sender, text }),
    });
  }

  async updateSupportTicketStatus(id: number, status: SupportStatus): Promise<SupportTicket> {
    return await this.request<SupportTicket>(`/support/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteSupportTicket(id: number): Promise<any> {
    return await this.request(`/support/tickets/${id}`, { method: 'DELETE' });
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
