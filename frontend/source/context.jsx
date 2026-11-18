import { createContext, useState, useEffect } from "react";
import API from "../../Service/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const role = localStorage.getItem("role");
      setUser({ role });
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {

    const res = await API.post("/auth/login", {
      email,
      password
    });

    const { token, role } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    setUser({ role });

    return role;
  };

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