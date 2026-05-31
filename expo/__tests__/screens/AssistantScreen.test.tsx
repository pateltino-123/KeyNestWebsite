import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import AssistantScreen from '@/app/(tabs)/assistant';

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

describe('AssistantScreen', () => {
  it('should render the Shoe Expert name', () => {
    render(<AssistantScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Mike')).toBeTruthy();
  });

  it('should render experience text', () => {
    render(<AssistantScreen />, { wrapper: createWrapper() });
    expect(screen.getByText(/Shoe Expert/)).toBeTruthy();
  });

  it('should render message input', () => {
    render(<AssistantScreen />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText(/Ask Mike/)).toBeTruthy();
  });

  it('should render quick prompts', () => {
    render(<AssistantScreen />, { wrapper: createWrapper() });
    expect(screen.getByText(/hot right now/)).toBeTruthy();
    expect(screen.getByText('I need running shoes')).toBeTruthy();
  });
});
