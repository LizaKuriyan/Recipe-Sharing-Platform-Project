import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/viewmyrecipe.css"; 

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    title: "",
    image: "",
    ingredients: "",
    steps: "",
    cookingTime: "",
    difficultyLevel: ""
  });

  // Fetch recipe data
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

      setRecipe({
      ...response.data,
      ingredients: response.data.ingredients
      ? response.data.ingredients.join(", ")
      : "",
      steps: response.data.steps
      ? response.data.steps.join(", ")
      : ""
      });

      }  catch (error) {
        console.error("Error fetching recipe", error);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value
    });
  };

  // Handle update
  const handleUpdate = async () => {

  const confirmUpdate = window.confirm(
    "Are you sure you want to update this recipe?"
  );

  if (!confirmUpdate) {
    return;
  }

  try {

    const token = localStorage.getItem("token");

    const updatedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients
        ? recipe.ingredients.split(",").map(i => i.trim()).filter(i => i !== "")
        : [],
      steps: recipe.steps
        ? recipe.steps.split(",").map(s => s.trim()).filter(s => s !== "")
        : []
    };

    await axios.put(
      `http://localhost:5000/user/update-recipe/${id}`,
      updatedRecipe,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Recipe updated successfully");
    navigate(`/viewmyrecipe/${id}`);

  } catch (error) {
    console.error("Error updating recipe", error);
    alert("Failed to update recipe");
  }
};

  return (
    <>
      <Navbar />

      <div className="container mt-5 view-container">
        <div className="row">

          {/* Left Side */}
          <div className="col-md-6">

            <div className="mb-3">
              <label className="form-label">Title:</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={recipe.title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
    <label className="form-label">Image URL:</label>
    <input
      type="text"
      className="form-control"
      name="image"
      value={recipe.image}
      onChange={handleChange}
    />
  </div>
    {recipe.image && (
    <div className="mb-3 text-center">
      <img
        src={recipe.image}
        alt="Recipe Preview"
        className="recipe-img"
        style={{ maxWidth: "100%", borderRadius: "10px" }}
      />
    </div>
  )}


            <div className="mb-3">
              <label className="form-label">Ingredients:</label>
              <textarea
                className="form-control"
                rows="4"
                name="ingredients"
                value={recipe.ingredients}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Steps to Follow:</label>
              <textarea
                className="form-control"
                rows="6"
                name="steps"
                value={recipe.steps}
                onChange={handleChange}
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
                name="cookingTime"
                value={recipe.cookingTime}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
               <label className="form-label">Difficulty Level:</label>
               <select className="form-control"name="difficultyLevel"value={recipe.difficultyLevel}onChange={handleChange}>
                 <option value="">Select Difficulty</option>
                 <option value="Easy">Easy</option>
                 <option value="Medium">Medium</option>
                 <option value="Hard">Hard</option>
               </select>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn custom-btn me-3"onClick={handleUpdate}>
            Update
          </button>

          <button className="btn btn-secondary" onClick={() => navigate(`/viewmyrecipe/${id}`)}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default EditRecipe;