var Sauce = require("../models/sauce.js");

function createSauce(payload) {
  const sauce = new Sauce(payload);
  return sauce
    .save()
    .then((sauce) => {
      return { message: "Sauce created successfully" };
    })
    .catch((err) => {
      throw new ErrorHandler(500, "Error");
    });
}

module.exports = { createSauce };
