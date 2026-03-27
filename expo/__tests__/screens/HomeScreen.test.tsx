import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import HomeScreen from '@/app/(tabs)/index';

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

describe('HomeScreen', () => {
  it('should render the app name', () => {
    render(<HomeScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('ShoeFit')).toBeTruthy();
  });

  it('should render welcome text when no profile', () => {
    render(<HomeScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Welcome to')).toBeTruthy();
  });

  it('should render scan button', () => {
    render(<HomeScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Scan Your Feet')).toBeTruthy();
  });

  it('should render scan subtitle', () => {
    render(<HomeScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Get personalized size recommendations')).toBeTruthy();
  });

  it('should render Recommended For You section', () => {
    render(<HomeScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Recommended For You')).toBeTruthy();
  });

  it('should render Popular Picks section', () => {
    render(<HomeScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Popular Picks')).toBeTruthy();
  });

  it('should render See All link', () => {
    render(<HomeScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('See All')).toBeTruthy();
  });
});
