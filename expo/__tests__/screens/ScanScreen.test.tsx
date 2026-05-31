import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/contexts/UserContext';
import ScanScreen from '@/app/scan';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  );
};

describe('ScanScreen', () => {
  it('should render intro screen by default', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Foot Scan')).toBeTruthy();
  });

  it('should render intro subtitle', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    expect(screen.getByText(/A guided multi-angle scan/)).toBeTruthy();
  });

  it('should render instruction steps', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    expect(screen.getByText(/Capture 3 angles per foot/)).toBeTruthy();
    expect(screen.getByText(/Stand on a flat, well-lit surface/)).toBeTruthy();
  });

  it('should render Get Started button', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Get Started')).toBeTruthy();
  });

  it('should navigate to mode selection on Get Started press', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    fireEvent.press(screen.getByText('Get Started'));
    expect(screen.getByText('How many feet?')).toBeTruthy();
  });

  it('should render mode options', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    fireEvent.press(screen.getByText('Get Started'));
    expect(screen.getByText('Both feet')).toBeTruthy();
    expect(screen.getByText('One foot')).toBeTruthy();
  });

  it('should show ruler prompt after mode selection', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    fireEvent.press(screen.getByText('Get Started'));
    fireEvent.press(screen.getByText('Both feet'));
    expect(screen.getByText('Do you have a ruler?')).toBeTruthy();
  });
});
