import React from 'react';
import { CheckCircle, Clock, Package, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
  timestamp?: string;
}

interface OrderStatusTimelineProps {
  currentStatus: 'placed' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered';
  timestamps?: {
    placed?: string;
    accepted?: string;
    preparing?: string;
    out_for_delivery?: string;
    delivered?: string;
  };
  className?: string;
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  currentStatus,
  timestamps,
  className
}) => {
  const statusSteps: StatusStep[] = [
    {
      id: 'placed',
      label: 'Order Placed',
      icon: <Clock className="w-4 h-4" />,
      completed: true,
      current: currentStatus === 'placed',
      timestamp: timestamps?.placed
    },
    {
      id: 'accepted',
      label: 'Order Accepted',
      icon: <CheckCircle className="w-4 h-4" />,
      completed: ['accepted', 'preparing', 'out_for_delivery', 'delivered'].includes(currentStatus),
      current: currentStatus === 'accepted',
      timestamp: timestamps?.accepted
    },
    {
      id: 'preparing',
      label: 'Preparing Order',
      icon: <Package className="w-4 h-4" />,
      completed: ['preparing', 'out_for_delivery', 'delivered'].includes(currentStatus),
      current: currentStatus === 'preparing',
      timestamp: timestamps?.preparing
    },
    {
      id: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: <Truck className="w-4 h-4" />,
      completed: ['out_for_delivery', 'delivered'].includes(currentStatus),
      current: currentStatus === 'out_for_delivery',
      timestamp: timestamps?.out_for_delivery
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: <Home className="w-4 h-4" />,
      completed: currentStatus === 'delivered',
      current: currentStatus === 'delivered',
      timestamp: timestamps?.delivered
    }
  ];

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4", className)}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200 md:left-6" />
        
        {/* Status Steps */}
        <div className="space-y-8">
          {statusSteps.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Status Icon */}
              <div className="relative z-10">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    {
                      'bg-green-500 text-white': step.completed,
                      'bg-blue-500 text-white animate-pulse': step.current,
                      'bg-gray-300 text-gray-600': !step.completed && !step.current
                    }
                  )}
                >
                  {step.icon}
                </div>
                
                {/* Animated Ring for Current Step */}
                {step.current && (
                  <div className="absolute inset-0 w-8 h-8 rounded-full bg-blue-500 opacity-30 animate-ping" />
                )}
              </div>

              {/* Status Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3
                      className={cn(
                        "font-medium text-sm transition-colors duration-300",
                        {
                          'text-green-700': step.completed,
                          'text-blue-700': step.current,
                          'text-gray-500': !step.completed && !step.current
                        }
                      )}
                    >
                      {step.label}
                    </h3>
                    
                    {/* Timestamp */}
                    {step.timestamp && (
                      <p className="text-xs text-gray-500 mt-1 sm:mt-0">
                        {formatTimestamp(step.timestamp)}
                      </p>
                    )}
                  </div>
                  
                  {/* Current Status Indicator */}
                  {step.current && (
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-blue-700">In Progress</span>
                    </div>
                  )}
                  
                  {/* Completed Indicator */}
                  {step.completed && !step.current && (
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Completed</span>
                    </div>
                  )}
                </div>

                {/* Additional Info for Current Step */}
                {step.current && step.id === 'out_for_delivery' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Your order is on the way! Track your delivery in real-time.
                    </p>
                  </div>
                )}

                {step.current && step.id === 'preparing' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Your order is being prepared. We'll notify you when it's ready for delivery.
                    </p>
                  </div>
                )}

                {step.current && step.id === 'accepted' && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Great! Your order has been accepted and is being processed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
