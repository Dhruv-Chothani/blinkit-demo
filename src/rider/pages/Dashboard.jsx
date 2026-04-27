import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  IndianRupee, 
  Clock,
  MapPin,
  Navigation,
  RefreshCw
} from 'lucide-react';
import { useRiderAuth } from '../../context/RiderAuthContext';
import StatCard from '../components/StatCard';

const RiderDashboard = () => {
  const { rider, isOnline, toggleOnlineStatus } = useRiderAuth();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  
  const [stats, setStats] = useState({
    totalDeliveries: 12,
    earningsToday: 2450,
    activeOrders: 3
  });

  const [earnings, setEarnings] = useState({
    today: 2450,
    weekly: 16800
  });

  // Mock data update
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        earningsToday: prev.earningsToday + Math.floor(Math.random() * 50)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateLocation = () => {
    setIsUpdatingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          });
          setIsUpdatingLocation(false);
        },
        (error) => {
          console.error('Location error:', error);
          // Mock location for demo
          setLocation({
            lat: '19.0760',
            lng: '72.8777'
          });
          setIsUpdatingLocation(false);
        }
      );
    } else {
      // Mock location if geolocation not supported
      setLocation({
        lat: '19.0760',
        lng: '72.8777'
      });
      setIsUpdatingLocation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:ml-64">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Hello, {rider?.name} 👋
              </h1>
              <p className="text-gray-600 mt-1">Welcome back to your delivery dashboard</p>
            </div>
            
            {/* Online/Offline Toggle */}
            <button
              onClick={toggleOnlineStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                isOnline 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-600' : 'bg-gray-400'
              }`} />
              {isOnline ? 'Online' : 'Offline'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Deliveries Today"
            value={stats.totalDeliveries}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Earnings Today"
            value={`₹${stats.earningsToday}`}
            icon={IndianRupee}
            color="green"
          />
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            icon={Clock}
            color="orange"
          />
        </div>

        {/* Live Location Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Live Location</h2>
            </div>
            <button
              onClick={updateLocation}
              disabled={isUpdatingLocation}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
            >
              {isUpdatingLocation ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Update Location
                </>
              )}
            </button>
          </div>
          
          {location.lat && location.lng ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Latitude:</span>
                <span className="text-sm font-mono text-gray-900">{location.lat}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Longitude:</span>
                <span className="text-sm font-mono text-gray-900">{location.lng}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Last updated: Just now
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Click "Update Location" to get current coordinates</p>
            </div>
          )}
        </div>

        {/* Earnings Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Today's Earnings</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Base Earnings</span>
                <span className="font-semibold text-gray-900">₹{earnings.today - 450}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bonus</span>
                <span className="font-semibold text-green-600">+₹450</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">₹{earnings.today}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Weekly Earnings</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Week</span>
                <span className="font-semibold text-gray-900">₹{earnings.weekly}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Week</span>
                <span className="font-semibold text-gray-900">₹14,200</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Growth</span>
                  <span className="text-sm font-bold text-green-600">+18.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
