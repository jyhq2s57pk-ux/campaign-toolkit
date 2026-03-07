import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Carousel from './Carousel';

// Mock the image import
vi.mock('../assets/joy-unlimited.png', () => ({ default: 'joy-unlimited.png' }));

describe('Carousel', () => {
  it('renders all carousel items', () => {
    render(<Carousel />);

    expect(screen.getByText('The Magic of Joy Holiday Season')).toBeInTheDocument();
    expect(screen.getByText('Summer Vibes Campaign')).toBeInTheDocument();
    expect(screen.getByText('Spring Refresh')).toBeInTheDocument();
  });

  it('displays scope and activation dates', () => {
    render(<Carousel />);

    // Each carousel item has a "Scope" section with "Global" value
    expect(screen.getAllByText('Global').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('October-December 2025')).toBeInTheDocument();
    expect(screen.getByText('June-August 2026')).toBeInTheDocument();
  });

  it('renders badges for each item', () => {
    render(<Carousel />);

    // Each of the first 2 items has 3 badges, the third has 2
    const premiumBadges = screen.getAllByText('Premium');
    expect(premiumBadges.length).toBe(3);
  });

  it('renders navigation dots', () => {
    render(<Carousel />);

    const dots = document.querySelectorAll('.dot');
    expect(dots).toHaveLength(3);
  });

  it('renders channel information', () => {
    render(<Carousel />);

    expect(screen.getByText('All Channels')).toBeInTheDocument();
  });
});
