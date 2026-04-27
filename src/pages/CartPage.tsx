import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const DELIVERY_FEE = 25;
const FREE_DELIVERY_ABOVE = 499;

const CartPage = () => {
  const { items, updateQty, removeFromCart, totalPrice, clearCart } = useCart();

  const deliveryFee = totalPrice >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const grandTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center animate-fade-in">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add items to get started</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-bold text-sm hover:bg-accent/90 transition-colors">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 md:py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Your Cart ({items.length} items)</h1>
        <button onClick={clearCart} className="text-sm text-destructive hover:underline">Clear all</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex items-center gap-4 bg-card rounded-xl border border-border p-3 animate-fade-in">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="text-sm font-semibold text-foreground line-clamp-1 hover:underline">{product.name}</Link>
                <p className="text-xs text-muted-foreground">{product.quantity}</p>
                <p className="text-sm font-bold text-foreground mt-0.5">₹{product.price * qty}</p>
              </div>
              <div className="flex items-center gap-0 rounded-lg overflow-hidden border border-accent shrink-0">
                <button onClick={() => updateQty(product.id, qty - 1)} className="w-8 h-8 flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-accent bg-card">{qty}</span>
                <button onClick={() => updateQty(product.id, qty + 1)} className="w-8 h-8 flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button onClick={() => removeFromCart(product.id)} className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0">
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl border border-border p-5 h-fit sticky top-20">
          <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground font-medium">₹{totalPrice}</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="text-foreground font-medium">{deliveryFee === 0 ? <span className="text-accent">FREE</span> : `₹${deliveryFee}`}</span>
            </div>
            {totalPrice < FREE_DELIVERY_ABOVE && (
              <p className="text-xs text-accent">Add ₹{FREE_DELIVERY_ABOVE - totalPrice} more for free delivery</p>
            )}
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between text-base font-bold"><span className="text-foreground">Total</span><span className="text-foreground">₹{grandTotal}</span></div>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 transition-colors"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
