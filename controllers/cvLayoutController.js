UserCVLayout = require("../models/userCVLayoutModel");
CVLayout = require("../models/cvLayoutModel");

exports.getCVLayout = (req, res) => {
  UserCVLayout.findOne({ cvID: req.body.cvid }, function (err, layouts) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      res.json({
        status: "success",
        message: "cv layouts retrieved successfully",
        data: layouts,
      });
    }
  });
};

exports.getAllCVLayouts = (req, res) => {
  console.log("Getting all layouts");
  CVLayout.find(function (err, layout) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      res.json({
        status: "success",
        message: "user cv layout retrieved successfully",
        data: layout,
      });
    }
  });
};

exports.setCVLayout = (req, res) => {
  UserCVLayout.findOneAndUpdate(
    { cvID: req.body.cvid },
    { $set: { layoutID: req.body.newTemplate } },
    { upsert: true },
    function (err, doc) {
      if (err) {
        res.json({
          status: "error",
          message: err,
        });
      } else {
        res.json({
          status: "success",
          message: "user cv layout retrieved successfully",
          data: doc,
        });
      }
    }
  );
};
