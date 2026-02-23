import {
  searchProducts,
  getProductById,
  searchByBrand,
  getTrendingProducts,
  searchSneakers,
  mapKicksProductToShoe,
  searchProductsUnder200,
  getHomeRecommendations,
  getPopularShoes,
  KicksProduct,
} from '@/services/kicksApi';

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

const createMockProduct = (overrides: Partial<KicksProduct> = {}): KicksProduct => ({
  id: 'test-1',
  title: 'Nike Dunk Low Retro',
  brand: 'Nike',
  sku: 'DD1391-100',
  colorway: 'White/Black',
  gender: 'Men',
  retail_price: 110,
  description: 'Classic Nike Dunk',
  image_url: 'https://example.com/shoe.jpg',
  ...overrides,
});

describe('kicksApi service', () => {
  describe('mapKicksProductToShoe', () => {
    it('should map a KicksProduct to Shoe format', () => {
      const product = createMockProduct();
      const shoe = mapKicksProductToShoe(product);

      expect(shoe).not.toBeNull();
      expect(shoe!.id).toBe('test-1');
      expect(shoe!.name).toBe('Nike Dunk Low Retro');
      expect(shoe!.brand).toBe('Nike');
      expect(shoe!.price).toBe(110);
      expect(shoe!.images).toEqual(['https://example.com/shoe.jpg']);
      expect(shoe!.sizes).toBeDefined();
      expect(shoe!.sizes.length).toBeGreaterThan(0);
    });

    it('should return null if product has no image', () => {
      const product = createMockProduct({
        image_url: undefined,
        thumbnail_url: undefined,
        image: undefined,
        thumbnail: undefined,
        media: undefined,
      });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe).toBeNull();
    });

    it('should use retail_price when available', () => {
      const product = createMockProduct({ retail_price: 150 });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.price).toBe(150);
    });

    it('should fall back to lowest_price', () => {
      const product = createMockProduct({ retail_price: undefined, lowest_price: 120 });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.price).toBe(120);
    });

    it('should fall back to last_sale_price', () => {
      const product = createMockProduct({ retail_price: undefined, lowest_price: undefined, last_sale_price: 200 });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.price).toBe(200);
    });

    it('should default to 150 if no price is available', () => {
      const product = createMockProduct({ retail_price: undefined, lowest_price: undefined, last_sale_price: undefined });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.price).toBe(150);
    });

    it('should detect running category', () => {
      const product = createMockProduct({ title: 'Nike Pegasus Running Shoe' });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.category).toBe('running');
    });

    it('should detect athletic category', () => {
      const product = createMockProduct({ title: 'Nike Basketball Trainer' });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.category).toBe('athletic');
    });

    it('should detect formal category', () => {
      const product = createMockProduct({ title: 'Cole Haan Oxford Dress Shoe' });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.category).toBe('formal');
    });

    it('should default to casual category', () => {
      const product = createMockProduct({ title: 'Nike Dunk Low' });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.category).toBe('casual');
    });

    it('should clean brand names', () => {
      const product = createMockProduct({ brand: 'air jordan' });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.brand).toBe('Jordan');
    });

    it('should use thumbnail_url as fallback image', () => {
      const product = createMockProduct({
        image_url: undefined,
        thumbnail_url: 'https://example.com/thumb.jpg',
      });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.images).toEqual(['https://example.com/thumb.jpg']);
    });

    it('should use media.imageUrl as fallback image', () => {
      const product = createMockProduct({
        image_url: undefined,
        thumbnail_url: undefined,
        media: { imageUrl: 'https://example.com/media.jpg' },
      });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.images).toEqual(['https://example.com/media.jpg']);
    });

    it('should generate buy links', () => {
      const product = createMockProduct();
      const shoe = mapKicksProductToShoe(product) as any;
      expect(shoe.buyLinks).toBeDefined();
      expect(shoe.buyLinks.length).toBeGreaterThan(0);
      expect(shoe.buyLinks[0].name).toBe('StockX');
    });

    it('should generate proper sizing tip for Nike', () => {
      const product = createMockProduct({ brand: 'nike' });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.sizingTip).toContain('Nike');
    });

    it('should generate proper sizing tip for Yeezy', () => {
      const product = createMockProduct({ brand: 'yeezy' });
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.sizingTip).toContain('Yeezy');
    });

    it('should generate rating between 4.2 and 4.6', () => {
      const product = createMockProduct();
      const shoe = mapKicksProductToShoe(product);
      expect(shoe!.rating).toBeGreaterThanOrEqual(4.2);
      expect(shoe!.rating).toBeLessThanOrEqual(4.6);
    });
  });

  describe('searchProducts', () => {
    it('should return empty array when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const results = await searchProducts('nike');
      expect(results).toEqual([]);
    });

    it('should return empty array for non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });
      const results = await searchProducts('nike');
      expect(results).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('should return fallback data for fallback-1 when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const result = await getProductById('fallback-1');
      expect(result).not.toBeNull();
      expect(result!.title).toBe('Nike Dunk Low Retro');
    });

    it('should return null for unknown id when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const result = await getProductById('unknown-999');
      expect(result).toBeNull();
    });
  });

  describe('searchByBrand', () => {
    it('should return empty array when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const results = await searchByBrand('nike');
      expect(results).toEqual([]);
    });
  });

  describe('getTrendingProducts', () => {
    it('should return empty array when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const results = await getTrendingProducts();
      expect(results).toEqual([]);
    });
  });

  describe('searchSneakers', () => {
    it('should return empty array when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const results = await searchSneakers();
      expect(results).toEqual([]);
    });
  });

  describe('searchProductsUnder200', () => {
    it('should filter products over $200', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [
            createMockProduct({ id: '1', title: 'Nike Dunk Low', retail_price: 110 }),
            createMockProduct({ id: '2', title: 'Jordan 1 High OG', retail_price: 250 }),
          ],
        }),
      });
      const results = await searchProductsUnder200('sneakers');
      results.forEach((p) => {
        const price = p.retail_price || p.lowest_price || p.last_sale_price || 150;
        expect(price).toBeLessThanOrEqual(200);
      });
    });
  });

  describe('getHomeRecommendations', () => {
    it('should return array when all API calls fail', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      const results = await getHomeRecommendations();
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getPopularShoes', () => {
    it('should return array when all API calls fail', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      const results = await getPopularShoes();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
