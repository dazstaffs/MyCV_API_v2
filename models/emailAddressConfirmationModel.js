const mongoose = require("mongoose");

var emailConfirmationSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
  },
});

var EmailConfirmation = (module.exports = mongoose.model(
  "user-email-confirmation",
  emailConfirmationSchema
));
module.exports.get = function (callback, limit) {
  EmailConfirmation.find(callback).limit(limit);
};
