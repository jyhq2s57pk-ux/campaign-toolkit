import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import './MediaLibrary.css';

const SOURCES = [
  { bucket: 'touchpoint-images', folder: 'journey-pages', label: 'Journey Pages' },
  { bucket: 'touchpoint-images', folder: 'resource-images', label: 'Resources' },
  { bucket: 'touchpoint-images', folder: 'campaign-images', label: 'Campaign' },
  { bucket: 'campaign-assets', folder: 'campaigns', label: 'Campaign' },
  { bucket: 'campaign-assets', folder: 'omnichannel', label: 'Resources' },
  { bucket: 'campaign-assets', folder: 'uploads', label: 'All' },
];

const FOLDER_TABS = ['All', 'Journey Pages', 'Resources', 'Campaign'];

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg)$/i;

export default function MediaLibrary({ isOpen, onClose, onSelect }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  // ESC key + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch all images on open
  useEffect(() => {
    if (!isOpen) return;
    if (!supabase) {
      setError('Database not connected');
      setLoading(false);
      return;
    }

    const fetchAllImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const allImages = [];

        for (const { bucket, folder, label } of SOURCES) {
          try {
            const { data, error: listError } = await supabase.storage
              .from(bucket)
              .list(folder, { limit: 500, sortBy: { column: 'created_at', order: 'desc' } });

            if (listError) continue;

            const imageFiles = (data || []).filter(
              (file) => file.name !== '.emptyFolderPlaceholder' && IMAGE_EXT.test(file.name)
            );

            for (const file of imageFiles) {
              const fullPath = folder ? `${folder}/${file.name}` : file.name;
              const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fullPath);

              allImages.push({
                id: `${bucket}/${fullPath}`,
                name: file.name,
                fullPath,
                bucket,
                folderLabel: label,
                publicUrl: urlData.publicUrl,
                createdAt: file.created_at,
              });
            }
          } catch {
            // Skip failed bucket/folder silently
          }
        }

        setImages(allImages);
      } catch (err) {
        console.error('Media library error:', err);
        setError('Failed to load media library');
      } finally {
        setLoading(false);
      }
    };

    fetchAllImages();
  }, [isOpen]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedImage(null);
      setSearchQuery('');
      setActiveFolder('All');
    }
  }, [isOpen]);

  const filteredImages = useMemo(() => {
    let result = images;

    if (activeFolder !== 'All') {
      result = result.filter((img) => img.folderLabel === activeFolder);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((img) => img.name.toLowerCase().includes(q));
    }

    return result;
  }, [images, activeFolder, searchQuery]);

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage.publicUrl);
      onClose();
    }
  };

  const handleDoubleClick = (img) => {
    onSelect(img.publicUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="media-library-overlay" onClick={onClose}>
      <div className="media-library" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="media-library__header">
          <h2 className="media-library__title">Media Library</h2>
          <span className="media-library__count">
            {loading ? '' : `${filteredImages.length} image${filteredImages.length !== 1 ? 's' : ''}`}
          </span>
          <button className="media-library__close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="media-library__toolbar">
          <div className="media-library__tabs">
            {FOLDER_TABS.map((tab) => (
              <button
                key={tab}
                className={`media-library__tab ${activeFolder === tab ? 'media-library__tab--active' : ''}`}
                onClick={() => setActiveFolder(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="media-library__search"
          />
        </div>

        {/* Grid Body */}
        <div className="media-library__body">
          {loading ? (
            <div className="media-library__status">
              <div className="media-library__spinner" />
              Loading images...
            </div>
          ) : error ? (
            <div className="media-library__status media-library__status--error">{error}</div>
          ) : filteredImages.length === 0 ? (
            <div className="media-library__status">No images found</div>
          ) : (
            <div className="media-library__grid">
              {filteredImages.map((img) => (
                <button
                  key={img.id}
                  className={`media-library__item ${selectedImage?.id === img.id ? 'media-library__item--selected' : ''}`}
                  onClick={() => setSelectedImage(img)}
                  onDoubleClick={() => handleDoubleClick(img)}
                  title={img.name}
                >
                  <div className="media-library__thumb">
                    <img src={img.publicUrl} alt={img.name} loading="lazy" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="media-library__footer">
          <div className="media-library__selected-info">
            {selectedImage ? (
              <span className="media-library__selected-name" title={selectedImage.name}>
                {selectedImage.name}
              </span>
            ) : (
              <span className="media-library__hint">Click to select · Double-click to insert</span>
            )}
          </div>
          <div className="media-library__actions">
            <button className="media-library__btn media-library__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="media-library__btn media-library__btn--insert"
              disabled={!selectedImage}
              onClick={handleSelect}
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
