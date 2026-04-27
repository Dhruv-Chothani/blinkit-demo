import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, User as ApiUser } from "@/services/api";
import localStorageService, { Vendor, Customer } from "@/services/localStorageService";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'vendor' | 'admin';
  address?: string;
  storeName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'vendor' | 'admin') => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize localStorage with sample data if empty
    localStorageService.initializeData();
    
    // Get current user from localStorage
    const savedUser = localStorageService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'vendor' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    console.log('Login attempt:', { email, role, password: '***' });
    
    try {
      // Try real API first
      const response = await api.login(email, password, role);
      
      if (response.success) {
        const user: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          role: response.data.user.role,
          address: response.data.user.address,
          storeName: response.data.user.storeName,
        };
        
        setUser(user);
        localStorageService.setCurrentUser(user);
        localStorage.setItem('authToken', response.data.token);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.log('API not available, falling back to localStorage');
    }
    
    // Fallback to localStorage for development
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check vendors
    if (role === 'vendor') {
      const vendor = localStorageService.getVendorByEmail(email);
      if (vendor && password === 'password') {
        const user: User = {
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          role: 'vendor',
          address: vendor.address,
          storeName: vendor.storeName,
        };
        console.log('Vendor login successful');
        setUser(user);
        localStorageService.setCurrentUser(user);
        setIsLoading(false);
        return true;
      }
    }
    
    // Check customers
    if (role === 'user') {
      const customer = localStorageService.getCustomerByEmail(email);
      if (customer && password === 'password') {
        const user: User = {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          role: 'user',
          address: customer.address,
        };
        console.log('Customer login successful');
        setUser(user);
        localStorageService.setCurrentUser(user);
        setIsLoading(false);
        return true;
      }
    }
    
    // Mock admin login
    if (role === 'admin' && email === 'admin@example.com' && password === 'password') {
      const user: User = {
        id: 'admin1',
        name: 'System Admin',
        email: 'admin@example.com',
        phone: '9876543212',
        role: 'admin',
        address: '789 Admin Building, Bangalore',
      };
      console.log('Admin login successful');
      setUser(user);
      localStorageService.setCurrentUser(user);
      setIsLoading(false);
      return true;
    }
    
    console.log('Login failed - invalid credentials');
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try real API first
      const response = await api.register({
        ...userData,
        status: 'active',
        registrationDate: new Date().toISOString().split('T')[0],
      });
      
      if (response.success) {
        const user: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          role: response.data.user.role,
          address: response.data.user.address,
          storeName: response.data.user.storeName,
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', response.data.token);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.log('API not available, falling back to mock data');
    }
    
    // Fallback to mock data for development
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userData.role === 'vendor') {
      const vendor = localStorageService.addVendor({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        storeName: userData.storeName || '',
        address: userData.address || '',
        role: 'vendor',
        status: 'active'
      });
      
      const user: User = {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        role: 'vendor',
        address: vendor.address,
        storeName: vendor.storeName,
      };
      
      console.log('Vendor registration successful');
      setUser(user);
      localStorageService.setCurrentUser(user);
      setIsLoading(false);
      return true;
    }
    
    if (userData.role === 'user') {
      const customer = localStorageService.addCustomer({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address || '',
        role: 'user'
      });
      
      const user: User = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: 'user',
        address: customer.address,
      };
      
      console.log('Customer registration successful');
      setUser(user);
      localStorageService.setCurrentUser(user);
      setIsLoading(false);
      return true;
    }
    
    console.log('Registration failed');
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorageService.removeCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
