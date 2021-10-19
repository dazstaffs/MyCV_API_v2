let router = require('express').Router();
router.get('/', function (req, res) {
    res.json({
        message: 'API is Working'
    });
});

// // Import contact controller
// var contactController = require('../controllers/contactController');
// // Contact routes
// router.route('/contacts')
//     .get(contactController.index)
//     .post(contactController.new);
// router.route('/contacts/:contact_id')
//     .get(contactController.view)
//     .patch(contactController.update)
//     .put(contactController.update)
//     .delete(contactController.delete);

var languageController = require('../controllers/languageController');
router.route('/languages')
    .get(languageController.index);

var authContrller = require('../controllers/authController');
router.route('/authenticate')
    .post(authContrller.auth);

var registerController = require('../controllers/registerController');
router.route('/register')
    .post(registerController.register);

router.route('/checkDuplicateUsername')
    .post(registerController.checkDuplicateUsername);

module.exports = router;