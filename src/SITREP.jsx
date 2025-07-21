import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/SITREP.css";
import axios from "axios";

function SITREP() {
  const [SITREPModal, setSITREPModal] = useState(false);
  const [eachWAR, setEachWAR] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [token, setToken] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [SITREP, setSITREP] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem("authToken");
      setToken(token);
      // Make a GET request with Axios
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
        }
      );
      setUserInfo(response.data);
      const response2 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wars`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
          params: {
            need: "eachWAR",
          },
        }
      );
      setEachWAR(response2.data.eachWAR);
    };
    getUserInfo();
  }, [SITREPModal]);

  const handleCreateWAR = (e) => {
    e.preventDefault();
    setSITREPModal(true);
  };

  const closeModal = () => {
    setSITREPModal(false);
  };

  const formatDate = (createdTime) => {
    const dateObj = new Date(createdTime);
    return (
      dateObj.getFullYear() +
      "-" +
      (dateObj.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      dateObj.getDate().toString().padStart(2, "0")
    );
  };

  const createSITREP = async (e) => {
    e.preventDefault();
    const specificWARs = [];
    for (const war of eachWAR) {
      const newDate = formatDate(war.createdAt);
      const startDate = formatDate(dateRange[0]);
      const endDate = formatDate(dateRange[1]);

      if (startDate <= newDate && newDate <= endDate) {
        specificWARs.push(war);
      }
    }
    if (specificWARs.length > 0) {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/sitrep`,
        {
          specificWARs,
          dateRange,
          currentUnit: userInfo.unit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSITREP(response.data.response.candidates[0].content.parts[0].text);
      closeModal();
    } else {
      alert("There are no WARs within the date range you provided.");
    }
  };

  return (
    <div className="sitrep-container">
      <button className="sitrep-button" onClick={handleCreateWAR}>
        <span>Create SITREP</span>
        <span className="plus-icon">+</span>
      </button>

      {SITREPModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Title:</h2>
            <textarea
              placeholder="Enter the title of the SITREP"
              required
            ></textarea>
            <h2>Select a Date</h2>
            <DatePicker
              selected={startDate}
              onChange={(update) => setDateRange(update)}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat="yyyy/MM/dd"
              placeholderText="Select a date range"
              required
            />
            <div>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={createSITREP}>Create SITREP</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SITREP;
