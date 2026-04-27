// Local Storage Service for managing all data locally
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  stock: number;
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  address: string;
  role: 'vendor';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryStatus: 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'failed';
  deliveryAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  vendorId: string;
}

class LocalStorageService {
  private readonly KEYS = {
    PRODUCTS: 'quickcart_products',
    VENDORS: 'quickcart_vendors',
    CUSTOMERS: 'quickcart_customers',
    ORDERS: 'quickcart_orders',
    CURRENT_USER: 'quickcart_current_user',
    AUTH_TOKEN: 'quickcart_auth_token'
  };

  // Initialize with sample data if empty
  initializeData() {
    if (!this.getProducts().length) {
      this.initializeSampleData();
    }
  }

  // Products
  getProducts(): Product[] {
    const products = localStorage.getItem(this.KEYS.PRODUCTS);
    return products ? JSON.parse(products) : [];
  }

  saveProducts(products: Product[]): void {
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
  }

  getProductsByVendor(vendorId: string): Product[] {
    return this.getProducts().filter(product => product.vendorId === vendorId);
  }

  getProductById(productId: string): Product | null {
    const products = this.getProducts();
    return products.find(product => product.id === productId) || null;
  }

  getProductsByCategory(category: string): Product[] {
    return this.getProducts().filter(product => product.category === category);
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  updateProduct(productId: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveProducts(products);
    return products[index];
  }

  deleteProduct(productId: string): boolean {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    if (filteredProducts.length === products.length) return false;
    
    this.saveProducts(filteredProducts);
    return true;
  }

  // Vendors
  getVendors(): Vendor[] {
    const vendors = localStorage.getItem(this.KEYS.VENDORS);
    return vendors ? JSON.parse(vendors) : [];
  }

  saveVendors(vendors: Vendor[]): void {
    localStorage.setItem(this.KEYS.VENDORS, JSON.stringify(vendors));
  }

  getVendorByEmail(email: string): Vendor | null {
    return this.getVendors().find(v => v.email === email) || null;
  }

  addVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Vendor {
    const vendors = this.getVendors();
    const newVendor: Vendor = {
      ...vendor,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    vendors.push(newVendor);
    this.saveVendors(vendors);
    return newVendor;
  }

  updateVendor(vendorId: string, updates: Partial<Vendor>): Vendor | null {
    const vendors = this.getVendors();
    const index = vendors.findIndex(v => v.id === vendorId);
    if (index === -1) return null;

    vendors[index] = {
      ...vendors[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveVendors(vendors);
    return vendors[index];
  }

  // Customers
  getCustomers(): Customer[] {
    const customers = localStorage.getItem(this.KEYS.CUSTOMERS);
    return customers ? JSON.parse(customers) : [];
  }

  saveCustomers(customers: Customer[]): void {
    localStorage.setItem(this.KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  getCustomerByEmail(email: string): Customer | null {
    return this.getCustomers().find(c => c.email === email) || null;
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
    const customers = this.getCustomers();
    const newCustomer: Customer = {
      ...customer,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    customers.push(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  }

  // Orders
  getOrders(): Order[] {
    const orders = localStorage.getItem(this.KEYS.ORDERS);
    return orders ? JSON.parse(orders) : [];
  }

  saveOrders(orders: Order[]): void {
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
  }

  getOrdersByCustomer(customerId: string): Order[] {
    return this.getOrders().filter(order => order.customerId === customerId);
  }

  getOrdersByVendor(vendorId: string): Order[] {
    return this.getOrders().filter(order => order.vendorId === vendorId);
  }

  addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  updateOrder(orderId: string, updates: Partial<Order>): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveOrders(orders);
    return orders[index];
  }

  updateOrderStatus(orderId: string, status: string): boolean {
    return this.updateOrder(orderId, { status: status as Order['status'] }) !== null;
  }

  updateDeliveryStatus(orderId: string, deliveryStatus: string): boolean {
    return this.updateOrder(orderId, { deliveryStatus: deliveryStatus as Order['deliveryStatus'] }) !== null;
  }

  // Current User
  getCurrentUser(): any {
    const user = localStorage.getItem(this.KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: any): void {
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
  }

  removeCurrentUser(): void {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
    localStorage.removeItem(this.KEYS.AUTH_TOKEN);
  }

  // Utility
  public generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Initialize sample data
  private initializeSampleData() {
    // Sample vendors
    const sampleVendors: Vendor[] = [
      {
        id: 'vendor1',
        name: 'John Smith',
        email: 'vendor@example.com',
        phone: '9876543211',
        storeName: 'Fresh Groceries',
        address: '456 Market St, Bangalore',
        role: 'vendor',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'vendor2',
        name: 'Sarah Johnson',
        email: 'vendor2@example.com',
        phone: '9876543213',
        storeName: 'Organic Foods',
        address: '789 Garden St, Bangalore',
        role: 'vendor',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Sample products
    const sampleProducts: Product[] = [
      
      {
        id: 'prod2',
        name: 'Organic Apples',
        price: 120,
        originalPrice: 150,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
        category: 'fruits',
        description: 'Fresh organic apples',
        vendorId: 'vendor2',
        vendorName: 'Organic Foods',
        vendorEmail: 'vendor2@example.com',
        stock: 50,
        rating: 4.8,
        reviews: 89,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'prod3',
        name: 'Fresh Milk',
        price: 45,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop',
        category: 'dairy',
        description: 'Fresh farm milk',
        vendorId: 'vendor1',
        vendorName: 'Fresh Groceries',
        vendorEmail: 'vendor@example.com',
        stock: 30,
        rating: 4.3,
        reviews: 67,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.saveVendors(sampleVendors);
    this.saveProducts(sampleProducts);
  }

  // Clear all data (for testing)
  clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export default new LocalStorageService();
