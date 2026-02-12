
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResourcesPage from './ResourcesPage';
import { api } from '../lib/api';
import { BrowserRouter } from 'react-router-dom';

// Mock the API module
vi.mock('../lib/api', () => ({
    api: {
        getResources: vi.fn(),
    }
}));

// Mock child components that might use other contexts or are complex
vi.mock('../components/Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('../components/Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));

describe('ResourcesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        api.getResources.mockReturnValue(new Promise(() => { })); // Never resolve
        render(
            <BrowserRouter>
                <ResourcesPage />
            </BrowserRouter>
        );
        // Assuming there isn't an explicit "Loading..." text but checking it doesn't crash. 
        // If there is no loading indicator, we might check for absence of resources.
        // Looking at the code: const [loading, setLoading] = useState(true);
        // It doesn't seem to render a loading spinner in the code I saw earlier, checking re-render?
        // Actually, looking at ResourcesPage.jsx again:
        // div className="resources-grid animate-fade-in"
        // resources.map...
        // If loading is true, resources is empty initially (useState([])), so it just renders empty grid.
        expect(screen.getByText('Assets & Resources')).toBeInTheDocument();
    });

    it('renders resources from API', async () => {
        const mockResources = [
            { id: 1, title: 'Brand Guidelines', description: 'Desc 1' },
            { id: 2, title: 'Visual Assets', description: 'Desc 2' },
        ];
        api.getResources.mockResolvedValue(mockResources);

        render(
            <BrowserRouter>
                <ResourcesPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Brand Guidelines')).toBeInTheDocument();
            expect(screen.getByText('Visual Assets')).toBeInTheDocument();
        });

        expect(screen.getAllByText('Download')).toHaveLength(2);
    });

    it('handles empty API response', async () => {
        api.getResources.mockResolvedValue([]);

        render(
            <BrowserRouter>
                <ResourcesPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Brand Guidelines')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Assets & Resources')).toBeInTheDocument();
    });
});
