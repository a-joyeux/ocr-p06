var User = require("../controllers/user.js");
var Sauce = require("../controllers/sauce.js");
var express = require("express");
var router = express.Router();
const { auth } = require("../helpers/auth.js");
const { response } = require("express");

router.get("/", auth, function (req, res) {
  res.send("Hello world!");
});

router.post("/api/sauces", auth, function (req, res) {
  console.log("router api sauces");
  console.log(req);
  Sauce.createSauce(req.body)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      next(err);
    });
});

// Auth the user
router.post("/api/auth/login", function (req, res, next) {
  User.loginUser(req.body, next)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      next(err);
    });
});
// Create a new user
router.post("/api/auth/signup", function (req, res, next) {
  User.createUser(req.body, next)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
