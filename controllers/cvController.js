CV = require("../models/cvModel");
authService = require("../controllers/authController");
const e = require("cors");
const mongoose = require("mongoose");

exports.addCV = (req, res) => {
  let cv = new CV();
  cv.userId = authService.getUserID(req);
  cv.cvName = req.body.cvName;
  cv.personalStatement = req.body.personalStatement;
  cv.employmentHistory = req.body.employmentHistory;
  cv.education = req.body.education;
  cv.skills = req.body.skills;
  cv.hobbiesStatement = req.body.hobbiesStatement;
  cv.createdDate = req.body.createdDate;
  cv.lastEditedDate = req.body.lastEditedDate;
  cv.isFinished = req.body.isFinished;

  cv.save(function (err, newCV) {
    if (err) {
      res.status(401).send({ err });
    } else {
      res.status(201).send({
        message: "CV Saved",
        data: newCV,
      });
    }
  });
};

exports.updateCV = (req, res) => {
  let userId = authService.getUserID(req);
  let cvID = req.body._id;
  CV.findOne({ UserId: userId, _id: cvID }).exec((err, cv) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      cv.cvName = req.body.cvName;
      cv.personalStatement = req.body.personalStatement;
      cv.employmentHistory = req.body.employmentHistory;
      cv.education = req.body.education;
      cv.skills = req.body.skills;
      cv.hobbiesStatement = req.body.hobbiesStatement;
      cv.lastEditedDate = new Date();
      cv.save(function (err, newCV) {
        if (err) {
          res.json({
            status: "error",
            message: err,
          });
        } else {
          res.json({
            status: "success",
            message: "CV Updated",
            data: newCV,
          });
        }
      });
    }
  });
};

exports.getUserCVs = (req, res) => {
  let userId = authService.getUserID(req);
  CV.find({ UserId: userId }).exec((err, cvs) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }
    res.json({
      status: "success",
      message: "CVs retrieved",
      data: cvs,
    });
  });
};

exports.getUserCVsByUserIDs = (userIDs) => {
  var userIDArray = userIDs.map(function (item) {
    return item["userID"];
  });
  return new Promise((resolve, reject) => {
    CV.find(
      {
        userId: {
          $in: userIDArray,
        },
      },
      {
        _id: 1,
      }
    ).exec((err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

exports.deleteUserCVsByID = (CVIDs) => {
  return new Promise((resolve, reject) => {
    var CVIDArray = CVIDs.map(function (item) {
      return item["_id"];
    });
    CV.deleteMany({
      _id: {
        $in: CVIDArray,
      },
    }).exec((err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

exports.copyUserCV = (req, res) => {
  let userId = authService.getUserID(req);
  let cvID = req.body.cvID;
  CV.findOne({ UserId: userId, _id: cvID }).exec((err, cv) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      cv._id = mongoose.Types.ObjectId();
      cv.isNew = true;
      cv.cvName = cv.cvName + " - Copy";
      cv.createdDate = new Date();
      cv.lastEditedDate = null;
      cv.save(function (err, newCV) {
        if (err) {
          res.json({
            status: "error",
            message: err,
          });
        } else {
          res.json({
            status: "success",
            message: "CV copied",
            data: newCV,
          });
        }
      });
    }
  });
};

exports.deleteUserCV = (req, res) => {
  let userId = authService.getUserID(req);
  let cvID = req.body.cvID;
  CV.findOneAndDelete({ UserId: userId, _id: cvID }).exec((err, cv) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      res.json({
        status: "success",
        message: "CV Copied",
      });
    }
  });
};
