var Sauce = require("../models/sauce.js");
var User = require("./user.js");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../helpers/error.js");
const { nextTick } = require("process");
require("dotenv").config();

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

function deleteImagefromSauce(sauce) {
  const filename = sauce.imageUrl.split("/images/")[1];
  try {
    fs.unlinkSync(`images/${filename}`);
  } catch {
    throw new ErrorHandler(500, "Cannot delete image");
  }
}

function updateSauce(payload) {
  return findSauce(payload.params.id).then((previousSauce) => {
    if (payload.file) deleteImagefromSauce(previousSauce);
    const sauce = payload.file
      ? {
          ...JSON.parse(payload.body.sauce),
          imageUrl: `${payload.protocol}://${payload.get("host")}/images/${payload.file.filename}`,
        }
      : { ...payload.body };
    return Sauce.updateOne({ _id: previousSauce._id }, { ...sauce, _id: previousSauce._id })
      .then(() => {
        return { message: "Sauce updated successfully" };
      })
      .catch((err) => {
        throw new ErrorHandler(500, "Error with sauce update");
      });
  });
}

function deleteSauce(sauceId, token) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return findSauce(sauceId).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    if (sauce.userId.toString() !== decodedToken.userId) {
      throw new ErrorHandler(403, "Unauthorized request");
    }
    try {
      fs.unlinkSync(`images/${filename}`);
      return Sauce.deleteOne({ _id: sauceId })
        .then(() => {
          return { message: "Sauce delete succeeded" };
        })
        .catch((error) => {
          throw new ErrorHandler(500, "Error with sauce deletion");
        });
    } catch {
      throw new ErrorHandler(500, "Error with sauce deletion");
    }
  });
}

function findSauce(sauceId) {
  return Sauce.findById(sauceId)
    .exec()
    .then((sauce) => {
      return sauce;
    })
    .catch((err) => {
      throw new ErrorHandler(404, `Cannot find sauce with id: ${sauceId}`);
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
  return Sauce.findById({ _id: sauceId })
    .exec()
    .then((sauce) => {
      return User.findUser(userInfos.userId)
        .then((user) => {
          if (userInfos.like == 1 && !sauce.usersLiked.includes(user._id)) {
            sauce.usersLiked.push(user);
            sauce.usersDisliked = sauce.usersDisliked.filter((elem) => !elem.equals(user._id));
          } else if (userInfos.like == -1 && !sauce.usersDisliked.includes(user._id)) {
            sauce.usersDisliked.push(user);
            sauce.usersLiked = sauce.usersLiked.filter((elem) => !elem.equals(user._id));
          } else if (userInfos.like == 0) {
            sauce.usersLiked = sauce.usersLiked.filter((elem) => !elem.equals(user._id));
            sauce.usersDisliked = sauce.usersDisliked.filter((elem) => !elem.equals(user._id));
          }
          sauce.likes = sauce.usersLiked.length;
          sauce.dislikes = sauce.usersDisliked.length;
          sauce.save();
          return { message: "Like status updated successfully" };
        })
        .catch((err) => {
          throw new ErrorHandler(404, `Cannot find user with email: ${userInfos.email}`);
        });
    })
    .catch((err) => {
      throw new ErrorHandler(404, `Cannot find sauce with id: ${sauceId}`);
    });
}

module.exports = { createSauce, findAll, likeSauce, findSauce, updateSauce, deleteSauce };
