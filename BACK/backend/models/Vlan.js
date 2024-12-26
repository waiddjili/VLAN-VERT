// backend/models/Vlan.js
const mongoose = require('mongoose');

const vlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vlanId: { type: Number, required: true },
});

const Vlan = mongoose.model('Vlan', vlanSchema);

module.exports = Vlan;
