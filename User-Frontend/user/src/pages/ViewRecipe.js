import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/viewrecipe.css";

const ViewRecipe = () => {
  const navigate=useNavigate();

  const location = useLocation();
  const page = location.state?.page || 1;

  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/recipe/${id}`
        );
        setRecipe(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) return <div className="text-center mt-5">Loading...</div>;

  const ingredientsArray = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : recipe.ingredients.split(",");

  const stepsArray = Array.isArray(recipe.steps)
    ? recipe.steps
    : recipe.steps.split(",");
  const toRoman = (num) => {
  const roman = ["i","ii","iii","iv","v","vi","vii","viii","ix","x","xi","xii","xiii","xiv","xv","xvi"];
  return roman[num - 1] || num;
};
  return (
    <>
      <Navbar />

      <div className="container mt-5 view-container">

        {/*BACK BUTTON */}
        <div className="mb-3">
          <button
            className="back-btn"
            onClick={() => navigate(`/home?page=${page}`)}
          >
            ← Back
          </button>
        </div>

        {/* IMAGE */}
        <div className="text-center">
          <img
            src={recipe.image}
            alt="recipe"
            className="recipe-main-image"
          />
        </div>

        {/* TITLE */}
        <h2 className="recipe-title-main text-center mt-4">
          {recipe.title}
        </h2>

        {/* CREATOR */}
        <p className="text-center creator-text">
          By {recipe.creator?.name}
        </p>

        {/* INGREDIENTS */}
       
      <div className="mt-4">
       <h5>Ingredients:</h5>
       <ul>
         {ingredientsArray.map((item, index) => (
        <li key={index}>{item.trim()}</li>
        ))}
       </ul>
      </div>

        {/* STEPS */}
   
      <div className="mt-4">
       <h5>Steps:</h5>
       <ul className="steps-list">
        {stepsArray.map((step, index) => (
        <li key={index}>
         <span className="step-title">
          Step {toRoman(index + 1)}:
         </span>{" "}
         {step.trim()}
        </li>
         ))}
       </ul>
      </div>
        {/* COOKING INFO */}
        <div className="info-box mt-4 text-center">
          <p><strong>Cooking Time:</strong> {recipe.cookingTime}mins</p>
          <p><strong>Difficulty Level:</strong> {recipe.difficultyLevel}</p>
        </div>

      </div>
    </>
  );
};

export default ViewRecipe;