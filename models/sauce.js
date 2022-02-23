var mongoose = require("mongoose");

var SauceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userID is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  manufacturer: {
    type: String,
    required: [true, "manufacturer is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  mainPepper: {
    type: String,
    required: [true, "mainPepper is required"],
  },
  imageUrl: {
    type: String,
  },
  heat: {
    type: Number,
    required: [true, "heat is required"],
  },
  likes: {
    type: Number,
  },
  dislikes: {
    type: Number,
  },
  usersLiked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  usersDisliked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Sauce", SauceSchema);
