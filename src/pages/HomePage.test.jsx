import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

vi.mock('../lib/api', () => ({
  api: {
    getCampaigns: vi.fn(),
  },
}));

vi.mock('../components/Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('../components/Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));

import { api } from '../lib/api';

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    api.getCampaigns.mockReturnValue(new Promise(() => {}));

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading campaigns...')).toBeInTheDocument();
  });

  it('renders campaign cards from API', async () => {
    const campaigns = [
      {
        id: 'camp-1',
        name: 'Summer Vibes',
        subtitle: 'Hot deals',
        activation_dates: 'June 2026',
        scope: 'Global',
        channels: 'Web',
        primary_color: '#FF0000',
      },
      {
        id: 'camp-2',
        name: 'Winter Sale',
        subtitle: 'Cold deals',
        activation_dates: 'Dec 2026',
        scope: 'EU',
        channels: 'App',
        primary_color: '#0000FF',
      },
    ];
    api.getCampaigns.mockResolvedValue(campaigns);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Summer Vibes')).toBeInTheDocument();
      expect(screen.getByText('Winter Sale')).toBeInTheDocument();
    });
  });

  it('shows "No campaigns found" for empty list', async () => {
    api.getCampaigns.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No campaigns found.')).toBeInTheDocument();
    });
  });

  it('renders header and footer', async () => {
    api.getCampaigns.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
