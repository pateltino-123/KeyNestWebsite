import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import ProfileScreen from '@/app/(tabs)/profile';

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

describe('ProfileScreen', () => {
  it('should render profile placeholder text', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Set up your profile')).toBeTruthy();
  });

  it('should render edit profile button', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Edit Profile')).toBeTruthy();
  });

  it('should render My Measurements section', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('My Measurements')).toBeTruthy();
  });

  it('should render no measurements message', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('No measurements yet')).toBeTruthy();
  });

  it('should render Scan Your Feet button', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Scan Your Feet')).toBeTruthy();
  });

  it('should render Appearance menu item', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Appearance')).toBeTruthy();
  });

  it('should render Preferences menu item', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Preferences')).toBeTruthy();
  });

  it('should show Dark theme label by default', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Dark')).toBeTruthy();
  });

  it('should render tap to add details text', () => {
    render(<ProfileScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Tap to add your details')).toBeTruthy();
  });
});
