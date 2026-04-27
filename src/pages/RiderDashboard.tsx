import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRiderAuth } from "@/context/RiderAuthContext";
import NewOrderPopup from "@/components/common/NewOrderPopup";
import OrderStatusTimeline from "@/components/common/OrderStatusTimeline";
import socketService, { SocketOrderData } from "@/services/socket";
import { 
  Users, 
  Store, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Settings,
  BarChart3,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  Navigation,
  RefreshCw,
  IndianRupee
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'picked' | 'onway' | 'delivered';
  timeAgo: string;
}

const RiderDashboard = () => {
  const { rider, logout } = useRiderAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState<SocketOrderData | null>(null);
  const [showNewOrderPopup, setShowNewOrderPopup] = useState(false);

  // Mock stats
  const [stats, setStats] = useState({
    totalDeliveries: 12,
    earningsToday: 2450,
    activeOrders: 3,
    rating: 4.8
  });

  const [earnings, setEarnings] = useState({
    today: 2450,
    weekly: 16800,
    monthly: 67200
  });

  // Mock orders data
  const mockOrders: Order[] = [
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
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    // Load online status from localStorage
    setIsOnline(localStorage.getItem('riderOnline') === 'true');

    // Simulate receiving a new order after 5 seconds
    const timer = setTimeout(() => {
      const simulatedNewOrder: SocketOrderData = {
        id: 'NEW' + Date.now(),
        customerId: 'customer123',
        customerName: 'Simulated Customer',
        customerAddress: '789 Marine Drive, Colaba, Mumbai - 400005',
        items: [
          { id: '1', name: 'Fresh Vegetables', quantity: 2, price: 150 },
          { id: '2', name: 'Bread', quantity: 1, price: 40 }
        ],
        totalAmount: 190,
        status: 'pending',
        vendorId: 'vendor123',
        vendorName: 'Fresh Mart',
        createdAt: new Date().toISOString()
      };
      
      setNewOrder(simulatedNewOrder);
      setShowNewOrderPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // New order handlers
  const handleAcceptOrder = (orderId: string) => {
    console.log('Order accepted:', orderId);
    
    // Update order status in local state
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'accepted' as const } : order
    );
    setOrders(updatedOrders);
    
    // Send to socket (mock)
    socketService.acceptOrder(orderId, rider?.id || '');
    
    // Update stats
    setStats(prev => ({
      ...prev,
      activeOrders: prev.activeOrders + 1
    }));
  };

  const handleRejectOrder = (orderId: string, reason: string) => {
    console.log('Order rejected:', orderId, reason);
    
    // Remove order from local state
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    
    // Send to socket (mock)
    socketService.rejectOrder(orderId, rider?.id || '', reason);
  };

  const handleCloseNewOrderPopup = () => {
    setShowNewOrderPopup(false);
    setNewOrder(null);
  };

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

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

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    localStorage.setItem('riderOnline', newStatus.toString());
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
    ));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
      'picked': 'bg-purple-100 text-purple-800 border-purple-200',
      'onway': 'bg-orange-100 text-orange-800 border-orange-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      'pending': 'Pending',
      'accepted': 'Accepted',
      'picked': 'Picked',
      'onway': 'On The Way',
      'delivered': 'Delivered'
    };
    return texts[status] || 'Pending';
  };

  const getNextStatus = (currentStatus: string) => {
    const flow = {
      'pending': 'accepted',
      'accepted': 'picked',
      'picked': 'onway',
      'onway': 'delivered',
      'delivered': null
    };
    return flow[currentStatus];
  };

  if (!rider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Rider Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {rider.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/rider/profile')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
                  <p className="text-xs text-muted-foreground">+20% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings Today</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.earningsToday}</div>
                  <p className="text-xs text-muted-foreground">+15% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeOrders}</div>
                  <p className="text-xs text-muted-foreground">2 need immediate attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.rating}</div>
                  <p className="text-xs text-muted-foreground">Excellent performance</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Online Status</CardTitle>
                  <CardDescription>Toggle your availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={toggleOnlineStatus}
                    className={`w-full ${isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-white' : 'bg-gray-300'}`} />
                    {isOnline ? 'Online' : 'Offline'}
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Update Location</CardTitle>
                  <CardDescription>Get current GPS coordinates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={updateLocation}
                    disabled={isUpdatingLocation}
                    className="w-full"
                  >
                    {isUpdatingLocation ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        Update Location
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="picked">Picked</SelectItem>
                      <SelectItem value="onway">On The Way</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <CardDescription>{order.timeAgo}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Customer</Label>
                        <p className="text-sm">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Address</Label>
                        <p className="text-sm">{order.address}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Items</Label>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-lg font-bold">Total: ₹{order.totalAmount}</div>
                      <div className="flex gap-2">
                        {getNextStatus(order.status) && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status)!)}
                          >
                            {getNextStatus(order.status) === 'accepted' && 'Accept Order'}
                            {getNextStatus(order.status) === 'picked' && 'Mark Picked'}
                            {getNextStatus(order.status) === 'onway' && 'On The Way'}
                            {getNextStatus(order.status) === 'delivered' && 'Mark Delivered'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{earnings.today}</div>
                  <p className="text-sm text-muted-foreground">Base: ₹{earnings.today - 450}</p>
                  <p className="text-sm text-green-600">Bonus: +₹450</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{earnings.weekly}</div>
                  <p className="text-sm text-green-600">+18.3% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{earnings.monthly}</div>
                  <p className="text-sm text-green-600">+12.5% growth</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Location</CardTitle>
                <CardDescription>Your current GPS coordinates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={updateLocation}
                  disabled={isUpdatingLocation}
                  className="w-full"
                >
                  {isUpdatingLocation ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Update Location
                    </>
                  )}
                </Button>
                
                {location.lat && location.lng ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-sm font-medium">Latitude</Label>
                      <p className="text-lg font-mono">{location.lat}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-sm font-medium">Longitude</Label>
                      <p className="text-lg font-mono">{location.lng}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Click "Update Location" to get coordinates</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Order Popup */}
      {showNewOrderPopup && newOrder && (
        <NewOrderPopup
          order={newOrder}
          onAccept={handleAcceptOrder}
          onReject={handleRejectOrder}
          onClose={handleCloseNewOrderPopup}
        />
      )}
    </div>
  );
};

export default RiderDashboard;
