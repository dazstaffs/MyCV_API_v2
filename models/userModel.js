const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

var userSchema = mongoose.Schema({
  FirstName: String,
  LastName: String,
  Town: String,
  County: String,
  HomeTelephone: String,
  Mobile: String,
  EmailAddress: String,
  Password: String,
});

var User = (module.exports = mongoose.model("users", userSchema));
module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
};
