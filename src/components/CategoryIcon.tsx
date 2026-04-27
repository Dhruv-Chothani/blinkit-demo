import {
  Apple, LeafyGreen, Milk, Popcorn, CupSoda, Drumstick, Croissant,
  SprayCan, Sparkles, Baby, Snowflake, Leaf, Zap, CircleCheck,
  BadgeDollarSign, ShoppingCart, Flame, TrendingUp, PartyPopper,
  Gift, Smartphone, Play, Tag, type LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  apple: Apple,
  "leafy-green": LeafyGreen,
  milk: Milk,
  popcorn: Popcorn,
  "cup-soda": CupSoda,
  drumstick: Drumstick,
  croissant: Croissant,
  "spray-can": SprayCan,
  sparkles: Sparkles,
  baby: Baby,
  snowflake: Snowflake,
  leaf: Leaf,
  zap: Zap,
  "circle-check": CircleCheck,
  "badge-dollar-sign": BadgeDollarSign,
  "shopping-cart": ShoppingCart,
  flame: Flame,
  "trending-up": TrendingUp,
  "party-popper": PartyPopper,
  gift: Gift,
  smartphone: Smartphone,
  play: Play,
  tag: Tag,
};

export const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = iconMap[name] || Apple;
  return <Icon className={className} />;
};
