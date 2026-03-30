import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/home.css";

const Home = () => {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const params = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(params.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const recipesPerPage = 6;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user/all-recipes"
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        {/* Search Bar */}
        <div className="search-container mb-4">
          <div className="search-wrapper">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>

        <h2 className="page-title mb-4">
          All Recipes
        </h2>

        <div className="row g-4">
          {currentRecipes.length > 0 ? (
            currentRecipes.map((recipe) => (
              <div className="col-md-4 text-center" key={recipe._id}>
                 <Link
                  to={`/viewrecipe/${recipe._id}`}
                  state={{ page: currentPage }}
                  className="text-decoration-none"
                 >
                  <div className="card recipe-card shadow">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="card-img-top recipe-image"
                    />
                  </div>

                  <div className="mt-2">
                    <h5 className="recipe-title">{recipe.title}</h5>
                    <p className="creator-name">
                      By {recipe.creator?.name || "Unknown"}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <h5 className="text-center">No recipes found</h5>
          )}
        </div>

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="text-center mt-5">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn ${
                  currentPage === index + 1
                    ? "btn-warning"
                    : "btn-outline-warning"
                } me-2`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </>
  );
};

export default Home;