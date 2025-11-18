import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Papa from "papaparse"
import "./css/Leaderboard.css";
import { calcVisibleRows } from "./utils/calcVisibleRows";

const Leaderboard = () => {
  const [csvData, setCsvData] = useState([]);
  const [visibleRows, setVisibleRows] = useState(10); // Start with 10 rows
  const containerRef = useRef(null);

  // Fetch and parse CSV data
  useEffect(() => {
  const fetchCSV = async () => {
    try{
    const response = await fetch("/mockData/MOCK_DATA.csv");
    if (!response.ok) throw new Error("Failed to load CSV");

      const csvText = await response.text();

      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Parsed CSV Data:", results.data);
          setCsvData(results.data);
        },
        error: (err) => {
          console.error("CSV parse error:", err);
        },
      });
  } catch (err) {
      console.error("CSV fetch error:", err);
  }
  }
    fetchCSV();
  }, []);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/user`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  // Scroll listener to load more rows
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      //if (!el) return;

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        setVisibleRows((prev) => {
          return calcVisibleRows(prev, 10, csvData.length);
        });
      }
    };
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, [csvData]);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <select className='levelFilter'>
        <option value="det">Detachment</option>
        <option value="squad">Squadron</option>
        <option value="delta">Delta</option>
      </select>
      <div className="leaderboard-table" ref={containerRef} data-testid="leaderboard-table">
        <div className="leaderboard-header">
          <div className="leaderboard-cell">Rank</div>
          <div className="leaderboard-cell">Username</div>
          <div className="leaderboard-cell">Email</div>
          <div className="leaderboard-cell">WARs Submitted</div>
          <div className="leaderboard-cell">Total Score</div>
        </div>
         {csvData.slice(0, visibleRows).map((row, index) => (
          <div className='leaderboard-row' key={index}>
            <div className='leaderboard-cell' title={row[0] || "N/A"}>{row[0] || "N/A"}</div>
            <div className='leaderboard-cell' title={row[1] || "N/A"}>{row[1] || "N/A"}</div>
            <div className='leaderboard-cell' title={row[2] || "N/A"}>{row[2] || "N/A"}</div> 
            <div className='leaderboard-cell' title={row[3] || 0}>{row[3] || 0}</div> 
            <div className='leaderboard-cell' title={row[4] || 0}>{row[4] || 0}</div> 
          </div>
         ))}
        {/* { users.map((user, index) => (
          <div key={user._id || index} className="leaderboard-row">
            <div className="leaderboard-cell" title={index + 1}>{index + 1}</div>
            <div className="leaderboard-cell" title={user.username || "N/A"}>{user.username || "N/A"}</div>
            <div className="leaderboard-cell" title={user.email}>{user.email}</div>
            <div className="leaderboard-cell" title={user.warsSubmitted || 0}>{user.warsSubmitted || 0}</div>
            <div className="leaderboard-cell" title={user.totalScore || 0}>{user.totalScore || 0}</div>
          </div>*/}
      </div>
    </div>
  );
};
 
export default Leaderboard;

// TODO: Implement scoring system
// 1. Update the User model to include fields for warsSubmitted and totalScore
// 2. When a user submits a WAR, increment their warsSubmitted count
// 3. Implement a rating system for WARs (e.g., other users can rate WARs)
// 4. Calculate and update the totalScore based on WAR ratings
// 5. Update the /users endpoint to include warsSubmitted and totalScore in the response
// 6. Modify this component to display and sort users based on their totalScore
