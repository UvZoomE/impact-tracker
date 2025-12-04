import React, { useState, useEffect, useCallback } from "react";
import {
  RuxIcon,
  RuxClassificationMarking,
  RuxButton,
  RuxTooltip,
} from "@astrouxds/react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import StarRating from "./StarRating";
import WarComments from "./WarComments";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./css/Dialog.css";

// --- Sub-Component: File Gallery ---
const FileGallery = ({ files }) => {
  const handleSingleFileOpen = (fileToOpen) => {
    // SECURITY: Ensure we have a string URL
    if (fileToOpen && typeof fileToOpen.secure_url === "string") {
      const url = fileToOpen.secure_url.trim();

      // SECURITY: Validate protocol to prevent XSS via 'javascript:' URIs
      // Only allow http:// or https:// schemes
      if (/^https?:\/\//i.test(url)) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        console.warn(
          "Security Block: Attempted navigation to unsafe URL scheme."
        );
      }
    }
  };

  if (!files || files.length === 0) return null;

  return (
    <div className="war-files">
      <h4>Attached Files:</h4>
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        navigation
        pagination={{ clickable: true }}
        className="file-swiper"
      >
        {files.map((file, index) => (
          <SwiperSlide key={file.public_id || index}>
            <div className="file-item">
              <RuxButton onClick={() => handleSingleFileOpen(file)}>
                View File #{index + 1}
              </RuxButton>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// --- Sub-Component: War Card ---
const WarCard = ({ war, isDetail = false, onViewMore }) => {
  return (
    <div className="war-item">
      <div className="war-item-header">
        {war.classification && (
          <RuxClassificationMarking
            classification={war.classification}
            className="war-classification"
          />
        )}
      </div>

      {!isDetail && (
        <div className="war-item-title">
          <h3>{war.title}</h3>
          <hr className="line-for-title" />
        </div>
      )}

      <div className="war-details">
        <p>
          <strong>Description:</strong> <span>{war.description}</span>
        </p>
        <p>
          <strong>Impact:</strong> <span>{war.impact}</span>
        </p>
        <p>
          <strong>POC:</strong> <span>{war.poc}</span>
        </p>
      </div>

      <FileGallery files={war.files} />

      <hr className="line-above-ratings" />

      <div className="war-meta">
        <p>
          <strong>Average Rating:</strong>
        </p>
        <RuxTooltip
          message={`Based on ${war.numberOfRatings || 0} ratings.`}
          placement="bottom"
          delay={0}
        >
          <div style={{ display: "inline-block" }}>
            <StarRating rating={war.averageRatings} />
          </div>
        </RuxTooltip>

        {!isDetail && (
          <p>
            <strong>Comments:</strong>{" "}
            <strong className="comment-number">
              {war.numberOfRatings || 0}
            </strong>
          </p>
        )}
      </div>

      {isDetail ? (
        <WarComments warViewer={war} />
      ) : (
        <div className="war-actions">
          <RuxButton onClick={(e) => onViewMore(e, war)} icon="expand-more">
            View More
          </RuxButton>
        </div>
      )}
    </div>
  );
};

// --- Main Component: Dialog ---
function Dialog({ isOpen, onClose }) {
  const [wars, setWars] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use null instead of empty string for object state
  const [warViewer, setWarViewer] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchWars = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");

        // SECURITY: Ensure backend URL is configured to avoid undefined requests
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) {
          throw new Error("Backend URL is not configured.");
        }

        const response = await axios.get(`${backendUrl}/wars`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { need: "eachWAR" },
        });
        setWars(response.data);
      } catch (err) {
        setError("Failed to fetch WARs. Please try again later.");
        // SECURITY: Log only the message to avoid leaking sensitive request headers/tokens in console
        console.error("Error fetching WARs:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWars();
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose(e);
      }
    },
    [onClose]
  );

  const handleWarView = (e, war) => {
    e.preventDefault();
    setWarViewer(war);
  };

  const handleBack = () => {
    setWarViewer(null);
  };

  if (!isOpen) return null;

  // Render Helpers
  const isDetailView = warViewer !== null;
  const title = isDetailView ? warViewer.title : "Your Submitted WARs";
  const hasWars = wars && wars.eachWAR && wars.eachWAR.length > 0;

  return (
    <div
      className="dialog-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="dialog-content">
        {/* Header Section */}
        <div className="buttons-in-header">
          {isDetailView ? (
            <RuxButton className="back-button" onClick={handleBack} iconOnly>
              <RuxIcon icon="arrow-back" size="medium" />
            </RuxButton>
          ) : (
            // Placeholder to keep spacing consistent
            <RuxButton
              className="search-button"
              style={{ visibility: "hidden" }}
              iconOnly
            >
              <RuxIcon icon="search" size="medium" />
            </RuxButton>
          )}

          <RuxButton className="close-button" onClick={onClose} iconOnly>
            <RuxIcon icon="close" size="medium" />
          </RuxButton>
        </div>

        <div className="dialog-header">
          <h2>{title}</h2>
        </div>

        {/* Body Section */}
        <div className="dialog-body">
          {loading && (
            <div className="status-message loading">
              <p>Loading WARs...</p>
            </div>
          )}

          {error && (
            <div className="status-message error">
              <RuxIcon icon="error" size="small" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && !hasWars && (
            <div className="status-message empty">
              <p>No WARs submitted yet.</p>
            </div>
          )}

          {!loading && !error && hasWars && (
            <div className={`wars-list ${isDetailView ? "detail-mode" : ""}`}>
              {isDetailView ? (
                <WarCard key={warViewer._id} war={warViewer} isDetail={true} />
              ) : (
                wars.eachWAR.map((war) => (
                  <WarCard
                    key={war._id}
                    war={war}
                    isDetail={false}
                    onViewMore={handleWarView}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
