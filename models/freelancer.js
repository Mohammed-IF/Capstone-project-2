const mongoose = require('mongoose');
function deleteEmpty (v) {
  if(v==null){
    return undefined;
  }
  return v;
}
const freelancerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  revenue: [{
    money: Number
  }],
  
  portfolioId: {
    type: mongoose.Schema.Types.String,
    //required: true
    set : deleteEmpty,
    ref: 'Portfolio'
  },
  resetToken: String,
  resetTokenExpiration: Date

})
   
module.exports = mongoose.model('Freelancer', freelancerSchema);




