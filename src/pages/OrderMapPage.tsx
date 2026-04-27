import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Truck, Phone, Clock, RefreshCw } from 'lucide-react';
import GoogleMapFixed from '@/components/common/GoogleMapFixed';
import { useAuth } from '@/context/AuthContext';

interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  totalAmount: number;
  status: 'placed' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered';
  vendorName: string;
  vendorPhone: string;
  vendorLocation?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  estimatedDelivery?: string;
  riderName?: string;
  riderPhone?: string;
  riderLocation?: {
    lat: number;
    lng: number;
  };
}

const OrderMapPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Mock order data - in real app, fetch from API
    const mockOrder: OrderDetails = {
      id: orderId || 'ORD001',
      customerName: user?.name || 'John Doe',
      customerPhone: '+91 98765 43210',
      customerAddress: '123 Main Street, Bandra West, Mumbai - 400050',
      items: [
        {
          id: '1',
          name: 'Fresh Milk',
          quantity: 2,
          price: 60,
          image: 'https://images.unsplash.com/photo-1550583744-3bdb5bcae14a'
        },
        {
          id: '2',
          name: 'Organic Bread',
          quantity: 1,
          price: 40,
          image: 'https://images.unsplash.com/photo-1509440357390-0cc2f5d2b9a3'
        },
        {
          id: '3',
          name: 'Farm Fresh Eggs',
          quantity: 1,
          price: 85,
          image: 'https://images.unsplash.com/photo-15185696595570-6b8b5b5b5b5b'
        }
      ],
      totalAmount: 245,
      status: 'out_for_delivery',
      vendorName: 'Fresh Mart',
      vendorPhone: '+91 87654 32109',
      vendorLocation: {
        lat: 19.0760,
        lng: 72.8777
      },
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      riderName: 'Raj Kumar',
      riderPhone: '+91 98765 12345',
      riderLocation: {
        lat: 19.0800,
        lng: 72.8500
      }
    };

    // Simulate loading delay
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [orderId, user]);

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call to refresh order status
    setTimeout(() => {
      if (order) {
        // Update rider location (simulate movement)
        const updatedOrder = {
          ...order,
          riderLocation: {
            lat: order.riderLocation!.lat + 0.001,
            lng: order.riderLocation!.lng + 0.001
          }
        };
        setOrder(updatedOrder);
      }
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'placed': 'bg-blue-100 text-blue-800 border-blue-200',
      'accepted': 'bg-green-100 text-green-800 border-green-200',
      'preparing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'out_for_delivery': 'bg-orange-100 text-orange-800 border-orange-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status as keyof typeof colors] || colors.placed;
  };

  const getStatusText = (status: string) => {
    const texts = {
      'placed': 'Order Placed',
      'accepted': 'Order Accepted',
      'preparing': 'Preparing',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered'
    };
    return texts[status as keyof typeof texts] || 'Order Placed';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order tracking...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/profile')}>
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  // Prepare map markers
  const mapMarkers = [
    {
      lat: order.vendorLocation?.lat || 19.0760,
      lng: order.vendorLocation?.lng || 72.8777,
      label: order.vendorName,
      type: 'vendor' as const
    },
    {
      lat: order.customerAddress ? 19.0800 : 19.0760, // Mock customer location
      lng: order.customerAddress ? 72.8500 : 72.8777,
      label: 'Delivery Address',
      type: 'destination' as const
    }
  ];

  // Add rider marker if available
  if (order.riderLocation) {
    mapMarkers.push({
      lat: order.riderLocation.lat,
      lng: order.riderLocation.lng,
      label: order.riderName,
      type: 'rider' as const
    });
  }

  // Prepare route if rider is available
  const route = order.riderLocation ? {
    origin: {
      lat: order.vendorLocation?.lat || 19.0760,
      lng: order.vendorLocation?.lng || 72.8777
    },
    destination: {
      lat: order.customerAddress ? 19.0800 : 19.0760,
      lng: order.customerAddress ? 72.8500 : 72.8777
    }
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Track Order</h1>
              <p className="text-sm text-gray-600">Order #{order.id}</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              {refreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Order Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Delivery Status</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Placed:</span>
                  <span className="text-sm font-medium">{formatTime(order.createdAt)}</span>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Est. Delivery:</span>
                    <span className="text-sm font-medium">{formatTime(order.estimatedDelivery)}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {order.riderName && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-600" />
                    <div>
                      <span className="text-sm text-gray-600">Rider:</span>
                      <span className="text-sm font-medium">{order.riderName}</span>
                    </div>
                  </div>
                )}
                {order.riderPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{order.riderPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Card */}
        <Card>
          <CardHeader>
            <CardTitle>Live Tracking</CardTitle>
            <CardDescription>
              Real-time location tracking for your order
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <GoogleMapFixed
              center={{
                lat: 19.0780,
                lng: 72.8635
              }}
              zoom={13}
              markers={mapMarkers}
              route={route}
              height="500px"
              onLocationUpdate={(location) => {
                console.log('Map location updated:', location);
              }}
            />
          </CardContent>
        </Card>

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Info */}
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{order.vendorName}</h4>
                  <p className="text-sm text-gray-600">{order.vendorPhone}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Store
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                    <p className="text-sm text-gray-700">{order.customerAddress}</p>
                  </div>
                </div>
                
                {order.riderName && (
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivery Partner</p>
                      <p className="text-sm text-gray-700">{order.riderName}</p>
                      <p className="text-sm text-gray-600">{order.riderPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/profile')}
            className="flex-1"
          >
            View All Orders
          </Button>
          {order.status === 'delivered' && (
            <Button
              onClick={() => {/* TODO: Open review modal */}}
              className="flex-1"
            >
              Rate Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderMapPage;
