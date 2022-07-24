const mongoose = require("mongoose");

var accTypeSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  accountTypeName: String,
  accountTypeDesc: String,
  price: String,
  included: [
    {
      type: String,
    },
  ],
  tier: String,
  active: Boolean,
});

var AccountType = (module.exports = mongoose.model(
  "account-type",
  accTypeSchema
));
module.exports.get = function (callback, limit) {
  AccountType.find(callback).limit(limit);
};
