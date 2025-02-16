import React, { useState } from "react";
import "./App.css"; 

function TeacherDashboard() {
  const [performanceText, setPerformanceText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [parentName, setParentName] = useState("");
  const [emailSubject, setEmailSubject] = useState("Student Progress Update");
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState("");

  const handleSubmit = async (event) => {
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
    } catch (error) {
      console.error("Error:", error);
      setSummary("Failed to connect to the backend.");
    }

    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUploadResult(data.message || "Upload successful!");
    } catch (error) {
      console.error("Error:", error);
      setUploadResult("Failed to upload file.");
    }
  };

  return (
    <div className="container">
      <h2>🧑‍🏫 Teacher Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Parent's Name"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Email Subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="input-field"
          required
        />
        <textarea
          placeholder="Enter student performance details..."
          value={performanceText}
          onChange={(e) => setPerformanceText(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </form>

      <h2>📂 Bulk Upload Student Feedback</h2>
      <form onSubmit={handleFileUpload}>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="input-field" />
        <button type="submit" className="upload-btn">Upload CSV</button>
      </form>
      {uploadResult && <p>{uploadResult}</p>}
    </div>
  );
}

export default TeacherDashboard;
