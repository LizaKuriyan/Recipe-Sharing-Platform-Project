const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    ingredients: [
      {
        type: String,
        required: true
      }
    ],

    steps: [
      {
        type: String,
        required: true
      }
    ],

    cookingTime: {
      type: Number, 
      required: true
    },

    difficultyLevel: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
