CV = require("../models/cvModel");
authService = require("../controllers/authController");

addCV = (req, res) => {
  let cv = new CV();
  cv.userId = authService.getUserID(req);
  cv.cvName = req.body.cvName;
  cv.personalStatement = req.body.personalStatement;
  cv.employmentHistory = req.body.employmentHistory;
  cv.education = req.body.education;
  cv.skills = req.body.skills;
  cv.hobbiesStatement = req.body.hobbiesStatement;

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

getUserCV = (req, res) => {
  let userId = authService.getUserID(req);
  let cvID = req.body;
  CV.find({ UserId: userId, _id: cvID }).exec((err, cv) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }
    res.json({
      status: "success",
      message: "CV retrieved",
      data: cv,
    });
  });
};

copyUserCV = (req, res) => {
  let userId = authService.getUserID(req);
  let cvID = req.body;
  CV.find({ UserId: userId, _id: cvID }).exec((err, cv) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }
    res.json({
      status: "success",
      message: "CV Copied",
      data: cv,
    });
  });
};

deleteUserCV = (req, res) => {
  let userId = authService.getUserID(req);
  let cvID = req.body.cvID;
  console.log(cvID);
  CV.find({ UserId: userId, _id: cvID }).exec((err, cv) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      CV.deleteOne(
        {
          _id: cvID,
        },
        function (err, cv) {
          if (err) res.send(err);
          res.json({
            status: "success",
            message: "CV Deleted",
          });
        }
      );
    }
  });
};

const methods = {
  addCV,
  getUserCVs,
  getUserCV,
  copyUserCV,
  deleteUserCV,
};

module.exports = methods;
