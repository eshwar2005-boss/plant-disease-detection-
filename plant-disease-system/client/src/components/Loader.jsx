import React from 'react'
import './Loader.css'

export function Spinner({ size = 'medium', color = 'primary' }) {
  return (
    <div className={`spinner spinner-${size} spinner-${color}`}>
      <div className="spinner-circle"></div>
    </div>
  )
}

export function Loader({ message = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <Spinner size="large" />
        <p className="loader-message">{message}</p>
      </div>
    )
  }

  return (
    <div className="loader">
      <Spinner />
      <p className="loader-message">{message}</p>
    </div>
  )
}

export function ProgressBar({ progress = 0, showPercentage = true }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
        {showPercentage && (
          <span className="progress-bar-label">{Math.round(progress)}%</span>
        )}
      </div>
    </div>
  )
}

export default Loader
