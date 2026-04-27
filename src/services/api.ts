// API Configuration - Backend developers can update these endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'vendor' | 'admin';
  status: 'active' | 'inactive';
  address?: string;
  storeName?: string;
  registrationDate: string;
  totalOrders?: number;
  totalRevenue?: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  customerName: string;
  customerEmail: string;
  vendorName: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryStatus: 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'failed';
  date: string;
  items: OrderItem[];
  deliveryAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

// Product Types
export interface Product {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  price: number;
  quantity: string;
  stock: number;
  image: string;
  status: 'active' | 'inactive';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Statistics Types
export interface SystemStats {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalAdmins: number;
  growthRate: number;
  monthlyRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
}

// API Class for Backend Integration
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication Endpoints
  async login(email: string, password: string, role: 'user' | 'vendor' | 'admin') {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request<null>('/auth/logout', { method: 'POST' });
  }

  async getProfile() {
    return this.request<User>('/auth/profile');
  }

  // User Management Endpoints
  async getUsers(page: number = 1, limit: number = 10, filters?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.role && { role: filters.role }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });

    return this.request<User[]>(`/users?${params}`) as Promise<PaginatedResponse<User>>;
  }

  async getUserById(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<null>(`/users/${id}`, { method: 'DELETE' });
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Order Management Endpoints
  async getOrders(page: number = 1, limit: number = 10, filters?: {
    status?: string;
    search?: string;
    vendorId?: string;
    customerId?: string;
  }): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.vendorId && { vendorId: filters.vendorId }),
      ...(filters?.customerId && { customerId: filters.customerId }),
    });

    return this.request<Order[]>(`/orders?${params}`) as Promise<PaginatedResponse<Order>>;
  }

  async getOrderById(id: string) {
    return this.request<Order>(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: Order['status']) {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateDeliveryStatus(id: string, deliveryStatus: Order['deliveryStatus']) {
    return this.request<Order>(`/orders/${id}/delivery-status`, {
      method: 'PUT',
      body: JSON.stringify({ deliveryStatus }),
    });
  }

  // Product Management Endpoints
  async getProducts(page: number = 1, limit: number = 10, filters?: {
    vendorId?: string;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.vendorId && { vendorId: filters.vendorId }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });

    return this.request<Product[]>(`/products?${params}`) as Promise<PaginatedResponse<Product>>;
  }

  async getProductById(id: string) {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Partial<Product>) {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request<null>(`/products/${id}`, { method: 'DELETE' });
  }

  // Statistics Endpoints
  async getSystemStats() {
    return this.request<SystemStats>('/stats/system');
  }

  async getVendorStats(vendorId: string) {
    return this.request<{ revenue: number; orders: number; products: number }>(`/stats/vendor/${vendorId}`);
  }

  async getUserStats(userId: string) {
    return this.request<{ orders: number; totalSpent: number }>(`/stats/user/${userId}`);
  }
}

// Export API instance
export const api = new ApiClient();
