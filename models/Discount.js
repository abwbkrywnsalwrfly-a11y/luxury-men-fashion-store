const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  percentage: { type: Number, required: true },
  maxUses: { type: Number },
  usedTimes: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discount', discountSchema);
