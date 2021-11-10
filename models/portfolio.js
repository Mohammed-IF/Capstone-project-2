const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var portfolioSchema = new Schema({
  portfolioNumber: {
    type: Number,
    required: true
  },
  previousWork: {
    type: String,
    required: true
  },  
  yearsOfExperinece: {
    type: Number,
    required: true
  },  
  description: {
        type: String,
        required: true
  },
  image: {
    public_id: {
      type: String
    },
    url: {
      type: String,
      required: true
    }
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Freelancer'
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: 'Freelancer'
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);