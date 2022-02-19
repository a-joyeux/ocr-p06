const req = require("express/lib/request");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var User = require("../models/user.js");
const { ErrorHandler, getErrorMessage } = require("../helpers/error.js");
require("dotenv").config();

function createUser(payload) {
  const user = new User(payload);
  return user
    .save()
    .then((user) => {
      return { message: "User created successfully" };
    })
    .catch((err) => {
      throw new ErrorHandler(500, getErrorMessage(err));
    });
}

function findUser(userId) {
  return User.findById(userId).then((user) => {
    if (!user) {
      throw new ErrorHandler(500, getErrorMessage({ statusCode: "500", message: "Email not found" }));
    }
    return user;
  });
}

function loginUser(payload) {
  return User.findOne({ email: payload.email }).then((user) => {
    if (!user) {
      throw new ErrorHandler(500, getErrorMessage({ statusCode: "500", message: "Email not found" }));
    }
    return bcrypt.compare(payload.password, user.password).then((valid) => {
      if (!valid) {
        throw new ErrorHandler(403, "Wrong password");
      }
      return {
        userId: user._id,
        token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        }),
      };
    });
  });
}

module.exports = { createUser, loginUser, findUser };
