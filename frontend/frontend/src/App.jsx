import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboards
import StudentDashboard from "./pages/student/StudentDashboard";
import Assessment from "./pages/Assessment/Assessment";
import Mood from "./pages/Mood/Mood";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import GeneralDashboard from "./pages/general/GeneralDashboard";

function App() {
  return (
    <Routes>
      {/* 🔐 Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />   {/* 🔥 add this */}
      <Route path="/register" element={<Register />} />

      {/* 🎓 Student */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/assessment" element={<Assessment />} />   {/* 🔥 lowercase */}
      <Route path="/mood" element={<Mood />} />               {/* 🔥 lowercase */}

      {/* 👩‍🏫 Staff */}
      <Route path="/staff" element={<StaffDashboard />} />

      {/* 🛠 Admin */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* 🌐 General */}
      <Route path="/general" element={<GeneralDashboard />} />
    </Routes>
  );
}

export default App;