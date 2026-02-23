import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import ShoeDetailScreen from '@/app/shoe/[id]';
import { useLocalSearchParams } from 'expo-router';

jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/services/kicksApi', () => ({
  getProductById: jest.fn(() => Promise.resolve(null)),
  mapKicksProductToShoe: jest.fn(() => null),
}));

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

describe('ShoeDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render shoe details for a known shoe id', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Air Max 90')).toBeTruthy();
    expect(screen.getByText('Nike')).toBeTruthy();
  });

  it('should render shoe rating', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('4.7')).toBeTruthy();
  });

  it('should render review count', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });
    expect(screen.getByText(/reviews/)).toBeTruthy();
  });

  it('should render Where to Buy button', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Where to Buy')).toBeTruthy();
  });

  it('should render Available Sizes section', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Available Sizes')).toBeTruthy();
  });

  it('should render Colors section', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Colors')).toBeTruthy();
  });

  it('should render Description section', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Description')).toBeTruthy();
  });

  it('should render Details section', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Details')).toBeTruthy();
  });

  it('should show Shoe not found for unknown id after loading', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'nonexistent-999' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Shoe not found')).toBeTruthy();
    });
  });

  it('should show Go Back button for unknown shoe after loading', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'nonexistent-999' });
    render(<ShoeDetailScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Go Back')).toBeTruthy();
    });
  });
});
