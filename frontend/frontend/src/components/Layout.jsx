import React from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children, role }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      
      {/* 🔥 SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🧠 MHE</h2>

        <p onClick={() => navigate(`/${role}`)}>🏠 Dashboard</p>

        {role === "student" && (
          <>
            <p>📝 Take Test</p>
            <p>📊 Results</p>
          </>
        )}

        {role === "staff" && (
          <>
            <p>👥 Students</p>
            <p>📈 Reports</p>
          </>
        )}

        {role === "general" && (
          <>
            <p>🧪 Test</p>
            <p>📚 Awareness</p>
          </>
        )}

        <p onClick={logout} style={{ marginTop: "auto", color: "red" }}>
          🚪 Logout
        </p>
      </div>

      {/* 🔥 MAIN */}
      <div style={styles.main}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI"
  },
  sidebar: {
    width: "220px",
    background: "#1e293b",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  logo: {
    marginBottom: "20px"
  },
  main: {
    flex: 1,
    background: "#f1f5f9",
    padding: "20px"
  }
};