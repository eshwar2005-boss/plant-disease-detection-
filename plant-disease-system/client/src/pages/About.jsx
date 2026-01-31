import React from 'react'

export default function About(){
  return (
    <div className="about-page">
      <h2>About</h2>

      <p><strong>Plant Disease System</strong> is a demo web application for detecting plant diseases from images. It supports uploading photos from your device, capturing images with the camera, and storing detection history for later review. The project is intended as a foundation for integrating a real machine learning model for automated disease diagnosis.</p>

      <h3>How to use</h3>
      <ol>
        <li>Go to <strong>Upload / Detection</strong>, and either choose an image from your device or start the camera and take a photo.</li>
        <li>Press <strong>Upload & Detect</strong> to send the image to the server — the app will return the detected disease (demo) and confidence score.</li>
        <li>Visit <strong>Results</strong> to view stored detection history and review past images and diagnoses.</li>
        <li>See <strong>Disease Info</strong> for disease descriptions and recommended pesticide treatments.</li>
      </ol>

      <h3>What this is useful for</h3>
      <ul>
        <li>Quickly collect and store images of plant symptoms for review.</li>
        <li>Create a dataset you can later use to train a real detection model.</li>
        <li>Provide farmers and extension workers with an easy tool to document plant health issues and contact helpers.</li>
      </ul>

      <h3>Recommended pesticides (examples)</h3>
      <div className="pesticide-grid">
        <div className="pesticide-card">
          <img src="/images/pesticide1.svg" alt="Copper Fungicide" />
          <div className="pesticide-meta">
            <strong>Copper Fungicide</strong>
            <p className="muted">Controls many fungal diseases; use as foliar spray per label instructions.</p>
          </div>
        </div>

        <div className="pesticide-card">
          <img src="/images/pesticide2.svg" alt="Neem Oil" />
          <div className="pesticide-meta">
            <strong>Neem Oil</strong>
            <p className="muted">Organic option for insect control and some fungal problems; useful as a preventive spray.</p>
          </div>
        </div>

        <div className="pesticide-card">
          <img src="/images/pesticide3.svg" alt="Chlorothalonil" />
          <div className="pesticide-meta">
            <strong>Chlorothalonil</strong>
            <p className="muted">Broad‑spectrum fungicide; rotate products to avoid resistance.</p>
          </div>
        </div>
      </div>

      <h4>Safety & best practices</h4>
      <p>Always follow the product label and local regulations. Use personal protective equipment (gloves, mask, eyewear), avoid spraying near water, and consider integrated pest management (IPM) approaches that combine cultural, biological and chemical controls.</p>

    </div>
  )
}