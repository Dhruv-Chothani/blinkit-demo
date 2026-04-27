import { promoBanners } from "@/data/products";
import { CategoryIcon } from "@/components/CategoryIcon";

const PromoBannerStrip = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {promoBanners.map((b) => (
      <div
        key={b.id}
        className="flex items-center gap-3 rounded-xl p-3 md:p-4 border border-border"
        style={{ backgroundColor: b.bg }}
      >
        <CategoryIcon name={b.icon} className="w-7 h-7 md:w-8 md:h-8 text-foreground/70 shrink-0" />
        <div>
          <p className="text-sm font-bold text-foreground leading-tight">{b.title}</p>
          <p className="text-xs text-muted-foreground">{b.subtitle}</p>
        </div>
      </div>
    ))}
  </div>
);

export default PromoBannerStrip;
