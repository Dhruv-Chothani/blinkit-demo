import { io, Socket } from 'socket.io-client';

// WebSocket service for real-time features
class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  connect() {
    try {
      // Connect to WebSocket server (placeholder URL)
      this.socket = io(process.env.VITE_SOCKET_URL || 'ws://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Socket connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.handleReconnect();
    });

    // Order events (for riders)
    this.socket.on('new_order', (orderData) => {
      console.log('New order received:', orderData);
      this.emit('new_order_notification', orderData);
    });

    this.socket.on('order_status_update', (orderData) => {
      console.log('Order status updated:', orderData);
      this.emit('order_status_update', orderData);
    });

    // User events (for customers)
    this.socket.on('order_accepted', (orderData) => {
      console.log('Order accepted by rider:', orderData);
      this.emit('order_accepted', orderData);
    });

    this.socket.on('rider_location_update', (locationData) => {
      console.log('Rider location updated:', locationData);
      this.emit('rider_location_update', locationData);
    });

    // Admin events
    this.socket.on('system_alert', (alertData) => {
      console.log('System alert:', alertData);
      this.emit('system_alert', alertData);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Public methods
  emit(event: string, data: any) {
    // Emit to local listeners (for now, just log)
    console.log(`Socket event: ${event}`, data);
    
    // In real implementation, this would emit to React components
    // through a context or event emitter
  }

  // Send events to server
  send(event: string, data: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot send event:', event);
    }
  }

  // Rider methods
  acceptOrder(orderId: string, riderId: string) {
    this.send('accept_order', { orderId, riderId, timestamp: new Date().toISOString() });
  }

  rejectOrder(orderId: string, riderId: string, reason: string) {
    this.send('reject_order', { orderId, riderId, reason, timestamp: new Date().toISOString() });
  }

  updateOrderStatus(orderId: string, status: string) {
    this.send('update_order_status', { orderId, status, timestamp: new Date().toISOString() });
  }

  updateLocation(riderId: string, location: { lat: number; lng: number }) {
    this.send('update_rider_location', { 
      riderId, 
      location, 
      timestamp: new Date().toISOString() 
    });
  }

  // User methods
  trackOrder(orderId: string) {
    this.send('track_order', { orderId, timestamp: new Date().toISOString() });
  }

  // Connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get socket instance (for direct access if needed)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

// Export types for TypeScript
export interface SocketOrderData {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered';
  vendorId: string;
  vendorName: string;
  createdAt: string;
}

export interface SocketLocationData {
  riderId: string;
  orderId?: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

export interface SocketNotificationData {
  id: string;
  type: 'order_update' | 'rider_location' | 'system_alert';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}
