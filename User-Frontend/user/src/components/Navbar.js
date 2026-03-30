import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">

        <span className="navbar-brand fw-bold">
          RECIPEbox
        </span>

        <div className="links">
          <Link className="nav-link d-inline" to="/home">Home</Link>
          <Link className="nav-link d-inline" to="/myrecipes">My Recipes</Link>
          <Link className="nav-link d-inline" to="/addmyrecipe">Add Recipe</Link>
          <Link className="nav-link d-inline" to="/profile">Profile</Link>

          {/* Logout Button */}
          <button className="logout-btn"onClick={logout}>Logout</button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
