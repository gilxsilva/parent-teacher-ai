import React, { useState } from "react";
import "./App.css"; 

function ParentDashboard() {
  const [parentName, setParentName] = useState("");
  const [summaries, setSummaries] = useState([]);

  const fetchSummaries = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-summaries?parent_name=${parentName}`);
      const data = await response.json();
      setSummaries(data);
    } catch (error) {
      console.error("Error:", error);
      setSummaries([]);
    }
  };

  return (
    <div className="container">
      <h2>📩 Parent Dashboard</h2>
      <input
        type="text"
        placeholder="Enter Parent Name"
        value={parentName}
        onChange={(e) => setParentName(e.target.value)}
        className="input-field"
      />
      <button onClick={fetchSummaries} className="primary-btn">Get Feedback</button>

      {summaries.length > 0 ? (
        <div>
          <h3>📝 Student Feedback</h3>
          {summaries.map((entry, index) => (
            <div key={index} className="feedback-section">
              <strong>{entry.student_name}</strong>
              <p>{entry.summary}</p>
              <small>{entry.date}</small>
            </div>
          ))}
        </div>
      ) : (
        <p>No feedback found.</p>
      )}
    </div>
  );
}

export default ParentDashboard;
