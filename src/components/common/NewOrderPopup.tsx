import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, User, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import socketService, { SocketOrderData } from '@/services/socket';

interface NewOrderPopupProps {
  order: SocketOrderData;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string, reason: string) => void;
  onClose: () => void;
  autoCloseTime?: number; // Auto-close after X seconds
}

const NewOrderPopup: React.FC<NewOrderPopupProps> = ({
  order,
  onAccept,
  onReject,
  onClose,
  autoCloseTime = 30
}) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseTime);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const handleAccept = () => {
    onAccept(order.id);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      return;
    }
    onReject(order.id, rejectReason);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-orange-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              New Order Alert!
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-600">
                {formatTime(timeLeft)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Order ID:</span>
              <span className="font-mono text-sm font-medium">#{order.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Customer:</span>
              <span className="text-sm font-medium">{order.customerName}</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{order.customerAddress}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vendor:</span>
              <span className="text-sm font-medium">{order.vendorName}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-gray-400" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-gray-700">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Total Amount:</span>
              <span className="text-lg font-bold text-green-600">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {!showRejectForm ? (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Accept Order
              </Button>
              <Button
                onClick={() => setShowRejectForm(true)}
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                size="lg"
              >
                Reject
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Reason for rejection:</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please specify the reason for rejecting this order..."
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                  size="lg"
                >
                  Confirm Reject
                </Button>
                <Button
                  onClick={() => setShowRejectForm(false)}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Time Warning */}
          {timeLeft <= 10 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <p className="text-xs text-orange-800 text-center">
                ⚠️ Order will auto-reject in {timeLeft} seconds
              </p>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default NewOrderPopup;
