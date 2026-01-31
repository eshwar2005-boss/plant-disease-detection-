import React from 'react'

export default function Home(){
  return (
    <div className="home hero">
      <div className="hero-bg" aria-hidden="true" />
      <img src="/images/leaf1.svg" className="leaf leaf1" alt="" aria-hidden="true" />
      <img src="/images/leaf2.svg" className="leaf leaf2" alt="" aria-hidden="true" />
      <img src="/images/leaf3.svg" className="leaf leaf3" alt="" aria-hidden="true" />

      <div className="hero-inner banner">
        <div className="banner-text">
          <h1 className="banner-title">WELCOME TO PLANT DISEASE SYSTEM</h1>
          <p className="banner-sub">A Plant Disease Detection Website</p>
          <p className="banner-desc">Upload a leaf image or capture with your camera to get a quick diagnosis and guidance.</p>
          <div className="banner-cta">
            <a className="btn large" href="/gallery">Start Detection</a>
            <a className="btn secondary" href="/disease">View Diseases</a>
          </div>
        </div>

        <div className="hero-grid">
          <img src="/images/sample1.svg" alt="plant1" />
          <img src="/images/sample2.svg" alt="plant2" />
          <img src="/images/sample3.svg" alt="plant3" />
        </div>
      </div>
    </div>
  )
}