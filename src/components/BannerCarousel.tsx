import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "@/data/products";
import { CategoryIcon } from "@/components/CategoryIcon";

import bannerFruits from "@/assets/banner-fruits.jpg";
import bannerDairy from "@/assets/banner-dairy.jpg";
import bannerSnacks from "@/assets/banner-snacks.jpg";
import bannerBakery from "@/assets/banner-bakery.jpg";
import bannerBeverages from "@/assets/banner-beverages.jpg";

const bannerImages: Record<number, string> = {
  1: bannerFruits,
  2: bannerDairy,
  3: bannerSnacks,
  4: bannerBakery,
  5: bannerBeverages,
};

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((b) => (
          <div
            key={b.id}
            className="min-w-full h-44 md:h-56 relative"
          >
            <img
              src={bannerImages[b.id]}
              alt={b.title}
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={640}
              loading={b.id === 1 ? undefined : "lazy"}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10">
              {b.badge && b.badgeIcon && (
                <span className="inline-flex items-center gap-1.5 bg-card/90 text-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm w-fit mb-2">
                  <CategoryIcon name={b.badgeIcon} className="w-3.5 h-3.5" />
                  {b.badge}
                </span>
              )}
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-1 drop-shadow-md">{b.title}</h2>
              <p className="text-base md:text-lg font-semibold text-white/90 drop-shadow-sm">{b.subtitle}</p>
              <button className="mt-3 bg-card text-foreground font-bold text-sm px-5 py-2 rounded-full hover:bg-card/90 transition-colors shadow w-fit">
                Shop Now →
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors shadow">
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>
      <button onClick={() => setCurrent((c) => (c + 1) % banners.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors shadow">
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-card w-6" : "bg-card/40"}`} />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
