const express = require("express");
var mongoose = require("mongoose");
var router = require("./router/router.js");
const bodyParser = require("body-parser");
const { handleError } = require("./helpers/error.js");
require("dotenv").config();

console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();
    const port = 3000;

    app.use(bodyParser.json());
    app.use(router);
    app.use((err, req, res, next) => {
      console.log("ERROR === ", err);
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
