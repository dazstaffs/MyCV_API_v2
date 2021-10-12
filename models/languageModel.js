var mongoose = require('mongoose');
// Setup schema
var languageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number
    }
});
// Export Contact model
var Language = module.exports = mongoose.model('language', languageSchema);
module.exports.get = function (callback, limit) {
    Language.find(callback).limit(limit);
}