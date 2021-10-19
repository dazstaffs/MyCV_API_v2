let jwt = require('jsonwebtoken');
User = require('../models/userModel');
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");

auth = function (req, res) {
    const email = req.body.email, password = req.body.password;

    User.findOne({ EmailAddress : email })
        .exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            console.log("Becrypt")
            console.log(user)
            var passwordIsValid = bcrypt.compareSync(
                password,
                user.Password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.EmailAddress }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            console.log("200")
            res.status(200).send({
                email: 'test',
                //roles: authorities//,
                accessToken: token
            });
        })
};

verifyToken = (req, res, next) =>{
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided"});
    }

    jwt.verify(token, config.secret, (err, decoded) =>{
        if (err) {
            return res.status(401).send({ message: "Unauthorized"});
        }
        req.EmailAddress = decoded.EmailAddress;
        next();
    })
}

const authJwt = {
    auth, verifyToken
};

module.exports = authJwt;