import { useState } from "react";
import axios from "../utils/axiosConfig";
import "../styles/Dashboard.css";  // Ensure to import the correct CSS

const Dashboard = ({ token, onLogout }) => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const checkEmail = async () => {
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      const res = await axios.post("/check-email", { email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(res.data); // Save the result data here
    } catch (err) {
      setResult(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="container dashboard-container">
      {/* Profile Button */}
      <div className="profile-container">
        <button className="profile-btn" onClick={toggleDropdown}>
          Profile
        </button>
        {dropdownVisible && (
          <div className="dropdown-menu">
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <h2>Dashboard</h2>

      <div className="email-checker">
        <input
          type="email"
          placeholder="Enter email to check"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button onClick={checkEmail} className="check-btn" disabled={loading || !email}>
          {loading ? "Checking..." : "Check Email"}
        </button>
      </div>

      {result && (
        <div className="result-container">
          <h3>Email Validation Results</h3>
          <div className={`result-message ${error ? "result-error" : "result-success"}`}>
            <div className="result-item">
              <strong>Deliverability:</strong> {result.deliverability}
            </div>
            <div className="result-item">
              <strong>SMTP Score:</strong> {result.smtp_score}
            </div>
            <div className="result-item">
              <strong>Fraud Score:</strong> {result.fraud_score}
            </div>
            <div className="result-item">
              <strong>Disposable:</strong> {result.disposable ? "Yes" : "No"}
            </div>
            <div className="result-item">
              <strong>Catch All:</strong> {result.catch_all ? "Yes" : "No"}
            </div>
            <div className="result-item">
              <strong>Generic:</strong> {result.generic ? "Yes" : "No"}
            </div>
            <div className="result-item">
              <strong>Common:</strong> {result.common ? "Yes" : "No"}
            </div>
            <div className="result-item">
              <strong>DNS Valid:</strong> {result.dns_valid ? "Yes" : "No"}
            </div>
            <div className="result-item">
              <strong>Honeypot:</strong> {result.honeypot ? "Yes" : "No"}
            </div>
            <div className="result-item">
              <strong>Leaked:</strong> {result.leaked ? "Yes" : "No"}
            </div>
            <div className="result-item">
              <strong>Spam Trap Score:</strong> {result.spam_trap_score}
            </div>
            <div className="result-item">
              <strong>First Seen:</strong> {result.first_seen.human}
            </div>
            <div className="result-item">
              <strong>Domain Age:</strong> {result.domain_age.human}
            </div>
            <div className="result-item">
              <strong>Risky TLD:</strong> {result.risky_tld ? "Yes" : "No"}
            </div>
            <div className="result-item">
              <strong>SPF Record:</strong> {result.spf_record ? "Valid" : "Invalid"}
            </div>
            <div className="result-item">
              <strong>DMARC Record:</strong> {result.dmarc_record ? "Valid" : "Invalid"}
            </div>
            <div className="result-item">
              <strong>Sanitized Email:</strong> {result.sanitized_email}
            </div>
            <div className="result-item">
              <strong>MX Records:</strong> {result.mx_records.join(", ")}
            </div>
            <div className="result-item">
              <strong>A Records:</strong> {result.a_records.join(", ")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
