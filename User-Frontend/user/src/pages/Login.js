import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginUser = () => {
    axios.post("http://localhost:5000/user/login", {
      email,
      password
    })
    .then(res => {
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    })
    .catch(err => {
      setError(err.response?.data?.message || "Login failed");
    });
  };

  return (
    <div className="page-center">
      <div className="card p-4 login-card shadow">
        <h3 className="text-center mb-4">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-1"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        {/* Forgot Password Link */}
        <div className="text-end mb-3">
          <Link to="/forgotpassword" className="forgot-link">
            Forgot Password?
          </Link>
        </div>

        <button className="btn custom-btn w-100 mb-3" onClick={loginUser}>
          Login
        </button>

        <p className="mt-2 text-center">
          Don’t have an account? <Link className="signup" to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;