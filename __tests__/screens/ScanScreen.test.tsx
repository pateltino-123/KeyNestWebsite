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
    expect(screen.getByText('Scan Your Feet')).toBeTruthy();
  });

  it('should render intro subtitle', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Get accurate measurements for perfect shoe recommendations')).toBeTruthy();
  });

  it('should render instruction steps', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Place a credit card next to your foot for scale')).toBeTruthy();
    expect(screen.getByText('Stand on a flat, well-lit surface')).toBeTruthy();
    expect(screen.getByText('We will scan both feet and recommend based on the larger one')).toBeTruthy();
  });

  it('should render Start Scanning button', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Start Scanning')).toBeTruthy();
  });

  it('should navigate to left foot scan on Start Scanning press', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    fireEvent.press(screen.getByText('Start Scanning'));
    expect(screen.getByText('Position your left foot')).toBeTruthy();
  });

  it('should render camera placeholder text in scan step', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    fireEvent.press(screen.getByText('Start Scanning'));
    expect(screen.getByText('Align your foot with the outline and place a credit card beside it')).toBeTruthy();
    expect(screen.getByText('Place card here')).toBeTruthy();
  });

  it('should render step indicators', () => {
    render(<ScanScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });
});
