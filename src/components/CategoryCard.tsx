import { Link } from "react-router-dom";
import { Category } from "@/data/products";
import { CategoryIcon } from "@/components/CategoryIcon";

const CategoryCard = ({ category }: { category: Category }) => (
  <Link
    to={`/category/${category.id}`}
    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5 animate-fade-in"
    style={{ backgroundColor: category.color }}
  >
    <CategoryIcon name={category.icon} className="w-8 h-8 md:w-10 md:h-10 text-foreground/80" />
    <span className="text-xs md:text-sm font-semibold text-foreground text-center leading-tight">{category.name}</span>
  </Link>
);

export default CategoryCard;
