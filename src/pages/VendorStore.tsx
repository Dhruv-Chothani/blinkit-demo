import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import localStorageService from "@/services/localStorageService";
import { SlidersHorizontal, ArrowLeft, Store, Star, Mail, Phone, MapPin, Shield } from "lucide-react";

type SortOption = "default" | "low-high" | "high-low";

const VendorStore = () => {
  const { id } = useParams();
  const [sort, setSort] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(800);

  // Get vendor information
  const vendor = useMemo(() => {
    const vendors = localStorageService.getVendors();
    return vendors.find(v => v.id === id);
  }, [id]);

  // Get vendor's products
  const vendorProducts = useMemo(() => {
    return localStorageService.getProductsByVendor(id || '');
  }, [id]);

  const filtered = useMemo(() => {
    let list = vendorProducts.filter((p) => p.price <= maxPrice);
    if (sort === "low-high") list.sort((a, b) => a.price - b.price);
    if (sort === "high-low") list.sort((a, b) => b.price - a.price);
    return list;
  }, [vendorProducts, sort, maxPrice]);

  // Get categories for this vendor
  const categories = useMemo(() => {
    const categorySet = new Set();
    vendorProducts.forEach(product => {
      categorySet.add(product.category);
    });
    return Array.from(categorySet);
  }, [vendorProducts]);

  if (!vendor) return <div className="container py-12 text-center text-muted-foreground">Vendor not found</div>;

  return (
    <div className="container py-4 md:py-6 space-y-4">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Vendor Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <Store className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{vendor.storeName}</h1>
                <p className="text-sm text-muted-foreground mb-2">{vendor.name}</p>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.5</span>
                    <span className="text-xs text-muted-foreground">(234 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Verified Vendor</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{vendor.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{vendorProducts.length}</div>
          <div className="text-sm text-muted-foreground">Products</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{categories.length}</div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <div className="text-2xl font-bold text-foreground">4.5</div>
          <div className="text-sm text-muted-foreground">Rating</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <div className="text-2xl font-bold text-foreground">234</div>
          <div className="text-sm text-muted-foreground">Reviews</div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3">Categories Available</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground">({filtered.length} items)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-foreground" />
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-sm bg-muted border-0 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="default">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} md:block w-56 shrink-0`}>
          <div className="bg-card rounded-xl border border-border p-4 sticky top-20 space-y-4">
            <h3 className="font-semibold text-foreground">Filters</h3>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Max Price: ₹{maxPrice}</label>
              <input type="range" min={10} max={800} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-accent" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Categories</label>
              <div className="space-y-1">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input type="checkbox" className="accent-accent rounded" defaultChecked />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">No products match your filters</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorStore;
