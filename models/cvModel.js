const mongoose = require("mongoose");

var cvSchema = mongoose.Schema({
  userId: String,
  cvName: String,
  personalStatement: String,
  createdDate: Date,
  lastEditedDate: Date,
  isFinished: Boolean,
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

var UserCV = (module.exports = mongoose.model("user-cvs", cvSchema));
module.exports.get = function (callback, limit) {
  UserCV.find(callback).limit(limit);
};
