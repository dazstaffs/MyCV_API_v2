// Import contact model
AccountType = require("../models/accountTypeModel");
UserAccountType = require("../models/userTypeModel");
authService = require("../controllers/authController");
emailService = require("../controllers/emailController");

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

exports.continueUserAccountSubscription = function (req, res) {
  let userID = authService.getUserID(req);
  UserAccountType.findOne({ userID: userID }).exec((err, userAccType) => {
    if (err) {
      console.log(err);
      res.json({
        status: "error",
        message: err,
      });
    } else {
      userAccType.renew = true;
      userAccType.save(function (err) {
        if (err) res.json(err);
        res.json({
          message: "OK",
        });
      });
    }
  });
};

exports.updateUserAccountType = function (req, res) {
  let userID = authService.getUserID(req);
  AccountType.findOne({ accountTypeName: req.body.type }).exec(
    (err, accType) => {
      UserAccountType.findOne(
        { userID: userID },
        async function (err, userAccountType) {
          if (err) res.send(err);

          if (req.body.type == "Standard") {
            //When renewals are processed, set accType._id.
            userAccountType.renew = false;
            await emailService.sendAccountDowngradeEmail(userID);
          }

          if (req.body.type == "Premium") {
            //When renewals are processed, take money, set new renewal date
            userAccountType.accountType = accType._id;
            let date = new Date();
            userAccountType.renewalDate = new Date(
              date.setMonth(date.getMonth() + 1)
            );
            userAccountType.renew = true;
            await emailService.sendAccountUpgradeEmail(userID);
          }

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
              renew: userAccType.renew,
            },
          });
        }
      });
    }
  });
};

exports.confirmAccountDelete = (req, res) => {
  let userID = authService.getUserID(req);
  UserAccountType.findOne({ userID: userID }, function (err, userAccountType) {
    if (err) res.send(err);
    userAccountType.renew = false;
    let date = new Date();
    userAccountType.deleteAccountOn = new Date(
      date.setMonth(date.getMonth() + 1)
    );

    userAccountType.save(function (err) {
      if (err) res.json(err);

      res.json({
        message: "OK",
      });
    });
  });
};

exports.downgradeTodaysNonRenewals = () => {
  return new Promise((resolve, reject) => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    AccountType.findOne({ accountTypeName: "Standard" }).exec(
      (err, standardAccountType) => {
        if (err) reject(err);

        UserAccountType.updateMany(
          {
            renewalDate: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
            renew: false,
          },
          {
            $set: { accountType: standardAccountType._id },
          },
          function (err, data) {
            if (err) reject(err);
            else resolve(data);
          }
        );
      }
    );
  });
};
