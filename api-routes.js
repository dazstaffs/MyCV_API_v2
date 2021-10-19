let router = require('express').Router();
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to My CV api...'
    });
});

// Import contact controller
var contactController = require('./controllers/contactController');
// Contact routes
router.route('/contacts')
    .get(contactController.index)
    .post(contactController.new);
router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);

//Language Actions
var languageController = require('./controllers/languageController');
router.route('/languages')
    .get(languageController.index);


var authContrller = require('./controllers/authController');
router.route('/authenticate')
    .post(authContrller.auth);

var registerController = require('./controllers/registerController');
router.route('/register')
    .post(registerController.register);

module.exports = router;