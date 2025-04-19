import { useState } from "react";
import axios from "../utils/axiosConfig";
import "../styles/auth.css";

const Register = ({ goToLogin }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Password length check (Frontend Validation)
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/register", form);
      alert("Registration successful. Please log in.");
      goToLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="container">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      {["username", "email", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : field === "email" ? "email" : "text"}
          placeholder={field}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          required
          disabled={loading}
        />
      ))}
      <button type="submit" className="register-btn" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="link">
        Already have an account? <span onClick={goToLogin}>Login</span>
      </p>
    </form>
  );
};

export default Register;
