var User = require("../controllers/user.js");
var Sauce = require("../controllers/sauce.js");
var express = require("express");
var router = express.Router();
const { auth } = require("../helpers/auth.js");
const { response } = require("express");

router.get("/", auth, function (req, res) {
  res.send("Hello world!");
});

// GET all sauces
router.get("/api/sauces", auth, function (req, res, next) {
  Sauce.findAll()
    .then((sauces) => {
      res.send(sauces);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/api/sauces/:id/like", auth, function (req, res, next) {
  Sauce.likeSauce(req.params.id, req.body)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      next(err);
    });
});

// Create a sauce
router.post("/api/sauces", auth, function (req, res, next) {
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
