// Import contact model
AccountType = require("../models/accountTypeModel");
UserAccountType = require("../models/userTypeModel");
authService = require("../controllers/authController");

// Handle index actions
exports.getAccountTypes = function (req, res) {
  AccountType.find({ active: true, tier: "T1" }, function (err, accTypes) {
    if (err) {
      console.log(err);
      res.json({
        status: "error",
        message: err,
      });
    }

    res.json({
      status: "success",
      message: "account types retrieved successfully",
      data: accTypes,
    });
  });
};

exports.getUserAccountType = function (req, res) {
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
          res.json({
            status: "success",
            message: "user account retrieved",
            data: accType.accountTypeName,
          });
        }
      });
    }
  });
};
