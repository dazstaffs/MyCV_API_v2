const mongoose = require("mongoose");

var schema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
  },
  premium: {
    type: Boolean,
  },
  html: {
    type: String,
  },
  enabled: {
    type: Boolean,
  },
});

var UserAccountType = (module.exports = mongoose.model("cv-layout", schema));
module.exports.get = function (callback, limit) {
  UserAccountType.find(callback).limit(limit);
};
