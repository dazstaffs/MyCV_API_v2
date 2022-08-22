const User = require("../models/userModel");
authService = require("../controllers/authController");
var bcrypt = require("bcryptjs");
const emailController = require("../controllers/emailController");

exports.getUser = (req, res) => {
  let userID = authService.getUserID(req);
  User.findOne({ _id: userID }).exec((err, user) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      res.json({
        status: "success",
        message: "User Found",
        data: user,
      });
    }
  });
};

exports.updateUser = (req, res) => {
  let userID = authService.getUserID(req);
  User.findById(userID, function (err, user) {
    if (err) res.send(err);
    else {
      user.FirstName = req.body.firstName;
      user.LastName = req.body.lastName;
      user.Town = req.body.town;
      user.County = req.body.county;
      user.HomeTelephone = req.body.homeTelephone;
      user.Mobile = req.body.mobile;
      user.EmailAddress = user.EmailAddress;
      user.save(function (err) {
        if (err) res.json(err);
        res.json({
          status: "Success",
          message: "User Info updated",
        });
      });
    }
  });
};

exports.updateUserPassword = (req, res) => {
  let userID = authService.getUserID(req);
  let newPassword = bcrypt.hashSync(req.body.newPassword, 8);

  User.findById(userID, function (err, user) {
    if (err) res.send(err);

    var passwordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      user.Password
    );

    if (!passwordIsValid) {
      res.json({
        message: "Current Password Incorrect",
      });
      return;
    } else {
      user.Password = newPassword;
      user.save(async function (err) {
        if (err) res.json(err);
        await emailController.sendPasswordChangeConfirmEmail(userID);
        res.json({
          status: "Success",
        });
      });
    }
  });
};
