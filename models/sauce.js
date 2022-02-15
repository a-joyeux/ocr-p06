var mongoose = require("mongoose");

var SauceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "userID is required"],
  },
  name: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  description: {
    type: String,
  },
  mainPepper: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  heat: {
    type: Number,
  },
  likes: {
    type: Number,
  },
  dislikes: {
    type: Number,
  },
  usersLiked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  usersDisliked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Sauce", SauceSchema);
