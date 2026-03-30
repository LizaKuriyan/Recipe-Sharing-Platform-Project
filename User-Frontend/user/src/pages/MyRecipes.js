import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/myrecipes.css";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
const MyRecipes = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(params.get("page")) || 1;
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const recipesPerPage = 5;

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/user/my-recipes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes", error);
      }
    };

    fetchMyRecipes();
  }, []);

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3 className="mb-4">My Recipes</h3>

        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>View Count</th>
              <th>View Page</th>
            </tr>
          </thead>

          <tbody>
            {currentRecipes.length > 0 ? (
              currentRecipes.map((recipe, index) => (
                <tr key={recipe._id}>
                  <td>{indexOfFirstRecipe + index + 1}</td>
                  <td>{recipe.title}</td>
                  <td>{recipe.views} Views</td>
                  <td>
                    <Link to={`/viewmyrecipe/${recipe._id}`}state={{ page: currentPage }}>
                      <button className="btn custom-btn btn-sm">
                        Click to View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No recipes found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="text-center mt-4">
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

export default MyRecipes;