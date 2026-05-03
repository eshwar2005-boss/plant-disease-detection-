import React from 'react'
import './ImagePreview.css'

export default function ImagePreview({ 
  src, 
  alt = 'Preview',
  onRemove,
  showControls = true,
  className = '' 
}) {
  if (!src) return null

  return (
    <div className={`image-preview ${className}`}>
      <div className="image-preview-wrapper">
        <img 
          src={src} 
          alt={alt} 
          className="image-preview-img"
        />
        {showControls && onRemove && (
          <button 
            className="image-preview-remove" 
            onClick={onRemove}
            aria-label="Remove image"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function ImageGallery({ images = [], onImageClick }) {
  if (!images.length) return null

  return (
    <div className="image-gallery">
      {images.map((img, idx) => (
        <div 
          key={idx} 
          className="image-gallery-item"
          onClick={() => onImageClick && onImageClick(img, idx)}
        >
          <img src={img.url || img} alt={img.alt || `Image ${idx + 1}`} />
        </div>
      ))}
    </div>
  )
}
