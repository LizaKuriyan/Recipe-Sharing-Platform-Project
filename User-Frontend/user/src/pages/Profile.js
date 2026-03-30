import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // Redirect to login if no token
          return;
        }

        const response = await axios.get("http://localhost:5000/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details", error);
        navigate("/"); 
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card text-center">
          <h1 className="mb-4">My Profile</h1>

          <h5>Username: {user.name}</h5>
          <p>Email: {user.email}</p>

          <div className="mt-4">
            <button className="btn custom-btn me-3" onClick={() => navigate("/changepassword")}>Change Password</button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;