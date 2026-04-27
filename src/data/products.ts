export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  quantity: string;
  image: string;
  description: string;
  brand: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Banner {
  id: number;
  title: string;
  image: string;
  subtitle: string;
  bg: string;
  badge?: string;
  badgeIcon?: string;
}

export interface PromoBanner {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  bg: string;
}

export const categories: Category[] = [
  { id: "fruits", name: "Fruits", icon: "apple", color: "hsl(0 80% 95%)" },
  { id: "vegetables", name: "Vegetables", icon: "leafy-green", color: "hsl(120 60% 93%)" },
  { id: "dairy", name: "Dairy & Bread", icon: "milk", color: "hsl(200 60% 93%)" },
  { id: "snacks", name: "Snacks", icon: "popcorn", color: "hsl(35 80% 93%)" },
  { id: "beverages", name: "Beverages", icon: "cup-soda", color: "hsl(280 60% 93%)" },
  { id: "meat", name: "Meat & Fish", icon: "drumstick", color: "hsl(10 70% 93%)" },
  { id: "bakery", name: "Bakery", icon: "croissant", color: "hsl(40 70% 93%)" },
  { id: "household", name: "Household", icon: "spray-can", color: "hsl(180 50% 93%)" },
  { id: "personal", name: "Personal Care", icon: "sparkles", color: "hsl(320 50% 93%)" },
  { id: "baby", name: "Baby Care", icon: "baby", color: "hsl(210 70% 93%)" },
  { id: "frozen", name: "Frozen", icon: "snowflake", color: "hsl(195 70% 93%)" },
  { id: "organic", name: "Organic", icon: "leaf", color: "hsl(100 60% 93%)" },
];

