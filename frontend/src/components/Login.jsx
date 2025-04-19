import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import "../styles/auth.css";

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const { username, password } = form;
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post("/login", form);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="container login-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}

      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        disabled={loading}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        disabled={loading}
        required
      />

      <button
        type="submit"
        className="login-btn"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="link">
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")}>Sign Up</span>
      </p>
    </form>
  );
};

export default Login;
