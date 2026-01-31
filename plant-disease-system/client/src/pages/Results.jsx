import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Results(){
  const [results, setResults] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5001/api/results')
      .then(r => setResults(r.data.results || []))
      .catch(()=>{})
  },[])

  return (
    <div className="results-page">
      <h2>Detection Results</h2>
      {results.length===0 && <p>No detection history yet. Try uploading an image.</p>}
      <div className="results-list">
        {results.map((r, i) => (
          <div className="result-item" key={i}>
            <div className="result-thumb">
              {r.image ? <img src={`http://localhost:5001${r.image}`} alt={`res-${i}`} /> : <div className="no-thumb">No image</div>}
            </div>
            <div className="result-meta">
              <p><strong>{r.detection.name}</strong> — {r.detection.severity}</p>
              <p><strong>Type:</strong> {r.detection.details?.type || 'Unknown'}</p>
              <p><strong>Estimated recovery:</strong> {r.detection.details?.estimated_days || 'N/A'}</p>
              <p className="muted">Confidence: {r.confidence} • {new Date(r.time).toLocaleString()}</p>

              {r.detection.details?.life_cycle && (
                <div className="life-cycle">
                  <h4>Life cycle</h4>
                  <p>{r.detection.details.life_cycle}</p>
                </div>
              )}

              {r.detection.details?.measures && (
                <div className="measures">
                  <h4>Control measures</h4>
                  <ul>
                    {r.detection.details.measures.map((m, idx) => <li key={idx}>{m}</li>)}
                  </ul>
                </div>
              )}

              {r.detection.details?.pesticides && r.detection.details.pesticides.length>0 && (
                <div className="recommended">
                  <h4>Recommended pesticides</h4>
                  <div className="pesticide-grid">
                    {r.detection.details.pesticides.map(p=> (
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
          </div>
        ))}
      </div>
    </div>
  )
}