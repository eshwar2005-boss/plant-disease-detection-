import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

export default function Gallery(){
  const [samples, setSamples] = useState([])
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [streaming, setStreaming] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(()=>{
    // Try backend samples, fall back to local public images
    axios.get('http://localhost:5001/api/samples')
      .then(r => setSamples(r.data.images))
      .catch(()=> setSamples([
        { id: 1, url: '/images/sample1.svg' },
        { id: 2, url: '/images/sample2.svg' },
        { id: 3, url: '/images/sample3.svg' }
      ]))
  },[])

  function handleFile(e){
    const file = e.target.files[0]
    if (file) setSelected(file)
  }

  async function sendFile(file){
    setResult(null)
    const fd = new FormData()
    fd.append('image', file)
    const res = await axios.post('http://localhost:5001/api/detect', fd, { headers: {'Content-Type': 'multipart/form-data'} })
    setResult(res.data)
  }

  async function onUpload(){
    if (!selected) return alert('Choose an image first')
    await sendFile(selected)
  }

  async function startCamera(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      setStreaming(true)
    }catch(err){
      alert('Camera access denied or not available')
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
      await sendFile(file)
    }, 'image/jpeg')
  }

  return (
    <div className="gallery-page">
      <h2>Gallery / Detect</h2>

      <section className="samples">
        <h3>Sample Images</h3>
        <div className="grid">
          {samples.map(s=> (
            <img key={s.id} src={s.url} alt={`sample-${s.id}`} />
          ))}
        </div>
      </section>

      <section className="upload">
        <h3>Upload from device</h3>
        <input type="file" accept="image/*" capture="environment" onChange={handleFile} />
        <button onClick={onUpload} className="btn">Upload & Detect</button>
      </section>

      <section className="camera">
        <h3>Capture with Camera</h3>
        <div className="cam-row">
          <video ref={videoRef} autoPlay playsInline muted className="video" />
          <canvas ref={canvasRef} style={{display:'none'}} />
        </div>
        <div className="cam-controls">
          {!streaming ? (
            <button onClick={startCamera} className="btn">Start Camera</button>
          ) : (
            <button onClick={takePhoto} className="btn">Take Photo</button>
          )}
        </div>
      </section>

      <section className="preview">
        <h3>Preview & Result</h3>
        {selected && <div className="preview-box">
          <img src={URL.createObjectURL(selected)} alt="selected" />
        </div>}

        {result && (
          <div className="result-box">
            <p><strong>Detection:</strong> {result.detection.name}</p>
            <p><strong>Type:</strong> {result.detection.details?.type || 'Unknown'}</p>
            <p><strong>Estimated recovery:</strong> {result.detection.details?.estimated_days || 'N/A'}</p>
            <p className="muted"><strong>Confidence:</strong> {result.confidence}</p>

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
                  {result.detection.details.measures.map((m,i)=> <li key={i}>{m}</li>)}
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

            {result.image && <p>Saved to server: <a href={`http://localhost:5001${result.image}`} target="_blank">View</a></p>}

          </div>
        )}
      </section>
    </div>
  )
}