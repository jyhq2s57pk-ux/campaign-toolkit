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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);

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

  // Shared fetch function (callable from useEffect + after upload)
  const fetchAllImages = async () => {
    if (!supabase) {
      setError('Database not connected');
      setLoading(false);
      return;
    }

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

  // Fetch all images on open
  useEffect(() => {
    if (!isOpen) return;
    fetchAllImages();
  }, [isOpen]);

  // Upload handler — uploads to campaign-assets/uploads
  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0 || !supabase) return;

    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading 0 / ${imageFiles.length}...`);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const path = `uploads/${safeName}`;

      setUploadProgress(`Uploading ${i + 1} / ${imageFiles.length}...`);

      try {
        const { error: uploadError } = await supabase.storage
          .from('campaign-assets')
          .upload(path, file, { upsert: true });

        if (uploadError) {
          console.error(`Upload failed for ${file.name}:`, uploadError);
          errorCount++;
        } else {
          successCount++;
        }
      } catch {
        errorCount++;
      }
    }

    setUploading(false);
    setUploadProgress('');

    if (successCount > 0) {
      // Refresh the gallery
      await fetchAllImages();
      setActiveFolder('All');
    }

    if (errorCount > 0) {
      setError(`${errorCount} file(s) failed to upload`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUploadFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedImage(null);
      setSearchQuery('');
      setActiveFolder('All');
      setShowUploadZone(false);
      setUploadProgress('');
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
          <button
            type="button"
            className={`media-library__upload-btn ${showUploadZone ? 'media-library__upload-btn--active' : ''}`}
            onClick={() => setShowUploadZone(!showUploadZone)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload
          </button>
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

        {/* Upload Zone */}
        {showUploadZone && (
          <div
            className={`media-library__dropzone ${dragOver ? 'media-library__dropzone--active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {uploading ? (
              <div className="media-library__dropzone-content">
                <div className="media-library__spinner" />
                <span>{uploadProgress}</span>
              </div>
            ) : (
              <label className="media-library__dropzone-content">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Drag &amp; drop images here, or <strong>click to browse</strong></span>
                <span className="media-library__dropzone-hint">PNG, JPG, GIF, WebP, SVG · Max 5 MB each</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => { handleUploadFiles(e.target.files); e.target.value = ''; }}
                />
              </label>
            )}
          </div>
        )}

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
