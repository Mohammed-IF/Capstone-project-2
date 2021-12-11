var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
  title: String,
  image: {
    public_id: {
      type: String
    },
    url: {
      type: String,
      
    }
  },
  category: String,
  description: String,
  wistiaId: String,
  price: Number,
  ownByTeacher: { type: Schema.Types.ObjectId, ref: 'Teacher'},
  enrolledByStudents: [{
    user: { type: Schema.Types.ObjectId, ref: 'User'},
  }],
  totalStudents: Number,
  stars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rate',
  }]
,
comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rate'
  }]
,
});

//--------module to export database---------
module.exports = mongoose.model('Course', CourseSchema);
