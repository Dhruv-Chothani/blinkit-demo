import React, { createContext, useContext, useState, useEffect } from 'react';

const RiderAuthContext = createContext();

export const useRiderAuth = () => {
  const context = useContext(RiderAuthContext);
  if (!context) {
    throw new Error('useRiderAuth must be used within RiderAuthProvider');
  }
  return context;
};

export const RiderAuthProvider = ({ children }) => {
  const [rider, setRider] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('riderToken');
    const savedRider = localStorage.getItem('riderData');
    
    if (token && savedRider) {
      setRider(JSON.parse(savedRider));
      setIsOnline(localStorage.getItem('riderOnline') === 'true');
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Mock API call
      const mockResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              rider: {
                id: 'rider1',
                name: 'Dhruv',
                email: email,
                phone: '+91 98765 43210',
                vehicleType: 'Bike',
                vehicleNumber: 'MH01 AB 1234'
              },
              token: 'mock-rider-token-12345'
            }
          });
        }, 1000);
      });

      if (mockResponse.success) {
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
