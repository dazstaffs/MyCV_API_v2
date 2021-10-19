let mongoose = require('mongoose');
mongoose.Promise = global.Promise;


let userCredentialSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    EmailAddress: {
        type: String
    },
    Password: {
        type: String
    },
    LastLogin: {
        type: Date
    },
    UserID: {
        type: String
    }
});
var UserCredential = module.exports = mongoose.model('user-credentials', userCredentialSchema);
module.exports.get = function (callback, limit) {
    UserCredential.find(callback).limit(limit);
}