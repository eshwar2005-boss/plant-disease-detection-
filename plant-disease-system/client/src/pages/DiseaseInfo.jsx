import React, { useState } from 'react'

const DISEASES = [
  {
    name: 'Powdery Mildew',
    desc: 'White powdery spots on leaves, common in humid conditions.',
    symptoms: ['White powder on leaf surfaces', 'Leaf curling and distortion', 'Reduced plant vigor', 'Affects young leaves first'],
    conditions: ['Warm days (60-80°F)', 'Cool nights', 'High humidity (40-60%)'],
    lifecycle: 'Overwinters on plant debris and spreads by wind. Favors warm days and cool nights.',
    cultural_measures: [
      'Remove and destroy infected leaves',
      'Improve air circulation',
      'Water at soil level, not foliage',
      'Space plants adequately',
      'Avoid overhead irrigation'
    ],
    pesticides: [
      {
        name: 'Copper Fungicide',
        type: 'Contact Fungicide',
        image: '🧴',
        icon: '🟠',
        use: 'Apply as foliar spray at recommended dilution. Repeat every 7-14 days during disease pressure.',
        dosage: 'As per label instructions (typically 1-2 tbsp per gallon)',
        frequency: 'Every 7-14 days',
        safety: 'Wear gloves and mask. Avoid inhalation. Wash hands after application.',
        effectiveness: '85% effective',
        cost: '$15-25 per liter',
        organic: true
      }
    ]
  },
  {
    name: 'Leaf Spot',
    desc: 'Brown or black spots on leaves often due to fungal infection.',
    symptoms: ['Round or angular brown/black spots', 'Yellow halo around spots', 'Spots with concentric rings', 'Leaf yellowing and drop'],
    conditions: ['Wet foliage', 'High humidity', 'Overhead irrigation', 'Temperature 60-75°F'],
    lifecycle: 'Fungal spores persist in soil and plant debris. Spread by splashing water and air currents.',
    cultural_measures: [
      'Remove affected leaves immediately',
      'Avoid overhead irrigation',
      'Water early morning at soil level',
      'Improve canopy air circulation',
      'Remove fallen plant debris',
      'Practice crop rotation'
    ],
    pesticides: [
      {
        name: 'Neem Oil',
        type: 'Botanical Fungicide',
        image: '🌿',
        icon: '🟢',
        use: 'Use as a contact spray; effective for early-stage infections and as preventive measure.',
        dosage: '2% solution (as per product label)',
        frequency: 'Every 7-10 days',
        safety: 'Low toxicity. Wash hands after use. Avoid contact with eyes.',
        effectiveness: '75% effective',
        cost: '$12-20 per liter',
        organic: true
      },
      {
        name: 'Sulfur Dust',
        type: 'Protectant Fungicide',
        image: '💛',
        icon: '🟡',
        use: 'Dust on foliage as preventive or early treatment. Do not apply in hot weather.',
        dosage: 'As per label',
        frequency: 'Every 7-14 days',
        safety: 'Can cause phytotoxicity if applied above 85°F. Wear mask.',
        effectiveness: '80% effective',
        cost: '$8-15 per kg',
        organic: true
      }
    ]
  },
  {
    name: 'Early Blight',
    desc: 'Common in tomatoes/potatoes — irregular concentric spots.',
    symptoms: ['Concentric brown rings on lower leaves', 'Yellow halo around lesions', 'Stem lesions with concentric pattern', 'Progressive leaf yellowing'],
    conditions: ['Temperature 65-75°F', 'High humidity', 'Wet foliage', 'Overhead watering'],
    lifecycle: 'Survives on infected soil, debris, and potato seed pieces. Spores spread by wind, rain splash, and soil contact.',
    cultural_measures: [
      'Rotate crops (3-year minimum)',
      'Remove infected debris thoroughly',
      'Mulch soil to prevent splash',
      'Prune lower leaves (6-8 inches from soil)',
      'Stake plants for air circulation',
      'Use disease-resistant varieties'
    ],
    pesticides: [
      {
        name: 'Chlorothalonil',
        type: 'Synthetic Fungicide',
        image: '🛡️',
        icon: '🔴',
        use: 'Apply as directed on label; rotate with other fungicides to prevent resistance.',
        dosage: 'As per label instructions',
        frequency: 'Every 7-10 days',
        safety: 'PRECAUTION: Wear protective equipment. Not organic. Follow all safety instructions.',
        effectiveness: '90% effective',
        cost: '$20-30 per liter',
        organic: false
      },
      {
        name: 'Mancozeb',
        type: 'Contact Fungicide',
        image: '⚙️',
        icon: '🟠',
        use: 'Protectant fungicide. Apply preventively before disease appears.',
        dosage: 'As per label',
        frequency: 'Every 7-14 days',
        safety: 'Wear gloves and mask. Wash thoroughly after application.',
        effectiveness: '85% effective',
        cost: '$15-25 per kg',
        organic: false
      }
    ]
  },
  {
    name: 'Healthy',
    desc: 'No visible disease.',
    symptoms: [],
    conditions: [],
    lifecycle: 'N/A',
    cultural_measures: ['Maintain good plant health', 'Regular monitoring', 'Proper spacing', 'Adequate watering'],
    pesticides: []
  }
]

