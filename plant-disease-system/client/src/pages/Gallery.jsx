import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'

export default function Gallery(){
  const [samples, setSamples] = useState([])
  const [selected, setSelected] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [streaming, setStreaming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [uploadMethod, setUploadMethod] = useState('upload') // upload, camera, sample
  const [plantType, setPlantType] = useState('unknown')
  const [userId, setUserId] = useState('user_' + Math.random().toString(36).substr(2, 9))
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const PLANT_TYPES = ['Unknown', 'Apple', 'Blueberry', 'Cherry', 'Corn', 'Grape', 'Orange', 'Peach', 'Pepper', 'Potato', 'Raspberry', 'Soybean', 'Squash', 'Strawberry', 'Tomato']

  useEffect(()=>{
    axios.get(`${API}/api/samples`)
      .then(r => setSamples(r.data.images))
      .catch(()=> setSamples([
        { id: 1, url: '/images/sample1.svg' },
        { id: 2, url: '/images/sample2.svg' },
        { id: 3, url: '/images/sample3.svg' }
      ]))
  },[])

  // revoke preview object URL when preview changes or component unmounts
  useEffect(()=>{
    return () => {
      try{ if (previewUrl) URL.revokeObjectURL(previewUrl) }catch(e){}
    }
  },[previewUrl])

  async function useSample(url){
    setErrorMessage(null)
    setLoading(true)
    setUploadMethod('sample')
    try{
      const res = await fetch(url)
      if (!res.ok) throw new Error('Could not fetch sample')
      const blob = await res.blob()
      const file = new File([blob], 'sample.jpg', { type: blob.type || 'image/jpeg' })
      setSelected(file)
      try{ setPreviewUrl(URL.createObjectURL(file)) }catch(e){}
      await sendFile(file)
    }catch(err){
      console.error('Sample fetch error', err)
      setErrorMessage(err.message || 'Could not use sample')
    }finally{setLoading(false)}
  }

  function handleFile(e){
    const file = e.target.files[0]
    if (file) {
      setSelected(file)
      try{ setPreviewUrl(URL.createObjectURL(file)) }catch(e){}
      setUploadMethod('upload')
    }
  }

  async function sendFile(file){
    setResult(null)
    setErrorMessage(null)
    setLoading(true)
    const fd = new FormData()
    fd.append('image', file)
    fd.append('userId', userId)
    fd.append('plantType', plantType)
    try{
      const res = await axios.post(`${API}/api/detect`, fd)
      setResult(res.data)
      try{ document.querySelector('.detection-section')?.scrollIntoView({ behavior: 'smooth' }) }catch(e){}
    }catch(err){
      console.error('Upload error', err)
      setErrorMessage(err.response?.data?.message || err.message || 'Upload failed')
    }finally{
      setLoading(false)
    }
  }

  async function onUpload(){
    if (!selected) return alert('Choose an image first')
    await sendFile(selected)
  }

  async function startCamera(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      videoRef.current.srcObject = stream
      setStreaming(true)
      setUploadMethod('camera')
    }catch(err){
      alert('Camera access denied or not available')
    }
  }

  function stopCamera(){
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      setStreaming(false)
    }
  }

  function takePhoto(){
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(async (blob)=>{
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
      setSelected(file)
      try{ setPreviewUrl(URL.createObjectURL(file)) }catch(e){}
      stopCamera()
      await sendFile(file)
    }, 'image/jpeg')
  }

  const getSeverityColor = (severity) => {
    const colors = {
      'High': '#dc2626',
      'Medium': '#f59e0b',
      'Low': '#10b981',
      'None': '#0284c7'
    }
    return colors[severity] || '#6b7280'
  }

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="gallery-hero-bg" />
        <div className="gallery-hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">📸 Upload / Detection</h1>
            <p className="hero-sub">Upload an image or capture a photo to detect plant disease</p>

            {/* User Info & Plant Type Selection */}
            <div className="user-config">
              <div className="config-item">
                <label>Plant Type:</label>
                <select value={plantType} onChange={(e) => setPlantType(e.target.value)} className="form-select">
                  {PLANT_TYPES.map(p => (
                    <option key={p} value={p.toLowerCase()}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="config-item">
                <label>User ID:</label>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="form-input" placeholder="User ID" />
              </div>
            </div>

            <div className="upload-card card-like">
              {/* Upload Method Tabs */}
              <div className="method-tabs">
                <button 
                  className={`tab-button ${uploadMethod === 'sample' ? 'active' : ''}`}
                  onClick={() => setUploadMethod('sample')}
                >
                  📷 Sample Images
                </button>
                <button 
                  className={`tab-button ${uploadMethod === 'upload' ? 'active' : ''}`}
                  onClick={() => setUploadMethod('upload')}
                >
                  📁 Upload File
                </button>
                <button 
                  className={`tab-button ${uploadMethod === 'camera' ? 'active' : ''}`}
                  onClick={() => setUploadMethod('camera')}
                >
                  📱 Live Camera
                </button>
              </div>

              {/* Sample Images Section */}
              {uploadMethod === 'sample' && (
                <section className="samples method-section">
                  <div className="section-header">
                    <h3>Sample Images</h3>
                    <p className="section-desc">Click any sample to analyze it instantly</p>
                  </div>
                  <div className="grid samples-grid">
                    {samples.map(s=> (
                      <div 
                        key={s.id} 
                        className="sample-item"
                        onClick={()=>useSample(s.url)}
                        title="Click to analyze this sample"
                      >
                        <img src={s.url} alt={`sample-${s.id}`} />
                        <div className="sample-overlay">Click to Analyze</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Upload File Section */}
              {uploadMethod === 'upload' && (
                <section className="upload method-section">
                  <div className="section-header">
                    <h3>Upload from Device</h3>
                    <p className="section-desc">Choose an image from your device</p>
                  </div>
                  <div className="upload-area">
                    <input 
                      type="file" 
                      id="file-input"
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleFile} 
                      className="file-input"
                    />
                    <label htmlFor="file-input" className="upload-label">
                      <span className="upload-icon">📁</span>
                      <span className="upload-text">Click to select image</span>
                      <span className="upload-hint">or drag and drop</span>
                    </label>
                    {selected && (
                      <div className="selected-file">
                        <p>✓ {selected.name}</p>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={onUpload} 
                    className="btn btn-primary" 
                    disabled={loading || !selected}
                  >
                    {loading ? '⏳ Analyzing...' : '🚀 Upload & Detect'}
                  </button>
                  {errorMessage && <div className="form-error" role="alert">{errorMessage}</div>}
                </section>
              )}

              {/* Camera Section */}
              {uploadMethod === 'camera' && (
                <section className="camera method-section">
                  <div className="section-header">
                    <h3>Capture with Camera</h3>
                    <p className="section-desc">Use your device camera to capture plant images</p>
                  </div>
                  {!streaming ? (
                    <div className="camera-start">
                      <div className="camera-icon">📱</div>
                      <p>Point your camera at the plant leaf to capture an image</p>
                      <button onClick={startCamera} className="btn btn-primary">
                        🎥 Start Camera
                      </button>
                    </div>
                  ) : (
                    <div className="camera-active">
                      <video ref={videoRef} autoPlay playsInline muted className="video" />
                      <canvas ref={canvasRef} style={{display:'none'}} />
                      <div className="camera-controls">
                        <button onClick={takePhoto} className="btn btn-success" disabled={loading}>
                          {loading ? '⏳ Processing...' : '📸 Capture Photo'}
                        </button>
                        <button onClick={stopCamera} className="btn btn-secondary">
                          ❌ Stop Camera
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview & Result Section */}
      <section className="detection-section">
        <h2>🔍 Detection Result</h2>
        
        {selected && (
          <div className="preview-container">
            <div className="preview-box">
              <img src={previewUrl || ''} alt="selected" />
              <div className="preview-overlay">Uploaded Image</div>
            </div>
          </div>
        )}

        {errorMessage && <div className="form-error large-error" role="alert">{errorMessage}</div>}

        {result ? (
          <div className="result-box detailed-result">
            {/* Header with Disease Name */}
            <div className="result-header">
              <div className="result-title">
                <h3>{result?.detection?.name || 'No detection'}</h3>
                <span 
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(result.detection?.severity) }}
                >
                  {result.detection?.severity || 'Unknown'}
                </span>
              </div>
              <div className="confidence-display">
                <span className="confidence-label">Confidence</span>
                <span className="confidence-value">{result.confidence}</span>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="info-grid">
              <div className="info-card">
                <label>Disease Type</label>
                <p>{result.detection?.details?.type || 'Unknown'}</p>
              </div>
              <div className="info-card">
                <label>Recovery Time</label>
                <p>{result.detection?.details?.estimated_days || 'N/A'}</p>
              </div>
              <div className="info-card">
                <label>Severity Level</label>
                <p>{result.detection?.severity || 'Unknown'}</p>
              </div>
              <div className="info-card">
                <label>Detection Time</label>
                <p>{new Date(result.time).toLocaleString()}</p>
              </div>
            </div>

            {/* Life Cycle */}
            {result.detection?.details?.life_cycle && (
              <div className="result-section life-cycle-section">
                <h4>🔄 Disease Life Cycle</h4>
                <p>{result.detection.details.life_cycle}</p>
              </div>
            )}

            {/* Control Measures */}
            {result.detection?.details?.measures && (
              <div className="result-section measures-section">
                <h4>🌿 Control Measures</h4>
                <ul className="measures-list">
                  {result.detection.details.measures.map((m,i)=> (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Pesticides */}
            {result.detection?.details?.pesticides && result.detection.details.pesticides.length>0 && (
              <div className="result-section pesticides-section">
                <h4>💊 Recommended Pesticides</h4>
                <div className="pesticide-grid">
                  {result.detection.details.pesticides.map(p=> (
                    <div className="pesticide-card detailed-pesticide" key={p.name}>
                      <div className="pesticide-image">{p.image || '💊'}</div>
                      <div className="pesticide-content">
                        <strong>{p.name}</strong>
                        <p className="pesticide-use">{p.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Server Info */}
            {result.image && (
              <div className="result-footer">
                <p>✓ Image saved to server</p>
                <a href={`${API}${result.image}`} target="_blank" rel="noreferrer" className="btn btn-outline">
                  View Original
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <p className="empty-text">No detection yet</p>
            <p className="empty-hint">Upload an image or capture a photo to start analyzing</p>
          </div>
        )}
      </section>

      {/* Tips & Best Practices */}
      <section className="tips-section">
        <h2>💡 Tips for Best Results</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">☀️</div>
            <h4>Good Lighting</h4>
            <p>Capture images in natural daylight for clearer disease symptoms</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Close-up View</h4>
            <p>Take close-up photos of affected leaves for better accuracy</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📸</div>
            <h4>Multiple Angles</h4>
            <p>Capture both sides of the leaf to get better diagnosis</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🌿</div>
            <h4>Healthy Reference</h4>
            <p>Include a healthy leaf for comparison to confirm disease</p>
          </div>
        </div>
      </section>
    </div>
  )
}