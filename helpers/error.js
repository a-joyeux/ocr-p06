const { Error } = require("mongoose");

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const getErrorMessage = (err) => {
  if (err.code) {
    return `Duplicate key error for : ${Object.keys(err.keyValue)} : ${
      err.keyValue[Object.keys(err.keyValue)]
    }`;
  }
  console.log(err);
  return Object.values(err.errors).map((error) => error.message);
};

const handleError = (err, res) => {
  const { statusCode, message } = err;

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
  getErrorMessage,
};
