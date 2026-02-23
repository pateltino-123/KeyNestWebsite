import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ShoeCard from '@/components/ShoeCard';
import { Shoe } from '@/mocks/shoes';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';

const mockShoe: Shoe = {
  id: '1',
  name: 'Air Max 90',
  brand: 'Nike',
  price: 130,
  category: 'casual',
  activityType: ['everyday'],
  images: ['https://example.com/shoe.jpg'],
  sizes: [9, 10, 11],
  colors: ['White'],
  description: 'A classic shoe',
  materials: ['Leather'],
  widthFit: 'normal',
  archSupport: 'medium',
  rating: 4.7,
  reviewCount: 100,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>{children}</UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('ShoeCard', () => {
  it('should render shoe name', () => {
    render(<ShoeCard shoe={mockShoe} />, { wrapper: createWrapper() });
    expect(screen.getByText('Air Max 90')).toBeTruthy();
  });

  it('should render shoe rating', () => {
    render(<ShoeCard shoe={mockShoe} />, { wrapper: createWrapper() });
    expect(screen.getByText('★ 4.7')).toBeTruthy();
  });

  describe('horizontal variant', () => {
    it('should render name in horizontal mode', () => {
      render(<ShoeCard shoe={mockShoe} variant="horizontal" />, { wrapper: createWrapper() });
      expect(screen.getByText('Air Max 90')).toBeTruthy();
    });

    it('should render rating in horizontal mode', () => {
      render(<ShoeCard shoe={mockShoe} variant="horizontal" />, { wrapper: createWrapper() });
      expect(screen.getByText('★ 4.7')).toBeTruthy();
    });
  });

  describe('compact variant', () => {
    it('should render name in compact mode', () => {
      render(<ShoeCard shoe={mockShoe} variant="compact" />, { wrapper: createWrapper() });
      expect(screen.getByText('Air Max 90')).toBeTruthy();
    });

    it('should render rating in compact mode', () => {
      render(<ShoeCard shoe={mockShoe} variant="compact" />, { wrapper: createWrapper() });
      expect(screen.getByText('★ 4.7')).toBeTruthy();
    });
  });

  describe('sizing alerts', () => {
    it('should not show sizing alert without measurements in context', () => {
      const runsSmallShoe: Shoe = { ...mockShoe, runsSmall: true };
      render(<ShoeCard shoe={runsSmallShoe} />, { wrapper: createWrapper() });
      expect(screen.queryByText('Runs small - size up')).toBeNull();
    });

    it('should not show alert when showSizingAlert is false', () => {
      const runsSmallShoe: Shoe = { ...mockShoe, runsSmall: true };
      render(<ShoeCard shoe={runsSmallShoe} showSizingAlert={false} />, { wrapper: createWrapper() });
      expect(screen.queryByText('Runs small - size up')).toBeNull();
    });

    it('should not show alert for normal shoe', () => {
      render(<ShoeCard shoe={mockShoe} />, { wrapper: createWrapper() });
      expect(screen.queryByText('Runs small - size up')).toBeNull();
      expect(screen.queryByText('Runs large - size down')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle shoe with empty images array gracefully', () => {
      const noImageShoe: Shoe = { ...mockShoe, images: [] };
      expect(() => render(<ShoeCard shoe={noImageShoe} />, { wrapper: createWrapper() })).not.toThrow();
    });

    it('should render with different ratings', () => {
      const lowRatedShoe: Shoe = { ...mockShoe, rating: 3.2 };
      render(<ShoeCard shoe={lowRatedShoe} />, { wrapper: createWrapper() });
      expect(screen.getByText('★ 3.2')).toBeTruthy();
    });
  });
});
