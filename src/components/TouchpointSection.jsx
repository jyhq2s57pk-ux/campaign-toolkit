import TouchpointItem from './TouchpointItem';
import ScreenshotPlaceholder from './ScreenshotPlaceholder';
import './TouchpointSection.css';

export default function TouchpointSection({ platform, platformType, title, touchpoints }) {
  return (
    <section className="touchpoint-section-full">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-centered">
          <p className="platform-label">
            {platform}{platformType ? ` - ${platformType}` : ''}
          </p>
          <h2 className="section-title-large">{title}</h2>
        </div>

        {/* Content Card */}
        <div className="touchpoint-card">
          <div className="touchpoint-layout">
            {/* Screenshot - Left 40% */}
            <div className="touchpoint-screenshot">
              <ScreenshotPlaceholder
                imageUrl={touchpoints[0]?.image_url}
                markers={
                  touchpoints[0]?.marker_positions && touchpoints[0].marker_positions.length > 0
                    ? touchpoints[0].marker_positions
                    : touchpoints.map((_, i) => ({
                      number: i + 1,
                      top: `${15 + i * (70 / Math.max(touchpoints.length - 1, 1))}%`,
                      left: '92%'
                    }))
                }
              />
            </div>

            {/* Specs List - Right 60% */}
            <div className="touchpoint-list">
              {touchpoints.map((item, i) => (
                <TouchpointItem
                  key={item.id || i}
                  number={i + 1}
                  title={item.title}
                  description={item.description}
                  isOptional={item.is_optional}
                  isNew={item.is_new}
                  isPremium={item.tier_premium}
                  isExecutive={item.tier_executive}
                  isStandard={item.tier_standard}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
