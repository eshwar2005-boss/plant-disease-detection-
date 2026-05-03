import React from 'react'
import './Alert.css'

export default function Alert({ 
  type = 'info', 
  message, 
  title,
  onClose,
  className = '' 
}) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`alert alert-${type} ${className}`}>
      <div className="alert-icon">{icons[type]}</div>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{message}</div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      )}
    </div>
  )
}
