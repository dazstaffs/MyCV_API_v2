const authController = require("../controllers/authController");

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/sessionValid", [authController.verifyToken], authController.validToken);
    app.post("/api/set-password", [authController.verifyToken], authController.setPassword);
}