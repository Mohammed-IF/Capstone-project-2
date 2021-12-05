const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const profileSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: {
        public_id: {
          type: String
        },
        url: {
          type: String,
          
        }
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      freelancerId: {
        type: Schema.Types.ObjectId,
        ref: 'Freelancer'
      },
      teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
      },
  })

  module.exports = mongoose.model('Profile', profileSchema);