import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import WishlistScreen from '@/app/(tabs)/wishlist';

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

describe('WishlistScreen', () => {
  it('should render the Wishlist title', () => {
    render(<WishlistScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Wishlist')).toBeTruthy();
  });

  it('should render Ask Assistant button', () => {
    render(<WishlistScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Ask Assistant')).toBeTruthy();
  });

  it('should render filter options', () => {
    render(<WishlistScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Purchased')).toBeTruthy();
    expect(screen.getByText('Did not Fit')).toBeTruthy();
  });

  it('should show empty state when wishlist is empty', () => {
    render(<WishlistScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Your wishlist is empty')).toBeTruthy();
    expect(screen.getByText('Save shoes you love by tapping the heart icon')).toBeTruthy();
  });

  it('should render Browse Shoes button in empty state', () => {
    render(<WishlistScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Browse Shoes')).toBeTruthy();
  });

  it('should render sort label', () => {
    render(<WishlistScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Sort: Date Added')).toBeTruthy();
  });
});
