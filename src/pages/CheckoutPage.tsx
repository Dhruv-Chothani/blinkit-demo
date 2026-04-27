import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import localStorageService from "@/services/localStorageService";

const DELIVERY_FEE = 25;
const FREE_DELIVERY_ABOVE = 499;

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("upi");
  const [placed, setPlaced] = useState(false);
  const deliveryFee = totalPrice >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;

  if (items.length === 0 && !placed) {
    navigate("/cart");
    return null;
  }

  const handlePlace = () => {
    if (!user) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    try {
      // Create order items
      const orderItems = items.map(({ product, qty }) => ({
        id: localStorageService.generateId(),
        productId: product.id,
        productName: product.name,
        quantity: qty,
        price: product.price,
        total: product.price * qty
      }));

      // Group items by vendor to create separate orders
      const ordersByVendor = new Map();
      items.forEach(({ product, qty }) => {
        if (!ordersByVendor.has(product.vendorId)) {
          ordersByVendor.set(product.vendorId, {
            vendorId: product.vendorId,
            vendorName: product.vendorName,
            items: [],
            subtotal: 0
          });
        }
        const vendorOrder = ordersByVendor.get(product.vendorId);
        vendorOrder.items.push({
          id: localStorageService.generateId(),
          productId: product.id,
          productName: product.name,
          quantity: qty,
          price: product.price,
          total: product.price * qty
        });
        vendorOrder.subtotal += product.price * qty;
      });

      // Create orders for each vendor
      const grandTotal = totalPrice + deliveryFee;
      const deliveryFeePerOrder = deliveryFee / ordersByVendor.size;

      ordersByVendor.forEach((vendorOrder, vendorId) => {
        const order = {
          customerId: user.id,
          customerName: user.name,
          customerEmail: user.email,
          vendorId: vendorOrder.vendorId,
          vendorName: vendorOrder.vendorName,
          items: vendorOrder.items,
          total: vendorOrder.subtotal + deliveryFeePerOrder,
          status: 'pending' as const,
          deliveryStatus: 'preparing' as const,
          deliveryAddress: user.address || 'Default Address',
          paymentStatus: 'paid' as const,
        };

        localStorageService.addOrder(order);
      });

      clearCart();
      setPlaced(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const paymentOptions = [
    { id: "upi", label: "UPI", icon: Smartphone },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "cod", label: "Cash on Delivery", icon: Banknote },
  ];

  return (
    <div className="container py-4 md:py-8 max-w-2xl animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6">Checkout</h1>

      {/* Address */}
      <section className="bg-card rounded-xl border border-border p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Delivery Address</h3>
        <p className="text-sm text-muted-foreground">123 Main Street, Apartment 4B, Mumbai - 400001</p>
      </section>

      {/* Payment */}
      <section className="bg-card rounded-xl border border-border p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
        <div className="space-y-2">
          {paymentOptions.map((opt) => (
            <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${payment === opt.id ? "border-accent bg-accent/5" : "border-border hover:bg-muted"}`}>
              <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-accent" />
              <opt.icon className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="bg-card rounded-xl border border-border p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
        <div className="space-y-1.5 text-sm">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex justify-between">
              <span className="text-muted-foreground">{product.name} × {qty}</span>
              <span className="text-foreground">₹{product.price * qty}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-foreground">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">₹{totalPrice + deliveryFee}</span>
          </div>
        </div>
      </section>

      <button onClick={handlePlace} className="w-full py-3.5 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 transition-colors">
        Place Order · ₹{totalPrice + deliveryFee}
      </button>
    </div>
  );
};

export default CheckoutPage;
