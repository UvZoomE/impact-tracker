import React, { useEffect, useState } from "react";
import "./css/CompleteProfile.css";
import axios from "axios";
import { RuxClock, RuxMonitoringIcon } from "@astrouxds/react";
import { useLocation, useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [rank, setRank] = useState("");
  const [DoDID, setDoDID] = useState("");
  const [unit, setUnit] = useState("");
  const [role, setRole] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Function to get the token from the URL
    const getTokenFromURL = () => {
      const params = new URLSearchParams(location.search); // Get query parameters from URL
      const token = params.get("token"); // Extract the 'token' parameter
      return token;
    };

    const token = getTokenFromURL(); // Call the function to get the token

    // If no token, redirect to login or another page
    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    }

    const checkServer = async () => {
      // Make a GET request with Axios
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/complete-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
        },
      );

      setUserId(response.data.userId);
    };

    checkServer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (DoDID.length != 10) {
      alert("Your DoD ID must be 10 characters long");
      return;
    }

    const userObj = {
      firstname,
      lastname,
      rank,
      DoDID,
      unit,
      role,
      reason,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/complete-profile`,
        { userId, userObj },
      );
      setSuccess("Profile complete! Enjoy!");
      setError("");
      if (response.data.user.profileCompleted) navigate("/home");
    } catch (err) {
      setSuccess("");
      setError("There was an error submitting your information, try again.");
    }
  };

  return (
    <div className="container">
      <div slot="header" className="header-container">
        <h3 className="first-header-item">LOGO</h3>
        <RuxClock timezone="Z" className="sign-in-clock"></RuxClock>
        <RuxMonitoringIcon
          status="normal"
          className="sign-in-status"
        ></RuxMonitoringIcon>
      </div>
      <div className="body-container">
        <form className="rux-form" onSubmit={handleSubmit}>
          <h3 className="finish-text">Finish your profile!</h3>
          <hr color="#4dacff" />
          <div className="complete-profile-inputs">
            <label className="first-name-label" htmlFor="firstname">
              First Name
            </label>
            <input
              id="firstname"
              type="text"
              placeholder="Please enter your first name"
              name="firstname"
              required
              className="first-name-input"
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label className="last-name-label" htmlFor="lastname">
              Last Name
            </label>
            <input
              id="lastname"
              type="text"
              placeholder="Please enter your last name"
              name="lastname"
              required
              className="last-name-input"
              onChange={(e) => setLastname(e.target.value)}
            />
            <label className="choices-label" htmlFor="choices">
              Rank:
            </label>
            <select
              id="choices"
              name="choices"
              onChange={(e) => setRank(e.target.value)}
              className="choices-select"
              required
            >
              <option value=""></option>
              <option value="Spc1">Spc1</option>
              <option value="Spc2">Spc2</option>
              <option value="Spc3">Spc3</option>
              <option value="Spc4">Spc4</option>
              <option value="Sgt">Sgt</option>
              <option value="TSgt">TSgt</option>
              <option value="MSgt">MSgt</option>
              <option value="SMSgt">SMSgt</option>
              <option value="CMSgt">CMSgt</option>
              <option value="2Lt">2Lt</option>
              <option value="1Lt">1Lt</option>
              <option value="Capt">Capt</option>
              <option value="Maj">Maj</option>
              <option value="Lt Col">Lt Col</option>
              <option value="Col">Col</option>
              <option value="Brig Gen">Brig Gen</option>
              <option value="Maj Gen">Maj Gen</option>
              <option value="Lt Gen">Lt Gen</option>
              <option value="Gen">Gen</option>
              <option value="Civilian">Civilian</option>
              <option value="Contractor">Contractor</option>
            </select>
            <label className="dod-id-label" htmlFor="dodid">
              DoD ID
            </label>
            <input
              id="dodid"
              type="text"
              placeholder="Please enter your DoD ID"
              name="dodid"
              required
              className="dod-id-input"
              onChange={(e) => setDoDID(e.target.value)}
            />
            <label className="unit-label" htmlFor="unit">
              Unit
            </label>
            <input
              id="unit"
              type="text"
              placeholder="Please enter your unit"
              name="unit"
              required
              className="unit-input"
              onChange={(e) => setUnit(e.target.value)}
            />
            <label className="role-choice" htmlFor="role">
              Role:
            </label>
            <select
              id="role"
              name="role"
              onChange={(e) => setRole(e.target.value)}
              className="role-select"
              required
            >
              <option value=""></option>
              <option value="commander">Commander</option>
              <option value="basic-user">Basic User</option>
            </select>
            <label className="reason-label" htmlFor="reason">
              Reason:
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="4" // Number of visible text lines
              cols="50" // Number of visible character widths
              value={reason} // Controlled component
              onChange={(e) => setReason(e.target.value)} // Handle change event
              placeholder="Provide justification for account request"
              className="reason-text-area"
              required
            />
          </div>
          <div className="complete-profile-btn-box">
            <button className="complete-profile-btn" type="submit">
              Complete Profile!
            </button>
          </div>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>
    </div>
  );
};

export default CompleteProfile;
