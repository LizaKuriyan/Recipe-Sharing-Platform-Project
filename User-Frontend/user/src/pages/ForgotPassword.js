import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/profile.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/user/forgot-password", { email });
      setMessage(res.data.message);
      setError("");
    } 
    catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h3 className="text-center mb-4">Forgot Password</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Enter your registered email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="text-center mt-4">
          <button className="btn custom-btn me-3" onClick={handleSubmit}>
            Submit
          </button>

          <Link to="/">
            <button className="btn custom-btn">
              Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;