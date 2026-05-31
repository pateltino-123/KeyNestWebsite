import { brandSizingTips, footTypeTips, widthTips, SizingTip } from '@/mocks/sizingTips';

describe('sizingTips mock data', () => {
  describe('brandSizingTips', () => {
    it('should contain multiple tips', () => {
      expect(brandSizingTips.length).toBeGreaterThan(0);
    });

    it('each tip should have required fields', () => {
      brandSizingTips.forEach((tip: SizingTip) => {
        expect(tip.brand).toBeDefined();
        expect(typeof tip.brand).toBe('string');
        expect(tip.tip).toBeDefined();
        expect(typeof tip.tip).toBe('string');
        expect(['small', 'large', 'normal']).toContain(tip.direction);
        expect(typeof tip.adjustment).toBe('number');
        expect(tip.adjustment).toBeGreaterThanOrEqual(0);
      });
    });

    it('should include common brands', () => {
      const tipBrands = brandSizingTips.map((t) => t.brand);
      expect(tipBrands).toContain('Nike');
      expect(tipBrands).toContain('Adidas');
      expect(tipBrands).toContain('Brooks');
    });
  });

  describe('footTypeTips', () => {
    it('should have tips for all arch types', () => {
      expect(footTypeTips.flat).toBeDefined();
      expect(footTypeTips.neutral).toBeDefined();
      expect(footTypeTips.high).toBeDefined();
    });

    it('all tips should be non-empty strings', () => {
      expect(typeof footTypeTips.flat).toBe('string');
      expect(footTypeTips.flat.length).toBeGreaterThan(0);
      expect(typeof footTypeTips.neutral).toBe('string');
      expect(footTypeTips.neutral.length).toBeGreaterThan(0);
      expect(typeof footTypeTips.high).toBe('string');
      expect(footTypeTips.high.length).toBeGreaterThan(0);
    });
  });

  describe('widthTips', () => {
    it('should have tips for all width types', () => {
      expect(widthTips.narrow).toBeDefined();
      expect(widthTips.normal).toBeDefined();
      expect(widthTips.wide).toBeDefined();
    });

    it('all tips should be non-empty strings', () => {
      expect(typeof widthTips.narrow).toBe('string');
      expect(widthTips.narrow.length).toBeGreaterThan(0);
      expect(typeof widthTips.normal).toBe('string');
      expect(widthTips.normal.length).toBeGreaterThan(0);
      expect(typeof widthTips.wide).toBe('string');
      expect(widthTips.wide.length).toBeGreaterThan(0);
    });
  });
});
