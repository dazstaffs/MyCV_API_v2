const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

var cvSchema = mongoose.Schema({
  cvName: String,
  personalStatement: String,
  employmentHistory: [
    // {
    //   employerName: '',
    //   jobTitle: '',
    //   startDate: '2021-12-04T21:35:50.047Z',
    //   endDate: '2021-12-04T21:35:50.047Z',
    //   achievements: [Array]
    // }
  ],
  education: [
    // {
    //   institutionName: '',
    //   level: '',
    //   courseName: '',
    //   grade: '',
    //   startDate: '2021-12-04T21:35:50.047Z',
    //   endDate: '2021-12-04T21:35:50.047Z',
    //   achievements: []
    // }
  ],
  skills: [
    // { skillName: '', experienceID: 0 }
  ],
  hobbiesStatement: String,
});

var User = (module.exports = mongoose.model("user-cv", cvSchema));
module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
};
