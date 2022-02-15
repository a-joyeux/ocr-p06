const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("./error.js");
require("dotenv").config();

function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(401, "Invalid token");
  }
}

module.exports = {
  auth,
};
