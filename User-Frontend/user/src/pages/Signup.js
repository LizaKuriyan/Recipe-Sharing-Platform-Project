import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const registerUser = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    axios
      .post("http://localhost:5000/user/signup", user)
      .then((response) => {
        setErrorMessage("");
        navigate("/"); // redirect to login page
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(
            error.response.data.message
          );
        } else {
          setErrorMessage("Failed to connect to API");
        }
      });
  };

  return (
    <div className="page-center">
      <div className="card p-4 signup-card shadow">
        <h3 className="text-center mb-4">Sign Up</h3>

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <input
          className="form-control mb-3"
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="btn custom-btn w-100" onClick={registerUser}>
          Sign Up
        </button>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link className="login" to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;