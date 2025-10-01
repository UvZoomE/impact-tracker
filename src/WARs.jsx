import React, { useEffect, useState } from "react";
import {
  RuxCard,
  RuxTab,
  RuxTabs,
  RuxClassificationMarking,
  RuxIcon,
  RuxButton,
  RuxTextarea,
  RuxDialog,
} from "@astrouxds/react";
import "./css/WARs.css";
import axios from "axios";
import { Avatar } from "@mui/material";
import StarRating from "./StarRating";
import Carousel from "./Carousel";

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
  const [newImpact, setNewImpact] = useState("");
  const [editImpact, setEditImpact] = useState(false);
  const [originalImpact, setOriginalImpact] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [currentWAR, setCurrentWAR] = useState("");
  const [files, setFiles] = useState("");
  const [error, setError] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false); // Secondary dialog visibility
  const [imageSrc, setImageSrc] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

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
    setNewDescription(null);
    setNewImpact(null);
    setRating("");
    setComment("");
    setUnclassifiedVersion("");
    setFiles([]);
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
      setCurrentUser(response.data.email);
      setAllWars(response.data.eachWAR);
    })();
  }, [eprBullet]);

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

  const handleRateWarSubmit = async (e) => {
    e.preventDefault();
    let fileUrls = [];

    try {
      // Check if there are any files to upload
      if (files && files[0]?.length > 0) {
        // Wait for all the file uploads to Cloudinary to complete
        fileUrls = await Promise.all(
          files[0].map(async (file) => {
            const formData = new FormData();
            formData.append("file", file); // Append the file
            formData.append("upload_preset", "impact-tracker-images"); // Set your upload preset

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
      const newestDescription = newDescription ? newDescription : null;
      const newestImpact = newImpact ? newImpact : null;

      if (!rating) {
        alert("You need to provide a rating before you can submit.");
        return;
      }

      if (!comment) {
        alert("You need to provide comments on your rating, try again.");
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/edited-wars`,
        {
          originalWarID: currentWAR._id,
          editsMadeBy: currentUser,
          newDescription: newestDescription,
          newImpact: newestImpact,
          rating,
          comment,
          unclassifiedVersion,
          eprBullet,
          files: fileUrls ? fileUrls : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
        }
      );
      setRateDialog(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleIconClick = (e, src) => {
    e.preventDefault();
    if (src.length === 1) {
      setImageSrc(src);
    } else {
      setImageArray(src);
    }
    setIsImageDialogOpen(true); // Open the image dialog
  };

  const handleCloseImageDialog = () => {
    setIsImageDialogOpen(false);
    setImageSrc("");
    setImageArray([]);
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
                  {editDescription ? (
                    <>
                      <p className="edit-description-text">Edit Description:</p>
                      <RuxTextarea
                        value={newDescription || originalDescription} // Bind the value to newDescription, fallback to originalDescription
                        onRuxinput={(e) => setNewDescription(e.target.value)} // Update newDescription on change
                      />
                      <div className="edit-icons">
                        <RuxIcon
                          icon="check"
                          size="small"
                          onClick={() => {
                            setOriginalDescription(newDescription); // Save the newDescription as originalDescription when confirming
                            setEditDescription(false);
                          }}
                        />
                        <RuxIcon
                          icon="cancel"
                          size="small"
                          onClick={() => {
                            setNewDescription(originalDescription); // Reset newDescription to originalDescription when canceled
                            setEditDescription(false);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        Description:{" "}
                        <span className="rate-war-description">
                          {newDescription || selectedWar.description}{" "}
                          {/* Display newDescription or fallback */}
                        </span>
                      </p>
                      <RuxIcon
                        icon="edit"
                        size="small"
                        className="edit-icon"
                        onClick={() => {
                          setOriginalDescription(
                            newDescription || selectedWar.description
                          ); // Set originalDescription when entering edit mode
                          setEditDescription(true);
                        }}
                      />
                    </>
                  )}
                </div>

                <div className="impact-row">
                  {editImpact ? (
                    <>
                      <p className="edit-impact-text">Edit Impact:</p>
                      <RuxTextarea
                        value={newImpact || originalImpact} // Bind the value to newImpact, fallback to originalImpact
                        onRuxinput={(e) => setNewImpact(e.target.value)} // Update newImpact on change
                      />
                      <div className="edit-icons">
                        <RuxIcon
                          icon="check"
                          size="small"
                          onClick={() => {
                            setOriginalImpact(newImpact); // Save the newImpact as originalImpact when confirming
                            setEditImpact(false);
                          }}
                        />
                        <RuxIcon
                          icon="cancel"
                          size="small"
                          onClick={() => {
                            setNewImpact(originalImpact); // Reset newImpact to originalImpact when canceled
                            setEditImpact(false);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        Impact:{" "}
                        <span className="rate-war-description">
                          {newImpact || selectedWar.impact}{" "}
                          {/* Display newImpact or fallback */}
                        </span>
                      </p>
                      <RuxIcon
                        icon="edit"
                        size="small"
                        className="edit-icon"
                        onClick={() => {
                          setOriginalImpact(newImpact || selectedWar.impact); // Set originalImpact when entering edit mode
                          setEditImpact(true);
                        }}
                      />
                    </>
                  )}
                </div>

                <div className="poc-row">
                  <p>
                    POC:{" "}
                    <span className="rate-war-description">
                      {selectedWar.poc}
                    </span>
                  </p>
                </div>

                <p>Rating System: </p>
                <StarRating rating={rating} setRating={setRating} />

                <RuxTextarea
                  required
                  label="Comments: "
                  id="provide-comments"
                  placeholder="Explain why you are giving this rating for this troop"
                  value={comment}
                  onRuxinput={(e) => setComment(e.target.value)}
                />
                <div className="unclassified-version-container">
                  <label htmlFor="provide-unclassified">
                    Unclassified Version of WAR:
                  </label>
                  {addUnclassifiedVersion ? (
                    <RuxTextarea
                      id="provide-unclassified"
                      placeholder="(Optional) Provide an unclassified version of this troop's WAR"
                      value={unclassifiedVersion}
                      onRuxinput={(e) => setUnclassifiedVersion(e.target.value)}
                    />
                  ) : (
                    <RuxButton
                      id="provide-unclassified"
                      icon="add"
                      onClick={() => setAddUnclassifiedVersion(true)}
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
                        placeholder="(Optional) Provide an unclassified EPR/EPB bullet of this troop's WAR"
                        value={eprBullet}
                        onChange={(e) => setEprBullet(e.target.value)}
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
                      onClick={() => setUnclassifiedBullet(true)}
                    >
                      Add
                    </RuxButton>
                  )}
                </div>
                {selectedWar.files && selectedWar.files.length > 0 ? (
                  <div>
                    <div className="current-images">
                      <p>File Provided:</p>
                      <RuxIcon
                        icon="image"
                        onClick={(e) => handleIconClick(e, selectedWar.files)}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <label htmlFor="files">Files/ Images: </label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  multiple
                  onChange={handleFileChange}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>

              <div className="custom-dialog-footer">
                <button
                  type="button"
                  className="custom-button"
                  onClick={handleCloseRateDialog}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="custom-button"
                  onClick={() => setCurrentWAR(selectedWar)}
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
          {/* Secondary dialog for displaying the image or file */}
          {isImageDialogOpen && (
            <RuxDialog
              open={isImageDialogOpen}
              onRuxdialogclosed={handleCloseImageDialog}
              style={{ zIndex: 9999 }} // Ensure it's on top of the main dialog
            >
              {imageSrc && imageSrc.length === 1 ? (
                <img
                  src={imageSrc[0].secure_url}
                  alt="Selected Icon"
                  style={{ maxWidth: "100%" }}
                />
              ) : imageArray.length > 0 ? (
                <Carousel images={imageArray} />
              ) : (
                ""
              )}
            </RuxDialog>
          )}
        </div>
      )}
    </div>
  );
}

export default WARs;
