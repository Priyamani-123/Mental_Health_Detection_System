import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await login({ email, password });

console.log("LOGIN RESPONSE:", res);

// ✅ ALWAYS TRUST localStorage
const role = localStorage.getItem("role");

console.log("FINAL ROLE:", role);

// 🔥 NAVIGATION
if (role === "student") navigate("/student");
else if (role === "staff") navigate("/staff");
else if (role === "general") navigate("/general");
else if (role === "admin") navigate("/admin");
else setError("Invalid role");

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setError("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <h1 style={styles.mainTitle}>
        Mental Health Early Detection 🧠
      </h1>

      <div style={styles.card}>

        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to continue</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          style={styles.input}
        />

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            style={styles.input}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          onClick={() => navigate("/register")}
          style={styles.link}
        >
          Don't have an account? Register
        </p>

      </div>
    </div>
  );
}


// 🎨 STYLES
const styles = {
  container: {
    height: "100vh",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI"
  },

  mainTitle: {
    position: "absolute",
    top: "30px",
    fontSize: "28px",
    fontWeight: "600",
    color: "#333"
  },

  card: {
    width: "360px",
    padding: "30px",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  title: {
    marginBottom: "5px",
    color: "#333"
  },

  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666"
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box"
  },

  passwordWrapper: {
    position: "relative",
    width: "100%"
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "18px",
    color: "#888"
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  },

  link: {
    marginTop: "15px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#007bff"
  },

  error: {
    color: "red",
    fontSize: "14px"
  }
};