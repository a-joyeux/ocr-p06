const req = require("express/lib/request");
const res = require("express/lib/response");
var User = require("../models/user.js");
const { ErrorHandler, getErrorMessage } = require("../helpers/error.js");

function createUser(payload, next) {
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

module.exports = { createUser };
