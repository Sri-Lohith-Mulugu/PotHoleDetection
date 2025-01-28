import React from "react";
import { useNavigate } from "react-router-dom"; // To navigate between pages
import "./LandingPage.css"; // Make sure your styles are linked

const LandingPage = () => {
  const navigate = useNavigate(); // hook to navigate to different pages

  const handleLogin = () => {
    navigate("/login"); // Navigate to the login page
  };

  const handleSignup = () => {
    navigate("/register"); // Navigate to the signup page
  };

  return (
    <div className="hero-container">
      <div className="hero-buttons">
        <button className="button" onClick={handleLogin}>
          Login
        </button>
        <button className="button" onClick={handleSignup}>
          Register
        </button>
      </div>

      <section className="hero">
        <div className="hero-text">
          <h1>Automatic PotHole Detection by CNN and ANN</h1>
          <p>
          Our project uses advanced deep learning techniques and computer vision 
                to detect potholes on roads. This helps in efficient road maintenance 
                and reduces the risk of accidents. The system is trained on a dataset 
                of road images to accurately classify and locate potholes.
          </p>
        </div>

        <div className="hero-image">
          <img src="/image.webp" alt="Cricket Game" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
