import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const BUCKET = 'campaign-assets';

export default function ImageUpload({ value, onChange, label, placeholder, folder = 'uploads' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      if (!supabase) {
        setError('Database not connected. Use URL input instead.');
        setUploading(false);
        return;
      }

      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        // If bucket doesn't exist, fall back gracefully
        if (uploadError.message?.includes('not found') || uploadError.statusCode === 404) {
          setError('Storage bucket not configured. Use the URL field below.');
        } else {
          setError('Upload failed: ' + uploadError.message);
        }
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path);

      onChange(urlData.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Use URL input instead.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-component">
      {label && <label className="image-upload-label">{label}</label>}

      <div className="image-upload-controls">
        <button
          type="button"
          className="btn-secondary image-upload-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <span className="image-upload-or">or</span>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Paste image URL'}
          className="image-upload-url"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {error && <div className="image-upload-error">{error}</div>}

      {value && (
        <div className="image-upload-preview">
          <img
            src={value}
            alt="Preview"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <button
            type="button"
            className="image-upload-clear"
            onClick={() => onChange('')}
            title="Remove image"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
