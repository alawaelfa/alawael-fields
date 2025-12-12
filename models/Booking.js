const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true,
    index: true
  },
  fieldId: {
    type: Number,
    required: true
  },
  slotIndex: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  deposit: {
    type: Number,
    default: 0,
    min: 0
  },
  players: [playerSchema],
  customPrice: {
    type: Number,
    min: 0
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isQuickBooking: {
    type: Boolean,
    default: false
  },
  isNoBooking: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// فهرس مركب للبحث السريع
bookingSchema.index({ userId: 1, date: 1, fieldId: 1, slotIndex: 1 });

// تحديث updatedAt تلقائياً
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
