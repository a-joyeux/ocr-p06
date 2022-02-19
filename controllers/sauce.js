var Sauce = require("../models/sauce.js");
var User = require("./user.js");
const { ErrorHandler } = require("../helpers/error.js");

function createSauce(payload) {
  const sauce = new Sauce({
    ...JSON.parse(payload.body.sauce),
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${payload.protocol}://${payload.get("host")}/images/${payload.file.filename}`,
  });
  return sauce
    .save()
    .then((sauce) => {
      return { message: "Sauce created successfully" };
    })
    .catch((err) => {
      throw new ErrorHandler(500, "Error in sauce creation");
    });
}

function updateSauce(payload) {
  const sauce = payload.file
    ? {
        ...JSON.parse(payload.body.sauce),
        imageUrl: `${payload.protocol}://${payload.get("host")}/images/${payload.file.filename}`,
      }
    : { ...payload.body };
  return Sauce.updateOne({ _id: payload.params.id }, { ...sauce, _id: payload.params.id })
    .then(() => {
      return { message: "Sauce updated successfully" };
    })
    .catch((err) => {
      throw new ErrorHandler(500, "Error with sauce update");
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

function updateLikes(sauce) {
  sauce.likes = sauce.usersLiked.length;
  sauce.dislikes = sauce.usersDisliked.length;
}

function likeSauce(sauceId, userInfos) {
  return Sauce.findById({ _id: sauceId })
    .exec()
    .then((sauce) => {
      return User.findUser(userInfos.userId)
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
          } else if (userInfos.like == 0) {
            sauce.usersLiked = sauce.usersLiked.filter((elem) => {
              elem !== user._id;
            });
            sauce.usersDisliked = sauce.usersDisliked.filter((elem) => {
              elem !== user._id;
            });
          }
          updateLikes(sauce);
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

module.exports = { createSauce, findAll, likeSauce, findSauce, updateSauce };
