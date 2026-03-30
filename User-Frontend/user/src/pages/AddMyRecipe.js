import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/addmyrecipe.css";
import Navbar from "../components/Navbar";
import axios from "axios";

function AddMyRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Easy");

const handleSubmit = async () => {

  const confirmAdd = window.confirm(
    "Are you sure you want to add this recipe?"
  );

  if (!confirmAdd) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/user/addrecipe",
      {
        title,
        image,
        ingredients: ingredients
          .split(",")
          .map(i => i.trim())
          .filter(i => i !== ""),

        steps: steps
          .split(",")
          .map(s => s.trim())
          .filter(s => s !== ""),             
        cookingTime,
        difficultyLevel
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Recipe added successfully");
    navigate("/myrecipes");

  } catch (error) {
    console.error(error);
    alert("Failed to add recipe");
  }
};

  return (
    <>
      <Navbar />

      <div className="add-recipe-container">
        <div className="container add-recipe-card">
          <h2 className="text-center mb-4">Add My Recipe</h2>

          <div className="row">
            {/* LEFT */}
            <div className="col-md-6">
              <div className="mb-3">
                <label>Image URL:</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Title:</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Ingredients (comma separated):</label>
                <textarea
                  className="form-control"
                  rows="4"
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-md-6">
              <div className="mb-3">
                <label>Steps (comma separated):</label>
                <textarea
                  className="form-control"
                  rows="6"
                  onChange={(e) => setSteps(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Cooking Time (minutes):</label>
                <input
                  type="number"
                  className="form-control"
                  onChange={(e) => setCookingTime(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Difficulty Level:</label>
                <select
                  className="form-select"
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn add-btn me-3" onClick={handleSubmit}>
              Add Recipe
            </button>
            <button className="btn add-btn" onClick={() => navigate("/home")}>
                Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddMyRecipe;