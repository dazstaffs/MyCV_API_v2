CV = require("../models/cvModel");

addCV = (req, res) => {
  let cv = new CV();
  cv.cvName = req.body.cvName;
  cv.personalStatement = req.body.personalStatement;
  cv.employmentHistory = req.body.employmentHistory;
  cv.education = req.body.education;
  cv.skills = req.body.skills;
  cv.hobbiesStatement = req.body.hobbiesStatement;

  cv.save(function (err) {
    if (err) res.json(err);
    else
      res.json({
        message: "New contact created!",
        data: cv,
      });
  });
};

const methods = {
  addCV,
};

module.exports = methods;
