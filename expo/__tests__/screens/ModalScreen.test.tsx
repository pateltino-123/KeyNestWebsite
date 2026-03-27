import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ModalScreen from '@/app/modal';

describe('ModalScreen', () => {
  it('should render the modal title', () => {
    render(<ModalScreen />);
    expect(screen.getByText('SoleFit')).toBeTruthy();
  });

  it('should render the description', () => {
    render(<ModalScreen />);
    expect(screen.getByText(/Your personal shoe sizing assistant/)).toBeTruthy();
  });

  it('should render close button', () => {
    render(<ModalScreen />);
    expect(screen.getByText('Close')).toBeTruthy();
  });
});
