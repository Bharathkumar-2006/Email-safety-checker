import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <div className="app-body">
        <h1>InboxGuard</h1>
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
            <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} />
            <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register goToLogin={() => window.location.href = "/login"} />} />
            <Route path="/dashboard" element={token ? <Dashboard onLogout={handleLogout} token={token} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
