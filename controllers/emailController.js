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

sendEmail = async (req, res, emailAddress, subject, html) => {
  let transporter = await getTestAccount();

  // send mail with defined transport object
  let info = await transporter
    .sendMail({
      from: '"My Admin" <admin@mycv.com>',
      to: emailAddress,
      subject: subject,
      html: html,
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "Unable to send email. Server error." });
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
    let sendEmailResult = await sendEmail(
      req,
      res,
      emailAddress,
      subject,
      html
    );

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
    let sendEmailResult = await sendEmail(
      req,
      res,
      emailAddress,
      subject,
      html
    );

    consoleLogResult(sendEmailResult);

    return res.status(200).send({
      message: `Delete Account Email Sent. Reference: ${sendEmailResult.messageId}`,
    });
  });
};
