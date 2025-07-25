const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

var cvSchema = mongoose.Schema({
  userId: String,
  cvName: String,
  personalStatement: String,
  createdDate: Date,
  lastEditedDate: Date,
  isFinished: Boolean,
  employmentHistory: [],
  education: [],
  skills: [],
  hobbiesStatement: String,
});

var UserCV = (module.exports = mongoose.model("user-cvs", cvSchema));
module.exports.get = function (callback, limit) {
  UserCV.find(callback).limit(limit);
};
