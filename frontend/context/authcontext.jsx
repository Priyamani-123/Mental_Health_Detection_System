import { createContext, useState, useEffect } from "react";
import { loginUser } from "../../Service/authService.js";
import API from "../../Service/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setUser({ role });
    }

    setLoading(false);

  }, []);

  // LOGIN
  const login = async (email, password) => {

    try {

      const data = await loginUser({
        email,
        password
      });

      const { token, role } = data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Update state
      setUser({ role });

      return role;

    } catch (error) {
      throw error;
    }

  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};