const langController = require("../controllers/languageController");
const registerController = require("../controllers/registerController");
const authController = require("../controllers/authController");
const emailController = require("../controllers/emailController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/languages", langController.index);
  app.post(
    "/api/register",
    [registerController.checkDuplicateUsername],
    registerController.register
  );
  app.post("/api/authenticate", authController.auth);
  app.post(
    "/api/sendPasswordResetEmail",
    emailController.sendPasswordResetEmail
  );
  app.post(
    "/api/user-confirming-email-address",
    registerController.setEmailAddressConfirmed
  );
};
