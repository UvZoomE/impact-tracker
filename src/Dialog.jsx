import React, { useState, useEffect } from "react";
import { RuxIcon, RuxClassificationMarking, RuxButton } from "@astrouxds/react";
import "./css/Dialog.css";
import axios from "axios";

function Dialog({ isOpen, onClose }) {
  // Set initial state to null for cleaner checks
  const [wars, setWars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchWars = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("authToken");
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/wars`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                need: "eachWAR",
              },
            }
          );
          setWars(response.data);
        } catch (err) {
          setError("Failed to fetch WARs.");
          console.error("Error fetching WARs:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchWars();
    }
  }, [isOpen]);

  // NEW: Handler for clicking the overlay
  const handleOverlayClick = (e) => {
    // If the click is on the overlay itself (not the content), close the dialog.
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  if (!isOpen) return null;

  return (
    // Attach the handler to the overlay div
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      {/* The rest of your content is inside this div, so clicks on it won't close the dialog */}
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Your Submitted WARs</h2>
          <RuxButton
            className="close-button"
            onClick={(e) => onClose(e)}
            iconOnly
          >
            <RuxIcon icon="close" size="medium" />
          </RuxButton>
        </div>
        <div className="dialog-body">
          {loading && <p>Loading WARs...</p>}
          {error && <p className="error-message">{error}</p>}

          {/* Corrected check for no WARs */}
          {!loading &&
            !error &&
            (!wars || !wars.eachWAR || wars.eachWAR.length === 0) && (
              <p>No WARs submitted yet.</p>
            )}

          {/* Corrected check for rendering WARs */}
          {!loading &&
            !error &&
            wars &&
            wars.eachWAR &&
            wars.eachWAR.length > 0 && (
              <div className="wars-list">
                {wars.eachWAR.map((war) => (
                  <div key={war._id} className="war-item">
                    <div className="war-item-header">
                      {war.classification && (
                        <RuxClassificationMarking
                          classification={war.classification}
                          className="war-classification"
                        />
                      )}
                    </div>
                    <div className="war-item-title">
                      <h3>{war.title}</h3>
                      <hr className="line-for-title" />
                    </div>
                    <p>
                      Description: <span>{war.description}</span>
                    </p>
                    <p>
                      Impact: <span>{war.impact}</span>
                    </p>
                    <p>
                      POC: <span>{war.poc}</span>
                    </p>
                    {war.files && war.files.length > 0 && (
                      <div className="war-files">
                        <h4>Attached Files:</h4>
                        {war.files.map((file, index) => (
                          <div key={index} className="file-item">
                            {file.resource_type === "image" ? (
                              <img
                                src={file.secure_url}
                                alt={`File ${index + 1}`}
                                className="war-image"
                              />
                            ) : (
                              <a
                                href={file.secure_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View PDF
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
