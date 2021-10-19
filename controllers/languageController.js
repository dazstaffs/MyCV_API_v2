// Import contact model
Language = require('../models/languageModel');


// Handle index actions
exports.index = function (req, res) {
    Language.find({ IsSupported : true }, function (err, languages) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Languages retrieved successfully",
            data: languages
        });
    });
};
