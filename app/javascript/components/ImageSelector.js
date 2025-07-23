// Create new file: app/javascript/components/ImageSelector.js
import React, { useState, useEffect } from 'react';

function ImageSelector({ artist, song, currentImageUrl, onImageSelect }) {
  const [imageOptions, setImageOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (artist && song) {
      fetchImageOptions();
    }
  }, [artist, song]);

  const fetchImageOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/snippets/image_options?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`);
      const data = await response.json();
      setImageOptions(data.images || []);
    } catch (error) {
      console.error('Error fetching image options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    onImageSelect(imageUrl);
  };

  if (loading) {
    return <div className="text-center">Loading alternative images...</div>;
  }

  return (
    <div className="image-selector">
      <div className="row g-2">
        {imageOptions.map((imageUrl, index) => (
          <div key={index} className="col-6 col-md-4">
            <div 
              className={`image-option ${selectedImage === imageUrl ? 'selected' : ''}`}
              onClick={() => handleImageSelect(imageUrl)}
              style={{
                border: selectedImage === imageUrl ? '3px solid #553d67' : '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                aspectRatio: '1/1'
              }}
            >
              <img 
                src={imageUrl} 
                alt={`Album cover option ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>
      {imageOptions.length === 0 && (
        <p className="text-muted small">No alternative images found</p>
      )}
    </div>
  );
}

export default ImageSelector;