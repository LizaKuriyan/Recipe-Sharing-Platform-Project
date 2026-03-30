const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/usermodel");

mongoose.connect('mongodb://localhost:27017/recipe_users');

async function createAdmin() {

  const hashedPassword = await bcrypt.hash("admin123", 10);
  //admin
  const admin = new User({
    name: "Admin",
    email: "admin123@gmail.com",
    password: hashedPassword,
    isAdmin: true,
    status: "Unblocked"
  });

  await admin.save();

  console.log("Admin created successfully");
  mongoose.disconnect();
}

createAdmin();