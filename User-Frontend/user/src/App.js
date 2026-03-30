import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import "./styles/global.css";
import MyRecipes from "./pages/MyRecipes";
import ViewMyRecipe from "./pages/ViewMyRecipe";
import EditRecipe from "./pages/EditRecipe";
import AddMyRecipe from "./pages/AddMyRecipe";
import ViewRecipe from "./pages/ViewRecipe";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/userAuth";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute>
          <Home />
          </ProtectedRoute>} />

        <Route path="/myrecipes" element={<ProtectedRoute>
          <MyRecipes />
        </ProtectedRoute>} />

        <Route path="/viewmyrecipe/:id" element={<ProtectedRoute>
          <ViewMyRecipe />
        </ProtectedRoute>} />

        <Route path="/editrecipe/:id" element={<ProtectedRoute>
          <EditRecipe />
        </ProtectedRoute>} />

        <Route path="/addmyrecipe" element={<ProtectedRoute>
          <AddMyRecipe />
        </ProtectedRoute>} />

        <Route path="/viewrecipe/:id" element={<ProtectedRoute>
          <ViewRecipe />
        </ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute>
          <Profile />
        </ProtectedRoute>} />

        <Route path="/changepassword" element={<ProtectedRoute>
          <ChangePassword />
        </ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;