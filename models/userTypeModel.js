const mongoose = require("mongoose");

var schema = mongoose.Schema({
  accountType: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  renewalDate: {
    type: mongoose.Schema.Types.Date,
    required: false,
  },
  deleteAccountOn: {
    type: mongoose.Schema.Types.Date,
    required: false,
  },
  renew: {
    type: mongoose.Schema.Types.Boolean,
    required: false,
  },
});

var UserAccountType = (module.exports = mongoose.model("user-type", schema));
module.exports.get = function (callback, limit) {
  UserAccountType.find(callback).limit(limit);
};
