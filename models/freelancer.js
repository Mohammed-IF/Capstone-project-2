const mongoose = require('mongoose');

const freelancerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
    //ref: 'Portfolio'
  }
})
   
module.exports = mongoose.model('Freelancer', freelancerSchema);




