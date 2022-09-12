const nodemailer = require("nodemailer");
let jwt = require("jsonwebtoken");
User = require("../models/userModel");
const config = require("../config/auth.config");
const authService = require("../controllers/authController");

getTestAccount = async () => {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
};

sendEmail = async (emailAddress, subject, html) => {
  let transporter = await getTestAccount();
  let info = await transporter
    .sendMail({
      from: '"My Admin" <admin@mycv.com>',
      to: emailAddress,
      subject: subject,
      html: html,
    })
    .catch((err) => {
      throw err;
    });
  return info;
};

getTokenExpiringIn30Minutes = (user) => {
  let token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 1800, //30 mins in seconds
  });
  return token;
};

consoleLogResult = (sendEmailResult) => {
  console.log("Message sent: %s", sendEmailResult.messageId);

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(sendEmailResult));
  return;
};

exports.sendPasswordResetEmail = async (req, res) => {
  let emailAddress = req.body.email;

  User.findOne({ EmailAddress: emailAddress }).exec(async (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user) {
      return res.status(404).send({ message: "Email Address Not Found." });
    }

    let token = getTokenExpiringIn30Minutes(user);
    let html =
      "<b>Password Reset</b><p>We have received your request for a password reset. " +
      "Please click on this link to be redirected to do your password reset:" +
      `<a href='http://localhost:4200/welcome/set-password/${token}'>Reset Password</a></p>`;
    let subject = "We have received your request...";
    let sendEmailResult = await sendEmail(emailAddress, subject, html);

    consoleLogResult(sendEmailResult);

    return res.status(200).send({
      message: `Reset Email Sent. Reference: ${sendEmailResult.messageId}`,
    });
  });
};

exports.sendDeleteAccountEmail = async (req, res) => {
  let userID = authService.getUserID(req);
  //cancel any renews
  User.findOne({ _id: userID }).exec(async (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    let emailAddress = user.EmailAddress;
    let token = getTokenExpiringIn30Minutes(user);
    let html =
      "<b>Delete My CV Account</b><p>We have received your request to delete your My CV account " +
      "Please click here to confirm your account deletion:" +
      `<a href='http://localhost:4200/manage/delete-account/${token}'>Confirm Account Deletion</a></p>`;

    let subject = "Confirm MY CV Account Deletion";
    let sendEmailResult = await sendEmail(emailAddress, subject, html);

    consoleLogResult(sendEmailResult);

    return res.status(200).send({
      message: `Delete Account Email Sent. Reference: ${sendEmailResult.messageId}`,
    });
  });
};

exports.sendPasswordChangeConfirmEmail = async (userID) => {
  User.findOne({ _id: userID }).exec(async (err, user) => {
    if (err) {
      throw err;
    }

    if (!user) {
      throw err;
    }

    let emailAddress = user.EmailAddress;
    let html =
      `<p>Dear ${user.FirstName}</p><p>We are emailing to confirm that you changed your My CV password. If this was not you, we would advise you change your password ASAP using this link: ` +
      `<a href='http://localhost:4200/welcome/reset-password'>Change Password</a></p>`;

    let subject = "My CV - Your Password Has Been Changed";
    let sendEmailResult = await sendEmail(emailAddress, subject, html);

    consoleLogResult(sendEmailResult);
    return;
  });
};

exports.sendAccountUpgradeEmail = async (userID) => {
  User.findOne({ _id: userID }).exec(async (err, user) => {
    if (err) {
      throw err;
    }

    if (!user) {
      throw err;
    }

    let date = new Date();
    let renewalDate = new Date(date.setMonth(date.getMonth() + 1));

    let emailAddress = user.EmailAddress;
    let html =
      `<p>Dear ${user.FirstName}</p>` +
      `<p>Thank you for upgrading to our Premium membership package. We hope you enjoy your new features. Your membership will auto-renew on the same day of each month, but you can cancel this at any time within the accounts page on the My CV website.</p>` +
      `<p>Your next auto-renewal will be: ${renewalDate}</p>` +
      "<p>Many Thanks</p>" +
      "<p>The My CV Team</p>";

    let subject = "My CV - Thank You For Upgrading";
    let sendEmailResult = await sendEmail(emailAddress, subject, html);

    consoleLogResult(sendEmailResult);
    return;
  });
};

exports.sendAccountDowngradeEmail = async (userID) => {
  User.findOne({ _id: userID }).exec(async (err, user) => {
    if (err) {
      throw err;
    }

    if (!user) {
      throw err;
    }

    let emailAddress = user.EmailAddress;
    let html =
      `<p>Dear ${user.FirstName}</p>` +
      `<p>We are just emailing to confirm your account will be changed back to the Standard account package at your next auto-renewal. You can continue to enjoy your current benefits until that date. If you change your mind, you can continue your current membership package from within the accounts page on the My CV website.</p>` +
      "<p>Many Thanks</p>" +
      "<p>The My CV Team</p>";

    let subject = "My CV - Your Account Type Change";
    let sendEmailResult = await sendEmail(emailAddress, subject, html);

    consoleLogResult(sendEmailResult);
    return;
  });
};

exports.sendEmailAddressConfirmationEmail = async (
  emailConfirmationID,
  emailAddress
) => {
  return new Promise(async (resolve, reject) => {
    let token = jwt.sign(
      {
        emailConfirmationID: emailConfirmationID,
      },
      config.secret,
      {
        expiresIn: 1800, //30 mins in seconds
      }
    );
    let subject = "My CV - Confirm Email Address";
    let html =
      "<p>Thank you for registering with My CV. Please confirm your email address using the following link:</p>" +
      `<p><a href='http://localhost:4200/welcome/login?registerEmailAddress=${token}'>Confirm Email Address</a></p>`;
    let sendEmailResult = await sendEmail(emailAddress, subject, html);
    consoleLogResult(sendEmailResult);
    resolve();
  });
};
