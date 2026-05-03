import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showRobot, setShowRobot] = useState(true);

  useEffect(() => {
    // Auto-hide robot after 3 seconds, show on hover
    const timer = setTimeout(() => setShowRobot(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }
    // Store user in localStorage
    const userData = {
      username: username,
      name: username,
      loginTime: new Date().toLocaleString()
    };
    localStorage.setItem('user', JSON.stringify(userData));
    alert(`Welcome back, ${username}!`);
    navigate('/dashboard');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      alert('Please fill all fields');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    // Store user in localStorage
    const userData = {
      username: username,
      name: username,
      email: email,
      signupTime: new Date().toLocaleString()
    };
    localStorage.setItem('user', JSON.stringify(userData));
    alert(`Welcome ${username}! Your account has been created.`);
    navigate('/dashboard');
  };

  return (
    <div className="landing-page">
      {/* Animated Robot Helper */}
      <div 
        className={`robot-helper ${showRobot ? 'visible' : ''}`}
        onMouseEnter={() => setShowRobot(true)}
        onMouseLeave={() => setTimeout(() => setShowRobot(false), 2000)}
      >
        <div className="robot-body">
          <div className="robot-head">
            <div className="robot-eye left"></div>
            <div className="robot-eye right"></div>
            <div className="robot-mouth"></div>
          </div>
          <div className="robot-torso">
            <div className="robot-arm left"></div>
            <div className="robot-arm right"></div>
          </div>
          <div className="robot-legs">
            <div className="robot-leg left"></div>
            <div className="robot-leg right"></div>
          </div>
        </div>
        <div className="robot-text">👋 Help us detect plant diseases!</div>
      </div>

      {/* Background Animation */}
      <div className="animated-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="landing-container">
        {/* Left Section - Welcome */}
        <div className="landing-left">
          <div className="welcome-content">
            <h1 className="main-title">
              🌱 Plant Disease <span className="highlight">Detector</span>
            </h1>
            <p className="subtitle">
              Identify plant diseases in seconds using AI-powered image recognition
            </p>
            <ul className="features-list">
              <li><span className="icon">✨</span> Instant Disease Detection</li>
              <li><span className="icon">📊</span> Detailed Analytics</li>
              <li><span className="icon">🔬</span> AI-Powered Accuracy</li>
              <li><span className="icon">🌍</span> Global Plant Database</li>
            </ul>
          </div>

          {/* Floating Animation */}
          <div className="floating-item item-1">🍎</div>
          <div className="floating-item item-2">🌽</div>
          <div className="floating-item item-3">🍅</div>
        </div>

        {/* Right Section - Auth Forms */}
        <div className="landing-right">
          {!showSignup ? (
            /* Login Form */
            <div className="auth-form login-form">
              <h2>Welcome Back!</h2>
              <p>Sign in to your account</p>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Login
                </button>
              </form>

              <div className="signup-link">
                <p>Don't have an account?</p>
                <button 
                  className="text-button"
                  onClick={() => setShowSignup(true)}
                >
                  Create new account
                </button>
              </div>
            </div>
          ) : (
            /* Signup Form */
            <div className="auth-form signup-form">
              <h2>Create Account</h2>
              <p>Get started in seconds</p>

              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Create Account
                </button>
              </form>

              <div className="login-link">
                <p>Already have an account?</p>
                <button 
                  className="text-button"
                  onClick={() => setShowSignup(false)}
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Down Motion Arrow */}
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="arrow">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
