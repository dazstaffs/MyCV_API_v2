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
      message: "CVs retrieved successfully",
      data: cvs,
    });
  });
};

const methods = {
  addCV,
  getUserCVs,
};

module.exports = methods;
