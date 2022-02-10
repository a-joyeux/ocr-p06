var User = require("../controllers/user.js");

var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.send("Hello world!");
});

router.post("/api/auth/signup", function (req, res, next) {
  User.createUser(req.body, next).then((response) => {
    res.send(response);
  });
});

module.exports = router;
