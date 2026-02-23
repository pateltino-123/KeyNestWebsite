import { darkTheme, lightTheme, ThemeColors } from '@/constants/colors';
import Colors from '@/constants/colors';

describe('colors constants', () => {
  describe('darkTheme', () => {
    it('should have all required color keys', () => {
      const requiredKeys = [
        'primary', 'primaryLight', 'accent', 'accentLight', 'accentDark',
        'background', 'surface', 'surfaceAlt', 'text', 'textSecondary',
        'textMuted', 'border', 'borderLight', 'success', 'successLight',
        'error', 'errorLight', 'warning', 'warningLight', 'white', 'black',
        'overlay', 'shadow',
      ];
      requiredKeys.forEach((key) => {
        expect(darkTheme).toHaveProperty(key);
      });
    });

    it('should have dark background color', () => {
      expect(darkTheme.background).toBe('#0A0A0A');
    });

    it('should have white text color', () => {
      expect(darkTheme.text).toBe('#FFFFFF');
    });

    it('should have string values for all colors', () => {
      Object.values(darkTheme).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('lightTheme', () => {
    it('should have all required color keys matching darkTheme', () => {
      const darkKeys = Object.keys(darkTheme).sort();
      const lightKeys = Object.keys(lightTheme).sort();
      expect(darkKeys).toEqual(lightKeys);
    });

    it('should have light background color', () => {
      expect(lightTheme.background).toBe('#F8FAFC');
    });

    it('should have dark text color', () => {
      expect(lightTheme.text).toBe('#0F172A');
    });

    it('should have string values for all colors', () => {
      Object.values(lightTheme).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('default export', () => {
    it('should export darkTheme as default', () => {
      expect(Colors).toEqual(darkTheme);
    });
  });

  describe('ThemeColors type', () => {
    it('should be compatible with both themes', () => {
      const dark: ThemeColors = darkTheme;
      const light: ThemeColors = lightTheme;
      expect(dark).toBeDefined();
      expect(light).toBeDefined();
    });
  });
});
