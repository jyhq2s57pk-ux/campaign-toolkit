import { useState } from 'react';
import './MarkerEditor.css';

export default function MarkerEditor({ imageUrl, markers, onChange }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const addMarker = () => {
    const newMarker = {
      number: markers.length + 1,
      top: '20%',
      left: '20%'
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

  const updateMarkerPosition = (index, top, left) => {
    const updated = [...markers];
    updated[index] = { ...updated[index], top, left };
    onChange(updated);
  };

  const handleImageClick = (e) => {
    if (selectedMarker === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    updateMarkerPosition(selectedMarker, `${y.toFixed(1)}%`, `${x.toFixed(1)}%`);
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
        <div className="marker-preview" onClick={handleImageClick}>
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="Touchpoint preview" />
              {markers.map((marker, index) => (
                <div
                  key={index}
                  className={`marker ${selectedMarker === index ? 'selected' : ''}`}
                  style={{ top: marker.top, left: marker.left }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarker(index);
                  }}
                >
                  {marker.number}
                </div>
              ))}
            </>
          ) : (
            <div className="marker-placeholder">
              <p>Add an image URL above to position markers</p>
            </div>
          )}
        </div>

        <div className="marker-controls">
          <p className="marker-instructions">
            {selectedMarker !== null
              ? `Click on the image to reposition marker ${markers[selectedMarker]?.number}`
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
                      Top: {marker.top}, Left: {marker.left}
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
