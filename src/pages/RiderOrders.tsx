import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import Orders from '../rider/pages/Orders';
import RiderNavbar from '../rider/components/Navbar';

const RiderOrdersPage = () => {
  const navigate = useNavigate();
  const { rider } = useRiderAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    const token = localStorage.getItem('riderToken');
    if (!token || !rider) {
      navigate('/login/rider');
    }
  }, [rider, navigate]);

  if (!rider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RiderNavbar />
      <Orders />
    </>
  );
};

export default RiderOrdersPage;
