import FeatureBlock from '../FeatureBlock'
import './App.css'

function App() {
    return (
        <div className="app-container">
            <h1 className="demo-title">FeatureBlock Component Demo</h1>

            <div className="feature-demo-wrapper">
                <FeatureBlock
                    number={1}
                    title="CLP Hero"
                    description="Feature special SKUs by category in a new carousel to appear before Bestsellers one Beauty: Exclusive Gifting Sets (fragrance & skincare sets Liquor: Festive Spirits to Celebrate (wine & champagne)"
                    badges={[
                        { label: 'New', color: 'magenta' },
                        { label: 'Executive', color: 'success' },
                        { label: 'Premium', color: 'purple' },
                        { label: 'Standard', color: 'default' }
                    ]}
                />
            </div>

            <div className="feature-demo-wrapper">
                <FeatureBlock
                    number={2}
                    title="Beauty Categories"
                    description="Showcase beauty product categories with curated selections for each segment. Focus on seasonal themes and trending items."
                    badges={[
                        { label: 'Premium', color: 'purple' },
                        { label: 'Standard', color: 'default' }
                    ]}
                />
            </div>

            <div className="feature-demo-wrapper">
                <FeatureBlock
                    number={3}
                    title="Exclusive Gift Sets"
                    description="Highlight exclusive gift sets featuring fragrance and skincare bundles. Perfect for holiday promotions and special occasions."
                    badges={[
                        { label: 'New', color: 'magenta' },
                        { label: 'Executive', color: 'success' }
                    ]}
                />
            </div>
        </div>
    )
}

export default App
