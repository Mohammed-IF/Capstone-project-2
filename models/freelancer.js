const mongoose = require('mongoose');

const freelancerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Portfolio'
  }
})
   /*cart: {
    items: [
      {
        postedServiceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'postedService'
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

freelancerSchema.methods.addToCart = function(postedService) {
  const cartPostedServiceIndex = this.cart.items.findIndex(item => {
    return item.postedServiceId.toString() == postedService._id.toString();
  });

  let newQuantity = 1;
  let updatedCartItems = this.cart ? [...this.cart.items] : [];

  if (cartPostedServiceIndex >= 0) {
    newQuantity = updatedCartItems[cartPostedServiceIndex].quantity + 1;
    updatedCartItems[cartPostedServiceIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      postedServiceId: postedService._id,
      quantity: newQuantity
    });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;

  return this.save();
};

freelancerSchema.methods.removeFromCart = function(postedServiceId) {
  const updatedCartItems = this.cart.items.filter(
    item => item.postedServiceId.toString() != postedServiceId.toString()
  );

  this.cart.items = updatedCartItems;

  return this.save();
};

freelancerSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};
*/
module.exports = mongoose.model('Freelancer', freelancerSchema);










/*const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  userName: {
        type: String,
        required: true
      }, 
  phoneNumber: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  skills: {
    type: Array,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Freelancer= mongoose.model('Freelancer', FreelancerSchema);

module.exports = Freelancer;
*/