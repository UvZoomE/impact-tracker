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
        setUsers(response.data.users || []);
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
        {/* { users.map((user, index) => (
          <div key={user._id || index} className="leaderboard-row">
            <div className="leaderboard-cell" title={index + 1}>{index + 1}</div>
            <div className="leaderboard-cell" title={user.username || "N/A"}>{user.username || "N/A"}</div>
            <div className="leaderboard-cell" title={user.email}>{user.email}</div>
            <div className="leaderboard-cell" title={user.warsSubmitted || 0}>{user.warsSubmitted || 0}</div>
            <div className="leaderboard-cell" title={user.totalScore || 0}>{user.totalScore || 0}</div>
          </div>
        ))} */}

          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='Sgt'>Sgt</div>
            <div className="leaderboard-cell" title='Stickler'>Stickler</div>
            <div className="leaderboard-cell" title='harsh.stickler.9@spaceforce.mil'>harsh.stickler.9@spaceforce.mil</div>
            <div className="leaderboard-cell" title='10'>10</div>
            <div className="leaderboard-cell" title='50'>50</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='SPC4'>SPC4</div>
            <div className="leaderboard-cell" title='Valle'>Valle</div>
            <div className="leaderboard-cell" title='jacob.valle.1@spaceforce.mil'>jacob.valle.1@spaceforce.mil</div>
            <div className="leaderboard-cell" title='0'>0</div>
            <div className="leaderboard-cell" title='0'>0</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='SPC4'>SPC4</div>
            <div className="leaderboard-cell" title='Nguyen'>Nguyen</div>
            <div className="leaderboard-cell" title='hung.nguyen.32@spaceforce.mil'>hung.nguyen.32@spaceforce.mil</div>
            <div className="leaderboard-cell" title='2'>2</div>
            <div className="leaderboard-cell" title='45'>45</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='General'>Gen.</div>
            <div className="leaderboard-cell" title='Wrong'>Wrong</div>
            <div className="leaderboard-cell" title='veri.wrong.6@spaceforce.mil'>veri.wrong.6@spaceforce.mil</div>
            <div className="leaderboard-cell" title='14'>14</div>
            <div className="leaderboard-cell" title='130'>130</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='Sgt'>Sgt</div>
            <div className="leaderboard-cell" title='Stickler'>Stickler</div>
            <div className="leaderboard-cell" title='harsh.stickler.9@spaceforce.mil'>harsh.stickler.9@spaceforce.mil</div>
            <div className="leaderboard-cell" title='10'>10</div>
            <div className="leaderboard-cell" title='50'>50</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='Brigadier General'>Brig. Gen.</div>
            <div className="leaderboard-cell" title='Langest-Oosanaim'>Langest-Oosanaim</div>
            <div className="leaderboard-cell" title='boards.langestoosanaim.1@spaceforce.mil'>boards.langestoosanaim.1@spaceforce.mil</div>
            <div className="leaderboard-cell" title='605'>605</div>
            <div className="leaderboard-cell" title='33550336'>33550336</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='SPC4'>SPC4</div>
            <div className="leaderboard-cell" title='Nguyen'>Nguyen</div>
            <div className="leaderboard-cell" title='hung.nguyen.32@spaceforce.mil'>hung.nguyen.32@spaceforce.mil</div>
            <div className="leaderboard-cell" title='2'>2</div>
            <div className="leaderboard-cell" title='45'>45</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='General'>Gen.</div>
            <div className="leaderboard-cell" title='Wrong'>Wrong</div>
            <div className="leaderboard-cell" title='veri.wrong.6@spaceforce.mil'>veri.wrong.6@spaceforce.mil</div>
            <div className="leaderboard-cell" title='14'>14</div>
            <div className="leaderboard-cell" title='130'>130</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='Sgt'>Sgt</div>
            <div className="leaderboard-cell" title='Stickler'>Stickler</div>
            <div className="leaderboard-cell" title='harsh.stickler.9@spaceforce.mil'>harsh.stickler.9@spaceforce.mil</div>
            <div className="leaderboard-cell" title='10'>10</div>
            <div className="leaderboard-cell" title='50'>50</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='SPC4'>SPC4</div>
            <div className="leaderboard-cell" title='Valle'>Valle</div>
            <div className="leaderboard-cell" title='jacob.valle.1@spaceforce.mil'>jacob.valle.1@spaceforce.mil</div>
            <div className="leaderboard-cell" title='0'>0</div>
            <div className="leaderboard-cell" title='0'>0</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='SPC2'>SPC2</div>
            <div className="leaderboard-cell" title='xVx3p1cG4m3rTryh4rd313xVx'>xVx3p1cG4m3rTryh4rd313xVx</div>
            <div className="leaderboard-cell" title='snipingcamper313@ubisoft.com'>snipingcamper313@ubisoft.com</div>
            <div className="leaderboard-cell" title='24'>24</div>
            <div className="leaderboard-cell" title='1337'>1337</div>
          </div>
          <div className="leaderboard-row">
            <div className="leaderboard-cell" title='General'>Gen.</div>
            <div className="leaderboard-cell" title='Wrong'>Wrong</div>
            <div className="leaderboard-cell" title='veri.wrong.6@spaceforce.mil'>veri.wrong.6@spaceforce.mil</div>
            <div className="leaderboard-cell" title='14'>14</div>
            <div className="leaderboard-cell" title='130'>130</div>
          </div>
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
