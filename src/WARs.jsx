import React, { useEffect, useState } from "react";
import {
  RuxCard,
  RuxTab,
  RuxTabs,
  RuxClassificationMarking,
  RuxIcon,
  RuxButton,
  RuxDialog,
  RuxTextarea,
} from "@astrouxds/react";
import "./css/WARs.css";
import axios from "axios";
import { Avatar } from "@mui/material";
import StarRating from "./StarRating";

function WARs() {
  const [allWars, setAllWars] = useState([]);
  const [rateDialog, setRateDialog] = useState(false);
  const [selectedWar, setSelectedWar] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [unclassifiedVersion, setUnclassifiedVersion] = useState("");
  const [eprBullet, setEprBullet] = useState("");
  const [addUnclassifiedVersion, setAddUnclassifiedVersion] = useState(false);
  const [unclassifiedBullet, setUnclassifiedBullet] = useState(false);

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  const handleRateDialog = (war) => {
    setSelectedWar(war); // Set the WAR being rated
    setRateDialog(true);
  };

  const handleCloseRateDialog = () => {
    setRateDialog(false);
    setSelectedWar(null); // Clear the selected WAR
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wars`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
          params: { need: "eachWAR" },
        }
      );
      setAllWars(response.data);
    })();
  }, [eprBullet]);

  const handleRateWarSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert("You need to provide a rating before you can submit.");
      return;
    }
  };

  return (
    <div>
      <RuxTabs className="rate-war-tabs">
        <RuxTab className="rate-war-tab">To-do</RuxTab>
        <RuxTab className="rate-war-tab">Local</RuxTab>
        <RuxTab className="rate-war-tab">Global</RuxTab>
      </RuxTabs>
      <div className="rate-wars-background">
        {allWars &&
          allWars.map((element) => (
            <RuxCard key={element._id} className="whole-card">
              <div slot="header">
                <RuxClassificationMarking
                  classification={element.classification}
                ></RuxClassificationMarking>
              </div>
              <div className="war-card-first-row">
                <div className="avatar-container">
                  <Avatar src="random" className="avatar" />
                  <p className="name">{element.name}</p>{" "}
                  {/* Element name directly under Avatar */}
                </div>
                <div className="card-title-with-line">
                  <h2>{element.title}</h2>
                  <hr />
                </div>
                <h3>
                  Date Posted: <span>{formatDate(element.createdAt)}</span>
                </h3>
              </div>
              <div className="war-card-second-row">
                <div className="card-content">
                  <p>
                    Description:{" "}
                    <span className="card-description">
                      {element.description}
                    </span>
                  </p>
                  <p>
                    Impact:{" "}
                    <span className="card-impact">{element.impact}</span>
                  </p>
                  <p>
                    POC: <span className="card-poc">{element.poc}</span>
                  </p>
                  {element.files && element.files.length > 0 ? (
                    <div className="attachment">
                      <RuxIcon
                        icon="folder"
                        className="attachment-icon"
                        size="small"
                      />
                      File(s) provided
                    </div>
                  ) : (
                    ""
                  )}
                  <RuxButton
                    icon="star"
                    className="war-card-button"
                    onClick={() => handleRateDialog(element)}
                  >
                    Rate WAR!
                  </RuxButton>
                </div>
              </div>
            </RuxCard>
          ))}
      </div>

      {rateDialog && (
        <div className="custom-dialog-overlay">
          <div className="custom-dialog">
            <form onSubmit={handleRateWarSubmit} className="rate-war-form">
              <RuxClassificationMarking
                classification={selectedWar.classification}
              />
              <div className="custom-dialog-header">
                <RuxIcon icon="star" size="small" />
                <h3>{selectedWar.title}</h3>
                <h4>{formatDate(selectedWar.createdAt)}</h4>
              </div>

              <div className="rate-war-body">
                <div className="description-row">
                  <p>
                    Description:{" "}
                    <span className="rate-war-description">
                      {selectedWar.description}
                    </span>
                  </p>
                  <RuxIcon icon="edit" size="small" className="edit-icon" />
                </div>

                <div className="impact-row">
                  <p>
                    Impact:{" "}
                    <span className="rate-war-description">
                      {selectedWar.impact}
                    </span>
                  </p>
                  <RuxIcon icon="edit" size="small" className="edit-icon" />
                </div>
                <div className="poc-row">
                  <p>
                    POC:{" "}
                    <span className="rate-war-description">
                      {selectedWar.poc}
                    </span>
                  </p>
                  <RuxIcon icon="edit" size="small" className="edit-icon" />
                </div>

                <p>Rating System: </p>
                <StarRating rating={rating} setRating={setRating} />

                <RuxTextarea
                  required
                  label="Comments: "
                  id="provide-comments"
                  placeholder="Explain why you are giving this rating for this troop"
                  value={comment}
                  onChange={setComment}
                />
                <div className="unclassified-version-container">
                  <label htmlFor="provide-unclassified">
                    Unclassified Version of WAR:
                  </label>
                  {addUnclassifiedVersion ? (
                    <RuxTextarea
                      id="provide-unclassified"
                      placeholder="Provide an unclassified version of this troop's WAR (Optional)"
                      value={unclassifiedVersion}
                      onChange={setUnclassifiedVersion}
                    />
                  ) : (
                    <RuxButton
                      id="provide-unclassified"
                      icon="add"
                      onClick={(e) => setAddUnclassifiedVersion(true)}
                    >
                      Add
                    </RuxButton>
                  )}
                </div>

                <div className="unclassified-bullet-container">
                  <label htmlFor="provide-bullet">
                    Unclassified EPR/EPB Bullet:{" "}
                  </label>
                  {unclassifiedBullet ? (
                    <div>
                      {/* 1206s and EPRs are programmed in their PDFs to be 202.321mm (764.6778px), 
                      and OPRs are 201.041mm (759.84px). Conversion to pixels assumes 96 dpi 
                      and 25.4 mm/inch. */
                      /* 12 point Times New Roman for above description */}
                      <textarea
                        id="provide-bullet"
                        placeholder="Provide an unclassified EPR/EPB bullet of this troop's WAR (Optional)"
                        value={eprBullet}
                        onInput={(e) => setEprBullet(e.target.value)}
                        style={{
                          fontSize: "12pt",
                          width: "764.6778px",
                          maxWidth: "764.6778px",
                          fontFamily: "Times New Roman, Times, serif",
                          backgroundColor: "#101923",
                          border: "1px solid #4dacff",
                          color: "white",
                        }}
                      />
                    </div>
                  ) : (
                    <RuxButton
                      id="provide-bullet"
                      icon="add"
                      onClick={(e) => setUnclassifiedBullet(true)}
                    >
                      Add
                    </RuxButton>
                  )}
                </div>
              </div>

              <div className="custom-dialog-footer">
                <button
                  type="button"
                  className="custom-button"
                  onClick={handleCloseRateDialog}
                >
                  Cancel
                </button>
                <button type="submit" className="custom-button">
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WARs;
