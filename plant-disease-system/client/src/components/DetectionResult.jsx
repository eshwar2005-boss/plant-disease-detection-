import React from 'react'
import Card from './Card'
import './DetectionResult.css'

export default function DetectionResult({ result }) {
  if (!result) return null

  const { prediction, confidence, treatments, lifecycle, metadata } = result

  const confidencePercent = Math.round((confidence || 0) * 100)
  const confidenceColor = confidence >= 0.8 ? '#10b981' : confidence >= 0.5 ? '#f59e0b' : '#ef4444'

  return (
    <div className="detection-result">
      {/* Main Prediction Card */}
      <Card className="prediction-card">
        <div className="prediction-header">
          <div>
            <h2 className="prediction-title">Detection Result</h2>
            <p className="prediction-disease">{prediction || 'Unknown'}</p>
          </div>
          <div className="confidence-badge" style={{ '--confidence-color': confidenceColor }}>
            <div className="confidence-value">{confidencePercent}%</div>
            <div className="confidence-label">Confidence</div>
          </div>
        </div>
        
        {metadata && (
          <div className="metadata-grid">
            {metadata.plantType && (
              <div className="metadata-item">
                <span className="metadata-label">Plant Type</span>
                <span className="metadata-value">{metadata.plantType}</span>
              </div>
            )}
            {metadata.timestamp && (
              <div className="metadata-item">
                <span className="metadata-label">Detected At</span>
                <span className="metadata-value">{new Date(metadata.timestamp).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Lifecycle Information */}
      {lifecycle && (
        <Card title="Disease Lifecycle" className="lifecycle-card">
          <div className="lifecycle-content">
            {lifecycle.pathogen && (
              <div className="lifecycle-section">
                <h4>Pathogen</h4>
                <p>{lifecycle.pathogen}</p>
              </div>
            )}
            {lifecycle.symptoms && (
              <div className="lifecycle-section">
                <h4>Symptoms</h4>
                <p>{lifecycle.symptoms}</p>
              </div>
            )}
            {lifecycle.conditions && (
              <div className="lifecycle-section">
                <h4>Favorable Conditions</h4>
                <p>{lifecycle.conditions}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Treatment Recommendations */}
      {treatments && treatments.length > 0 && (
        <Card title="Treatment Recommendations" className="treatments-card">
          <div className="treatments-list">
            {treatments.map((treatment, idx) => (
              <div key={idx} className="treatment-item">
                <div className="treatment-type">{treatment.type || 'General'}</div>
                <div className="treatment-description">{treatment.description || treatment}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
