const req = require("express/lib/request");
const res = require("express/lib/response");
var User = require("../models/user.js");
const { ErrorHandler } = require("../helpers/error.js");

function createUser(payload, next) {
  const user = new User(payload);
  return user
    .save()
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((err) => {
      throw new ErrorHandler(500, "Error message");
    });
}

module.exports = { createUser };