export const products: Product[] = [
  { id: "1", name: "Fresh Red Apples", category: "fruits", price: 149, originalPrice: 199, quantity: "1 kg", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop", description: "Crisp and juicy red apples, perfect for snacking or baking.", brand: "Farm Fresh", inStock: true },
  { id: "2", name: "Organic Bananas", category: "fruits", price: 49, quantity: "6 pcs", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop", description: "Naturally ripened organic bananas.", brand: "Green Valley", inStock: true },
  { id: "3", name: "Fresh Broccoli", category: "vegetables", price: 79, originalPrice: 99, quantity: "250 g", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop", description: "Farm fresh broccoli florets.", brand: "Farm Fresh", inStock: true },
  { id: "4", name: "Baby Spinach", category: "vegetables", price: 45, quantity: "200 g", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop", description: "Tender baby spinach leaves, washed and ready to use.", brand: "Green Valley", inStock: true },
  { id: "5", name: "Amul Toned Milk", category: "dairy", price: 30, quantity: "500 ml", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop", description: "Fresh toned milk packed with nutrients.", brand: "Amul", inStock: true },
  { id: "6", name: "Whole Wheat Bread", category: "dairy", price: 45, quantity: "400 g", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop", description: "Soft whole wheat bread, freshly baked.", brand: "Harvest Gold", inStock: true },
  { id: "7", name: "Classic Salted Chips", category: "snacks", price: 20, quantity: "52 g", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop", description: "Crispy and delicious salted potato chips.", brand: "Lay's", inStock: true },
  { id: "8", name: "Dark Chocolate Bar", category: "snacks", price: 99, originalPrice: 120, quantity: "100 g", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300&h=300&fit=crop", description: "Rich dark chocolate with 70% cocoa.", brand: "Cadbury", inStock: true },
  { id: "9", name: "Orange Juice", category: "beverages", price: 85, quantity: "1 L", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop", description: "100% pure orange juice, no added sugar.", brand: "Tropicana", inStock: true },
  { id: "10", name: "Green Tea", category: "beverages", price: 175, originalPrice: 210, quantity: "25 bags", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=300&h=300&fit=crop", description: "Premium green tea for a healthy lifestyle.", brand: "Lipton", inStock: true },
  { id: "11", name: "Fresh Chicken Breast", category: "meat", price: 280, quantity: "500 g", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=300&h=300&fit=crop", description: "Boneless chicken breast, hormone-free.", brand: "Fresh Farms", inStock: true },
  { id: "12", name: "Sourdough Loaf", category: "bakery", price: 120, quantity: "450 g", image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=300&h=300&fit=crop", description: "Artisan sourdough bread with crispy crust.", brand: "Baker's Delight", inStock: true },
  { id: "13", name: "Strawberries", category: "fruits", price: 199, quantity: "250 g", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop", description: "Sweet and fresh strawberries.", brand: "Berry Good", inStock: true },
  { id: "14", name: "Carrots", category: "vegetables", price: 35, quantity: "500 g", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop", description: "Crunchy fresh carrots.", brand: "Farm Fresh", inStock: true },
  { id: "15", name: "Greek Yogurt", category: "dairy", price: 65, quantity: "200 g", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", description: "Thick and creamy Greek yogurt.", brand: "Epigamia", inStock: true },
  { id: "16", name: "Mixed Nuts", category: "snacks", price: 350, originalPrice: 420, quantity: "250 g", image: "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=300&h=300&fit=crop", description: "Premium assorted dry fruits and nuts.", brand: "Nutraj", inStock: true },
  { id: "17", name: "Coconut Water", category: "beverages", price: 40, quantity: "200 ml", image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop", description: "Natural tender coconut water.", brand: "Raw Pressery", inStock: true },
  { id: "18", name: "Avocado", category: "fruits", price: 120, quantity: "1 pc", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop", description: "Ripe and ready-to-eat Hass avocado.", brand: "Imported", inStock: true },
  { id: "19", name: "Mangoes (Alphonso)", category: "fruits", price: 399, originalPrice: 499, quantity: "1 kg", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop", description: "Premium Alphonso mangoes, the king of fruits.", brand: "Ratnagiri Select", inStock: true },
  { id: "21", name: "Onions", category: "vegetables", price: 30, quantity: "1 kg", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=300&fit=crop", description: "Fresh red onions, essential for every kitchen.", brand: "Farm Fresh", inStock: true },
  { id: "22", name: "Potatoes", category: "vegetables", price: 35, quantity: "1 kg", image: "https://images.unsplash.com/photo-1518977676601-b53f82ber680?w=300&h=300&fit=crop", description: "Premium quality fresh potatoes.", brand: "Farm Fresh", inStock: true },
    { id: "23", name: "Paneer (Cottage Cheese)", category: "dairy", price: 90, quantity: "200 g", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop", description: "Soft and fresh paneer, great for curries.", brand: "Amul", inStock: true },
  { id: "24", name: "Curd (Dahi)", category: "dairy", price: 35, quantity: "400 g", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", description: "Thick and creamy curd, set naturally.", brand: "Mother Dairy", inStock: true },
  { id: "25", name: "Butter", category: "dairy", price: 55, quantity: "100 g", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop", description: "Creamy salted butter for toast and cooking.", brand: "Amul", inStock: true },
  { id: "26", name: "Peanut Butter", category: "snacks", price: 199, originalPrice: 249, quantity: "350 g", image: "https://images.unsplash.com/photo-1612187209234-3e1c184f898c?w=300&h=300&fit=crop", description: "Crunchy peanut butter with no added sugar.", brand: "MyFitness", inStock: true },
  { id: "27", name: "Instant Noodles", category: "snacks", price: 14, quantity: "70 g", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop", description: "Quick and tasty masala instant noodles.", brand: "Maggi", inStock: true },
  { id: "28", name: "Cola Drink", category: "beverages", price: 40, quantity: "750 ml", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop", description: "Chilled cola drink for refreshment.", brand: "Coca-Cola", inStock: true },
  { id: "29", name: "Mango Juice", category: "beverages", price: 25, quantity: "200 ml", image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop", description: "Real mango pulp juice, sweet and thick.", brand: "Maaza", inStock: true },
  { id: "30", name: "Salmon Fillet", category: "meat", price: 650, originalPrice: 799, quantity: "250 g", image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=300&h=300&fit=crop", description: "Fresh Atlantic salmon fillet, rich in omega-3.", brand: "SeaFresh", inStock: true },
  { id: "31", name: "Eggs (Free Range)", category: "dairy", price: 85, quantity: "12 pcs", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop", description: "Farm-fresh free range eggs.", brand: "Country Delight", inStock: true },
  { id: "32", name: "Croissants", category: "bakery", price: 149, quantity: "4 pcs", image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=300&fit=crop", description: "Buttery flaky French croissants.", brand: "Baker's Delight", inStock: true },
  { id: "33", name: "Garlic Bread", category: "bakery", price: 99, originalPrice: 129, quantity: "200 g", image: "https://images.unsplash.com/photo-1573140401552-3fab0b6608aa?w=300&h=300&fit=crop", description: "Cheesy garlic bread, ready to bake.", brand: "McCain", inStock: true },
  { id: "34", name: "Dish Wash Liquid", category: "household", price: 99, quantity: "500 ml", image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&h=300&fit=crop", description: "Effective grease-cutting dish wash gel.", brand: "Vim", inStock: true },
  { id: "35", name: "Floor Cleaner", category: "household", price: 120, originalPrice: 149, quantity: "1 L", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=300&fit=crop", description: "Disinfectant floor cleaner with fresh fragrance.", brand: "Lizol", inStock: true },
  { id: "36", name: "Shampoo", category: "personal", price: 180, quantity: "340 ml", image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop", description: "Anti-dandruff shampoo for clean, healthy hair.", brand: "Head & Shoulders", inStock: true },
  { id: "37", name: "Face Wash", category: "personal", price: 149, originalPrice: 199, quantity: "100 ml", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop", description: "Oil-control face wash for fresh skin.", brand: "Himalaya", inStock: true },
  { id: "38", name: "Baby Diapers", category: "baby", price: 499, originalPrice: 649, quantity: "40 pcs", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop", description: "Ultra-soft baby diapers with overnight protection.", brand: "Pampers", inStock: true },
  { id: "39", name: "Frozen Peas", category: "frozen", price: 65, quantity: "500 g", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop", description: "Quick-frozen green peas, farm fresh.", brand: "Safal", inStock: true },
  { id: "40", name: "Organic Honey", category: "organic", price: 299, originalPrice: 399, quantity: "500 g", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop", description: "Pure organic wild honey, unprocessed.", brand: "Dabur", inStock: true },
];

export const banners: Banner[] = [
  { id: 1, title: "Fresh Fruits & Veggies", subtitle: "Up to 40% OFF", bg: "hsl(45 100% 51%)", image: "/src/assets/banner-fruits.jpg", badge: "Farm Fresh", badgeIcon: "leaf" },
  { id: 2, title: "Dairy Essentials", subtitle: "Starting at ₹30", bg: "hsl(142 60% 45%)", image: "/src/assets/banner-dairy.jpg", badge: "Daily Needs", badgeIcon: "milk" },
  { id: 3, title: "Snack Time!", subtitle: "Buy 2 Get 1 Free", bg: "hsl(10 80% 55%)", image: "/src/assets/banner-snacks.jpg", badge: "Party Pack", badgeIcon: "popcorn" },
  { id: 4, title: "Weekend Special", subtitle: "Flat 30% OFF on Bakery", bg: "hsl(270 60% 50%)", image: "/src/assets/banner-bakery.jpg", badge: "Fresh Baked", badgeIcon: "croissant" },
  { id: 5, title: "Summer Coolers", subtitle: "Juices & Shakes from ₹25", bg: "hsl(195 80% 45%)", image: "/src/assets/banner-beverages.jpg", badge: "Beat the Heat", badgeIcon: "snowflake" },
];

export const promoBanners: PromoBanner[] = [
  { id: 1, title: "10 Min Delivery", subtitle: "Lightning fast to your door", icon: "zap", bg: "hsl(45 100% 96%)" },
  { id: 2, title: "Fresh Guarantee", subtitle: "Or 100% money back", icon: "circle-check", bg: "hsl(142 60% 95%)" },
  { id: 3, title: "Best Prices", subtitle: "Cheaper than supermarkets", icon: "badge-dollar-sign", bg: "hsl(200 60% 95%)" },
  { id: 4, title: "No Minimum Order", subtitle: "Order even ₹1 item", icon: "shopping-cart", bg: "hsl(280 50% 95%)" },
];

export const categoryPromoBanners: Record<string, { title: string; subtitle: string; bg: string; icon: string }> = {
  fruits: { title: "Fruit Fest! Up to 40% OFF", subtitle: "Farm fresh fruits delivered in minutes", bg: "hsl(0 70% 50%)", icon: "apple" },
  vegetables: { title: "Veggie Bonanza!", subtitle: "Green & fresh, straight from farms", bg: "hsl(142 60% 40%)", icon: "leafy-green" },
  dairy: { title: "Dairy Days Sale", subtitle: "Milk, curd, paneer & more at best prices", bg: "hsl(200 70% 45%)", icon: "milk" },
  snacks: { title: "Snack Attack!", subtitle: "Buy any 3 snacks & save 20%", bg: "hsl(35 80% 50%)", icon: "popcorn" },
  beverages: { title: "Summer Sippers", subtitle: "Cool drinks from ₹25 only", bg: "hsl(280 60% 50%)", icon: "cup-soda" },
  meat: { title: "Meat Monday", subtitle: "Premium cuts, freshly packed", bg: "hsl(10 70% 45%)", icon: "drumstick" },
  bakery: { title: "Bakery Delights", subtitle: "Freshly baked, straight from the oven", bg: "hsl(40 70% 45%)", icon: "croissant" },
  household: { title: "Home Essentials", subtitle: "Stock up on cleaning supplies", bg: "hsl(180 50% 40%)", icon: "spray-can" },
  personal: { title: "Self Care Sunday", subtitle: "Pamper yourself with top brands", bg: "hsl(320 50% 45%)", icon: "sparkles" },
  baby: { title: "Baby Care Deals", subtitle: "Trusted brands at best prices", bg: "hsl(210 70% 45%)", icon: "baby" },
  frozen: { title: "Frozen Favourites", subtitle: "Quick meals & frozen treats", bg: "hsl(195 70% 40%)", icon: "snowflake" },
  organic: { title: "Go Organic", subtitle: "Healthy living starts here", bg: "hsl(100 60% 40%)", icon: "leaf" },
};
