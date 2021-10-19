const UserCredential = require('../models/userModel');
const User =  require('../models/userModel');
var bcrypt = require("bcryptjs");

checkDuplicateUsername = (req, res) => {
    UserCredential.findOne({
        EmailAddress: req.body.emailAddress
    })
    .exec((err,userCredential) => {
        if (err) {
            res.status(500).send({ message: err});
        }
        if (userCredential) {
            res.status(400).send({ message: "Username already in use!"})
        }
        else{
            res.status(200).send({ message: "Username free for use"});
        }
    });
}

register = (req, res) => {
    const user = new User({
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Town: req.body.town,
        County: req.body.county,
        PostCode: req.body.postCode,
        HomeTelephone: req.body.homeTelephone,
        Mobile: req.body.mobile,
        EmailAddress: req.body.emailAddress,
        Password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
           res.status(500).send({ message: err}); 
        }
        else{
            res.status(200).send({ message: "User Created"});
        }
    });
}

const registerController = {
    checkDuplicateUsername,
    register
};

module.exports = registerController;