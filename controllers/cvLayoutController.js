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

exports.getPremiumCVLayouts = () => {
  return new Promise((resolve, reject) => {
    CVLayout.find(
      {
        premium: true,
      },
      {
        _id: 1,
      }
    ).exec((err, premiumTemplates) => {
      if (err) reject(err);
      else {
        resolve(premiumTemplates);
      }
    });
  });
};

exports.downgradePremiumToStandardTemplates = (cvIDs, premiumLayoutIDs) => {
  return new Promise(async (resolve, reject) => {
    let cvSimpleArray = cvIDs.map((cvIDS) => {
      return cvIDS["_id"];
    });
    let premiumLayoutsArray = premiumLayoutIDs.map((premiumLayouts) => {
      return premiumLayouts["_id"];
    });
    let defaultTemplate = await getDefaultStandardTemplate().then(
      (template) => template
    );
    UserCVLayout.updateMany(
      {
        cvID: { $in: cvSimpleArray },
        layoutID: { $in: premiumLayoutsArray },
      },
      {
        $set: { layoutID: defaultTemplate },
      }
    ).exec((err, result) => {
      if (err) reject(err);
      else {
        resolve(result);
      }
    });
  });
};

getDefaultStandardTemplate = () => {
  return new Promise((resolve, reject) => {
    CVLayout.findOne(
      {
        default: true,
      },
      {
        _id: 1,
      }
    ).exec((err, layout) => {
      if (err) reject(err);
      else {
        resolve(layout);
      }
    });
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

exports.deleteLayoutsByCVID = (userCVIdsForDeletion) => {
  return new Promise((resolve, reject) => {
    let array = userCVIdsForDeletion.map((objectID) => {
      return objectID["_id"];
    });
    console.log(array);
    UserCVLayout.deleteMany({
      cvID: {
        $in: array,
      },
    }).exec((err, confirmation) => {
      if (err) reject(err);
      else {
        resolve(confirmation);
      }
    });
  });
};
