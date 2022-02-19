var Sauce = require("../models/sauce.js");
var User = require("./user.js");
const { ErrorHandler } = require("../helpers/error.js");

function createSauce(payload) {
  const sauce = new Sauce(payload);
  return sauce
    .save()
    .then((sauce) => {
      return { message: "Sauce created successfully" };
    })
    .catch((err) => {
      throw new ErrorHandler(500, "Error in sauce creation");
    });
}

function findSauce(sauceId) {
  return Sauce.findById(sauceId)
    .exec()
    .then((sauce) => {
      return sauce;
    })
    .catch((err) => {
      throw new ErrorHandler(500, `Cannot find sauce with id: ${sauceId}`);
    });
}

function findAll() {
  return Sauce.find({})
    .exec()
    .then((sauce) => {
      return sauce;
    })
    .catch((err) => {
      throw new ErrorHandler(500, "Error to search all sauces");
    });
}

function likeSauce(sauceId, userInfos) {
  return Sauce.findById(sauceId)
    .exec()
    .then((sauce) => {
      User.findUser(userInfos)
        .then((user) => {
          if (userInfos.like == 1 && !sauce.usersLiked.includes(user._id)) {
            sauce.usersLiked.push(user);
            sauce.usersDisliked = sauce.usersDisliked.filter((elem) => {
              elem !== user._id;
            });
          } else if (userInfos.like == -1 && !sauce.usersDisliked.includes(user._id)) {
            sauce.usersDisliked.push(user);
            sauce.usersLiked = sauce.usersLiked.filter((elem) => {
              elem !== user._id;
            });
          }
          sauce.save();
          return { message: "Like status updated successfully" };
        })
        .catch((err) => {
          throw new ErrorHandler(500, `Cannot find user with email: ${userInfos.email}`);
        });
    })
    .catch((err) => {
      throw new ErrorHandler(500, `Cannot find sauce with id: ${sauceId}`);
    });
}

module.exports = { createSauce, findAll, likeSauce, findSauce };
