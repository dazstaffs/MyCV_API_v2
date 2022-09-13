const UserCredential = require("../models/userModel");
const User = require("../models/userModel");
var bcrypt = require("bcryptjs");
const AccountType = require("../models/accountTypeModel");
const UserType = require("../models/userTypeModel");
const UserEmailConfirmation = require("../models/emailAddressConfirmationModel");
const EmailController = require("./emailController");
const config = require("../config/auth.config");
let jwt = require("jsonwebtoken");

exports.checkDuplicateUsername = (req, res, next) => {
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

exports.register = (req, res) => {
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

  user.save(async (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err });
    } else {
      setAccountType(user);
      let emailConf = await setEmailAddressUnconfirmed(user);
      await EmailController.sendEmailAddressConfirmationEmail(
        emailConf._id,
        user.EmailAddress
      );
      res.status(200).send({ message: "User Created" });
    }
  });
};

setEmailAddressUnconfirmed = (user) => {
  return new Promise((resolve, reject) => {
    const userEmailConfirmation = new UserEmailConfirmation({
      userID: user._id,
      emailConfirmed: false,
    });

    userEmailConfirmation.save((err, emailConfirmation) => {
      if (err) {
        reject(err);
      } else {
        resolve(emailConfirmation);
      }
    });
  });
};

exports.resendEmailConfirmationLink = (req, res) => {
  //Find users ID
  User.findOne({ EmailAddress: req.body.email }).exec(async (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    UserEmailConfirmation.findOne({ userID: user._id }).exec(
      async (err, result) => {
        if (err) {
          return res.status(500).send({ message: err });
        } else {
          if (result == undefined || result == null) {
            let newConf = await setEmailAddressUnconfirmed(user);
            await EmailController.sendEmailAddressConfirmationEmail(
              newConf._id,
              req.body.email
            );
          } else {
            await EmailController.sendEmailAddressConfirmationEmail(
              result._id,
              req.body.email
            );
          }
          res.status(200).send({ message: "Confirmation Email Sent" });
        }
      }
    );
  });

  //Use UserEmailConfirmationIDinNewEmail
};

exports.setEmailAddressConfirmed = (req, res) => {
  let emailConfID = "";
  jwt.verify(req.body.token, config.secret, (err, decoded) => {
    emailConfID =
      decoded.emailConfirmationID == undefined
        ? ""
        : decoded.emailConfirmationID;
  });

  UserEmailConfirmation.updateOne(
    { _id: emailConfID },
    { $set: { emailConfirmed: true } }
  ).exec((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err });
    } else {
      console.log(result);
      res.status(200).send({ message: "OK" });
    }
  });
};

exports.checkUserEmailAddressConfirmed = (userID) => {
  return new Promise((resolve, reject) => {
    UserEmailConfirmation.findOne({ userID: userID }).exec((err, conf) => {
      if (err) reject(err);
      else {
        resolve(conf);
      }
    });
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
          return;
        }
      });
    }
  });
};
