import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/register");

  return (
    <div className="hero-container">

      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="nav-brand">🚧 PotHole Detector</div>
        <div className="nav-buttons">
          <button className="btn-outline" onClick={handleLogin}>Login</button>
          <button className="btn-solid" onClick={handleSignup}>Register</button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-tag">AI Powered Road Safety</div>
          <h1>Smart Pothole<br />Detection System</h1>
          <p>
            Upload a road image, choose between CNN or ANN model,
            and get an instant prediction with confidence score —
            helping enable smarter road maintenance and accident prevention.
          </p>

          {/* Tech Badges — decorative only */}
          <div className="hero-badges">
            <span className="badge">PyTorch</span>
            <span className="badge">CNN</span>
            <span className="badge">ANN</span>
            <span className="badge">Flask</span>
            <span className="badge">React</span>
            <span className="badge">MongoDB</span>
          </div>

          <button className="btn-solid hero-cta" onClick={handleLogin}>
            Get Started →
          </button>
        </div>

        <div className="hero-image">
          <img src="/image.webp" alt="Pothole Detection" />
        </div>
      </section>

      {/* Stats Section */}
      <div className="hero-stats">
        <div className="stat">
          <h2>99%</h2>
          <p>CNN Accuracy</p>
        </div>
        <div className="divider" />
        <div className="stat">
          <h2>2</h2>
          <p>AI Models</p>
        </div>
        <div className="divider" />
        <div className="stat">
          <h2>Real-Time</h2>
          <p>Detection</p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
