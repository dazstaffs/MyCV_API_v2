const mongoose = require("mongoose");

var schema = mongoose.Schema({
  accountType: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

var UserAccountType = (module.exports = mongoose.model("user-type", schema));
module.exports.get = function (callback, limit) {
  UserAccountType.find(callback).limit(limit);
};
