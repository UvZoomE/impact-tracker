import React, { useState, useEffect } from "react";
import {
  RuxIcon,
  RuxClassificationMarking,
  RuxButton,
  RuxTooltip,
} from "@astrouxds/react";
import "./css/Dialog.css";
import axios from "axios";
import StarRating from "./StarRating";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Dialog({ isOpen, onClose }) {
  // Set initial state to null for cleaner checks
  const [wars, setWars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warViewer, setWarViewer] = useState("");

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

  // This function opens a single file's URL
  const handleSingleFileOpen = (fileToOpen) => {
    if (fileToOpen && fileToOpen.secure_url) {
      window.open(fileToOpen.secure_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleWarView = (e, war) => {
    e.preventDefault();
    setWarViewer(war);
  };

  if (!isOpen) return null;

  return (
    // Attach the handler to the overlay div
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      {/* The rest of your content is inside this div, so clicks on it won't close the dialog */}
      <div className="dialog-content">
        <div className="buttons-in-header">
          {warViewer.title && warViewer.title.length > 0 ? (
            <RuxButton className="back-button" onClick={() => setWarViewer("")}>
              <RuxIcon icon="arrow-back" size="medium" />
            </RuxButton>
          ) : (
            <RuxButton
              className="search-button"
              onClick={(e) => onClose(e)}
              iconOnly
            >
              <RuxIcon icon="search" size="medium" />
            </RuxButton>
          )}
          <RuxButton
            className="close-button"
            onClick={(e) => onClose(e)}
            iconOnly
          >
            <RuxIcon icon="close" size="medium" />
          </RuxButton>
        </div>
        <div className="dialog-header">
          <h2>
            {warViewer.title && warViewer.title.length > 0
              ? warViewer.title
              : "Your Submitted WARs"}
          </h2>
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
                {warViewer.title && warViewer.title.length > 0 ? (
                  <p>hi</p>
                ) : (
                  <>
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

                            {/* Swiper Component for the button gallery */}
                            <Swiper
                              // Add required Swiper modules
                              modules={[Navigation, Pagination]}
                              // Show one button at a time
                              slidesPerView={1}
                              // Add space between slides if you show more than one
                              spaceBetween={10}
                              // Enable arrow navigation
                              navigation
                              // Enable clickable pagination dots
                              pagination={{ clickable: true }}
                              className="file-swiper" // Optional: for custom styling
                            >
                              {war.files.map((file, index) => (
                                <SwiperSlide key={file.public_id || index}>
                                  <div className="file-item">
                                    <RuxButton
                                      onClick={() => handleSingleFileOpen(file)}
                                    >
                                      {/* Dynamically name each button */}
                                      View File #{index + 1}
                                    </RuxButton>
                                  </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          </div>
                        )}
                        <hr className="line-above-ratings" />
                        <p>Average Rating: </p>
                        <RuxTooltip
                          message={`Based on ${war.numberOfRatings} ratings.`}
                          placement="bottom"
                          delay={0}
                        >
                          <StarRating rating={war.averageRatings} />
                        </RuxTooltip>
                        <p>
                          Comments:{" "}
                          <strong className="comment-number">
                            {war.numberOfComments || 0}
                          </strong>
                        </p>
                        <RuxButton
                          onClick={(e) => handleWarView(e, war)}
                          icon="expand-more"
                        >
                          View More
                        </RuxButton>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
