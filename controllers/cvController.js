CV = require("../models/cvModel");
authService = require("../controllers/authController");
const mongoose = require("mongoose");

addCV = (req, res) => {
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

  cv.save(function (err) {
    if (err) {
      res.status(401).send({ err });
    } else {
      res.status(201).send({
        message: "CV Saved",
        data: cv,
      });
    }
  });
};

getUserCVs = (req, res) => {
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

copyUserCV = (req, res) => {
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
          console.log(newCV);
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

deleteUserCV = (req, res) => {
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

const methods = {
  addCV,
  getUserCVs,
  copyUserCV,
  deleteUserCV,
};

module.exports = methods;
