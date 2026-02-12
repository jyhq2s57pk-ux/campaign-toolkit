
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LinkHeroCard from './LinkHeroCard';
import { BrowserRouter } from 'react-router-dom';

describe('LinkHeroCard', () => {
    it('renders with required props', () => {
        render(
            <BrowserRouter>
                <LinkHeroCard
                    title="Test Title"
                    description="Test Description"
                    link="/test-link"
                    linkText="Go"
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/test-link');
    });

    it('renders with launch icon', () => {
        render(
            <BrowserRouter>
                <LinkHeroCard
                    title="Test Title"
                    description="Desc"
                    link="/test"
                />
            </BrowserRouter>
        );
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', '/test');
        expect(linkElement).toHaveClass('launch-icon-link');
        // Check for specific SVG or class if possible, or just that it contains an SVG
        expect(linkElement.querySelector('svg.launch-icon')).toBeInTheDocument();
    });
});
