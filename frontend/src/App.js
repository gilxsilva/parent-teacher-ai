import React, { useState } from "react";

function App() {
  const [performanceText, setPerformanceText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ performance: performanceText }),
      });

      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummary("Error generating summary.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSummary("Failed to connect to the backend.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h2>Parent-Teacher AI</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          placeholder="Enter student performance details..."
          value={performanceText}
          onChange={(e) => setPerformanceText(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </form>

      {summary && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Generated Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
