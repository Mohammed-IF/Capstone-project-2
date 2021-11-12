const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now
  },
  resetToken: String,
  resetTokenExpiration: Date,
  facebook: String,
  tokens: Array,
  role: String,
  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  //-------Courses that user is teaching-------------
  coursesTeach: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course'}
  }],


  //--------Courses that user is taking-------------
  coursesTaken: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course'}
  }],

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


userSchema.methods.addToCart = function(postedService) {
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

userSchema.methods.addCustomToCart = function(postedService) {
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
userSchema.methods.removeFromCart = function(postedServiceId) {
  const updatedCartItems = this.cart.items.filter(
    item => item.postedServiceId.toString() != postedServiceId.toString()
  );

  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};
module.exports = mongoose.model('User', userSchema);
