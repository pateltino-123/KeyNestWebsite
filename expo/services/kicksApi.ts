const API_BASE_URL = "https://api.kicks.dev/v2";
const API_KEY = process.env.EXPO_PUBLIC_KICKS_API_KEY || "";

let apiAvailable = true;
let lastApiCheck = 0;
const API_RETRY_INTERVAL = 60000; // Retry API every 60 seconds after failure

export interface KicksProduct {
  id: string;
  title: string;
  brand: string;
  sku?: string;
  colorway?: string;
  gender?: string;
  retail_price?: number;
  release_date?: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  image?: string;
  thumbnail?: string;
  media?: {
    imageUrl?: string;
    thumbUrl?: string;
    smallImageUrl?: string;
  };
  lowest_price?: number;
  highest_price?: number;
  last_sale_price?: number;
  sales_last_72h?: number;
  deadstock_sold?: number;
  volatility?: number;
}

export interface KicksSearchResponse {
  data: KicksProduct[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface KicksProductDetails extends KicksProduct {
  sizes?: {
    size: string;
    lowest_ask?: number;
    highest_bid?: number;
  }[];
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<any> {
  const now = Date.now();
  
  // Skip API calls if we know it's failing (with periodic retry)
  if (!apiAvailable && (now - lastApiCheck) < API_RETRY_INTERVAL) {
    return null;
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Authorization": API_KEY,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 500 || response.status === 503 || response.status === 401) {
        apiAvailable = false;
        lastApiCheck = now;
      }
      return null;
    }

    apiAvailable = true;
    const data = await response.json();
    return data;
  } catch {
    apiAvailable = false;
    lastApiCheck = now;
    return null;
  }
}

const CLOTHING_KEYWORDS = [
  "hoodie", "t-shirt", "tee", "shirt", "pants", "shorts", "jacket",
  "hat", "cap", "beanie", "socks", "backpack", "bag", "apparel",
  "jersey", "sweatshirt", "crewneck", "pullover", "vest", "coat",
  "sweater", "polo", "tank", "jogger", "legging", "tracksuit",
  "windbreaker", "puffer", "fleece", "cardigan", "boxers", "underwear",
  "gloves", "scarf", "headband", "wristband", "duffle", "tote",
  "wallet", "keychain", "lanyard", "sticker", "poster", "figurine",
  "toy", "collectible", "accessory", "watch", "sunglasses", "belt"
];

const SHOE_KEYWORDS = [
  "shoe", "sneaker", "boot", "loafer", "oxford", "sandal", "slide",
  "runner", "trainer", "basketball", "jordan", "dunk", "air max",
  "yeezy", "foam", "clog", "mule", "slip-on", "high-top", "low-top",
  "mid", "retro", "force 1", "blazer", "cortez", "waffle", "pegasus",
  "gel-", "ultraboost", "nmd", "superstar", "stan smith", "chuck",
  "old skool", "sk8", "authentic", "era", "550", "574", "990", "2002r"
];

function isShoeProduct(product: KicksProduct): boolean {
  const title = product.title?.toLowerCase() || "";
  
  for (const keyword of CLOTHING_KEYWORDS) {
    if (title.includes(keyword)) {
      console.log(`[KicksDB] Filtered out clothing: ${product.title}`);
      return false;
    }
  }
  
  const hasShoeKeyword = SHOE_KEYWORDS.some(keyword => title.includes(keyword));
  
  if (!hasShoeKeyword) {
    const looksLikeShoe = 
      title.includes("nike") || 
      title.includes("adidas") || 
      title.includes("jordan") || 
      title.includes("new balance") ||
      title.includes("puma") ||
      title.includes("reebok") ||
      title.includes("converse") ||
      title.includes("vans") ||
      title.includes("asics");
    
    if (!looksLikeShoe) {
      console.log(`[KicksDB] Filtered out non-shoe: ${product.title}`);
      return false;
    }
  }
  
  return true;
}

export async function searchProducts(query: string): Promise<KicksProduct[]> {
  const response = await fetchWithAuth(`/search?query=${encodeURIComponent(query + " shoes")}&limit=50`);
  
  if (response) {
    const products = response.data || response.products || response.results || response || [];
    
    if (Array.isArray(products) && products.length > 0) {
      const shoesOnly = products.filter(isShoeProduct).filter(p => {
        const hasImage = getProductImage(p) !== null;
        if (!hasImage) {
          console.log(`[KicksDB] Filtered out shoe without image: ${p.title}`);
        }
        return hasImage;
      });
      const sorted = shoesOnly.sort((a, b) => getCommonShoeScore(b) - getCommonShoeScore(a));
      console.log(`[KicksDB] Returning ${sorted.length} shoes with images`);
      return sorted.length > 0 ? sorted : [];
    }
  }
  
  console.log(`[KicksDB] No API results for: ${query}`);
  return [];
}

export async function getProductById(productId: string): Promise<KicksProductDetails | null> {
  const response = await fetchWithAuth(`/products/${productId}`);
  
  if (response) {
    return response.data || response.product || response || null;
  }
  
  const fallback = FALLBACK_SHOE_DATA.find(s => s.id === productId);
  return fallback || null;
}

export async function searchByBrand(brand: string): Promise<KicksProduct[]> {
  const response = await fetchWithAuth(`/search?query=${encodeURIComponent(brand + " shoes")}&limit=50`);
  
  if (response) {
    const products = response.data || response.products || response.results || response || [];
    if (Array.isArray(products) && products.length > 0) {
      const shoesOnly = products.filter(isShoeProduct).filter(p => getProductImage(p) !== null);
      const sorted = shoesOnly.sort((a, b) => getCommonShoeScore(b) - getCommonShoeScore(a));
      return sorted.length > 0 ? sorted : [];
    }
  }
  
  return [];
}

export async function getTrendingProducts(): Promise<KicksProduct[]> {
  const response = await fetchWithAuth(`/search?query=popular sneakers 2024&limit=50`);
  
  if (response) {
    const products = response.data || response.products || response.results || response || [];
    if (Array.isArray(products) && products.length > 0) {
      const shoesOnly = products.filter(isShoeProduct).filter(p => getProductImage(p) !== null);
      const sorted = shoesOnly.sort((a, b) => getCommonShoeScore(b) - getCommonShoeScore(a));
      return sorted.length > 0 ? sorted : [];
    }
  }
  
  return [];
}

export async function searchSneakers(query: string = "sneakers"): Promise<KicksProduct[]> {
  const response = await fetchWithAuth(`/search?query=${encodeURIComponent(query)}&limit=50`);
  
  if (response) {
    const products = response.data || response.products || response.results || response || [];
    if (Array.isArray(products) && products.length > 0) {
      const shoesOnly = products.filter(isShoeProduct).filter(p => getProductImage(p) !== null);
      const sorted = shoesOnly.sort((a, b) => getCommonShoeScore(b) - getCommonShoeScore(a));
      return sorted.length > 0 ? sorted : [];
    }
  }
  
  return [];
}

function getProductImage(product: KicksProduct): string | null {
  const possibleImages = [
    product.image_url,
    product.thumbnail_url,
    product.image,
    product.thumbnail,
    product.media?.imageUrl,
    product.media?.thumbUrl,
    product.media?.smallImageUrl,
  ];
  
  for (const img of possibleImages) {
    if (img && typeof img === 'string' && img.startsWith('http')) {
      return img;
    }
  }
  
  return null;
}

export function mapKicksProductToShoe(product: KicksProduct) {
  const price = product.retail_price || product.lowest_price || product.last_sale_price || 150;
  
  const category = detectCategory(product.title, product.brand);
  
  const imageUrl = getProductImage(product);
  
  if (!imageUrl) {
    return null;
  }
  
  const seededRandom = (product.id?.charCodeAt(0) || 0) % 100;
  const rating = Math.min(4.6, 4.2 + (seededRandom / 100) * 0.4);
  
  const buyLinks = generateBuyLinks(product.title, product.brand, product.sku);
  
  return {
    id: product.id || `shoe-${product.sku || product.title}`.replace(/\s+/g, '-'),
    name: product.title || "Sneaker",
    brand: cleanBrandName(product.brand || "Unknown"),
    price: Math.round(price),
    category,
    activityType: getActivityType(category),
    images: [imageUrl],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    colors: product.colorway ? [product.colorway] : ["Various"],
    description: product.description || `${product.title} by ${product.brand}`,
    materials: ["Premium materials"],
    sizingTip: getSizingTip(product.brand || ""),
    widthFit: "normal" as const,
    archSupport: "medium" as const,
    rating: Number(rating.toFixed(1)),
    reviewCount: Math.floor(seededRandom * 20) + 100,
    sku: product.sku,
    lowestPrice: product.lowest_price,
    highestPrice: product.highest_price,
    lastSalePrice: product.last_sale_price,
    buyLinks,
  };
}

function generateBuyLinks(title: string, brand: string, sku?: string): { name: string; url: string; icon: string }[] {
  const searchQuery = encodeURIComponent(`${brand} ${title}`);
  const skuQuery = sku ? encodeURIComponent(sku) : searchQuery;
  
  return [
    {
      name: "StockX",
      url: `https://stockx.com/search?s=${skuQuery}`,
      icon: "shopping-bag",
    },
    {
      name: "GOAT",
      url: `https://www.goat.com/search?query=${searchQuery}`,
      icon: "shopping-cart",
    },
    {
      name: "Nike",
      url: `https://www.nike.com/w?q=${searchQuery}`,
      icon: "external-link",
    },
  ];
}

export async function searchProductsUnder200(query: string): Promise<KicksProduct[]> {
  const products = await searchProducts(query + " shoes");
  return products.filter(p => {
    const price = p.retail_price || p.lowest_price || p.last_sale_price || 150;
    return price <= 200;
  });
}

function isSimpleColorway(product: KicksProduct): boolean {
  const colorway = product.colorway?.toLowerCase() || "";
  const title = product.title?.toLowerCase() || "";
  
  const limitedKeywords = [
    "limited", "special", "exclusive", "rare", "collab", "collaboration",
    "pe", "sample", "promo", "friends and family", "f&f", "quickstrike",
    "tier zero", "hypercolor", "iridescent", "reflective"
  ];
  
  for (const keyword of limitedKeywords) {
    if (title.includes(keyword) || colorway.includes(keyword)) {
      return false;
    }
  }
  
  const simpleColorways = [
    "white", "black", "grey", "gray", "red", "blue", "green",
    "triple white", "triple black", "all white", "all black",
    "white/black", "black/white", "core black", "cloud white"
  ];
  
  return simpleColorways.some(simple => 
    colorway.includes(simple) || title.includes(simple)
  );
}

function getCommonShoeScore(product: KicksProduct): number {
  let score = 0;
  
  if (isSimpleColorway(product)) {
    score += 100;
  }
  
  const title = product.title?.toLowerCase() || "";
  const commonModels = [
    "air force 1", "dunk low", "chuck taylor", "old skool", "samba",
    "stan smith", "superstar", "club c", "550", "574", "air max 90",
    "blazer", "cortez", "suede classic"
  ];
  
  if (commonModels.some(model => title.includes(model))) {
    score += 50;
  }
  
  const price = product.retail_price || product.lowest_price || 150;
  if (price <= 150) {
    score += 30;
  } else if (price <= 200) {
    score += 10;
  }
  
  return score;
}

export async function getHomeRecommendations(): Promise<KicksProduct[]> {
  console.log("[KicksDB] Fetching home recommendations");
  
  const queries = [
    "nike running shoes",
    "adidas running shoes", 
    "new balance running shoes",
  ];
  
  const allProducts: KicksProduct[] = [];
  
  for (const query of queries) {
    const products = await searchProducts(query);
    allProducts.push(...products);
  }
  
  const uniqueProducts = Array.from(
    new Map(allProducts.map(p => [p.id, p])).values()
  );
  
  const under200 = uniqueProducts.filter(p => {
    const price = p.retail_price || p.lowest_price || p.last_sale_price || 150;
    return price <= 200;
  });
  
  const sorted = under200.sort((a, b) => getCommonShoeScore(b) - getCommonShoeScore(a));
  
  console.log("[KicksDB] Home recommendations:", sorted.length);
  return sorted.slice(0, 12);
}

export async function getPopularShoes(): Promise<KicksProduct[]> {
  console.log("[KicksDB] Fetching popular shoes");
  
  const queries = [
    "puma running shoes",
    "asics running shoes",
    "reebok running shoes",
  ];
  
  const allProducts: KicksProduct[] = [];
  
  for (const query of queries) {
    const products = await searchProducts(query);
    allProducts.push(...products);
  }
  
  const uniqueProducts = Array.from(
    new Map(allProducts.map(p => [p.id, p])).values()
  );
  
  const under200 = uniqueProducts.filter(p => {
    const price = p.retail_price || p.lowest_price || p.last_sale_price || 150;
    return price <= 200;
  });
  
  const sorted = under200.sort((a, b) => getCommonShoeScore(b) - getCommonShoeScore(a));
  
  console.log("[KicksDB] Popular shoes:", sorted.length);
  return sorted.slice(0, 12);
}

function cleanBrandName(brand: string): string {
  if (!brand) return "Unknown";
  
  const brandMap: Record<string, string> = {
    "nike": "Nike",
    "adidas": "Adidas",
    "new balance": "New Balance",
    "puma": "Puma",
    "reebok": "Reebok",
    "asics": "ASICS",
    "on": "On",
    "hoka": "Hoka",
    "saucony": "Saucony",
    "skechers": "Skechers",
    "brooks": "Brooks",
    "under armour": "Under Armour",
  };
  
  const lowerBrand = brand.toLowerCase();
  return brandMap[lowerBrand] || brand;
}

function detectCategory(title: string, _brand: string): "running" | "medical" {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("diabetic") || lowerTitle.includes("ortho") || lowerTitle.includes("medical")) {
    return "medical";
  }
  return "running";
}

