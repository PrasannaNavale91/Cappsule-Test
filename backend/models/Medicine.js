import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  id: Number,
  salt: String,
  salt_frequency: Number,
  available_forms: [String],
  most_common: {
    Form: String,
    Strength: String,
    Packing: String
  },
  price: Number,
  pharmacy: String,
  salt_forms_json: mongoose.Schema.Types.Mixed
});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;