import { useState } from 'react';
import './MarkerEditor.css';

// Marker Line SVG (Matches Frontend)
const MarkerLine = () => (
  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.375 9L0.375001 9" stroke="#D6D6D6" strokeWidth="0.75" strokeLinecap="round" />
  </svg>
);

export default function MarkerEditor({ imageUrl, markers, onChange }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const addMarker = () => {
    const newMarker = {
      number: markers.length + 1,
      top: '50%',
      // We don't need 'left' anymore as css handles it, but keeping data structure constraint
      left: 'auto'
    };
    onChange([...markers, newMarker]);
  };

  const removeMarker = (index) => {
    const updated = markers.filter((_, i) => i !== index);
    // Renumber markers
    const renumbered = updated.map((m, i) => ({ ...m, number: i + 1 }));
    onChange(renumbered);
    setSelectedMarker(null);
  };

  const updateMarkerPosition = (index, top) => {
    const updated = [...markers];
    updated[index] = { ...updated[index], top };
    onChange(updated);
  };

  const handleImageClick = (e) => {
    if (selectedMarker === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    // Only calculate Y
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp between 0 and 100
    const clampedY = Math.max(0, Math.min(100, y));

    updateMarkerPosition(selectedMarker, `${clampedY.toFixed(1)}%`);
  };

  return (
    <div className="marker-editor">
      <div className="marker-editor-header">
        <label>Marker Positions</label>
        <button type="button" onClick={addMarker} className="btn-add-marker">
          + Add Marker
        </button>
      </div>

      <div className="marker-editor-content">
        <div className="marker-preview">
          {imageUrl ? (
            <div className="marker-image-wrapper" onClick={handleImageClick}>
              <img src={imageUrl} alt="Touchpoint preview" />
              {/* Markers Container */}
              <div className="editor-markers-container">
                {markers.map((marker, index) => (
                  <div
                    key={index}
                    className={`editor-marker-row ${selectedMarker === index ? 'selected' : ''}`}
                    style={{ top: marker.top }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarker(index);
                    }}
                  >
                    <MarkerLine />
                    <div className="number-label">
                      <span className="number-label-text">{marker.number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="marker-placeholder">
              <p>Add an image URL above to position markers</p>
            </div>
          )}
        </div>

        <div className="marker-controls">
          <p className="marker-instructions">
            {selectedMarker !== null
              ? `Click on the image (at desired height) to position marker ${markers[selectedMarker]?.number}`
              : 'Click "Add Marker" or select an existing marker to edit'}
          </p>

          {markers.length > 0 && (
            <div className="marker-list">
              {markers.map((marker, index) => (
                <div key={index} className={`marker-item ${selectedMarker === index ? 'active' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setSelectedMarker(index)}
                    className="marker-select-btn"
                  >
                    <span className="marker-number">{marker.number}</span>
                    <span className="marker-coords">
                      Top: {marker.top}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMarker(index)}
                    className="marker-remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
