var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/usermodel');
const Recipe = require('../models/recipemodel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/auth'); // centralized auth middleware

// ===============================
// SIGNUP API
// ===============================
router.post('/signup', async (req, res) => {
  try {
    let { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const formatName = (name) => {
      return name
        .trim()
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
    name = formatName(name);
    email = email.toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid Email Format" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Password and Confirm Password do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ===============================
// LOGIN API
// ===============================
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status === "Blocked") return res.status(403).json({ message: "Your account has been blocked by admin" });
    if (!bcrypt.compareSync(req.body.password, user.password)) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ===============================
// GET MY RECIPES (LOGGED-IN USER)
// ===============================
router.get('/my-recipes', authMiddleware, async (req, res) => {
  try {
    const myRecipes = await Recipe.find({ creator: req.user._id }).select('title views createdAt').sort({ createdAt: -1 });
    res.status(200).json(myRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ===============================
// GET SINGLE RECIPE (LOGGED-IN USER)
// ===============================
router.get('/my-recipes/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, creator: req.user._id });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===============================
// DELETE RECIPE
// ===============================
router.delete('/delete-recipe/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, creator: req.user._id });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===============================
// UPDATE RECIPE
// ===============================
router.put('/update-recipe/:id', authMiddleware, async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate({ _id: req.params.id, creator: req.user._id }, req.body, { new: true });
    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===============================
// ADD RECIPE
// ===============================
router.post('/addrecipe', authMiddleware, async (req, res) => {
  try {
    const { title, image, ingredients, steps, cookingTime, difficultyLevel } = req.body;
    if (!title || !image || !ingredients || !steps || !cookingTime || !difficultyLevel) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newRecipe = new Recipe({ title, image, ingredients, steps, cookingTime, difficultyLevel, creator: req.user._id });
    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===============================
// GET CURRENT USER INFO
// ===============================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email status");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===============================
// CHANGE PASSWORD
// ===============================
router.put('/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user || !bcrypt.compareSync(oldPassword, user.password)) return res.status(400).json({ message: "Old password is incorrect" });
    if (newPassword.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===============================
// FORGOT PASSWORD
// ===============================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    res.status(200).json({ message: "Password reset token generated.", resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===============================
// GET ALL RECIPES (PUBLIC)
// ===============================
router.get('/all-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('creator', 'name').sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===============================
// GET SINGLE RECIPE (PUBLIC + INCREMENT VIEW)
// ===============================
router.get('/recipe/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('creator', 'name');
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;