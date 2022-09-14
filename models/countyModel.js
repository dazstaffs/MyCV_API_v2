var mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
// Setup schema
var countySchema = mongoose.Schema({
  County: {
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
var county = (module.exports = mongoose.model("counties", countySchema));
module.exports.get = function (callback, limit) {
  county.find(callback).limit(limit);
};
