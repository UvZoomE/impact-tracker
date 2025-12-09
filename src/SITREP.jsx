import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "./css/SITREP.css";

function SITREP() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data State
  const [wars, setWars] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [sitrepResult, setSitrepResult] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [commandGuidance, setCommandGuidance] = useState(""); // New State
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Options State
  const [reportFocus, setReportFocus] = useState("all");
  const [outputFormat, setOutputFormat] = useState("bullets");
  const [tone, setTone] = useState("standard");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [userRes, warsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, config),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/wars`, {
            ...config,
            params: { need: "eachWAR" },
          }),
        ]);

        setUserInfo(userRes.data);
        setWars(warsRes.data.eachWAR || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCommandGuidance("");
    setDateRange([null, null]);
    setReportFocus("all");
    setOutputFormat("bullets");
    setTone("standard");
    setModalOpen(false);
  };

  const handleCreateSITREP = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Please select a date range.");

    setLoading(true);
    const token = localStorage.getItem("authToken");

    // Filter WARs by Date
    const specificWARs = wars.filter((war) => {
      const warDate = new Date(war.createdAt).setHours(0, 0, 0, 0);
      return (
        warDate >= startDate.setHours(0, 0, 0, 0) &&
        warDate <= endDate.setHours(23, 59, 59, 999)
      );
    });

    if (specificWARs.length === 0) {
      setLoading(false);
      return alert("There are no WARs within the selected date range.");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/sitrep`,
        {
          title,
          specificWARs,
          dateRange,
          currentUnit: userInfo.unit,
          commandGuidance, // Sending the specific instructions
          preferences: {
            focus: reportFocus,
            format: outputFormat,
            tone: tone,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const generatedText =
        response.data?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        setSitrepResult(generatedText);
        resetForm();
      }
    } catch (error) {
      console.error("Error generating SITREP:", error);
      alert("Failed to generate SITREP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sitrep-container">
      <button className="sitrep-trigger-btn" onClick={() => setModalOpen(true)}>
        <span>Create SITREP</span>
        <span className="plus-icon">+</span>
      </button>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Generate SITREP</h2>

            {/* Title Input */}
            <div className="form-group">
              <label>SITREP Title</label>
              <input
                type="text"
                className="text-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Weekly Ops Summary"
              />
            </div>

            {/* Date Range */}
            <div className="form-group">
              <label>Reporting Period</label>
              <DatePicker
                selected={startDate}
                onChange={(update) => setDateRange(update)}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                dateFormat="yyyy/MM/dd"
                placeholderText="Select Start & End Date"
                className="date-picker-input"
              />
            </div>

            {/* Options Grid */}
            <div className="options-grid">
              <div className="form-group">
                <label>Report Focus</label>
                <select
                  value={reportFocus}
                  onChange={(e) => setReportFocus(e.target.value)}
                  className="select-input"
                >
                  <option value="all">Everything (General)</option>
                  <option value="operations">Mission/Operations</option>
                  <option value="training">Training & Readiness</option>
                  <option value="personnel">Personnel & Admin</option>
                  <option value="logistics">Logistics & Supply</option>
                </select>
              </div>

              <div className="form-group">
                <label>Output Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="select-input"
                >
                  <option value="bullets">Bullet Points (AF Style)</option>
                  <option value="executive">Executive Summary</option>
                  <option value="detailed">Detailed Narrative</option>
                  <option value="email">Email Draft</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="select-input"
                >
                  <option value="standard">Standard / Professional</option>
                  <option value="urgent">Urgent / Critical</option>
                  <option value="concise">Brief / Concise</option>
                  <option value="persuasive">Persuasive (Awards/Decs)</option>
                </select>
              </div>
            </div>

            {/* Command Guidance Input */}
            <div className="form-group full-width">
              <label>Specific Instructions For AI (Optional)</label>
              <textarea
                className="textarea-input"
                value={commandGuidance}
                onChange={(e) => setCommandGuidance(e.target.value)}
                placeholder="Specific items to highlight, people to mention, or context the AI needs (e.g., 'Emphasize the successful audit outcome')"
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCreateSITREP}
                disabled={loading}
              >
                {loading ? "Compiling..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SITREP;