export default function DiseaseInfo(){
  const [expandedDisease, setExpandedDisease] = useState(null)

  const toggleDisease = (name) => {
    setExpandedDisease(expandedDisease === name ? null : name)
  }

  return (
    <div className="disease-page">
      <h1>🌱 Disease Information & Treatment Guide</h1>
      <p className="subtitle">Comprehensive guide to identifying plant diseases and recommended treatment options</p>

      <div className="disease-grid">
        {DISEASES.map(d => (
          <div 
            className={`disease-card ${expandedDisease === d.name ? 'expanded' : ''}`}
            key={d.name}
          >
            <div 
              className="disease-header"
              onClick={() => toggleDisease(d.name)}
            >
              <h3>{d.name}</h3>
              <span className="toggle-icon">{expandedDisease === d.name ? '▼' : '▶'}</span>
            </div>

            <p className="disease-desc">{d.desc}</p>

            {expandedDisease === d.name && (
              <div className="disease-details">
                {/* Symptoms */}
                {d.symptoms && d.symptoms.length > 0 && (
                  <div className="info-section">
                    <h4>🔍 Symptoms</h4>
                    <ul className="info-list">
                      {d.symptoms.map((symptom, idx) => (
                        <li key={idx}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Favorable Conditions */}
                {d.conditions && d.conditions.length > 0 && (
                  <div className="info-section">
                    <h4>🌡️ Favorable Conditions</h4>
                    <ul className="info-list">
                      {d.conditions.map((cond, idx) => (
                        <li key={idx}>{cond}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Life Cycle */}
                {d.lifecycle && d.lifecycle !== 'N/A' && (
                  <div className="info-section">
                    <h4>🔄 Disease Life Cycle</h4>
                    <p className="lifecycle-text">{d.lifecycle}</p>
                  </div>
                )}

                {/* Cultural Measures */}
                {d.cultural_measures && d.cultural_measures.length > 0 && (
                  <div className="info-section cultural-section">
                    <h4>🌿 Cultural Control Measures (Preferred)</h4>
                    <ul className="info-list">
                      {d.cultural_measures.map((measure, idx) => (
                        <li key={idx}>{measure}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pesticides */}
                {d.pesticides && d.pesticides.length > 0 && (
                  <div className="info-section pesticide-section">
                    <h4>💊 Recommended Pesticides</h4>
                    <div className="pesticide-list">
                      {d.pesticides.map(p => (
                        <div className="pesticide-detailed" key={p.name}>
                          <div className="pesticide-header-detail">
                            <div className="pesticide-icon">{p.icon}</div>
                            <div className="pesticide-title">
                              <strong>{p.name}</strong>
                              <span className={`pesticide-type ${p.organic ? 'organic' : 'synthetic'}`}>
                                {p.organic ? '🍃 Organic' : '⚠️ Synthetic'}
                              </span>
                            </div>
                          </div>

                          <div className="pesticide-info-grid">
                            <div className="info-item">
                              <label>Type:</label>
                              <p>{p.type}</p>
                            </div>
                            <div className="info-item">
                              <label>Effectiveness:</label>
                              <p>{p.effectiveness}</p>
                            </div>
                            <div className="info-item">
                              <label>Cost:</label>
                              <p>{p.cost}</p>
                            </div>
                            <div className="info-item">
                              <label>Frequency:</label>
                              <p>{p.frequency}</p>
                            </div>
                          </div>

                          <div className="pesticide-details-grid">
                            <div className="detail-box">
                              <h5>📋 Application</h5>
                              <p>{p.use}</p>
                            </div>
                            <div className="detail-box">
                              <h5>⚗️ Dosage</h5>
                              <p>{p.dosage}</p>
                            </div>
                            <div className="detail-box">
                              <h5>⚠️ Safety</h5>
                              <p>{p.safety}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* General Pesticide Information */}
      <div className="pesticide-guidelines">
        <h3>💡 Pesticide Use Guidelines</h3>
        <div className="guidelines-grid">
          <div className="guideline-card">
            <h4>✅ Best Practices</h4>
            <ul>
              <li>Always read and follow label instructions</li>
              <li>Wear appropriate PPE (gloves, mask, goggles)</li>
              <li>Apply in early morning or late evening</li>
              <li>Avoid application during rain or high heat</li>
              <li>Spray both sides of leaves</li>
              <li>Keep away from water sources</li>
              <li>Store safely away from children and pets</li>
            </ul>
          </div>

          <div className="guideline-card">
            <h4>🔄 Resistance Management</h4>
            <ul>
              <li>Rotate active ingredients every 2-3 weeks</li>
              <li>Alternate between different fungicide classes</li>
              <li>Don't use the same product continuously</li>
              <li>Follow maximum application limits</li>
              <li>Use lower rates when disease pressure is low</li>
              <li>Combine with cultural methods</li>
            </ul>
          </div>

          <div className="guideline-card">
            <h4>🌱 Integrated Pest Management (IPM)</h4>
            <ul>
              <li>Start with cultural controls first</li>
              <li>Monitor plants regularly for early detection</li>
              <li>Use resistant varieties when available</li>
              <li>Apply biological controls when possible</li>
              <li>Use chemical controls as last resort</li>
              <li>Combine multiple strategies for best results</li>
            </ul>
          </div>

          <div className="guideline-card">
            <h4>🧪 Organic vs Synthetic</h4>
            <ul>
              <li><strong>Organic:</strong> Neem Oil, Sulfur, Copper</li>
              <li><strong>Synthetic:</strong> Chlorothalonil, Mancozeb</li>
              <li>Organic = naturally derived</li>
              <li>Synthetic = lab-formulated</li>
              <li>Check certifications for organic farming</li>
              <li>Both need careful handling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* IPM Strategy */}
      <div className="ipm-strategy">
        <h3>📊 Integrated Pest Management Strategy</h3>
        <div className="ipm-steps">
          <div className="ipm-step">
            <div className="step-number">1️⃣</div>
            <h4>Identify</h4>
            <p>Correctly identify the disease using symptoms and conditions</p>
          </div>
          <div className="ipm-step">
            <div className="step-number">2️⃣</div>
            <h4>Monitor</h4>
            <p>Scout plants regularly and assess disease severity</p>
          </div>
          <div className="ipm-step">
            <div className="step-number">3️⃣</div>
            <h4>Prevent</h4>
            <p>Use cultural methods: proper spacing, irrigation, sanitation</p>
          </div>
          <div className="ipm-step">
            <div className="step-number">4️⃣</div>
            <h4>Treat</h4>
            <p>Apply pesticides only when threshold is exceeded</p>
          </div>
        </div>
      </div>
    </div>
  )
}