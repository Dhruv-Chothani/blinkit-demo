import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import localStorageService from "@/services/localStorageService";
import { SlidersHorizontal, ArrowLeft, Store } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";

type SortOption = "default" | "low-high" | "high-low";

const CategoryPage = () => {
  const { id } = useParams();
  const [sort, setSort] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(800);

  // Get all products from localStorage
  const allProducts = localStorageService.getProducts();
  
  // Get products for this category
  const categoryProducts = useMemo(() => {
    return allProducts.filter((p) => p.category === id);
  }, [id, allProducts]);

  const filtered = useMemo(() => {
    let list = categoryProducts.filter((p) => p.price <= maxPrice);
    if (sort === "low-high") list.sort((a, b) => a.price - b.price);
    if (sort === "high-low") list.sort((a, b) => b.price - a.price);
    return list;
  }, [categoryProducts, sort, maxPrice]);

  // Get unique vendors for this category
  const vendors = useMemo(() => {
    const vendorSet = new Map();
    categoryProducts.forEach(product => {
      if (!vendorSet.has(product.vendorId)) {
        vendorSet.set(product.vendorId, {
          id: product.vendorId,
          name: product.vendorName,
          email: product.vendorEmail
        });
      }
    });
    return Array.from(vendorSet.values());
  }, [categoryProducts]);

  if (!id) return <div className="container py-12 text-center text-muted-foreground">Category not found</div>;

  return (
    <div className="container py-4 md:py-6 space-y-4">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-bold">{id.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground capitalize">{id}</h1>
          <span className="text-sm text-muted-foreground">({filtered.length} items)</span>
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

      {/* Vendors Section */}
      {vendors.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Store className="w-4 h-4" />
            Vendors in this Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                to={`/vendor/${vendor.id}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Store className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">Verified Vendor</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} md:block w-56 shrink-0`}>
          <div className="bg-card rounded-xl border border-border p-4 sticky top-20 space-y-4">
            <h3 className="font-semibold text-foreground">Filters</h3>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Max Price: ₹{maxPrice}</label>
              <input type="range" min={10} max={800} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-accent" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Vendors</label>
              <div className="space-y-1">
                {vendors.map(vendor => (
                  <label key={vendor.id} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input type="checkbox" className="accent-accent rounded" defaultChecked />
                    {vendor.name}
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

export default CategoryPage;
