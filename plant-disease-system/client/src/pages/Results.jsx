import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'

export default function Results(){
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    axios.get(`${API}/api/results`)
      .then(r => {
        const latest = r.data.results?.[0] || null
        setResult(latest)
        setLoading(false)
      })
      .catch(()=>{
        setLoading(false)
      })
  },[])

  return (
    <div className="results-page">
      <h2>Latest Detection Result</h2>
      {loading && <p>Loading...</p>}
      {!loading && !result && <p className="empty">No detection yet. Go to <a href="/gallery">Upload/Detect</a> to start.</p>}
      {result && (
        <div className="result-item card-like">
          <div className="result-thumb">
            {result.image ? <img src={`${API}${result.image}`} alt="latest" /> : <div className="no-thumb">No image</div>}
          </div>
          <div className="result-meta">
            <p><strong>{result.detection.name}</strong> — {result.detection.severity}</p>
            <p><strong>Type:</strong> {result.detection.details?.type || 'Unknown'}</p>
            <p><strong>Estimated recovery:</strong> {result.detection.details?.estimated_days || 'N/A'}</p>
            <p className="muted">Confidence: {result.confidence} • {new Date(result.time).toLocaleString()}</p>

            {result.detection.details?.life_cycle && (
              <div className="life-cycle">
                <h4>Life cycle</h4>
                <p>{result.detection.details.life_cycle}</p>
              </div>
            )}

            {result.detection.details?.measures && (
              <div className="measures">
                <h4>Control measures</h4>
                <ul>
                  {result.detection.details.measures.map((m, idx) => <li key={idx}>{m}</li>)}
                </ul>
              </div>
            )}

            {result.detection.details?.pesticides && result.detection.details.pesticides.length>0 && (
              <div className="recommended">
                <h4>Recommended pesticides</h4>
                <div className="pesticide-grid">
                  {result.detection.details.pesticides.map(p=> (
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
      )}
    </div>
  )
}