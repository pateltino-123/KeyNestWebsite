export interface PricePoint {
  date: string;
  price: number;
  retailer: string;
}

export interface RetailerPrice {
  retailer: string;
  currentPrice: number;
  originalPrice: number;
  url: string;
  inStock: boolean;
  shipping: string;
  authenticity: string;
}

export interface DealInfo {
  shoeId: string;
  dealScore: number;
  currentLowest: number;
  retailPrice: number;
  historicalLow: number;
  historicalHigh: number;
  priceHistory: PricePoint[];
  retailers: RetailerPrice[];
  lastUpdated: string;
  priceChange30d: number;
  isNewLow: boolean;
}

const generatePriceHistory = (
  basePrice: number,
  shoeId: string
): PricePoint[] => {
  const retailers = ["StockX", "GOAT", "Flight Club"];
  const points: PricePoint[] = [];
  const now = new Date();

  for (let i = 90; i >= 0; i -= 3) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    retailers.forEach((retailer) => {
      const seed = (parseInt(shoeId) * 7 + i * 13 + retailers.indexOf(retailer) * 31) % 100;
      const variance = (seed - 50) / 100;
      const price = Math.round(basePrice * (1 + variance * 0.3));
      points.push({ date: dateStr, price, retailer });
    });
  });

  return points;
};

const generateRetailers = (basePrice: number, shoeId: string): RetailerPrice[] => {
  const seed = parseInt(shoeId) * 17;
  return [
    {
      retailer: "StockX",
      currentPrice: Math.round(basePrice * (0.85 + (seed % 30) / 100)),
      originalPrice: basePrice,
      url: `https://stockx.com/search?s=${shoeId}`,
      inStock: true,
      shipping: "Free shipping",
      authenticity: "Verified authentic",
    },
    {
      retailer: "GOAT",
      currentPrice: Math.round(basePrice * (0.88 + ((seed + 7) % 25) / 100)),
      originalPrice: basePrice,
      url: `https://www.goat.com/search?query=${shoeId}`,
      inStock: true,
      shipping: "$10 shipping",
      authenticity: "Verified authentic",
    },
    {
      retailer: "Flight Club",
      currentPrice: Math.round(basePrice * (0.90 + ((seed + 13) % 20) / 100)),
      originalPrice: basePrice,
      url: `https://www.flightclub.com/catalogsearch/result/?q=${shoeId}`,
      inStock: (seed % 3) !== 0,
      shipping: "$12 shipping",
      authenticity: "100% authentic",
    },
    {
      retailer: "Nike.com",
      currentPrice: basePrice,
      originalPrice: basePrice,
      url: `https://www.nike.com`,
      inStock: (seed % 4) !== 0,
      shipping: "Free shipping over $50",
      authenticity: "Official store",
    },
  ];
};

const calculateDealScore = (currentLowest: number, retailPrice: number, historicalLow: number): number => {
  if (retailPrice === 0) return 50;
  const discountFromRetail = (retailPrice - currentLowest) / retailPrice;
  const proximityToLow = historicalLow > 0
    ? 1 - (currentLowest - historicalLow) / (retailPrice - historicalLow || 1)
    : 0.5;
  const score = Math.round((discountFromRetail * 60 + proximityToLow * 40) * 100) / 100;
  return Math.max(1, Math.min(100, Math.round(score)));
};

export const generateDealInfo = (shoeId: string, retailPrice: number): DealInfo => {
  const priceHistory = generatePriceHistory(retailPrice, shoeId);
  const retailers = generateRetailers(retailPrice, shoeId);
  const currentLowest = Math.min(...retailers.filter(r => r.inStock).map(r => r.currentPrice));
  const allPrices = priceHistory.map(p => p.price);
  const historicalLow = Math.min(...allPrices);
  const historicalHigh = Math.max(...allPrices);
  const recent = priceHistory.filter(p => {
    const d = new Date(p.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return d >= thirtyDaysAgo;
  });
  const oldestRecent = recent.length > 0 ? recent[0].price : retailPrice;
  const newestRecent = recent.length > 0 ? recent[recent.length - 1].price : retailPrice;
  const priceChange30d = oldestRecent > 0
    ? Math.round(((newestRecent - oldestRecent) / oldestRecent) * 100)
    : 0;

  return {
    shoeId,
    dealScore: calculateDealScore(currentLowest, retailPrice, historicalLow),
    currentLowest,
    retailPrice,
    historicalLow,
    historicalHigh,
    priceHistory,
    retailers,
    lastUpdated: new Date().toISOString(),
    priceChange30d,
    isNewLow: currentLowest <= historicalLow * 1.02,
  };
};

export const getDealScoreLabel = (score: number): { label: string; color: string } => {
  if (score >= 80) return { label: "Great Deal", color: "#10B981" };
  if (score >= 60) return { label: "Good Deal", color: "#3B82F6" };
  if (score >= 40) return { label: "Fair Price", color: "#F59E0B" };
  if (score >= 20) return { label: "Above Average", color: "#F97316" };
  return { label: "Overpriced", color: "#EF4444" };
};
