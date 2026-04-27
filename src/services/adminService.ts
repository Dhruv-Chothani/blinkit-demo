import { api, User, Order, SystemStats } from './api';

// Admin Service - All admin-specific API calls
export class AdminService {
  // System Statistics
  static async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await api.getSystemStats();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
      // Fallback mock data for development
      return this.getMockStats();
    }
  }

  // User Management
  static async getAllUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await api.getUsers(
        filters?.page || 1,
        filters?.limit || 50,
        {
          role: filters?.role,
          status: filters?.status,
          search: filters?.search,
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback mock data for development
      return this.getMockUsers();
    }
  }

  static async createUser(userData: any) {
    try {
      const response = await api.createUser(userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  static async updateUser(id: string, userData: Partial<User>) {
    try {
      const response = await api.updateUser(id, userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  static async deleteUser(id: string) {
    try {
      await api.deleteUser(id);
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  // Order Management
  static async getAllOrders(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await api.getOrders(
        filters?.page || 1,
        filters?.limit || 50,
        {
          status: filters?.status,
          search: filters?.search,
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Fallback mock data for development
      return this.getMockOrders();
    }
  }

  static async updateOrderStatus(id: string, status: Order['status']) {
    try {
      const response = await api.updateOrderStatus(id, status);
      return response.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }

  static async updateDeliveryStatus(id: string, deliveryStatus: Order['deliveryStatus']) {
    try {
      const response = await api.updateDeliveryStatus(id, deliveryStatus);
      return response.data;
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      throw error;
    }
  }

  // Mock Data for Development (Backend developers can remove these)
  private static getMockStats(): SystemStats {
    return {
      totalRevenue: 45678,
      totalOrders: 156,
      activeUsers: 89,
      totalVendors: 12,
      totalCustomers: 76,
      totalAdmins: 1,
      growthRate: 18.2,
      monthlyRevenue: 12500,
      pendingOrders: 23,
      deliveredOrders: 133,
    };
  }

  private static getMockUsers() {
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'user@example.com',
          phone: '9876543210',
          role: 'user' as const,
          status: 'active' as const,
          address: '123 Main St, Bangalore',
          registrationDate: '2024-01-15',
          totalOrders: 12,
          totalRevenue: 2340,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-03-20T15:30:00Z',
        },
        {
          id: '2',
          name: 'Vendor Store',
          email: 'vendor@example.com',
          phone: '9876543211',
          role: 'vendor' as const,
          status: 'active' as const,
          storeName: 'Local Grocery Store',
          address: '456 Market St, Bangalore',
          registrationDate: '2024-01-10',
          totalOrders: 45,
          totalRevenue: 12500,
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-03-20T14:20:00Z',
        },
        {
          id: '3',
          name: 'System Admin',
          email: 'admin@example.com',
          phone: '9876543212',
          role: 'admin' as const,
          status: 'active' as const,
          address: '789 Admin Building, Bangalore',
          registrationDate: '2024-01-01',
          createdAt: '2024-01-01T08:00:00Z',
          updatedAt: '2024-03-20T16:00:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 50,
        total: 3,
        totalPages: 1,
      },
    };
  }

  private static getMockOrders() {
    return {
      success: true,
      data: [
        {
          id: 'ORD001',
          customerId: '1',
          vendorId: '2',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          vendorName: 'Local Grocery Store',
          total: 456,
          status: 'processing' as const,
          deliveryStatus: 'out_for_delivery' as const,
          date: '2024-03-20',
          items: [
            {
              id: '1',
              productId: 'p1',
              name: 'Fresh Tomatoes',
              quantity: 2,
              price: 40,
              image: 'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=100&h=100&fit=crop',
            },
          ],
          deliveryAddress: '123 Main St, Bangalore',
          paymentStatus: 'paid' as const,
          createdAt: '2024-03-20T10:00:00Z',
          updatedAt: '2024-03-20T14:30:00Z',
        },
        {
          id: 'ORD002',
          customerId: '4',
          vendorId: '5',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          vendorName: 'Fresh Market',
          total: 234,
          status: 'shipped' as const,
          deliveryStatus: 'delivered' as const,
          date: '2024-03-19',
          items: [
            {
              id: '2',
              productId: 'p2',
              name: 'Organic Apples',
              quantity: 1,
              price: 120,
              image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop',
            },
          ],
          deliveryAddress: '456 Oak Ave, Bangalore',
          paymentStatus: 'paid' as const,
          createdAt: '2024-03-19T11:00:00Z',
          updatedAt: '2024-03-20T10:00:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 50,
        total: 2,
        totalPages: 1,
      },
    };
  }
}

export default AdminService;
