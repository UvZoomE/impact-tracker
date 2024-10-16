import React, { useEffect, useState } from "react";
import { RuxIcon, RuxClassificationMarking } from "@astrouxds/react";
import "./css/Dashboard.css";
import axios from "axios";

function Dashboard() {
  const [dialog, setDialog] = useState(false);
  const [classification, setClassification] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState("");
  const [poc, setPOC] = useState("");
  const [warCount, setWARCount] = useState(0);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem("authToken");
      // Make a GET request with Axios
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
        }
      );
      setPOC(response.data);
      const response2 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wars`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
          params: {
            need: "warCount",
          },
        }
      );
      setWARCount(response2.data.warCount);
    };
    getUserInfo();
  }, [dialog]);

  const handleCreateWAR = async (e) => {
    e.preventDefault();
    setDialog(true);
  };

  const closeDialog = async (e) => {
    e.preventDefault();
    setDialog(false);
    setFiles([]);
  };

  const handleFileChange = (event) => {
    const file = Object.values(event.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    file.map((eachFile) => {
      if (eachFile && !allowedTypes.includes(eachFile.type)) {
        setError("Invalid file type. Please upload a JPEG, PNG, or PDF file.");
        event.target.value = ""; // Clear the file input
        setFiles([]); // Reset selected file in state
        return;
      }
    });

    if (event.target.value) {
      setError(""); // Clear error if file is valid
      setFiles([file]); // Set the valid file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileUrls = [];

    try {
      // Check if there are any files to upload
      if (files[0].length > 0) {
        // Wait for all the file uploads to Cloudinary to complete
        fileUrls = await Promise.all(
          files[0].map(async (file) => {
            const formData = new FormData();
            formData.append("file", file); // Append the file
            formData.append("upload_preset", "impact-tracker"); // Set your upload preset

            try {
              const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                formData
              );
              return response.data.secure_url; // Return the secure URL
            } catch (error) {
              console.log("Error uploading file:", error);
              throw error;
            }
          })
        );
      }

      const token = localStorage.getItem("authToken");

      // Send the collected file URLs to the backend along with other form data
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/wars`,
        {
          classification,
          title,
          description,
          impact,
          poc,
          files: fileUrls, // Send the uploaded file URLs
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
        }
      );
      setDialog(false); // Close the dialog on success
      setFiles([]); // Clear the file input
    } catch (err) {
      console.error("Error during submission", err);
      setFiles([]); // Clear the file input on error
    }
  };

  return (
    <div className="cards-container">
      <button class="war-button" onClick={handleCreateWAR}>
        <span>Create a WAR</span>
        <span class="plus-icon">+</span>
      </button>

      {/* Dialog */}
      {dialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div slot="header" className="dialog-header">
              <h3>Create a WAR</h3>
              <RuxIcon icon="edit" size="small" className="create-war-icon" />
            </div>
            {classification ? (
              <RuxClassificationMarking
                classification={classification}
              ></RuxClassificationMarking>
            ) : (
              ""
            )}
            <div slot="body">
              <form onSubmit={handleSubmit} className="create-war-form">
                <label htmlFor="classification">Classification:</label>
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  required
                  id="classification"
                >
                  <option value="">Select Classification</option>
                  <option value="unclassified">Unclassified</option>
                  <option value="cui">Controlled (CUI)</option>
                  <option value="confidential">Confidential</option>
                  <option value="secret">Secret</option>
                  <option value="top-secret">Top Secret</option>
                  <option value="top-secret-sci">Top Secret//SCI</option>
                </select>

                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter title"
                  id="title"
                />

                <label htmlFor="description">Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Enter detailed description"
                  id="description"
                />

                <label htmlFor="impact">Impact of WAR:</label>
                <textarea
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  required
                  placeholder="Describe the impact"
                  id="impact"
                />

                <label className="poc-label">POC (Point of Contact):</label>
                <p className="poc-text">{poc}</p>
                <label htmlFor="files">Files/ Images: </label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  multiple
                  onChange={handleFileChange}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Submit WAR</button>
              </form>
            </div>
            <button onClick={closeDialog}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>WARs Submitted</h4>
          <RuxIcon icon="description" size="small" />
        </div>
        <div className="card-body">
          <h1>{warCount}</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            Averaging a <strong className="rating">4.5</strong> rating from
            others
          </h5>
          <RuxIcon icon="trending-up" size="small" className="icons" />
        </div>
      </div>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>
            WARs Edits <br />
            Approved
          </h4>
          <RuxIcon icon="edit" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            Estimated approval rating of <strong className="rating">17%</strong>
          </h5>
          <RuxIcon icon="check-circle" size="small" className="icons" />
        </div>
      </div>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>
            Unclassified Edits <br />
            Approved
          </h4>
          <RuxIcon icon="publish" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            While maintaining a <strong className="rating">good </strong>
            impact
            <br /> statement
          </h5>
          <RuxIcon icon="gavel" size="small" className="icons" />
        </div>
      </div>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>
            Points gained this <br />
            year
          </h4>
          <RuxIcon icon="score" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            Placing in the top <strong className="rating">10%</strong> against{" "}
            <br />
            other teammates in the Space Force
          </h5>
          <RuxIcon icon="grade" size="small" className="icons" />
        </div>
      </div>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>
            EPR bullets <br />
            accepted
          </h4>
          <RuxIcon icon="supervisor-account" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            That delivers, on average, an <br />
            <strong className="rating">exceeded some</strong> rating
          </h5>
          <RuxIcon icon="mission" size="small" className="icons" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
