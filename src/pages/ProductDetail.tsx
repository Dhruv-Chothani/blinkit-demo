import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingCart, Truck, Shield, RotateCcw, Gift, Store, Star, Clock, Package } from "lucide-react";
import localStorageService from "@/services/localStorageService";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, updateQty, getQty } = useCart();
  
  // Get product from localStorage
  const product = localStorageService.getProductById(id || '');
  
  if (!product) return <div className="container py-12 text-center text-muted-foreground">Product not found</div>;

  const qty = getQty(product.id);
  const related = localStorageService.getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 6);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="container py-4 md:py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div className="bg-muted rounded-2xl overflow-hidden aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          {/* Vendor Information */}
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{product.vendorName}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-muted-foreground">4.5 (234 reviews)</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-extrabold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-sm font-bold">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Stock Information */}
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              {product.category}
            </span>
          </div>

          {/* Add to Cart Section */}
          <div className="flex items-center gap-3 mb-6">
            {qty === 0 ? (
              <button
                onClick={() => addToCart(product)}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4" /> 
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            ) : (
              <div className="flex items-center gap-0 rounded-xl overflow-hidden border-2 border-accent">
                <button onClick={() => updateQty(product.id, qty - 1)} className="w-11 h-11 flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 h-11 flex items-center justify-center text-lg font-bold text-accent bg-card">{qty}</span>
                <button onClick={() => updateQty(product.id, qty + 1)} className="w-11 h-11 flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted text-center">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-foreground">10 Min Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted text-center">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-foreground">100% Genuine</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted text-center">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-foreground">Easy Returns</span>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-foreground mb-2">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="text-foreground">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vendor</span>
                <span className="text-foreground">{product.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className="text-foreground">{product.stock} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Time</span>
                <span className="text-foreground">10-15 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer banner */}
      <div className="mt-6 rounded-2xl overflow-hidden shadow-sm" style={{ background: "linear-gradient(135deg, hsl(45 100% 51%), hsl(35 100% 55%))" }}>
        <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-3">
          <div className="flex items-center gap-3">
            <Gift className="w-7 h-7 text-card shrink-0" />
            <div>
              <h3 className="text-lg font-extrabold text-card">Combo Offer</h3>
              <p className="text-sm text-card/80">Buy 3 or more & get extra 10% OFF on this category</p>
            </div>
          </div>
          <Link to={`/category/${product.category}`} className="bg-card text-foreground font-bold text-sm px-5 py-2 rounded-full hover:bg-card/90 transition-colors shadow">
            Browse {product.category}
          </Link>
        </div>
      </div>

      {/* Vendor Section */}
      <div className="mt-6 bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Store className="w-4 h-4" />
              {product.vendorName}
            </h3>
            <p className="text-sm text-muted-foreground">Verified Vendor</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">4.5</span>
            </div>
            <p className="text-xs text-muted-foreground">234 reviews</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Quality products sourced directly from trusted vendors. Fast delivery guaranteed.
        </p>
        <Link 
          to={`/vendor/${product.vendorId}`}
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View Vendor Store →
        </Link>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-foreground mb-3">You May Also Like</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {related.map((p) => (
              <div key={p.id} className="min-w-[160px] max-w-[180px] shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
