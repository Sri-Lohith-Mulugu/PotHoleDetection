import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "./App.css";

function Card() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [selectedModel, setSelectedModel] = useState("CNN");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        navigate("/login");
      }
    };
    verifyUser();
  }, [navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImageURL(URL.createObjectURL(file));
      setResponse(null);
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image first.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("model", selectedModel);
    try {
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
    } catch (error) {
      setResponse({ error: "Failed to connect to server." });
    }
    setLoading(false);
  };

  // Safely extract result values — handles both CNN and ANN response formats
  const result = response && response.result ? response.result : null;
  const prediction = result ? result.prediction : null;
  const isPothole = prediction === "Pothole";

  // Confidence — some models return 0.0 for confidence, fall back to class_probabilities
  let confidence = 0;
  if (result) {
    if (result.confidence && result.confidence > 0) {
      confidence = Math.round(result.confidence * 100);
    } else if (result.class_probabilities) {
      const val = isPothole
        ? result.class_probabilities.Pothole
        : result.class_probabilities.Normal;
      confidence = Math.round((val || 0) * 100);
    }
  }

  const potholeProb = result && result.class_probabilities
    ? Math.round((result.class_probabilities.Pothole || 0) * 100)
    : 0;
  const normalProb = result && result.class_probabilities
    ? Math.round((result.class_probabilities.Normal || 0) * 100)
    : 0;

  return (
    <>
      <div className="App center-container" style={{ paddingTop: "70px" }}>
        <header className="Prediction">
          <h1>Smart Pothole Detection System</h1>

          <form onSubmit={handleSubmit}>
            {/* File Upload */}
            <label className="file-upload">
              <input
                type="file"
                accept="image/png, image/jpeg, image/*"
                onChange={handleImageUpload}
                hidden
              />
              <span>📁 Choose Image</span>
            </label>

            {/* Model Selection */}
            <div className="model-selection">
              <label htmlFor="model">Select Model:</label>
              <select id="model" value={selectedModel} onChange={handleModelChange}>
                <option value="CNN">CNN (Enhanced)</option>
                <option value="ANN">ANN (Basic)</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "⏳ Analyzing..." : "🔍 Detect Pothole"}
            </button>
          </form>

          {/* Image Preview */}
          {imageURL && (
            <div className="image-preview">
              <h2>Image Preview</h2>
              <img
                src={imageURL}
                alt="Preview"
                width="400"
                style={{ borderRadius: "12px", border: "3px solid #7c3aed" }}
              />
              <p className="file-name">{image?.name}</p>
            </div>
          )}

          {/* Result Display */}
          {result && !response.error && (
            <div style={{
              marginTop: "24px",
              padding: "24px",
              borderRadius: "16px",
              background: isPothole ? "rgba(220, 38, 38, 0.15)" : "rgba(22, 163, 74, 0.15)",
              border: `2px solid ${isPothole ? "#dc2626" : "#16a34a"}`,
              maxWidth: "500px",
              margin: "24px auto",
              textAlign: "center"
            }}>
              {/* Prediction Badge */}
              <div style={{
                display: "inline-block",
                padding: "8px 24px",
                borderRadius: "999px",
                background: isPothole ? "#dc2626" : "#16a34a",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px"
              }}>
                {isPothole ? "⚠️ Pothole Detected!" : "✅ Road is Normal"}
              </div>

              {/* Model Used */}
              <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>
                Model Used: <strong style={{ color: "white" }}>{response.model}</strong>
              </p>

              {/* Confidence Bar */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ color: "white", marginBottom: "8px", fontWeight: "bold" }}>
                  Confidence: {confidence}%
                </p>
                <div style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "999px",
                  height: "12px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${confidence}%`,
                    height: "100%",
                    background: isPothole ? "#dc2626" : "#16a34a",
                    borderRadius: "999px",
                    transition: "width 0.5s ease"
                  }} />
                </div>
              </div>

              {/* Class Probabilities */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                marginTop: "16px"
              }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#dc2626", fontWeight: "bold", fontSize: "22px" }}>
                    {potholeProb}%
                  </p>
                  <p style={{ color: "#aaa", fontSize: "13px" }}>Pothole</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#16a34a", fontWeight: "bold", fontSize: "22px" }}>
                    {normalProb}%
                  </p>
                  <p style={{ color: "#aaa", fontSize: "13px" }}>Normal</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {response && response.error && (
            <div style={{
              marginTop: "16px",
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(220, 38, 38, 0.15)",
              border: "2px solid #dc2626",
              color: "white"
            }}>
              ❌ {response.error}
            </div>
          )}

        </header>
      </div>
      <ToastContainer />
    </>
  );
}

export default Card;
