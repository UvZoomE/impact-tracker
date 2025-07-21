import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Leaderboard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <div className="leaderboard-cell">Rank</div>
          <div className="leaderboard-cell">Username</div>
          <div className="leaderboard-cell">Email</div>
          <div className="leaderboard-cell">WARs Submitted</div>
          <div className="leaderboard-cell">Total Score</div>
        </div>
        {/* {users.map((user, index) => (
          <div key={user._id || index} className="leaderboard-row">
            <div className="leaderboard-cell">{index + 1}</div>
            <div className="leaderboard-cell">{user.username || "N/A"}</div>
            <div className="leaderboard-cell">{user.email}</div>
            <div className="leaderboard-cell">{user.warsSubmitted || 0}</div>
            <div className="leaderboard-cell">{user.totalScore || 0}</div>
          </div>
        ))} */}
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
