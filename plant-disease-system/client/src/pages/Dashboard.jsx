import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [detections, setDetections] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newProject, setNewProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [showDetectionModal, setShowDetectionModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m your plant disease assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const getUserId = (userData = user) => {
    return userData?.username || userData?.email || userData?.name || 'user_1';
  };

  const mapServerDetectionToUi = (row) => ({
    id: row.id,
    detection: {
      name: row.disease_name,
      severity: row.severity,
      details: {
        type: row.disease_type || 'N/A',
      },
    },
    confidence: `${Number(row.confidence || 0).toFixed(2)}%`,
    timestamp: row.created_at ? new Date(row.created_at).toLocaleString() : new Date().toLocaleString(),
  });

  const loadUserDetections = async (userData) => {
    const userId = getUserId(userData);
    const localKey = `detections_${userId}`;

    try {
      const response = await fetch(`http://localhost:5001/api/user/${encodeURIComponent(userId)}/detections`);
      if (response.ok) {
        const data = await response.json();
        const mapped = (data.detections || []).map(mapServerDetectionToUi);
        setDetections(mapped);
        localStorage.setItem(localKey, JSON.stringify(mapped));
        return;
      }
    } catch (error) {
      console.error('Failed to load detections from server:', error);
    }

    const savedDetections = JSON.parse(localStorage.getItem(localKey) || '[]');
    setDetections(savedDetections);
  };

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/landing');
    } else {
      setUser(userData);
      // Load saved projects
      const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      setProjects(savedProjects);
      loadUserDetections(userData);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const userId = getUserId(user);
    localStorage.setItem(`detections_${userId}`, JSON.stringify(detections));
  }, [detections, user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/landing');
  };

  // Drag and Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateImageFile(file)) {
        setSelectedFile(file);
        handleUpload(file);
      }
    }
  };

  const validateImageFile = (file) => {
    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      alert('❌ Please upload an image file only!');
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Image size should be less than 10MB!');
      return false;
    }
    
    return true;
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', getUserId());

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      const response = await fetch('http://localhost:5001/api/detect', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        
        // Check if the image is valid (plant/leaf image)
        if (result.error || result.isInvalidImage) {
          alert('❌ Invalid Image! Please upload only plant or leaf images.');
          setUploadProgress(0);
          setSelectedFile(null);
          return;
        }
        
        // Add to uploaded images
        const newImage = {
          id: Date.now(),
          name: file.name,
          preview: URL.createObjectURL(file),
          detection: result.detection,
          confidence: result.confidence,
          timestamp: new Date().toLocaleString(),
        };
        
        setUploadedImages((prev) => [newImage, ...prev]);
        setDetections((prev) => [
          {
            ...result,
            timestamp: newImage.timestamp,
          },
          ...prev,
        ]);

        setTimeout(() => {
          setUploadProgress(0);
          setSelectedFile(null);
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || '❌ Failed to detect disease. Please upload a valid plant image.');
        setUploadProgress(0);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Failed to upload image. Please try again.');
      setUploadProgress(0);
      setSelectedFile(null);
    }
  };

  const handleCreateProject = () => {
    if (!newProject.trim()) {
      alert('Please enter a project name');
      return;
    }

    const project = {
      id: Date.now(),
      name: newProject,
      createdAt: new Date().toLocaleString(),
      images: [],
    };

    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setNewProject('');
    alert(`Project "${newProject}" created successfully!`);
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handleImageClick = (image) => {
    setSelectedDetection(image);
    setShowDetectionModal(true);
  };

  const closeDetectionModal = () => {
    setShowDetectionModal(false);
    setSelectedDetection(null);
  };

  const handleDownloadReport = () => {
    if (!selectedDetection) return;

    // Create a detailed text report
    const report = `
PLANT DISEASE DETECTION REPORT
==============================

Image: ${selectedDetection.name}
Date: ${selectedDetection.timestamp}

DISEASE INFORMATION
-------------------
Disease Name: ${selectedDetection.detection?.name || 'Unknown'}
Confidence Level: ${selectedDetection.confidence || 'N/A'}
Severity: ${selectedDetection.detection?.severity || 'N/A'}
Disease Type: ${selectedDetection.detection?.details?.type || 'N/A'}

LIFE CYCLE
----------
${selectedDetection.detection?.details?.life_cycle || 'N/A'}

TREATMENT DURATION
------------------
${selectedDetection.detection?.details?.estimated_days || 'N/A'}

RECOMMENDED MEASURES
--------------------
${selectedDetection.detection?.details?.measures?.map((m, i) => `${i + 1}. ${m}`).join('\n') || 'N/A'}

RECOMMENDED PESTICIDES
----------------------
${selectedDetection.detection?.details?.pesticides?.map((p, i) => `${i + 1}. ${p.name}: ${p.use}`).join('\n') || 'None'}

SUGGESTIONS TO REDUCE DISEASE
------------------------------
${selectedDetection.detection?.details?.suggestions?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'No specific suggestions available'}

PREVENTION TIPS
---------------
${selectedDetection.detection?.details?.prevention || 'Follow general plant care guidelines'}

Generated by Plant Disease Detection System
    `;

    // Create blob and download
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disease-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Report downloaded successfully!');
  };

  const handleShareResult = () => {
    if (!selectedDetection) return;

    const shareText = `Plant Disease Detection Result:
Disease: ${selectedDetection.detection?.name || 'Unknown'}
Confidence: ${selectedDetection.confidence || 'N/A'}
Severity: ${selectedDetection.detection?.severity || 'N/A'}

Detected by Plant Disease Detection System`;

    if (navigator.share) {
      navigator.share({
        title: 'Plant Disease Detection Result',
        text: shareText,
      }).then(() => {
        alert('✅ Shared successfully!');
      }).catch((error) => {
        console.error('Error sharing:', error);
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Result copied to clipboard!');
    }).catch(() => {
      alert('❌ Failed to copy. Please try again.');
    });
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { type: 'user', text: chatInput }]);
    const userQuery = chatInput.toLowerCase();
    setChatInput('');

    // Simulate intelligent bot response based on keywords
    setTimeout(() => {
      let response = '';

      if (userQuery.includes('prevent') || userQuery.includes('prevention')) {
        response = '🛡️ Disease Prevention Tips:\n• Practice crop rotation (3-year cycle)\n• Water at soil level, not foliage\n• Space plants for air circulation\n• Remove plant debris regularly\n• Use disease-resistant varieties\n• Apply organic mulch around plants';
      } else if (userQuery.includes('reduce') || userQuery.includes('treat') || userQuery.includes('cure')) {
        response = '💊 Disease Reduction Methods:\n• Remove infected leaves immediately\n• Apply organic neem oil spray\n• Use copper-based fungicides\n• Improve air circulation\n• Maintain proper watering schedule\n• Consider bio-fungicides for organic control';
      } else if (userQuery.includes('organic') || userQuery.includes('natural')) {
        response = '🌿 Organic Disease Control:\n• Neem oil - powerful natural fungicide\n• Baking soda spray - alkaline prevents fungal growth\n• Garlic spray - natural antibacterial\n• Compost tea - boosts plant immunity\n• Sulfur dust - organic fungicide\n• Beneficial insects for pest control';
      } else if (userQuery.includes('fungicide') || userQuery.includes('pesticide') || userQuery.includes('chemical')) {
        response = '🧪 Fungicide Usage Tips:\n• Apply early in the season as preventive\n• Follow label instructions carefully\n• Rotate fungicide types to prevent resistance\n• Apply during dry weather for best results\n• Wear protective equipment\n• Consider organic options first';
      } else if (userQuery.includes('upload') || userQuery.includes('image') || userQuery.includes('photo')) {
        response = '📸 Image Upload Tips:\n• Use clear, well-lit photos\n• Focus on affected plant areas\n• Take photos in natural daylight\n• Avoid blurry or dark images\n• Show leaf details clearly\n• Multiple angles help accurate detection';
      } else if (userQuery.includes('water') || userQuery.includes('irrigation')) {
        response = '💧 Watering Best Practices:\n• Water early morning (6-10am)\n• Water at soil level, not leaves\n• Use drip irrigation when possible\n• Avoid overwatering - causes root rot\n• Allow soil to dry between waterings\n• Mulch to retain moisture';
      } else {
        const generalResponses = [
          '🌱 Tip: Regular monitoring helps catch diseases early when they\'re easier to treat. Check plants weekly!',
          '📊 Did you know? Proper spacing between plants improves air circulation and reduces disease spread by 40%.',
          '♻️ Crop rotation is key! Change plant families every 2-3 years to break disease cycles.',
          '🧹 Garden hygiene matters! Remove fallen leaves and infected plant material promptly.',
          '💪 Strong plants resist disease better. Ensure proper nutrition with balanced fertilizer.',
          '🌤️ Plant health tip: Most fungal diseases spread in damp conditions. Water in morning so plants dry during the day.',
        ];
        response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }

      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 1000);
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* Sidebar Profile */}
      <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
        <button className="sidebar-close" onClick={() => setShowSidebar(false)}>✕</button>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3>{user?.name || 'User'}</h3>
          <p>{user?.email || user?.username || 'user@example.com'}</p>
        </div>

        <div className="sidebar-menu">
          <button className="sidebar-item" onClick={() => { setShowSidebar(false); setActiveTab('upload'); }}>
            <span className="icon">📤</span> Upload & Detect
          </button>
          <button className="sidebar-item" onClick={() => { setShowSidebar(false); setActiveTab('projects'); }}>
            <span className="icon">📁</span> Projects
          </button>
          <button className="sidebar-item" onClick={() => { setShowSidebar(false); setActiveTab('history'); }}>
            <span className="icon">📊</span> History
          </button>
          <button className="sidebar-item" onClick={() => { setShowSidebar(false); setShowFAQ(true); }}>
            <span className="icon">❓</span> FAQs
          </button>
          <button className="sidebar-item" onClick={() => { setShowSidebar(false); setShowContact(true); }}>
            <span className="icon">📧</span> Contact Us
          </button>
          <button className="sidebar-item logout" onClick={handleLogout}>
            <span className="icon">🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>}

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setShowSidebar(true)}>
            ☰
          </button>
          <h1 className="dashboard-title">🌱 Plant Disease Dashboard</h1>
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={() => setShowFAQ(true)}>
            ❓ FAQs
          </button>
          <button className="header-btn" onClick={() => setShowContact(true)}>
            📧 Contact
          </button>
          <button className="profile-btn" onClick={() => setShowSidebar(true)}>
            <div className="profile-icon">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload & Detect
        </button>
        <button
          className={`nav-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📁 Create Projects
        </button>
        <button
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 Detection History
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Upload Section */}
        {activeTab === 'upload' && (
          <section className="section upload-section">
            <div className="section-header">
              <h2>📤 Upload Plant Image</h2>
              <p>Drag and drop or click to upload</p>
              <p className="warning-text">⚠️ Only plant/leaf images accepted. Human/person images will be rejected.</p>
            </div>

            <div
              className={`upload-area ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <div className="upload-content">
                <div className="upload-icon">📸</div>
                <p className="upload-text">Drag your image here</p>
                <p className="upload-subtext">or click anywhere to browse</p>
                <input
                  id="file-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      const file = e.target.files[0];
                      if (validateImageFile(file)) {
                        setSelectedFile(file);
                        handleUpload(file);
                      }
                    }
                  }}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <button className="browse-btn" onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('file-upload-input').click();
                }}>
                  Choose Image
                </button>
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="progress-text">{Math.round(uploadProgress)}% uploaded</p>
              </div>
            )}

            {selectedFile && (
              <div className="selected-file">
                <p>Selected: <strong>{selectedFile.name}</strong></p>
              </div>
            )}

            {/* Recent Uploads */}
            {uploadedImages.length > 0 && (
              <div className="recent-uploads">
                <h3>Recent Uploads</h3>
                <div className="images-grid">
                  {uploadedImages.map((img) => (
                    <div 
                      key={img.id} 
                      className="image-card" 
                      onClick={() => handleImageClick(img)}
                    >
                      <img src={img.preview} alt={img.name} />
                      <div className="image-info">
                        <p className="image-name">{img.name}</p>
                        <p className="image-time">{img.timestamp}</p>
                        {img.detection && (
                          <div className="detection-badge">
                            {img.detection.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="upload-helper-robot">
              <div className="robot-glow"></div>
              <div className="robot-avatar" aria-hidden="true">🤖</div>
              <div className="robot-particles" aria-hidden="true">
                <span>✨</span>
                <span>🌿</span>
                <span>💡</span>
              </div>
              <h3>Plant Helper Robot</h3>
              <p>
                Need help with upload quality? Use clear leaf photos with good light for better disease detection.
              </p>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <section className="section projects-section">
            <div className="section-header">
              <h2>📁 Create Detection Projects</h2>
              <p>Organize your disease detections into separate projects</p>
            </div>

            <div className="create-project-form">
              <input
                type="text"
                placeholder="Enter project name (e.g., 'Tomato Disease Study')"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                className="project-input"
              />
              <button className="create-btn" onClick={handleCreateProject}>
                ✨ Create Project
              </button>
            </div>

            {projects.length > 0 ? (
              <div className="projects-list">
                <h3>Your Projects ({projects.length})</h3>
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project.id} className="project-card">
                      <div className="project-icon">📁</div>
                      <h4>{project.name}</h4>
                      <p className="project-date">Created: {project.createdAt}</p>
                      <div className="project-actions">
                        <button className="edit-btn">Edit</button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No projects yet. Create one to get started!</p>
              </div>
            )}
          </section>
        )}

        {/* History Section */}
        {activeTab === 'history' && (
          <section className="section history-section">
            <div className="section-header">
              <h2>📊 Detection History</h2>
              <p>View all your past disease detections</p>
            </div>

            {detections.length > 0 ? (
              <div className="detections-table">
                <table>
                  <thead>
                    <tr>
                      <th>Disease</th>
                      <th>Confidence</th>
                      <th>Severity</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detections.map((det, idx) => (
                      <tr key={idx}>
                        <td><strong>{det.detection?.name || 'N/A'}</strong></td>
                        <td>
                          <span className="confidence">
                            {det.confidence || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className={`severity ${det.detection?.severity?.toLowerCase()}`}>
                            {det.detection?.severity || 'N/A'}
                          </span>
                        </td>
                        <td>{det.detection?.details?.type || 'N/A'}</td>
                        <td>{det.timestamp || new Date().toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No detections yet. Upload an image to get started!</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Detection Modal */}
      {showDetectionModal && selectedDetection && (
        <div className="modal-overlay" onClick={closeDetectionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDetectionModal}>✕</button>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedDetection.preview} alt={selectedDetection.name} />
              </div>
              
              <div className="modal-details">
                <h2>🔍 Disease Detection Result</h2>
                
                <div className="detection-result">
                  <div className="result-item">
                    <label>Disease Type</label>
                    <p className="disease-name">{selectedDetection.detection?.name || 'Unknown'}</p>
                  </div>

                  <div className="result-item">
                    <label>Confidence Level</label>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${selectedDetection.confidence || 0}%` }}
                      ></div>
                    </div>
                    <p>{selectedDetection.confidence || '0'}%</p>
                  </div>

                  <div className="result-item">
                    <label>Severity</label>
                    <p className={`severity-level ${selectedDetection.detection?.severity?.toLowerCase()}`}>
                      {selectedDetection.detection?.severity || 'N/A'}
                    </p>
                  </div>

                  {selectedDetection.detection?.details && (
                    <>
                      <div className="result-item">
                        <label>Disease Type</label>
                        <p>{selectedDetection.detection.details.type}</p>
                      </div>

                      <div className="result-item">
                        <label>Life Cycle</label>
                        <p>{selectedDetection.detection.details.life_cycle}</p>
                      </div>

                      <div className="result-item">
                        <label>Treatment Duration</label>
                        <p>{selectedDetection.detection.details.estimated_days}</p>
                      </div>

                      <div className="result-item">
                        <label>Recommended Measures</label>
                        <ul className="measures-list">
                          {selectedDetection.detection.details.measures.map((measure, idx) => (
                            <li key={idx}>✓ {measure}</li>
                          ))}
                        </ul>
                      </div>

                      {selectedDetection.detection.details.pesticides?.length > 0 && (
                        <div className="result-item">
                          <label>Recommended Pesticides</label>
                          <ul className="pesticides-list">
                            {selectedDetection.detection.details.pesticides.map((pest, idx) => (
                              <li key={idx}>
                                <strong>{pest.name}</strong>: {pest.use}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedDetection.detection.details.suggestions?.length > 0 && (
                        <div className="result-item suggestions-section">
                          <label>💡 Suggestions to Reduce Disease</label>
                          <ul className="suggestions-list">
                            {selectedDetection.detection.details.suggestions.map((suggestion, idx) => (
                              <li key={idx}>🌱 {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedDetection.detection.details.prevention && (
                        <div className="result-item prevention-section">
                          <label>🛡️ Prevention Tips</label>
                          <p className="prevention-text">{selectedDetection.detection.details.prevention}</p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="modal-actions">
                    <button className="action-btn download-btn" onClick={() => handleDownloadReport(selectedDetection)}>
                      📥 Download Report
                    </button>
                    <button className="action-btn share-btn" onClick={() => handleShareResult(selectedDetection)}>
                      📤 Share Result
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
          <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowContact(false)}>✕</button>
            
            <div className="modal-body">
              <h2>📧 Contact Us</h2>
              <p>Have questions? We're here to help!</p>
              
              <form className="contact-form" onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! Your message has been sent. We\'ll get back to you soon.');
                setShowContact(false);
              }}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" required placeholder="Your Name" />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required placeholder="your@email.com" />
                </div>
                
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" required placeholder="What's this about?" />
                </div>
                
                <div className="form-group">
                  <label>Message</label>
                  <textarea required rows="5" placeholder="Tell us more..."></textarea>
                </div>
                
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {showFAQ && (
        <div className="modal-overlay" onClick={() => setShowFAQ(false)}>
          <div className="modal-content faq-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowFAQ(false)}>✕</button>
            
            <div className="modal-body">
              <h2>❓ Frequently Asked Questions</h2>
              
              <div className="faq-list">
                <div className="faq-item">
                  <h3>How accurate is the disease detection?</h3>
                  <p>Our AI model achieves 95%+ accuracy on common plant diseases. However, always consult a professional for critical decisions.</p>
                </div>
                
                <div className="faq-item">
                  <h3>What image formats are supported?</h3>
                  <p>We support JPG, JPEG, PNG, and WebP formats. For best results, use clear, well-lit images of affected plant parts.</p>
                </div>
                
                <div className="faq-item">
                  <h3>Can I detect multiple diseases in one image?</h3>
                  <p>Currently, the system identifies the most prominent disease. Upload separate images for different affected areas.</p>
                </div>
                
                <div className="faq-item">
                  <h3>How do I export detection reports?</h3>
                  <p>Click the "Download Report" button in any detection result to export a detailed text report with all findings and recommendations.</p>
                </div>
                
                <div className="faq-item">
                  <h3>What plants are supported?</h3>
                  <p>We support tomatoes, potatoes, peppers, corn, grapes, apples, peaches, strawberries, and many more. Over 38 plant species are currently covered.</p>
                </div>
                
                <div className="faq-item">
                  <h3>Is my data secure?</h3>
                  <p>Yes! All images are processed securely and automatically deleted after analysis. We never share your data with third parties.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Widget */}
      <div className={`chatbot-widget ${showChatbot ? 'expanded' : ''}`}>
        <div className="chatbot-header" onClick={() => setShowChatbot(!showChatbot)}>
          <span className="chatbot-icon">🤖</span>
          <span className="chatbot-title">Plant Helper</span>
          <button className="chatbot-toggle">{showChatbot ? '−' : '+'}</button>
        </div>
        
        {showChatbot && (
          <div className="chatbot-body">
            <div className="chatbot-messages">
              {chatMessages.length === 0 && (
                <div className="bot-message welcome">
                  <p>👋 Hi! I'm your Plant Health Assistant. Ask me anything about plant diseases!</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`${msg.type}-message`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            
            <div className="chatbot-input">
              <input 
                type="text" 
                placeholder="Ask about plant diseases..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
              />
              <button onClick={handleChatSend}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
