const UserCredential = require("../models/userModel");
const User = require("../models/userModel");
var bcrypt = require("bcryptjs");
const AccountType = require("../models/accountTypeModel");
const UserType = require("../models/userTypeModel");

checkDuplicateUsername = (req, res, next) => {
  UserCredential.findOne({
    EmailAddress: req.body.emailAddress,
  }).exec((err, userCredential) => {
    if (err) {
      res.status(500).send({ message: err });
    }
    if (userCredential) {
      res.status(400).send({ message: "Username already in use!" });
    } else {
      next();
    }
  });
};

register = (req, res) => {
  const user = new User({
    FirstName: req.body.firstName,
    LastName: req.body.lastName,
    Town: req.body.town,
    County: req.body.county,
    HomeTelephone: req.body.homeTelephone,
    Mobile: req.body.mobile,
    EmailAddress: req.body.emailAddress,
    Password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      console.log("Error");
      res.status(500).send({ message: err });
    } else {
      setAccountType(user);
      console.log("User Created");
      res.status(200).send({ message: "User Created" });
    }
  });
};

setAccountType = (user) => {
  AccountType.findOne({
    active: true,
    tier: "T1",
    accountTypeName: "Standard",
  }).exec((err, userType) => {
    if (err) {
      console.log(err);
      return;
    } else {
      //set user account type
      const newUserType = new UserType({
        accountType: userType._id,
        userID: user._id,
      });

      newUserType.save((err, newUserType) => {
        if (err) {
          console.log("Error");
          return;
        } else {
          console.log("User Type Set");
          return;
        }
      });
    }
  });
};

const registerController = {
  checkDuplicateUsername,
  register,
};

module.exports = registerController;
