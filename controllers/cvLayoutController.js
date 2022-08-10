UserCVLayout = require("../models/userCVLayoutModel");
CVLayout = require("../models/cvLayoutModel");
AccountType = require("../models/accountTypeModel");
UserAccountType = require("../models/userTypeModel");

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

exports.getUserCVLayouts = (req, res) => {
  let userId = authService.getUserID(req);
  UserAccountType.findOne({ userID: userId }).exec((err, userAccType) => {
    if (err) {
      console.log(err);
      res.json({
        status: "error",
        message: err,
      });
    } else {
      AccountType.findOne({ _id: userAccType.accountType }, (err2, accType) => {
        if (err2) {
          console.log(err);
          res.json({
            status: "error",
            message: err,
          });
        } else {
          let premium = accType.accountTypeName == "Premium" ? true : false;
          if (premium) {
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
            return;
          } else {
            CVLayout.find({ premium: false }, function (err, layout) {
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
            return;
          }
        }
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
