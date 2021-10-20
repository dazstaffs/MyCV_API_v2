const controller = require("../controllers/languageController");
const authController = require("../controllers/authController");

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/languages", [authController.verifyToken], controller.index);
}