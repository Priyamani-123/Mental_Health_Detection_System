import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import StudentDashboard from "../pages/student/StudentDashboard";
import StaffDashboard from "../pages/staff/StaffDashboard";
import GeneralDashboard from "../pages/general/GeneralDashboard";

export default function AppRoutes() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Routes>

      {/* 🔐 AUTH ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔥 ROLE BASED ROUTES */}
      <Route
        path="/student"
        element={token && role === "student" ? <StudentDashboard /> : <Navigate to="/" />}
      />

      <Route
        path="/staff"
        element={token && role === "staff" ? <StaffDashboard /> : <Navigate to="/" />}
      />

      <Route
        path="/general"
        element={token && role === "general" ? <GeneralDashboard /> : <Navigate to="/" />}
      />

    </Routes>
  );
}