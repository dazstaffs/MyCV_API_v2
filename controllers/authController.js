let jwt = require("jsonwebtoken");
User = require("../models/userModel");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const emailController = require("../controllers/emailController");

auth = function (req, res) {
  const email = req.body.email,
    password = req.body.password;

  User.findOne({ EmailAddress: email }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    var passwordIsValid = bcrypt.compareSync(password, user.Password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    //if user request account deletion, cancel it.
    UserAccountType.findOne(
      { userID: user._id },
      function (err, userAccountType) {
        if (err) res.send(err);
        userAccountType.deleteAccountOn = null;
        userAccountType.save(function (err) {
          if (err) res.json(err);
          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400, //24 hours
          });

          res.status(200).send({
            accessToken: token,
          });
        });
      }
    );
  });
};

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    next();
  });
};

setPassword = async (req, res) => {
  let token = req.headers["x-access-token"];
  let userID = "";
  let newPassword = bcrypt.hashSync(req.body.newpassword, 8);
  jwt.verify(token, config.secret, (err, decoded) => {
    userID = decoded.id;
  });

  User.findById(userID, function (err, user) {
    if (err) res.send(err);
    user.Password = newPassword;
    user.save(async function (err) {
      if (err) res.json(err);
      await emailController.sendPasswordChangeConfirmEmail(userID);
      res.json({
        message: "Password Reset",
      });
    });
  });
};

validToken = (req, res) => {
  return res.status(200).send({ message: "OK" });
};

getUserID = (req) => {
  let token = req.headers["x-access-token"];
  let userID = "";
  jwt.verify(token, config.secret, (err, decoded) => {
    userID = decoded.id;
  });
  return userID;
};

const authJwt = {
  auth,
  verifyToken,
  validToken,
  setPassword,
  getUserID,
};

module.exports = authJwt;
