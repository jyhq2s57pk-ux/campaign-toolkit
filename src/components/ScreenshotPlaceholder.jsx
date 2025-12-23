import './ScreenshotPlaceholder.css';

export default function ScreenshotPlaceholder({ imageUrl, markers = [] }) {
  return (
    <div className="screenshot-placeholder">
      {imageUrl ? (
        <>
          <img src={imageUrl} alt="Touchpoint screenshot" className="screenshot-image" />
          <div className="screenshot-overlay"></div>
        </>
      ) : (
        <>
          <div className="screenshot-placeholder-empty">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="100" height="100" rx="8" stroke="#6b7280" strokeWidth="2" strokeDasharray="8 4"/>
              <path d="M40 50L50 60L70 40" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="75" cy="45" r="8" stroke="#6b7280" strokeWidth="2"/>
              <path d="M30 80L45 65L60 80L75 65L90 80" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="placeholder-text">No image added</p>
            <p className="placeholder-subtext">Add an image URL in the admin panel</p>
          </div>
          <div className="screenshot-border"></div>
        </>
      )}

      {markers.map((marker, i) => (
        <div
          key={i}
          className="screenshot-marker"
          style={{
            top: marker.top || `${20 + i * 15}%`,
            left: marker.left || '92%'
          }}
        >
          {marker.number}
        </div>
      ))}
    </div>
  );
}
