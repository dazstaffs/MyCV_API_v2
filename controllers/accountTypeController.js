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

exports.updateUserAccountType = function (req, res) {
  let userID = authService.getUserID(req);
  AccountType.findOne({ accountTypeName: req.body.type }).exec(
    (err, accType) => {
      UserAccountType.findOne(
        { userID: userID },
        function (err, userAccountType) {
          if (err) res.send(err);

          let renewalDate = null;
          if (req.body.type == "Premium") {
            let date = new Date();
            renewalDate = new Date(date.setMonth(date.getMonth() + 1));
          }

          userAccountType.accountType = accType._id;
          userAccountType.renewalDate = renewalDate;
          userAccountType.save(function (err) {
            if (err) res.json(err);
            res.json({
              message: "OK",
            });
          });
        }
      );
    }
  );
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
            data: {
              accountTypeName: accType.accountTypeName,
              renewalDate: userAccType.renewalDate,
            },
          });
        }
      });
    }
  });
};
