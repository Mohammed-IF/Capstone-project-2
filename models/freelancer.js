const mongoose = require('mongoose');

const freelancerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  revenue: [{
    money: Number
  }],
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'Portfolio'
  },
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
})
   
module.exports = mongoose.model('Freelancer', freelancerSchema);