function getActivityType(category: string): string[] {
  if (category === "medical") return ["everyday", "walking"];
  return ["running", "training"];
}

function getSizingTip(brand: string): string {
  const tips: Record<string, string> = {
    "nike": "Nike running shoes generally fit true to size",
    "adidas": "Adidas running shoes fit true to size; Adizero models fit snug",
    "new balance": "New Balance runs wide with excellent width options",
    "asics": "ASICS fits true to size with wide width availability",
    "on": "On fits true to size with a snug performance fit",
    "hoka": "Hoka fits true to size with a roomy toe box",
    "saucony": "Saucony fits true to size; racing models run narrow",
    "puma": "Puma Nitro running shoes fit true to size",
    "reebok": "Reebok FloatZig fits true to size",
    "skechers": "Skechers performance running shoes fit true to size",
    "brooks": "Brooks fits true to size with excellent width options",
    "under armour": "Under Armour running shoes generally fit true to size",
  };
  
  const lowerBrand = brand.toLowerCase();
  return tips[lowerBrand] || "Check sizing guide for best fit";
}

const FALLBACK_SHOE_DATA: KicksProduct[] = [
  {
    id: "fallback-1",
    title: "Nike Dunk Low Retro",
    brand: "Nike",
    sku: "DD1391-100",
    colorway: "White/Black",
    gender: "Men",
    retail_price: 110,
    description: "The Nike Dunk Low Retro brings back the classic 1985 basketball design with premium leather and iconic color blocking.",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-2",
    title: "Jordan 1 Retro High OG",
    brand: "Jordan",
    sku: "DZ5485-612",
    colorway: "Varsity Red/White",
    gender: "Men",
    retail_price: 180,
    description: "The Air Jordan 1 Retro High OG continues to set the standard for sneaker culture with its timeless design.",
    image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-3",
    title: "New Balance 550",
    brand: "New Balance",
    sku: "BB550WT1",
    colorway: "White/Green",
    gender: "Unisex",
    retail_price: 130,
    description: "The New Balance 550 returns from the archives with its vintage basketball styling and premium leather upper.",
    image_url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-4",
    title: "Adidas Samba OG",
    brand: "Adidas",
    sku: "B75806",
    colorway: "Core Black/White",
    gender: "Unisex",
    retail_price: 100,
    description: "The Adidas Samba OG is a timeless classic that has transitioned from the pitch to the streets with ease.",
    image_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-5",
    title: "Nike Air Force 1 Low",
    brand: "Nike",
    sku: "CW2288-111",
    colorway: "Triple White",
    gender: "Men",
    retail_price: 115,
    description: "The Nike Air Force 1 Low remains an icon of street style with its classic silhouette and Air cushioning.",
    image_url: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-6",
    title: "Brooks Ghost 18",
    brand: "Brooks",
    sku: "110431-001",
    colorway: "Black/White",
    gender: "Men",
    retail_price: 180,
    description: "The Brooks Ghost 18 delivers soft DNA LOFT v3 cushioning and a smooth ride for everyday road running.",
    image_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-7",
    title: "Nike Air Max 90",
    brand: "Nike",
    sku: "CN8490-100",
    colorway: "White/Black/Cool Grey",
    gender: "Men",
    retail_price: 130,
    description: "The Nike Air Max 90 stays true to its OG running roots with visible Max Air and classic design.",
    image_url: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-8",
    title: "Vans Old Skool",
    brand: "Vans",
    sku: "VN000D3HY28",
    colorway: "Black/White",
    gender: "Unisex",
    retail_price: 70,
    description: "The Vans Old Skool is the first Vans shoe to feature the iconic side stripe and remains a skateboarding staple.",
    image_url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-9",
    title: "Puma Suede Classic",
    brand: "Puma",
    sku: "352634-03",
    colorway: "Black/White",
    gender: "Unisex",
    retail_price: 75,
    description: "The Puma Suede Classic is an iconic sneaker that has been a staple of street culture since 1968.",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-10",
    title: "ASICS Gel-Kayano 30",
    brand: "ASICS",
    sku: "1011B548-001",
    colorway: "Black/Electric Red",
    gender: "Men",
    retail_price: 160,
    description: "The ASICS Gel-Kayano 30 offers maximum support and comfort for overpronators.",
    image_url: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-11",
    title: "Reebok Club C 85",
    brand: "Reebok",
    sku: "AR0456",
    colorway: "Chalk/Green",
    gender: "Unisex",
    retail_price: 85,
    description: "The Reebok Club C 85 is a tennis-inspired classic with a clean, minimalist design.",
    image_url: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400&h=400&fit=crop",
  },
  {
    id: "fallback-12",
    title: "Nike Blazer Mid 77",
    brand: "Nike",
    sku: "BQ6806-100",
    colorway: "White/Black",
    gender: "Unisex",
    retail_price: 105,
    description: "The Nike Blazer Mid 77 brings back the vintage basketball look with premium leather and retro styling.",
    image_url: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400&h=400&fit=crop",
  },
];


