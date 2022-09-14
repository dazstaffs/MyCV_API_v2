const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  FirstName: String,
  LastName: String,
  Town: {
    type: mongoose.Schema.Types.ObjectId,
  },
  County: {
    type: mongoose.Schema.Types.ObjectId,
  },
  HomeTelephone: String,
  Mobile: String,
  EmailAddress: String,
  Password: String,
});

var User = (module.exports = mongoose.model("users", userSchema));
module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
};
