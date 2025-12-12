const mongoose = require('mongoose');

const archivedSlotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slotKey: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  slotIndex: {
    type: Number,
    required: true
  },
  isArchived: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// فهرس للبحث السريع
archivedSlotSchema.index({ userId: 1, date: 1 });

const ArchivedSlot = mongoose.model('ArchivedSlot', archivedSlotSchema);

module.exports = ArchivedSlot;
