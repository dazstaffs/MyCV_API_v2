const authController = require("../controllers/authController");
const cvController = require("../controllers/cvController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

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
  app.get(
    "/api/get-cvs",
    [authController.verifyToken],
    cvController.getUserCVs
  );
};
