var mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
// Setup schema
var languageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    _id: {
        type: [Schema.Types.ObjectId]
    }
});
// Export Contact model
var Language = module.exports = mongoose.model('language', languageSchema);
module.exports.get = function (callback, limit) {
    Language.find(callback).limit(limit);
}