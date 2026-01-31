import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Contact(){
  const [helpers, setHelpers] = useState([])
  const [form, setForm] = useState({name:'',phone:'',email:'',location:'',services:''})
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  function load(){
    axios.get('http://localhost:5001/api/helpers').then(r=>setHelpers(r.data.helpers || [])).catch(()=>setHelpers([]))
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
    await axios.post('http://localhost:5001/api/helpers', form)
    setForm({name:'',phone:'',email:'',location:'',services:''})
    load()
  }

  async function remove(id){
    if (!confirm('Remove this helper?')) return
    await axios.delete(`http://localhost:5001/api/helpers/${id}`)
    load()
  }

  const visible = helpers.filter(h=>{
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (h.name||'').toLowerCase().includes(q) || (h.location||'').toLowerCase().includes(q) || (h.services||'').toLowerCase().includes(q)
  })

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div>
          <h2>Contact / Helpers</h2>
          <p className="muted">Add helpers who can assist farmers with advice, on-site visits, or supplies. Click a phone number to call from a mobile device.</p>
        </div>

        <div className="search-box">
          <input placeholder="Search by name, location or services" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="contact-grid">
        <form className="helper-form card-like" onSubmit={addHelper}>
          <div className="form-row">
            <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            <input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          </div>

          <div className="form-row">
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
          </div>

          <input placeholder="Services (comma separated)" value={form.services} onChange={e=>setForm({...form,services:e.target.value})} />

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button className="btn">Add Helper</button>
            <button type="button" onClick={()=>{setForm({name:'',phone:'',email:'',location:'',services:''}); setError('')}} className="btn secondary">Clear</button>
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
                  </div>
                </div>

                <div className="helper-actions">
                  {h.phone && <a href={`tel:${h.phone}`} className="helper-btn" title="Call"><img src="/images/icon-phone.svg" alt="phone" /></a>}
                  {h.email && <a href={`mailto:${h.email}`} className="helper-btn" title="Email"><img src="/images/icon-email.svg" alt="email" /></a>}
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