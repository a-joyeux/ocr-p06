const req = require("express/lib/request");
const res = require("express/lib/response");
var User = require("../models/user.js");

function createUser(payload) {
  const user = new User(payload);
  return user
    .save()
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
      return err;
    });
}

module.exports = { createUser };
