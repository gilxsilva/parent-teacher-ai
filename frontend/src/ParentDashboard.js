import React, { useState, useEffect } from "react";

function ParentDashboard({ parentName }) {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get-summaries?parent_name=${parentName}`)
      .then((response) => response.json())
      .then((data) => setSummaries(data))
      .catch((error) => console.error("Error fetching summaries:", error));
  }, [parentName]);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h2>Parent Dashboard</h2>
      <h3>Welcome, {parentName}!</h3>

      {summaries.length > 0 ? (
        summaries.map((summary, index) => (
          <div key={index} style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", backgroundColor: "#f8f9fa" }}>
            <strong>{summary.student_name} - {new Date(summary.date).toLocaleDateString()}</strong>
            <p>{summary.summary}</p>
          </div>
        ))
      ) : (
        <p>No reports available yet.</p>
      )}
    </div>
  );
}

export default ParentDashboard;
