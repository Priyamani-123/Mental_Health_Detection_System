import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NEW FIELDS
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [role, setRole] = useState("student");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role || !age || !gender) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // ✅ SEND ALL DATA TO BACKEND
      await registerUser({
        name,
        email,
        password,
        role,
        age: Number(age),
        gender
      });

      setSuccess("Registration successful ✅");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.detail ||
        err.message ||
        "Register failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      <h1 style={styles.title}>
        Mental Health Early Detection 🧠
      </h1>

      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account ✨</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* AGE */}
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={styles.input}
        />

        {/* GENDER */}
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Gender</option>
          <option value="male">👨 Male</option>
          <option value="female">👩 Female</option>
          <option value="other">🌈 Other</option>
        </select>

        {/* PASSWORD */}
        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* ROLE */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="student">🎓 Student</option>
          <option value="staff">👨‍🏫 Staff</option>
          <option value="general">🌐 General</option>
          <option value="admin">⚙ Admin</option>
        </select>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p onClick={() => navigate("/")} style={styles.link}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "#f5f7fb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI"
  },

  title: {
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
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  heading: {
    textAlign: "center",
    marginBottom: "10px"
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
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
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px"
  },

  link: {
    textAlign: "center",
    color: "#007bff",
    cursor: "pointer",
    marginTop: "10px"
  },

  error: {
    color: "red",
    textAlign: "center"
  },

  success: {
    color: "green",
    textAlign: "center"
  }
};