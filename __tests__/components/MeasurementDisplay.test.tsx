import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MeasurementDisplay from '@/components/MeasurementDisplay';
import { FootMeasurements } from '@/contexts/UserContext';

const mockMeasurements: FootMeasurements = {
  leftLength: 26.5,
  leftWidth: 10.0,
  rightLength: 26.7,
  rightWidth: 10.2,
  archType: 'neutral',
  footType: 'normal',
  recommendedSize: 10,
  lastScanned: new Date().toISOString(),
};

describe('MeasurementDisplay', () => {
  describe('default (full) variant', () => {
    it('should render recommended size', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} />);
      expect(screen.getByText('Recommended Size')).toBeTruthy();
      expect(screen.getByText('US 10')).toBeTruthy();
    });

    it('should render average length', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} />);
      expect(screen.getByText('Length')).toBeTruthy();
      expect(screen.getByText('26.6 cm')).toBeTruthy();
    });

    it('should render average width', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} />);
      expect(screen.getByText('Width')).toBeTruthy();
      expect(screen.getByText('10.1 cm')).toBeTruthy();
    });

    it('should render arch type', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} />);
      expect(screen.getByText('Arch Type')).toBeTruthy();
      expect(screen.getByText('Neutral Arch')).toBeTruthy();
    });

    it('should render foot type', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} />);
      expect(screen.getByText('Foot Type')).toBeTruthy();
      expect(screen.getByText('Normal')).toBeTruthy();
    });
  });

  describe('compact variant', () => {
    it('should render size in compact mode', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} compact />);
      expect(screen.getByText('US 10')).toBeTruthy();
      expect(screen.getByText('Size')).toBeTruthy();
    });

    it('should render width label in compact mode', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} compact />);
      expect(screen.getByText('Normal')).toBeTruthy();
    });

    it('should render arch label in compact mode', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} compact />);
      expect(screen.getByText('Neutral')).toBeTruthy();
      expect(screen.getByText('Arch')).toBeTruthy();
    });
  });

  describe('with different measurement values', () => {
    it('should display flat arch for flat feet', () => {
      render(<MeasurementDisplay measurements={{ ...mockMeasurements, archType: 'flat' }} />);
      expect(screen.getByText('Flat Arch')).toBeTruthy();
    });

    it('should display high arch', () => {
      render(<MeasurementDisplay measurements={{ ...mockMeasurements, archType: 'high' }} />);
      expect(screen.getByText('High Arch')).toBeTruthy();
    });

    it('should display wide foot type', () => {
      render(<MeasurementDisplay measurements={{ ...mockMeasurements, footType: 'wide' }} />);
      expect(screen.getByText('Wide')).toBeTruthy();
    });

    it('should display narrow foot type', () => {
      render(<MeasurementDisplay measurements={{ ...mockMeasurements, footType: 'narrow' }} />);
      expect(screen.getByText('Narrow')).toBeTruthy();
    });

    it('should display W icon for wide feet', () => {
      render(<MeasurementDisplay measurements={{ ...mockMeasurements, footType: 'wide' }} />);
      expect(screen.getByText('W')).toBeTruthy();
    });

    it('should display N icon for narrow feet', () => {
      render(<MeasurementDisplay measurements={{ ...mockMeasurements, footType: 'narrow' }} />);
      expect(screen.getByText('N')).toBeTruthy();
    });

    it('should display M icon for normal feet', () => {
      render(<MeasurementDisplay measurements={mockMeasurements} />);
      expect(screen.getByText('M')).toBeTruthy();
    });
  });
});
