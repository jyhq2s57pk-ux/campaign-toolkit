import { useState } from 'react';
import './MarkerEditor.css';

export default function MarkerEditor({ imageUrl, markers, onChange }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const addMarker = () => {
    const newMarker = {
      number: markers.length + 1,
      top: '50%',
      left: 'calc(100% - 30px)' // Fixed horizontal position
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
    // Keep left fixed or assume CSS handles it, but let's persist the "standard" fixed value
    updated[index] = { ...updated[index], top, left: 'calc(100% - 30px)' };
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
              {markers.map((marker, index) => (
                <div
                  key={index}
                  className={`marker ${selectedMarker === index ? 'selected' : ''}`}
                  style={{ top: marker.top /* left is handled by CSS class */ }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarker(index);
                  }}
                >
                  {marker.number}
                </div>
              ))}
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
