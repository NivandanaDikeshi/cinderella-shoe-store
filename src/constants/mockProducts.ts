export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  featured?: boolean;
  bestSeller?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "aurelia-crimson-heels",
    name: "Aurelia Crimson Heels",
    price: 6800,
    description: "Premium velvet-finish heels crafted for high-end events and formal evenings, featuring an elegant ankle strap and cushioned insole.",
    category: "Heels",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Crimson", "Classic Black", "Soft Nude"],
    images: ["/images/heels.jpg"],
    featured: true,
    bestSeller: false,
    rating: 4.8,
    reviewsCount: 34
  },
  {
    id: "seraphina-strappy-sandals",
    name: "Seraphina Strappy Sandals",
    price: 4200,
    description: "Elegant and breathable strappy sandals ideal for warm afternoons and casual seaside getaways, made with soft eco-friendly leather.",
    category: "Sandals",
    sizes: ["37", "38", "39", "40"],
    colors: ["Tan", "Beige", "Metallic Gold"],
    images: ["/images/sandals.jpg"],
    featured: false,
    bestSeller: true,
    rating: 4.6,
    reviewsCount: 22
  },
  {
    id: "velvet-blush-flats",
    name: "Velvet Blush Flats",
    price: 3800,
    description: "Sleek, round-toe flats featuring a luxury velvet texture and gold-plated details on the heel. Designed for all-day office comfort.",
    category: "Flats",
    sizes: ["36", "37", "38", "39"],
    colors: ["Rose Gold", "Classic Taupe", "Midnight Blue"],
    images: ["/images/flats.jpg"],
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviewsCount: 41
  },
  {
    id: "cinderella-glass-slippers",
    name: "Cinderella Crystal Heels",
    price: 12500,
    description: "A signature statement piece featuring light-catching crystal overlays and a sheer side design. Feel like royalty on your special day.",
    category: "Heels",
    sizes: ["36", "37", "38", "39"],
    colors: ["Silver Shimmer", "Clear Crystal"],
    images: ["/images/hero1.jpg"],
    featured: true,
    bestSeller: false,
    rating: 5.0,
    reviewsCount: 15
  },
  {
    id: "starlight-gold-pumps",
    name: "Starlight Gold Pumps",
    price: 8500,
    description: "Glossy gold pumps with a slender stiletto heel, ideal for wedding parties, formal receptions, and celebrations.",
    category: "Heels",
    sizes: ["37", "38", "39", "40"],
    colors: ["Brushed Gold", "Champagne Rose"],
    images: ["/images/hero2.jpg"],
    featured: false,
    bestSeller: true,
    rating: 4.7,
    reviewsCount: 29
  },
  {
    id: "cozy-plush-slippers",
    name: "Cozy Plush Slippers",
    price: 2900,
    description: "Ultra-soft plush slippers designed for ultimate home comfort. Keeps your steps warm and cushioned on lazy weekends.",
    category: "Slippers",
    sizes: ["38", "39", "40", "41"],
    colors: ["Blush Pink", "Heather Grey"],
    images: ["/images/slippers.jpg"],
    featured: false,
    bestSeller: false,
    rating: 4.5,
    reviewsCount: 18
  },
  {
    id: "vesper-matte-black-heels",
    name: "Vesper Matte Black Heels",
    price: 7200,
    description: "Classic pointed-toe matte black heels. The timeless wardrobe essential that transition seamlessly from corporate boardrooms to evening dinners.",
    category: "Heels",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Matte Black", "Deep Navy"],
    images: ["/images/hero3.jpg"],
    featured: true,
    bestSeller: true,
    rating: 4.8,
    reviewsCount: 52
  },
  {
    id: "elisa-comfort-wedges",
    name: "Elisa Comfort Wedges",
    price: 4800,
    description: "Premium cork wedges with cross-over leather straps. Designed with shock-absorbing soles for active, stylish outdoor comfort.",
    category: "Sandals",
    sizes: ["37", "38", "39", "40"],
    colors: ["Rich Tan", "Vanilla Cream"],
    images: ["/images/about-hero.jpg"],
    featured: false,
    bestSeller: false,
    rating: 4.7,
    reviewsCount: 16
  }
];
