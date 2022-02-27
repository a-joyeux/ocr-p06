var User = require("../controllers/user.js");
var Sauce = require("../controllers/sauce.js");
var express = require("express");
var router = express.Router();
const { auth } = require("../helpers/auth.js");
const multer = require("../helpers/multer-config");
const { ErrorHandler } = require("../helpers/error.js");

const { response } = require("express");

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

// GET Sauce by ID
router.get("/api/sauces/:id", auth, function (req, res, next) {
  Sauce.findSauce(req.params.id)
    .then((sauce) => {
      res.send(sauce);
    })
    .catch((err) => {
      next(err);
    });
});

// Like/Dislike a Sauce
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
router.post("/api/sauces", auth, multer, function (req, res, next) {
  if (req.file) {
    Sauce.createSauce(req)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        next(err);
      });
  } else throw new ErrorHandler(500, "Image file is required");
});

// Update a sauce

router.put("/api/sauces/:id", auth, multer, function (req, res, next) {
  Sauce.updateSauce(req)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      next(err);
    });
});

// Delete a sauce

router.delete("/api/sauces/:id", auth, multer, function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  Sauce.deleteSauce(req.params.id, token)
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
