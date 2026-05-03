import React from 'react'
import Card from './Card'
import './DiseaseCard.css'

export default function DiseaseCard({ disease, onClick }) {
  return (
    <Card 
      className="disease-card"
      hoverable
      onClick={onClick}
    >
      <div className="disease-card-icon">{disease.icon || '🌿'}</div>
      <h3 className="disease-card-title">{disease.name}</h3>
      <p className="disease-card-plant">{disease.plantType}</p>
      <p className="disease-card-description">{disease.description}</p>
      
      {disease.severity && (
        <div className={`disease-severity severity-${disease.severity.toLowerCase()}`}>
          {disease.severity}
        </div>
      )}
    </Card>
  )
}

export function DiseaseList({ diseases = [], onDiseaseClick }) {
  if (!diseases.length) {
    return <div className="disease-list-empty">No diseases found</div>
  }

  return (
    <div className="disease-list">
      {diseases.map((disease, idx) => (
        <DiseaseCard 
          key={disease.id || idx} 
          disease={disease}
          onClick={() => onDiseaseClick && onDiseaseClick(disease)}
        />
      ))}
    </div>
  )
}
