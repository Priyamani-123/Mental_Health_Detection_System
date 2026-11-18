import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../Service/authService";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);

      alert("Registration successful!");
      navigate("/login");

    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>

        <h2>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <select name="role" onChange={handleChange}>
          <option value="Student">Student</option>
          <option value="General">General User</option>
        </select>

        <button type="submit">
          Register
        </button>

      </form>
    </div>
  );
};

export default Register;