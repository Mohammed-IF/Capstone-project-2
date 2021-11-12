const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const teacherSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now
  },
  resetToken: String,
  resetTokenExpiration: Date,
  //facebook: String,
  tokens: Array,
 // role: String,
  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  //-------Courses that teacher is teaching-------------
  coursesTeach: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course'}
  }],


  //--------Courses that teacher is taking-------------
  
  revenue: [{
    money: Number
  }],
  cart: {
    items: [
      {
        postedServiceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'PostedService'
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
  
});

module.exports = mongoose.model('Teacher', teacherSchema);
