import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/viewmyrecipe.css";

const ViewMyRecipe = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = location.state?.page || 1;  

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/user/my-recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/user/delete-recipe/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Recipe deleted successfully");
      navigate("/myrecipes");

    } catch (error) {
      console.error("Error deleting recipe", error);
      alert("Failed to delete recipe");
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <h3 className="heading">{recipe.title}</h3>

      <div className="container mt-5 view-container">
        <div className="row">

          {/* Left Side */}
          <div className="col-md-6">

            <div className="image-box mb-4">
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt="recipe"
                  className="recipe-img"
                />
              ) : (
                <p>No Image Available</p>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Title:</label>
              <input
                type="text"
                className="form-control"
                value={recipe.title}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ingredients:</label>
              <textarea
                className="form-control"
                rows="4"
                value={recipe.ingredients}
                readOnly
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Steps to Follow:</label>
              <textarea
                className="form-control"
                rows="6"
                value={recipe.steps}
                readOnly
              ></textarea>
            </div>

          </div>

          {/* Right Side */}
          <div className="col-md-6">

            <div className="mb-4">
              <label className="form-label">Cooking Time:</label>
              <input
                type="text"
                className="form-control"
                value={recipe.cookingTime}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Difficulty Level:</label>
              <input
                type="text"
                className="form-control"
                value={recipe.difficultyLevel}
                readOnly
              />
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="text-center mt-4">
          <button
            className="btn custom-btn me-3"
            onClick={() => navigate(`/editrecipe/${id}`)}
          >
            Edit
          </button>

          <button
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>

        <div className="mb-3 mt-3">
          <button
            className="btn custom-btn"
            onClick={() => navigate(`/myrecipes?page=${page}`)}
          >
            Back
          </button>
        </div>

      </div>
    </>
  );
};

export default ViewMyRecipe;