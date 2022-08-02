const authController = require("../controllers/authController");
const cvController = require("../controllers/cvController");
const userController = require("../controllers/userController");
const accountTypeController = require("../controllers/accountTypeController");
const cvLayoutController = require("../controllers/cvLayoutController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Gets
  app.get(
    "/api/get-cvs",
    [authController.verifyToken],
    cvController.getUserCVs
  );

  app.get(
    "/api/get-user",
    [authController.verifyToken],
    userController.getUser
  );

  app.get(
    "/api/get-subscriptions",
    [authController.verifyToken],
    accountTypeController.getAccountTypes
  );

  app.get(
    "/api/get-user-subscription",
    [authController.verifyToken],
    accountTypeController.getUserAccountType
  );

  //Posts
  app.post(
    "/api/sessionValid",
    [authController.verifyToken],
    authController.validToken
  );
  app.post(
    "/api/set-password",
    [authController.verifyToken],
    authController.setPassword
  );
  app.post("/api/save-cv", [authController.verifyToken], cvController.addCV);
  app.post(
    "/api/update-cv",
    [authController.verifyToken],
    cvController.updateCV
  );

  app.post(
    "/api/update-user-subscription",
    [authController.verifyToken],
    accountTypeController.updateUserAccountType
  );

  app.post(
    "/api/get-cv-layout",
    [authController.verifyToken],
    cvLayoutController.getCVLayout
  );

  app.post(
    "/api/delete-cv",
    [authController.verifyToken],
    cvController.deleteUserCV
  );
  app.post(
    "/api/copy-cv",
    [authController.verifyToken],
    cvController.copyUserCV
  );
  app.post(
    "/api/update-user",
    [authController.verifyToken],
    userController.updateUser
  );
};
