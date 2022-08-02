const mongoose = require("mongoose");

var schema = mongoose.Schema({
  cvID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  layoutID: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

var UserAccountType = (module.exports = mongoose.model(
  "user-cv-layout",
  schema
));
module.exports.get = function (callback, limit) {
  UserAccountType.find(callback).limit(limit);
};
