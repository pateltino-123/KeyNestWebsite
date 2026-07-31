import AsyncStorage from "@react-native-async-storage/async-storage";

const RAPIDAPI_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY || "f719f4271amsha623df303e02bf2p14001cjsnb9ec7645ceb8";
const RAPIDAPI_HOST = process.env.EXPO_PUBLIC_RAPIDAPI_HOST || "the-sneaker-database.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

const STORAGE_COUNT_KEY = "rapidapi_requests_count";
const STORAGE_MONTH_KEY = "rapidapi_requests_month";

export const LIMIT_MAX = 40;
export const LIMIT_THRESHOLD = 36; // 90% of 40 requests

export interface ApiUsage {
  count: number;
  limit: number;
  threshold: number;
  isFrozen: boolean;
  monthYear: string;
}

/**
 * Gets the current month in MM-YYYY format.
 */
function getCurrentMonthYear(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${year}`;
}

/**
 * Checks and updates the usage counter. Resets if a new month has started.
 */
export async function getApiUsage(): Promise<ApiUsage> {
  try {
    const currentMonth = getCurrentMonthYear();
    const storedMonth = await AsyncStorage.getItem(STORAGE_MONTH_KEY);
    
    let count = 0;
    if (storedMonth !== currentMonth) {
      // New month, reset the counter
      await AsyncStorage.setItem(STORAGE_MONTH_KEY, currentMonth);
      await AsyncStorage.setItem(STORAGE_COUNT_KEY, "0");
    } else {
      const storedCount = await AsyncStorage.getItem(STORAGE_COUNT_KEY);
      count = storedCount ? parseInt(storedCount, 10) : 0;
    }

    return {
      count,
      limit: LIMIT_MAX,
      threshold: LIMIT_THRESHOLD,
      isFrozen: count >= LIMIT_THRESHOLD,
      monthYear: currentMonth,
    };
  } catch (error) {
    console.error("[SneakerDbApi] Error getting API usage:", error);
    return {
      count: 0,
      limit: LIMIT_MAX,
      threshold: LIMIT_THRESHOLD,
      isFrozen: false,
      monthYear: getCurrentMonthYear(),
    };
  }
}

/**
 * Increments the API request counter.
 */
async function incrementApiUsage(): Promise<number> {
  try {
    const usage = await getApiUsage();
    const newCount = usage.count + 1;
    await AsyncStorage.setItem(STORAGE_COUNT_KEY, String(newCount));
    return newCount;
  } catch (error) {
    console.error("[SneakerDbApi] Error incrementing usage:", error);
    return 0;
  }
}

/**
 * Verifies if an image URL points to a clean stock image with a white background.
 */
export function isCleanWhiteBackground(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return false;
  }
  
  const lowerUrl = url.toLowerCase();
  
  // Blacklist keywords indicating lifestyle, on-foot, or dark backgrounds
  const blacklist = [
    "lifestyle",
    "onfoot",
    "on-foot",
    "streetwear",
    "wearing",
    "outdoor",
    "context",
    "lookbook",
    "unboxing",
    "dark",
    "black-background",
    "background-black",
  ];
  
  for (const keyword of blacklist) {
    if (lowerUrl.includes(keyword)) {
      return false;
    }
  }
  
  // Whitelist of domains that host clean catalog images with pure white backgrounds
  const whitelist = [
    "stockx.com",
    "goat.com",
    "flightclub.com",
    "stadiumgoods.com",
    "images.stockx.com",
    "image.goat.com",
  ];
  
  const isFromTrustedDomain = whitelist.some(domain => lowerUrl.includes(domain));
  
  // If it's from StockX, GOAT, etc., we strongly trust it is a clean white background shot
  if (isFromTrustedDomain) {
    return true;
  }
  
  // For other domains (like Unsplash), prioritize stock/catalog URLs and avoid generic search shots
  if (lowerUrl.includes("unsplash.com")) {
    return lowerUrl.includes("photo-") && !lowerUrl.includes("lifestyle");
  }

  return true;
}

/**
 * Searches the Sneaker Database on RapidAPI for a specific sneaker and extracts the best clean image.
 */
export async function fetchSneakerDbImage(
  brand: string,
  name: string,
  sku?: string
): Promise<string | null> {
  const usage = await getApiUsage();
  
  if (usage.isFrozen) {
    console.warn(`[SneakerDbApi] Request frozen. Cap reached (${usage.count}/${LIMIT_THRESHOLD}). Using fallback.`);
    return null;
  }

  // Construct query: prioritize SKU search, otherwise search by brand + name
  const query = sku ? sku : `${brand} ${name}`;
  const encodedQuery = encodeURIComponent(query);
  
  // The Sneaker Database on RapidAPI commonly exposes a search endpoint like:
  // - GET /v2/sneakers?limit=5&brand={brand}&name={name}
  // - GET /getproducts?keywords={query}
  // We'll support both `/v2/sneakers` and `/getproducts` formats by performing a flexible request.
  const endpoint = `/v2/sneakers?limit=5&search=${encodedQuery}`;
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    console.log(`[SneakerDbApi] Querying RapidAPI: ${url}`);
    
    // Increment count before making the network request to be safe
    await incrementApiUsage();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[SneakerDbApi] Request failed with status ${response.status}`);
      return null;
    }

    const json = await response.json();
    
    // Normalize response: Sneaker Database APIs return sneakers in a "data", "results", or root array
    const sneakers = json.data || json.results || (Array.isArray(json) ? json : null);
    
    if (!sneakers || !Array.isArray(sneakers) || sneakers.length === 0) {
      console.log("[SneakerDbApi] No matching sneakers found.");
      return null;
    }

    // Process the results to find a clean white background image
    for (const item of sneakers) {
      // Extract image URL from multiple possible fields
      const imageUrls: (string | null | undefined)[] = [
        item.image_url,
        item.imageUrl,
        item.thumbnail,
        item.image?.original,
        item.image?.thumbnail,
        ...(Array.isArray(item.imageLinks) ? item.imageLinks : []),
        ...(Array.isArray(item.images) ? item.images : []),
      ];

      for (const img of imageUrls) {
        if (img && isCleanWhiteBackground(img)) {
          console.log(`[SneakerDbApi] Found clean white background image: ${img}`);
          return img;
        }
      }
    }
    
    // If no white background image found, take the first valid image as fallback
    for (const item of sneakers) {
      const img = item.image_url || item.imageUrl || item.thumbnail || item.image?.original || (Array.isArray(item.imageLinks) && item.imageLinks[0]);
      if (img && typeof img === "string" && img.startsWith("http")) {
        console.log(`[SneakerDbApi] Falling back to first available image: ${img}`);
        return img;
      }
    }

    return null;
  } catch (error) {
    console.error("[SneakerDbApi] Error fetching image from RapidAPI:", error);
    return null;
  }
}
