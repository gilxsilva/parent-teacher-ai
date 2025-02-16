import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TeacherDashboard from "./TeacherDashboard";
import ParentDashboard from "./ParentDashboard";
import Home from "./Home";
import "./App.css"; 

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/teacher">Teacher Dashboard</Link>
        <Link to="/parent">Parent Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
