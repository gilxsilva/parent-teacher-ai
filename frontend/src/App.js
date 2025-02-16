import React, { useState } from "react";
import ParentDashboard from "./ParentDashboard";

function App() {
  const [view, setView] = useState("home");
  const [performanceText, setPerformanceText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [parentName, setParentName] = useState("");
  const [emailSubject, setEmailSubject] = useState("Student Progress Update");
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState("");

  // 📌 Handle Manual Submission (Single Student)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  // 📌 Handle Bulk Upload (CSV)
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

  const copyToClipboard = () => {
    const emailText = `Subject: ${emailSubject}\n\nDear ${parentName},\n\n${summary}\n\nBest,\n[Your Name]`;
    navigator.clipboard.writeText(emailText);
    alert("Email copied to clipboard!");
  };

  return (
    <div>
      {/* NAVIGATION */}
      <nav style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px", backgroundColor: "#f8f9fa" }}>
        <button onClick={() => setView("home")}>Home</button>
        <button onClick={() => setView("dashboard")}>Parent Dashboard</button>
      </nav>

      {view === "home" ? (
        <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
          <h2>Parent-Teacher AI</h2>

          {/* Single Student Feedback Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Parent's Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <input
              type="text"
              placeholder="Email Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              required
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <textarea
              rows="4"
              cols="50"
              placeholder="Enter student performance details..."
              value={performanceText}
              onChange={(e) => setPerformanceText(e.target.value)}
              required
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <button type="submit" disabled={loading} style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              {loading ? "Generating..." : "Generate Summary"}
            </button>
          </form>

          {/* Single Student Email Preview */}
          {summary && (
            <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#f8f9fa", textAlign: "left" }}>
              <h3>Email Preview:</h3>
              <strong>Subject: {emailSubject}</strong>
              <p>Dear {parentName},</p>
              <p>{summary}</p>
              <p>Best,<br />[Your Name]</p>
              <button onClick={copyToClipboard} style={{ marginTop: "10px", padding: "8px 12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Copy to Clipboard
              </button>
            </div>
          )}

          {/* 📌 BULK UPLOAD FEATURE */}
          <h2>Bulk Upload Student Feedback</h2>
          <form onSubmit={handleFileUpload}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ marginBottom: "10px" }}
            />
            <button type="submit" style={{ padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Upload CSV
            </button>
          </form>
          {uploadResult && <p>{uploadResult}</p>}
        </div>
      ) : (
        <ParentDashboard parentName={parentName} />
      )}
    </div>
  );
}

export default App;
