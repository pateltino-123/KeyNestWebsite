import { shoes, categories, brands, Shoe, Review } from '@/mocks/shoes';

describe('shoes mock data', () => {
  describe('shoes array', () => {
    it('should contain multiple shoes', () => {
      expect(shoes.length).toBeGreaterThan(0);
    });

    it('each shoe should have required fields', () => {
      shoes.forEach((shoe) => {
        expect(shoe.id).toBeDefined();
        expect(typeof shoe.id).toBe('string');
        expect(shoe.name).toBeDefined();
        expect(typeof shoe.name).toBe('string');
        expect(shoe.brand).toBeDefined();
        expect(typeof shoe.brand).toBe('string');
        expect(typeof shoe.price).toBe('number');
        expect(shoe.price).toBeGreaterThan(0);
        expect(['athletic', 'casual', 'formal', 'running', 'work', 'medical']).toContain(shoe.category);
        expect(Array.isArray(shoe.activityType)).toBe(true);
        expect(shoe.activityType.length).toBeGreaterThan(0);
        expect(Array.isArray(shoe.images)).toBe(true);
        expect(shoe.images.length).toBeGreaterThan(0);
        expect(Array.isArray(shoe.sizes)).toBe(true);
        expect(shoe.sizes.length).toBeGreaterThan(0);
        expect(Array.isArray(shoe.colors)).toBe(true);
        expect(shoe.colors.length).toBeGreaterThan(0);
        expect(typeof shoe.description).toBe('string');
        expect(Array.isArray(shoe.materials)).toBe(true);
        expect(['narrow', 'normal', 'wide']).toContain(shoe.widthFit);
        expect(['low', 'medium', 'high']).toContain(shoe.archSupport);
        expect(typeof shoe.rating).toBe('number');
        expect(shoe.rating).toBeGreaterThanOrEqual(0);
        expect(shoe.rating).toBeLessThanOrEqual(5);
        expect(typeof shoe.reviewCount).toBe('number');
      });
    });

    it('each shoe should have unique id', () => {
      const ids = shoes.map((shoe) => shoe.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('shoe images should be valid URLs', () => {
      shoes.forEach((shoe) => {
        shoe.images.forEach((img) => {
          expect(img).toMatch(/^https?:\/\//);
        });
      });
    });

    it('shoes with reviews should have valid review structure', () => {
      const shoesWithReviews = shoes.filter((shoe) => shoe.reviews && shoe.reviews.length > 0);
      shoesWithReviews.forEach((shoe) => {
        shoe.reviews!.forEach((review: Review) => {
          expect(review.id).toBeDefined();
          expect(review.userId).toBeDefined();
          expect(review.userName).toBeDefined();
          expect(typeof review.rating).toBe('number');
          expect(review.rating).toBeGreaterThanOrEqual(1);
          expect(review.rating).toBeLessThanOrEqual(5);
          expect(typeof review.comment).toBe('string');
          expect(typeof review.verified).toBe('boolean');
        });
      });
    });

    it('shoes with runsSmall should be boolean', () => {
      shoes.filter((s) => s.runsSmall !== undefined).forEach((shoe) => {
        expect(typeof shoe.runsSmall).toBe('boolean');
      });
    });

    it('shoes with runsLarge should be boolean', () => {
      shoes.filter((s) => s.runsLarge !== undefined).forEach((shoe) => {
        expect(typeof shoe.runsLarge).toBe('boolean');
      });
    });
  });

  describe('categories', () => {
    it('should contain expected categories', () => {
      expect(categories.length).toBeGreaterThan(0);
      const categoryIds = categories.map((c) => c.id);
      expect(categoryIds).toContain('athletic');
      expect(categoryIds).toContain('casual');
      expect(categoryIds).toContain('running');
    });

    it('each category should have id, name, and icon', () => {
      categories.forEach((cat) => {
        expect(cat.id).toBeDefined();
        expect(cat.name).toBeDefined();
        expect(cat.icon).toBeDefined();
      });
    });
  });

  describe('brands', () => {
    it('should contain expected brands', () => {
      expect(brands.length).toBeGreaterThan(0);
      expect(brands).toContain('Nike');
      expect(brands).toContain('Adidas');
      expect(brands).toContain('New Balance');
    });

    it('each brand should be a non-empty string', () => {
      brands.forEach((brand) => {
        expect(typeof brand).toBe('string');
        expect(brand.length).toBeGreaterThan(0);
      });
    });

    it('should have no duplicate brands', () => {
      const uniqueBrands = new Set(brands);
      expect(uniqueBrands.size).toBe(brands.length);
    });
  });
});
