var User = require("../controllers/user.js");

var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.send("Hello world!");
});

router.post("/api/auth/signup", function (req, res) {
  User.createUser(req.body).then((response) => {
    res.send(response);
  });
});

module.exports = router;
