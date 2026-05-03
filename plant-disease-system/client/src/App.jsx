import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import DiseaseInfo from './pages/DiseaseInfo'
import About from './pages/About'
import Contact from './pages/Contact'
import Analytics from './pages/Analytics'

export default function App() {
  const location = useLocation()
  const hideNav = location.pathname === '/landing' || location.pathname === '/dashboard'

  return (
    <div className="app">
      {!hideNav && (
        <nav className="nav">
          <div className="nav-left">
            <Link to="/" className="brand">🌱 PLANT DISEASE SYSTEM</Link>
            <Link to="/landing" className="nav-link">🚀 Login</Link>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/gallery" className="nav-link">Upload / Detection</Link>
            <Link to="/disease" className="nav-link">Disease Info</Link>
            <Link to="/analytics" className="nav-link">📊 Analytics</Link>
          </div>
          <div className="nav-right">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </nav>
      )}

      <main className={hideNav ? 'container full-bleed' : 'container'}>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/disease" element={<DiseaseInfo />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>

      {!hideNav && <footer className="footer">© 2026 Plant Disease System | Powered by SQLite, Node-Cache & TensorFlow</footer>}
    </div>
  )
}
