import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Results from './pages/Results'
import DiseaseInfo from './pages/DiseaseInfo'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="brand">PLANT DISEASE SYSTEM</Link>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/gallery" className="nav-link">Upload / Detection</Link>
          <Link to="/results" className="nav-link">Results</Link>
          <Link to="/disease" className="nav-link">Disease Info</Link>
        </div>
        <div className="nav-right">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/results" element={<Results />} />
          <Route path="/disease" element={<DiseaseInfo />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="footer">© 2026 Plant Disease System</footer>
    </div>
  )
}
