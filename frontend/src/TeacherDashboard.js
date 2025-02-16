import React, { useState } from "react";
import "./App.css"; 

function TeacherDashboard() {
  const [performanceText, setPerformanceText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [parentName, setParentName] = useState("");
  const [emailSubject, setEmailSubject] = useState("Student Progress Update");
  const [generated, setGenerated] = useState(false); // Track if feedback has been generated

  // 📌 Generate AI Summary (DOES NOT SEND TO PARENT)
  const handleGenerate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_name: parentName, performance: performanceText }),
      });

      const data = await response.json();
      setSummary(data.summary || "Error generating summary.");
      setGenerated(true); // Allow review before sending
    } catch (error) {
      console.error("Error:", error);
      setSummary("Failed to connect to the backend.");
    }

    setLoading(false);
  };

  // 📌 Send Finalized Feedback to Parent (ONLY When Teacher Clicks)
  const handleSendToParent = async () => {
    if (!summary.trim()) {
      alert("Please generate and review the feedback before sending.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/send-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_name: parentName, summary }),
      });

      const data = await response.json();
      alert(data.message || "Feedback sent to parent successfully!");
      setGenerated(false); // Reset UI after sending
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send feedback.");
    }
  };

  return (
    <div className="container">
      <h2>👩‍🏫 Teacher Dashboard</h2>

      {/* Feedback Form */}
      <form onSubmit={handleGenerate} className="feedback-form">
        <input
          type="text"
          placeholder="Parent's Name"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email Subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          required
        />
        <textarea
          rows="4"
          placeholder="Enter student performance details..."
          value={performanceText}
          onChange={(e) => setPerformanceText(e.target.value)}
          required
        />
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </form>

      {/* Editable Summary Section (Only Shows After Generation) */}
      {generated && (
        <div className="summary-box">
          <h3>📄 Review & Edit Feedback</h3>
          <textarea
            rows="6"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <button onClick={handleSendToParent} className="send-btn">
            Send to Parent
          </button>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
