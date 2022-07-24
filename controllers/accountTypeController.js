// Import contact model
AccountType = require("../models/accountTypeModel");

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
