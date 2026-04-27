import React, { useState } from 'react';
import { 
  MapPin, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck,
  User,
  IndianRupee,
  Phone
} from 'lucide-react';

const OrderCard = ({ order, onStatusUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
      'picked': 'bg-purple-100 text-purple-800 border-purple-200',
      'onway': 'bg-orange-100 text-orange-800 border-orange-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Pending',
      'accepted': 'Accepted',
      'picked': 'Picked',
      'onway': 'On The Way',
      'delivered': 'Delivered'
    };
    return texts[status] || 'Pending';
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      'pending': 'accepted',
      'accepted': 'picked',
      'picked': 'onway',
      'onway': 'delivered',
      'delivered': null
    };
    return flow[currentStatus];
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onStatusUpdate(order.id, nextStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStatus = getNextStatus(order.status);
  const statusColor = getStatusColor(order.status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">Order #{order.id}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Placed {order.timeAgo}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-green-600 font-semibold">
            <IndianRupee className="w-4 h-4" />
            <span className="text-lg">{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-start gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
        <div className="p-2 bg-white rounded-lg">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{order.customerName}</p>
          <div className="flex items-center gap-2 mt-1">
            <Phone className="w-3 h-3 text-gray-500" />
            <span className="text-sm text-gray-600">{order.customerPhone}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-gray-100 rounded-lg mt-1">
          <MapPin className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Delivery Address</p>
          <p className="text-sm text-gray-600 mt-1">{order.address}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Items ({order.items.length})</span>
        </div>
        <div className="space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.name} × {item.quantity}</span>
              <span className="text-gray-900 font-medium">₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {nextStatus && (
          <button
            onClick={handleStatusUpdate}
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </span>
            ) : (
              <>
                {nextStatus === 'accepted' && 'Accept Order'}
                {nextStatus === 'picked' && 'Mark as Picked'}
                {nextStatus === 'onway' && 'On The Way'}
                {nextStatus === 'delivered' && 'Mark Delivered'}
              </>
            )}
          </button>
        )}
        
        <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
