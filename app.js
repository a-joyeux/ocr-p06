const express = require("express");
var mongoose = require("mongoose");
var router = require("./router/router.js");
const bodyParser = require("body-parser");

mongoose
  .connect("mongodb://localhost/piquante", {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();
    const port = 3000;

    app.use(bodyParser.json());
    app.use(router);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    return err;
  });
