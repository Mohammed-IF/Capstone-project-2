const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var quoteSchema = new Schema({
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
  postedServices: [
    {
      postedServiceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'PostedService'
      },
    }
  ],
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

module.exports = mongoose.model('Quote', quoteSchema);
