let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = require('mongoose').Schema;


let userCredentialSchema = mongoose.Schema({
    EmailAddress: {
        type: String
    },
    Password: {
        type: String
    },
    UserID: {
        type: [Schema.Types.ObjectId]
    }
});
var UserCredential = module.exports = mongoose.model('user-credentials', userCredentialSchema);
module.exports.get = function (callback, limit) {
    UserCredential.find(callback).limit(limit);
}