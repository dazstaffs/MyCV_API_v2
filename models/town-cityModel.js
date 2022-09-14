var mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
// Setup schema
var townSchema = mongoose.Schema({
  Town: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
  Supported: {
    type: Boolean,
    required: true,
  },
  _id: {
    type: [Schema.Types.ObjectId],
  },
});
// Export Contact model
var town = (module.exports = mongoose.model("towns", townSchema));
module.exports.get = function (callback, limit) {
  town.find(callback).limit(limit);
};
