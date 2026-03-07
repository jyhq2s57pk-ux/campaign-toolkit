import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import IdeaDetailModal from './IdeaDetailModal';

// Mock Badge component
vi.mock('./Badge', () => ({
  default: ({ children }) => <span data-testid="badge">{children}</span>,
}));

describe('IdeaDetailModal', () => {
  const mockIdea = {
    title: 'Treasure Hunt',
    headline: 'Turn Every Store Visit into an Adventure',
    sub_headline: 'Gamify the travel experience',
    description: 'An immersive journey...',
    image_url: '/images/hunt.png',
    channels: ['App', 'Web', 'In-store'],
    how_it_works_title: 'How it works',
    how_it_works_steps: ['Step 1: Grab a clue', 'Step 2: Scan poster', 'Step 3: Win prize'],
  };

  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('returns null when idea is null', () => {
    const { container } = render(<IdeaDetailModal idea={null} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when idea is provided', () => {
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} />);

    expect(screen.getByText('Turn Every Store Visit into an Adventure')).toBeInTheDocument();
    expect(screen.getByText('Gamify the travel experience')).toBeInTheDocument();
    expect(screen.getByText('An immersive journey...')).toBeInTheDocument();
  });

  it('renders channel badges', () => {
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} />);

    const badges = screen.getAllByTestId('badge');
    expect(badges).toHaveLength(3);
    expect(badges[0]).toHaveTextContent('App');
    expect(badges[1]).toHaveTextContent('Web');
    expect(badges[2]).toHaveTextContent('In-store');
  });

  it('renders how_it_works_steps', () => {
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} />);

    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Step 1: Grab a clue')).toBeInTheDocument();
    expect(screen.getByText('Step 2: Scan poster')).toBeInTheDocument();
    expect(screen.getByText('Step 3: Win prize')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} />);

    fireEvent.click(document.querySelector('.idea-modal-overlay'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on Escape key', () => {
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('does not propagate click from modal content to overlay', () => {
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} />);

    fireEvent.click(document.querySelector('.idea-modal'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('uses fallback title when no headline', () => {
    const ideaNoHeadline = { ...mockIdea, headline: null };
    render(<IdeaDetailModal idea={ideaNoHeadline} onClose={onClose} />);

    expect(screen.getByText('Treasure Hunt')).toBeInTheDocument();
  });

  it('resolves images through imageMap', () => {
    const imageMap = { '/images/hunt.png': '/resolved/hunt.png' };
    render(<IdeaDetailModal idea={mockIdea} onClose={onClose} imageMap={imageMap} />);

    const img = document.querySelector('.idea-modal__image');
    expect(img).toHaveAttribute('src', '/resolved/hunt.png');
  });

  it('uses modal_images when available', () => {
    const ideaWithModalImages = {
      ...mockIdea,
      modal_images: ['/img1.png', '/img2.png'],
    };
    render(<IdeaDetailModal idea={ideaWithModalImages} onClose={onClose} />);

    const imgs = document.querySelectorAll('.idea-modal__image');
    expect(imgs).toHaveLength(2);
  });
});
