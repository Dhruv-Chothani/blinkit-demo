import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { addToCart, updateQty, getQty } = useCart();
  const qty = getQty(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-card rounded-xl border border-border p-3 flex flex-col hover:shadow-md transition-shadow animate-fade-in relative">
      {discount > 0 && (
        <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
          {discount}% OFF
        </span>
      )}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="flex-1 flex flex-col">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-0.5">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">{product.quantity}</p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
          </div>
          {qty === 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-accent text-accent text-xs font-bold hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-0 rounded-lg overflow-hidden border border-accent">
              <button
                onClick={() => updateQty(product.id, qty - 1)}
                className="w-7 h-7 flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 h-7 flex items-center justify-center text-xs font-bold text-accent bg-card">{qty}</span>
              <button
                onClick={() => updateQty(product.id, qty + 1)}
                className="w-7 h-7 flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
