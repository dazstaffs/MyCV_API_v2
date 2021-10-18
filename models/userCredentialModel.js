let mongoose = require('mongoose');
mongoose.Promise = global.Promise;


let userCredentialSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    emailAddress: {
        type: String
    },
    password: {
        type: String
    },
    lastLogin: {
        type: Date
    },
    userID: {
        type: String
    }
});
var UserCredential = module.exports = mongoose.model('user-credentials', userCredentialSchema);
module.exports.get = function (callback, limit) {
    UserCredential.find(callback).limit(limit);
}