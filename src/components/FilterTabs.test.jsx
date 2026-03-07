import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FilterTabs from './FilterTabs';

describe('FilterTabs', () => {
  const tabs = ['All', 'App', 'Web', 'In-store'];

  it('renders all tab options', () => {
    render(<FilterTabs tabs={tabs} onTabChange={vi.fn()} />);

    tabs.forEach((tab) => {
      expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument();
    });
  });

  it('marks active tab with aria-selected', () => {
    render(<FilterTabs tabs={tabs} activeTab="Web" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'Web' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false');
  });

  it('applies active class to active tab', () => {
    render(<FilterTabs tabs={tabs} activeTab="App" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'App' })).toHaveClass('filter-tabs__tab--active');
    expect(screen.getByRole('tab', { name: 'All' })).not.toHaveClass('filter-tabs__tab--active');
  });

  it('calls onTabChange with selected tab value', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(<FilterTabs tabs={tabs} onTabChange={onTabChange} />);

    await user.click(screen.getByRole('tab', { name: 'In-store' }));

    expect(onTabChange).toHaveBeenCalledWith('In-store');
  });

  it('defaults activeTab to All', () => {
    render(<FilterTabs tabs={tabs} onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders empty when no tabs provided', () => {
    render(<FilterTabs onTabChange={vi.fn()} />);

    expect(screen.getByRole('tablist')).toBeEmptyDOMElement();
  });
});
