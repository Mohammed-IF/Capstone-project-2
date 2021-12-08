const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postedServiceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
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
    }
  },
    name: {
      type: Schema.Types.String,
      required: true
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Freelancer'
    },
  quotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote'
  }],
});
module.exports = mongoose.model('PostedService', postedServiceSchema);