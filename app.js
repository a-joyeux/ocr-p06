const express = require("express");
var mongoose = require("mongoose");
var router = require("./router/router.js");
const bodyParser = require("body-parser");
const { handleError } = require("./helpers/error.js");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();
    const port = 3000;

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      next();
    });
    app.use(bodyParser.json());
    app.use(router);
    app.use((err, req, res, next) => {
      handleError(err, res);
    });
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    return err;
  });
