import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import BrowseScreen from '@/app/(tabs)/browse';

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

describe('BrowseScreen', () => {
  it('should render the Discover title', () => {
    render(<BrowseScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Discover')).toBeTruthy();
  });

  it('should render search input', () => {
    render(<BrowseScreen />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText('Search shoes, brands...')).toBeTruthy();
  });

  it('should render category chips', () => {
    render(<BrowseScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Running')).toBeTruthy();
    expect(screen.getByText('Medical')).toBeTruthy();
  });

  it('should render shoe count', () => {
    render(<BrowseScreen />, { wrapper: createWrapper() });
    expect(screen.getByText(/shoes found/)).toBeTruthy();
  });

  it('should allow typing in search input', () => {
    render(<BrowseScreen />, { wrapper: createWrapper() });
    const input = screen.getByPlaceholderText('Search shoes, brands...');
    fireEvent.changeText(input, 'Nike');
    expect(input.props.value).toBe('Nike');
  });
});
