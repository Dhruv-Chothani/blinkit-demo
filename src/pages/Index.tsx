import { Link } from "react-router-dom";
import { ChevronRight, Flame, Tag, TrendingUp, Sparkles, Smartphone, PartyPopper, Play, LeafyGreen } from "lucide-react";
import BannerCarousel from "@/components/BannerCarousel";
import PromoBannerStrip from "@/components/PromoBannerStrip";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import localStorageService from "@/services/localStorageService";

// Get all products from localStorage (all vendors)
const allProducts = localStorageService.getProducts();
const bestSellers = allProducts.filter((p) => p.originalPrice);
const essentials = allProducts.filter((p) => ["dairy", "vegetables", "fruits"].includes(p.category)).slice(0, 10);
const trending = allProducts.filter((p) => ["snacks", "beverages"].includes(p.category));
const newArrivals = allProducts.slice(-8);
const under99 = allProducts.filter((p) => p.price < 100).slice(0, 8);

const Index = () => (
  <div className="min-h-screen">
    <div className="container py-4 space-y-6 md:space-y-8">
      {/* Banner */}
      <BannerCarousel />

      {/* Promo Strip */}
      <PromoBannerStrip />

      {/* Categories */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
            Best Sellers <Flame className="w-5 h-5 text-destructive" />
          </h2>
          <Link to="/category/snacks" className="text-sm font-semibold text-primary flex items-center gap-0.5 hover:underline">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {bestSellers.map((p) => (
            <div key={p.id} className="min-w-[160px] max-w-[180px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Mid-page Banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "linear-gradient(135deg, hsl(45 100% 51%), hsl(35 100% 55%))" }}>
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5 md:py-6">
          <div className="text-center md:text-left mb-3 md:mb-0 flex items-center gap-3">
            <PartyPopper className="w-8 h-8 text-card shrink-0" />
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold text-card">First Order? Get 20% OFF</h3>
              <p className="text-sm text-card/80 font-medium">Use code QUICKCART20 at checkout</p>
            </div>
          </div>
          <button className="bg-card text-foreground font-bold text-sm px-6 py-2.5 rounded-full hover:bg-card/90 transition-colors shadow">
            Order Now
          </button>
        </div>
      </div>

      {/* Under ₹99 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
            Under ₹99 <Tag className="w-5 h-5 text-primary" />
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {under99.map((p) => (
            <div key={p.id} className="min-w-[160px] max-w-[180px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Daily Essentials */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
            Daily Essentials <LeafyGreen className="w-5 h-5 text-primary" />
          </h2>
          <Link to="/category/dairy" className="text-sm font-semibold text-primary flex items-center gap-0.5 hover:underline">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {essentials.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Fresh Tomatoes Banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4 mb-3 md:mb-0">
            <img 
              src="https://cdn.britannica.com/16/187216-050-CB57A09B/tomatoes-tomato-plant-Fruit-vegetable.jpg?w=300" 
              alt="Fresh Tomatoes" 
              className="w-20 h-20 rounded-lg object-cover shadow-sm"
            />
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold text-red-600">Fresh & Juicy Tomatoes</h3>
              <p className="text-sm text-red-700/80 font-medium">Farm-fresh, vine-ripened tomatoes delivered daily</p>
            </div>
          </div>
          <Link 
            to="/category/vegetables" 
            className="bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-red-700 transition-colors shadow"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Trending Banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "linear-gradient(135deg, hsl(270 60% 50%), hsl(280 70% 60%))" }}>
        <div className="flex flex-col items-center justify-center px-6 py-5 text-center gap-2">
          <TrendingUp className="w-8 h-8 text-card" />
          <h3 className="text-xl md:text-2xl font-extrabold text-card">Trending This Week</h3>
          <p className="text-sm text-card/80 font-medium">Most ordered items by your neighbours</p>
        </div>
      </div>

      {/* Trending Products */}
      <section>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {trending.map((p) => (
            <div key={p.id} className="min-w-[160px] max-w-[180px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
            New Arrivals <Sparkles className="w-5 h-5 text-primary" />
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* App Download Banner */}
      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5">
          <div className="text-center md:text-left mb-3 md:mb-0 flex items-center gap-3">
            <Smartphone className="w-7 h-7 text-primary shrink-0" />
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">Get the QuickCart App</h3>
              <p className="text-sm text-muted-foreground">Exclusive app-only deals & faster checkout</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-foreground text-card text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" /> Google Play
            </button>
            <button className="bg-foreground text-card text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" /> App Store
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="border-t border-border pt-6 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-bold text-foreground mb-2">QuickCart</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">Your everyday grocery delivery app. Fresh produce, dairy, snacks and more — delivered in minutes.</p>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Categories</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}><Link to={`/category/${c.id}`} className="hover:text-foreground transition-colors">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Help</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">FAQs</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Contact Us</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Return Policy</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Shipping Info</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Follow Us</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Instagram</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Twitter</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Facebook</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© 2026 QuickCart. All rights reserved.</p>
      </footer>
    </div>
  </div>
);

export default Index;
