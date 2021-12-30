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

updateUser = (req, res) => {
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
      user.Password = user.Password;

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

const functions = {
  getUser,
  updateUser,
};

module.exports = functions;
