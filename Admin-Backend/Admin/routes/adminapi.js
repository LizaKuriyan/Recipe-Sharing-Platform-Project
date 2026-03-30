var express = require('express');
var router = express.Router();
const User =require("../models/usermodel");
const Recipe =require("../models/recipemodel");
const adminAuth = require("../middleware/adminAuth");
const bcrypt = require("bcrypt");

/* GET home page. */
router.get('/login', function(req, res) {
  res.render('adminLogin');
});

/* login page */
router.post('/login', async function(req, res) {

  try {

    const { email, password } = req.body;

    const admin = await User.findOne({ email: email, isAdmin: true });

    if (!admin) {
      return res.send("Admin not found");
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.send("Wrong password");
    }

    req.session.admin = admin._id;

    res.redirect("/admin/home");

  }
  
  catch (error) {
    console.log(error);
    res.send("Login error");
  }

});

/* home page */
router.get('/home',adminAuth,async function (req, res, next) {

  try {

    const page = parseInt(req.query.page) || 1;  
    const limit = 6;                              
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find()
      .populate("creator", "name")  // get creator name from User model
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalRecipes = await Recipe.countDocuments();

    const totalPages = Math.ceil(totalRecipes / limit);

    res.render("adminHome", {
      recipes,
      currentPage: page,
      totalPages
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }

});

/* view users list */
router.get('/viewusers',adminAuth, async function(req, res) {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const users = await User.find({ isAdmin: false })
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 })
      .collation({ locale: "en", strength: 2 }) 

    const totalUsers = await User.countDocuments({ isAdmin: false });

    const totalPages = Math.ceil(totalUsers / limit);

    res.render("viewUsers", {
      users,
      currentPage: page,
      totalPages
    });

  } 
  
  catch (error) {
    console.log(error);
    res.send("Error loading users");
  }
});

/* user profile */
router.get('/userprofile/:id', adminAuth, async function(req, res) {

  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user) {
      return res.send("User not found");
    }
    const mongoose = require("mongoose");

    const recipes = await Recipe.find({ creator: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      const totalRecipes = await Recipe.countDocuments({ creator: userId });   
    const totalPages = Math.ceil(totalRecipes / limit);
    res.render("userProfile", {
      user,
      recipes,
      totalRecipes,
      currentPage: page,
      totalPages
    });
  }
  catch (error) {
    console.log("ERROR:", error);
    res.status(500).send("Server Error");
  }
});

/*block user */
router.post("/blockuser/:id",adminAuth, async function(req, res) {

  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, {
      status: "Blocked"
    });
    
    const sessionStore = req.sessionStore;
    sessionStore.all((err, sessions) => {
      if (!err && sessions) 
      {
        for (let sid in sessions) 
        {
          const sessionData = sessions[sid];
          if (sessionData.userId === userId)
          {
            sessionStore.destroy(sid, (err) => {
              if (err) console.log("Error destroying user session:", err);
            });
          }
        }
      }
    });
    res.redirect("/admin/userprofile/" + userId);
  } 
  
  catch (error) {
    console.log(error);
    res.send("Error blocking user");
  }
});

/* unblock user */
router.post("/unblockuser/:id",adminAuth, async function(req, res) {

  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, {
      status: "Unblocked"
    });

    res.redirect("/admin/userprofile/" + userId);
  } 
  
  catch (error) {
    console.log(error);
    res.send("Error unblocking user");
  }
});

// GET recipe detail page
router.get('/viewrecipe/:id',adminAuth, async (req, res) => {
    try 
    {
        const recipe = await Recipe.findById(req.params.id).populate('creator'); 
        if(!recipe){
            return res.status(404).send("Recipe not found");
        }
        const currentPage = parseInt(req.query.page) || 1;
        const from = req.query.from || 'home';  
        const userId = req.query.userid || null;

        res.render('recipe', { recipe, currentPage, from, userId });
    } 
    
    catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

/* mostviewed recipes */
router.get('/mostviewed',adminAuth, async function(req, res) {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find()
      .populate("creator", "name")   
      .sort({ views: -1 })           
      .skip(skip)
      .limit(limit);

    const totalRecipes = await Recipe.countDocuments();
    const totalPages = Math.ceil(totalRecipes / limit);

    res.render("mostViewed", {
      recipes,
      currentPage: page,
      totalPages
    });

  }
  
  catch (error) {
    console.log(error);
    res.send("Error loading most viewed recipes");
  }

});

/* logout */
router.get('/logout', function(req, res) {

  req.session.destroy(function(err){
    if(err){
      console.log(err);
      return res.send("Error logging out");
    }

    res.redirect("/admin/login");
  });

});

module.exports = router;
