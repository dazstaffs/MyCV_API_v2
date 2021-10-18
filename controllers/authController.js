let jwt = require('jsonwebtoken');
let fs = require("fs");
User = require('../models/userCredentialModel');
var bcrypt = require("bcryptjs");

exports.auth = function (req, res) {
    //const RSA_PRIVATE_KEY = fs.readFileSync(__dirname + '/resources/MyCVPrivateKey.ppk')
    const email = req.body.email, password = req.body.password;

    User.findOne({ emailAddress : email })
        .then((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            //   var token = jwt.sign({ id: user.id }, config.secret, {
            //     expiresIn: 86400 // 24 hours
            //   });

            res.status(200).send({
                email: 'test'//,
                //roles: authorities//,
                //accessToken: token
            });
        })

};