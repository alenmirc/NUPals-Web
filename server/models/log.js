const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  level: { 
    type: String, 
    enum: ['info', 'error', 'warn', 'debug'], 
    default: 'info' 
  },
  message: { 
    type: String, 
    required: true 
  },
  adminId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  adminName: { 
    type: String 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
