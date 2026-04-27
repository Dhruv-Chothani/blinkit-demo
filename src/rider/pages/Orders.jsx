import React, { useState, useEffect } from 'react';
import { Filter, Search, RefreshCw } from 'lucide-react';
import OrderCard from '../components/OrderCard';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD001',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 43210',
      address: '123 Main Street, Bandra West, Mumbai - 400050',
      items: [
        { name: 'Fresh Milk', quantity: 2, price: 120 },
        { name: 'Bread', quantity: 1, price: 40 },
        { name: 'Butter', quantity: 1, price: 85 }
      ],
      totalAmount: 245,
      status: 'pending',
      timeAgo: '5 mins ago'
    },
    {
      id: 'ORD002',
      customerName: 'Priya Patel',
      customerPhone: '+91 87654 32109',
      address: '456 Park Avenue, Andheri East, Mumbai - 400069',
      items: [
        { name: 'Organic Apples', quantity: 1, price: 150 },
        { name: 'Bananas', quantity: 2, price: 60 },
        { name: 'Orange Juice', quantity: 1, price: 120 }
      ],
      totalAmount: 330,
      status: 'accepted',
      timeAgo: '12 mins ago'
    },
    {
      id: 'ORD003',
      customerName: 'Amit Kumar',
      customerPhone: '+91 76543 21098',
      address: '789 Marine Drive, Colaba, Mumbai - 400005',
      items: [
        { name: 'Tomatoes', quantity: 2, price: 80 },
        { name: 'Onions', quantity: 1, price: 40 },
        { name: 'Potatoes', quantity: 2, price: 60 }
      ],
      totalAmount: 180,
      status: 'picked',
      timeAgo: '25 mins ago'
    },
    {
      id: 'ORD004',
      customerName: 'Sneha Reddy',
      customerPhone: '+91 65432 10987',
      address: '321 Linking Road, Khar West, Mumbai - 400052',
      items: [
        { name: 'Chicken Breast', quantity: 1, price: 280 },
        { name: 'Eggs', quantity: 12, price: 120 },
        { name: 'Cooking Oil', quantity: 1, price: 150 }
      ],
      totalAmount: 550,
      status: 'onway',
      timeAgo: '35 mins ago'
    },
    {
      id: 'ORD005',
      customerName: 'Vikram Singh',
      customerPhone: '+91 54321 09876',
      address: '654 Hill Road, Bandra, Mumbai - 400051',
      items: [
        { name: 'Rice', quantity: 1, price: 120 },
        { name: 'Dal', quantity: 1, price: 85 },
        { name: 'Spices Mix', quantity: 1, price: 95 }
      ],
      totalAmount: 300,
      status: 'delivered',
      timeAgo: '1 hour ago'
    }
  ];

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const refreshOrders = () => {
    loadOrders();
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'picked', label: 'Picked' },
    { value: 'onway', label: 'On The Way' },
    { value: 'delivered', label: 'Delivered' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 md:ml-64">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
          <p className="text-gray-600">Manage your delivery assignments</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshOrders}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No orders assigned to you yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!isLoading && orders.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'accepted').length}</p>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'picked').length}</p>
                <p className="text-sm text-gray-600">Picked</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'onway').length}</p>
                <p className="text-sm text-gray-600">On Way</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
                <p className="text-sm text-gray-600">Delivered</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
