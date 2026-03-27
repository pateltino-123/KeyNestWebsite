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
  it('should render the Shoe Expert title', () => {
    render(<AssistantScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Shoe Expert')).toBeTruthy();
  });

  it('should render the subtitle', () => {
    render(<AssistantScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Your AI assistant')).toBeTruthy();
  });

  it('should render message input', () => {
    render(<AssistantScreen />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText('Ask me anything about shoes...')).toBeTruthy();
  });

  it('should render quick prompts', () => {
    render(<AssistantScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('Find running shoes under $150')).toBeTruthy();
    expect(screen.getByText('Best shoes for wide feet')).toBeTruthy();
    expect(screen.getByText('Nike vs Adidas sizing?')).toBeTruthy();
    expect(screen.getByText('Recommend casual shoes')).toBeTruthy();
  });
});
