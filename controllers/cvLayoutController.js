UserCVLayout = require("../models/userCVLayoutModel");

exports.getCVLayout = (req, res) => {
  UserCVLayout.findOne({ cvID: req.body.cvid }, function (err, layout) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      res.json({
        status: "success",
        message: "user cv layout retrieved successfully",
        data: layout,
      });
    }
  });
};
