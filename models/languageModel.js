var mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
// Setup schema
var languageSchema = mongoose.Schema({
    LanguageName: {
        type: String,
        required: true
    },
    LanguageCode: {
        type: String,
        required: true
    },
    IsSupported: {
        type: Boolean,
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