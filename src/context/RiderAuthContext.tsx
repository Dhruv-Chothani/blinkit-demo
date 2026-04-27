import React, { createContext, useContext, useState, useEffect } from 'react';

interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  role: string;
}

interface RiderAuthContextType {
  rider: Rider | null;
  isOnline: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleOnlineStatus: () => void;
}

const RiderAuthContext = createContext<RiderAuthContextType | undefined>(undefined);

export const useRiderAuth = () => {
  const context = useContext(RiderAuthContext);
  if (!context) {
    throw new Error('useRiderAuth must be used within RiderAuthProvider');
  }
  return context;
};

export const RiderAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rider, setRider] = useState<Rider | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('riderToken');
    const savedRider = localStorage.getItem('riderData');
    
    if (token && savedRider) {
      try {
        setRider(JSON.parse(savedRider));
        setIsOnline(localStorage.getItem('riderOnline') === 'true');
      } catch (error) {
        console.error('Failed to parse rider data:', error);
        localStorage.removeItem('riderToken');
        localStorage.removeItem('riderData');
        localStorage.removeItem('riderOnline');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock API call - in real app, this would call your backend
      const mockResponse = await new Promise<{ success: boolean; data?: any }>((resolve) => {
        setTimeout(() => {
          // Simple mock validation
          if (email === 'rider@example.com' && password === 'password') {
            resolve({
              success: true,
              data: {
                rider: {
                  id: 'rider1',
                  name: 'Dhruv',
                  email: email,
                  phone: '+91 98765 43210',
                  vehicleType: 'Bike',
                  vehicleNumber: 'MH01 AB 1234',
                  role: 'rider'
                },
                token: 'mock-rider-token-12345'
              }
            });
          } else {
            resolve({ success: false });
          }
        }, 1000);
      });

      if (mockResponse.success && mockResponse.data) {
        const { rider: riderData, token } = mockResponse.data;
        setRider(riderData);
        localStorage.setItem('riderToken', token);
        localStorage.setItem('riderData', JSON.stringify(riderData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setRider(null);
    setIsOnline(false);
    localStorage.removeItem('riderToken');
    localStorage.removeItem('riderData');
    localStorage.removeItem('riderOnline');
  };

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    localStorage.setItem('riderOnline', newStatus.toString());
  };

  const value = {
    rider,
    isOnline,
    isLoading,
    login,
    logout,
    toggleOnlineStatus
  };

  return (
    <RiderAuthContext.Provider value={value}>
      {children}
    </RiderAuthContext.Provider>
  );
};
