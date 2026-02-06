import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Contact(){
  const [helpers, setHelpers] = useState([])
  const [form, setForm] = useState({name:'',phone:'',email:'',location:'',services:''})
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  function load(){
    axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'}/api/helpers`)
      .then(r=>setHelpers(r.data.helpers || []))
      .catch(()=>{
        setHelpers([])
        setMessage({type:'error', text:'Could not load helpers (server unavailable)'});
      })
  }
  useEffect(()=>{ load() },[])

  function validate(){
    if (!form.name.trim()) return 'Name required'
    if (!form.phone.trim()) return 'Phone required'
    return ''
  }

  async function addHelper(e){
    e.preventDefault()
    const err = validate();
    if (err){ setError(err); return }
    setError('')
    setLoading(true)
    setMessage(null)
    try{
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'}/api/helpers`, form)
      setForm({name:'',phone:'',email:'',location:'',services:''})
      setMessage({type:'success', text:'Helper added successfully'})
      load()
    }catch(err){
      setMessage({type:'error', text:'Failed to add helper'})
    }finally{setLoading(false)}
  }

  async function remove(id){
    if (!confirm('Remove this helper?')) return
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'}/api/helpers/${id}`)
      setMessage({type:'success', text:'Helper removed'})
      load()
    }catch(e){
      setMessage({type:'error', text:'Failed to remove helper'})
    }
  }

  function copyPhone(phone){
    if (!phone) return
    navigator.clipboard?.writeText(phone).then(()=>{
      setMessage({type:'success', text:`Phone ${phone} copied to clipboard`})
    }).catch(()=>{
      setMessage({type:'error', text:'Could not copy phone to clipboard'})
    })
  }

  // auto-clear transient messages
  useEffect(()=>{
    if (!message) return
    const t = setTimeout(()=>setMessage(null), 3500)
    return ()=>clearTimeout(t)
  },[message])

  const visible = helpers.filter(h=>{
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (h.name||'').toLowerCase().includes(q) || (h.location||'').toLowerCase().includes(q) || (h.services||'').toLowerCase().includes(q)
  })

  return (
    <div className="contact-page">
      {message && <div className={`notification ${message.type}`} role="status">{message.text}</div>}

      {/* Developer Contact Section */}
      <div className="developer-section">
        <div className="developer-content">
          <h2>About This Project</h2>
          <p>The Plant Disease Detection System is an advanced AI-powered application designed to help farmers identify and manage crop diseases efficiently.</p>
          
          <div className="developer-info">
            <div className="developer-card">
              <h3>👨‍💻 Developer</h3>
              <p><strong>Name:</strong> K. Santhoshini Reddy</p>
              <p><strong>Email:</strong> <a href="mailto:santhoshinireddy320@email.com">santhoshinireddy320@email.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+919876543219">+91 9876543219</a></p>
              <p><strong>Location:</strong> India</p>
            </div>

            <div className="developer-card">
              <h3>🎯 Project Purpose</h3>
              <p>This application uses advanced image recognition to identify plant diseases and provide farmers with:</p>
              <ul>
                <li>Accurate disease diagnosis</li>
                <li>Treatment recommendations</li>
                <li>Pesticide guidelines</li>
                <li>Cultural control measures</li>
                <li>Analytics & tracking</li>
              </ul>
            </div>

            <div className="developer-card">
              <h3>🔧 Technologies</h3>
              <p>Built with modern web technologies:</p>
              <ul>
                <li>Frontend: React, Vite, Axios</li>
                <li>Backend: Express.js, Node.js</li>
                <li>Database: SQLite3</li>
                <li>Caching: Node-Cache</li>
                <li>Image Processing: Sharp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-header">
        <div>
          <h2>Contact / Helpers</h2>
          <p className="muted">Add helpers who can assist farmers with advice, on-site visits, or supplies. Click a phone number to call from a mobile device.</p>
        </div>

        <div className="search-box">
          <label className="sr-only" htmlFor="helper-search">Search helpers</label>
          <input id="helper-search" placeholder="Search by name, location or services" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="contact-grid">
        <form className="helper-form card-like" onSubmit={addHelper} aria-label="Add helper form">
          <div className="form-row">
            <label className="sr-only" htmlFor="helper-name">Name</label>
            <input id="helper-name" required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />

            <label className="sr-only" htmlFor="helper-phone">Phone</label>
            <input id="helper-phone" required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          </div>

          <div className="form-row">
            <label className="sr-only" htmlFor="helper-email">Email</label>
            <input id="helper-email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />

            <label className="sr-only" htmlFor="helper-location">Location</label>
            <input id="helper-location" placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
          </div>

          <label className="sr-only" htmlFor="helper-services">Services</label>
          <input id="helper-services" placeholder="Services (comma separated)" value={form.services} onChange={e=>setForm({...form,services:e.target.value})} />

          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Helper'}</button>
            <button type="button" onClick={()=>{setForm({name:'',phone:'',email:'',location:'',services:''}); setError(''); setMessage(null)}} className="btn secondary">Clear</button>
          </div>
        </form>

        <div className="helpers-area">
          <h3>Available Helpers ({visible.length})</h3>

          {visible.length===0 && <div className="empty">No helpers found. Add one to get started.</div>}

          <div className="helpers-list">
            {visible.map(h => (
              <div key={h.id} className="helper-card card-like">
                <div className="helper-left">
                  <div className="avatar">{(h.name||'').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>
                  <div>
                    <strong>{h.name}</strong>
                    <p className="muted">{h.location} — {h.services}</p>
                    {h.phone && <div className="phone-row"><a href={`tel:${h.phone}`} className="phone-link" aria-label={`Call ${h.name}`}>{h.phone}</a> <button className="btn tiny" onClick={()=>copyPhone(h.phone)} aria-label={`Copy ${h.name} phone`}>Copy</button></div>}
                  </div>
                </div>

                <div className="helper-actions">
                  {h.email && <a href={`mailto:${h.email}`} className="helper-btn" title="Email" aria-label={`Email ${h.name}`}><img src="/images/icon-email.svg" alt="email" /></a>}
                  <button className="btn small danger" onClick={()=>remove(h.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}