import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "./App.css";

function Card() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [selectedModel, setSelectedModel] = useState("CNN"); // Default option
  const [response, setResponse] = useState("");
  const [responseClass, setResponseClass] = useState("");

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
      setResponse(""); // Clear any previous response
    } else {
      console.error("Please upload a valid image file.");
      setResponse("Invalid file type. Please upload an image.");
      setResponseClass("error-message");
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      console.error("Please select an image file.");
      setResponse("No image selected.");
      setResponseClass("error-message");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("model", selectedModel);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data.message);
      console.log(res.data);
      setResponseClass(
        res.data.message === "Image Received"
          ? "success-message"
          : "error-message"
      );
    } catch (error) {
      console.error("Error sending image to server:", error);
      setResponse("Failed to send image to server.");
      setResponseClass("error-message");
    }
  };

  return (
    <>
      <div className="App center-container">
        <header className="Prediction">
          <h1>Automatic PotHole Detection</h1>
          <form onSubmit={handleSubmit}>
            <label className="file-upload">
              <input
                type="file"
                accept="image/png, image/jpeg, image/*"
                onChange={handleImageUpload}
                hidden
              />
              <span>Upload Image</span>
            </label>

            <div className="model-selection">
              <label htmlFor="model">Select Model:</label>
              <select
                id="model"
                value={selectedModel}
                onChange={handleModelChange}
              >
                <option value="CNN">CNN</option>
                <option value="ANN">ANN</option>
              </select>
            </div>

            <button type="submit">Submit</button>
          </form>

          {imageURL && (
            <div className="image-preview">
              <h2>Image Preview:</h2>
              <img src={imageURL} alt="Preview" width="400" />
              <p className="file-name">{image?.name}</p>
            </div>
          )}

          {response && (
            <div className={`response-message ${responseClass}`}>
              <h2>Server Response:</h2>
              <p>{response}</p>
            </div>
          )}
        </header>
      </div>
      <ToastContainer />
    </>
  );
}

export default Card;
