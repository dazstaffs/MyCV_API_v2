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

exports.getUserAccountType = async function (req, res) {
  let userId = authService.getUserID(req);
  await exports
    .getUserAccountType2(userId)
    .then((resp) => {
      res.json({
        status: "success",
        message: "user account retrieved",
        data: resp,
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: err,
      });
    });
};

exports.getUserAccountType2 = async function (userId) {
  return new Promise((resolve, reject) => {
    UserAccountType.findOne({ userID: userId }).exec((err, userAccType) => {
      if (err) {
        reject(err);
      } else {
        AccountType.findOne(
          { _id: userAccType.accountType },
          (err2, accType) => {
            if (err2) {
              reject(err2);
            } else {
              let data = {
                accountTypeName: accType.accountTypeName,
                renewalDate: userAccType.renewalDate,
                renew: userAccType.renew,
              };
              resolve(data);
            }
          }
        );
      }
    });
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

exports.getTodaysNonRenewals = () => {
  return new Promise((resolve, reject) => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);
    UserAccountType.find(
      {
        renewalDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        renew: false,
      },
      {
        _id: 0,
        userID: 1,
      }
    ).exec((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.downgradeTodaysNonRenewals = (userIDs) => {
  return new Promise((resolve, reject) => {
    let userIDArray = userIDs.map((user) => {
      return user["userID"];
    });
    AccountType.findOne({ accountTypeName: "Standard" }).exec(
      (err, standardAccountType) => {
        if (err) reject(err);
        UserAccountType.updateMany(
          {
            userID: { $in: userIDArray },
          },
          {
            $set: { accountType: standardAccountType._id },
          }
        ).exec((err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }
    );
  });
};

exports.getTodaysDeletions = () => {
  return new Promise((resolve, reject) => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);
    UserAccountType.find(
      {
        deleteAccountOn: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
      {
        _id: 0,
        userID: 1,
      }
    ).exec((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.getTodaysRenewals = () => {
  return new Promise((resolve, reject) => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);
    UserAccountType.find(
      {
        renewalDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        renew: true,
      },
      {
        _id: 0,
        userID: 1,
      }
    ).exec((err, users) => {
      if (err) reject(err);
      else {
        resolve(users);
      }
    });
  });
};

exports.deleteUserTypesByUserID = (UserIDs) => {
  return new Promise((resolve, reject) => {
    let userIDArray = UserIDs.map((userID) => {
      return userID["userID"];
    });
    UserAccountType.deleteMany({
      userID: { $in: userIDArray },
    }).exec((err, confirmation) => {
      if (err) reject(err);
      else {
        resolve(confirmation);
      }
    });
  });
};

exports.renewMonthlyUsers = (UserIDs) => {
  return new Promise((resolve, reject) => {
    let userIDArray = UserIDs.map((userID) => {
      return userID["userID"];
    });
    let date = new Date();
    let renewalDate = date.setMonth(date.getMonth() + 1);
    UserAccountType.updateMany(
      {
        userID: { $in: userIDArray },
      },
      {
        $set: { renewalDate: renewalDate },
      }
    ).exec((err, confirmation) => {
      if (err) reject(err);
      else {
        resolve(confirmation);
      }
    });
  });
};
