import React from 'react'

const DISEASES = [
  {
    name:'Powdery Mildew',
    desc:'White powdery spots on leaves, common in humid conditions.',
    pesticides:[
      {name:'Copper Fungicide', image:'/images/pesticide1.svg', use:'Apply as foliar spray at recommended dilution. Repeat every 7-14 days during disease pressure.'}
    ]
  },
  {
    name:'Leaf Spot',
    desc:'Brown or black spots on leaves often due to fungal infection.',
    pesticides:[
      {name:'Neem Oil', image:'/images/pesticide2.svg', use:'Use as a contact spray; effective for early-stage infections and as preventive measure.'}
    ]
  },
  {
    name:'Early Blight',
    desc:'Common in tomatoes/potatoes — irregular concentric spots.',
    pesticides:[
      {name:'Chlorothalonil', image:'/images/pesticide3.svg', use:'Apply as directed on label; rotate with other fungicides to prevent resistance.'}
    ]
  },
  {name:'Healthy', desc:'No visible disease.', pesticides:[]}
]

export default function DiseaseInfo(){
  return (
    <div className="disease-page">
      <h2>Disease Info & Recommended Treatments</h2>

      <div className="disease-grid">
        {DISEASES.map(d => (
          <div className="disease-card" key={d.name}>
            <h3>{d.name}</h3>
            <p>{d.desc}</p>

            {d.pesticides && d.pesticides.length>0 && (
              <div className="pesticide-section">
                <h4>Recommended Pesticides</h4>
                <div className="pesticide-grid">
                  {d.pesticides.map(p => (
                    <div className="pesticide-card" key={p.name}>
                      <img src={p.image} alt={p.name} />
                      <div className="pesticide-meta">
                        <strong>{p.name}</strong>
                        <p className="muted">{p.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      <div className="pesticide-info">
        <h3>About Pesticide Use</h3>
        <p>Use pesticides responsibly: always follow label instructions, wear appropriate protective equipment, avoid application near water bodies, and rotate active ingredients to reduce resistance. Prefer integrated pest management (IPM): combine cultural, biological, and chemical methods for best results.</p>
      </div>
    </div>
  )
}