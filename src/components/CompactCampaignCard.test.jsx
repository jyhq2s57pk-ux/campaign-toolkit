import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CampaignCard from './CompactCampaignCard';

describe('CompactCampaignCard', () => {
  const defaultProps = {
    id: 'camp-1',
    name: 'Summer Campaign',
    subtitle: 'Hot deals',
    activationDates: 'June-August 2026',
    scope: 'Global',
    channels: 'Web, App',
    primaryColor: '#E94E55',
  };

  it('renders campaign name and metadata', () => {
    render(
      <BrowserRouter>
        <CampaignCard {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Summer Campaign')).toBeInTheDocument();
    expect(screen.getByText('Hot deals')).toBeInTheDocument();
    expect(screen.getByText('June-August 2026')).toBeInTheDocument();
    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText('Web, App')).toBeInTheDocument();
  });

  it('links to customer journey with campaign id', () => {
    render(
      <BrowserRouter>
        <CampaignCard {...defaultProps} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/customer-journey?campaignId=camp-1');
  });

  it('renders as button when onClick is provided', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <BrowserRouter>
        <CampaignCard {...defaultProps} onClick={onClick} />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    await user.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('shows initial fallback when no hero image', () => {
    render(
      <BrowserRouter>
        <CampaignCard {...defaultProps} heroImage={null} />
      </BrowserRouter>
    );

    expect(screen.getByText('S')).toBeInTheDocument(); // First char of 'Summer Campaign'
  });

  it('shows initial fallback for placeholder images', () => {
    render(
      <BrowserRouter>
        <CampaignCard {...defaultProps} heroImage="https://placehold.co/600x400" />
      </BrowserRouter>
    );

    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('applies dark text class for light background colors', () => {
    render(
      <BrowserRouter>
        <CampaignCard {...defaultProps} primaryColor="#FFFFFF" />
      </BrowserRouter>
    );

    const card = document.querySelector('.campaign-card');
    expect(card).toHaveClass('dark-text');
  });

  it('does not apply dark text for dark background colors', () => {
    render(
      <BrowserRouter>
        <CampaignCard {...defaultProps} primaryColor="#000000" />
      </BrowserRouter>
    );

    const card = document.querySelector('.campaign-card');
    expect(card).not.toHaveClass('dark-text');
  });
});
