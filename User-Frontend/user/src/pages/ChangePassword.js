import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/changepassword.css"; 

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/user/change-password",
        {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Password updated successfully!");
      navigate("/");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">
          <h3>Change Password</h3>

          <div className="mb-3">
            <label>Old Password:</label>
            <input
              type="password"
              className="form-control"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>New Password:</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button
              className="btn custom-btn"
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? "Updating..." : "Submit"}
            </button>

            <button
              className="btn custom-btn"
              onClick={() => navigate("/profile")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;