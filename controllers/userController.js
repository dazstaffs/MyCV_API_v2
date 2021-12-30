const User = require("../models/userModel");
authService = require("../controllers/authController");

getUser = (req, res) => {
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

const functions = {
  getUser,
};

module.exports = functions;
