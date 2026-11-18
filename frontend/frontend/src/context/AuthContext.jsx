import React, { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔁 Restore session
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded = jwtDecode(token);
        const role = decoded?.role?.toLowerCase().trim();

        if (role) {
          setUser({ role });
        }
      }
    } catch (err) {
      console.log("Restore error:", err);
    }
  }, []);

  // 🔐 LOGIN FUNCTION
  const login = async ({ email, password }) => {
    try {
      setLoading(true);

      console.log("Sending:", email, password);

      const data = await loginUser({ email, password });

      console.log("BACKEND RESPONSE:", data);

      const token = data?.access_token;

      if (!token) {
        throw new Error("Token missing");
      }

      const decoded = jwtDecode(token);
      const role = decoded?.role?.toLowerCase().trim();

      if (!role) {
        throw new Error("Role missing in token");
      }

      // ✅ store
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // ✅ update state
      setUser({ role });

      // ✅ IMPORTANT: always return object
      return { role };

    } catch (error) {
      console.log("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔐 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};