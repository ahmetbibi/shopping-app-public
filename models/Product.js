import mongoose, { mongo } from 'mongoose';
import shortid from 'shortid'; // To create a unique id

// Use String and Number type from mongoose schema types
const { String, Number } = mongoose.Schema.Types;

// Create a schema pretend to needing
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    default: shortid.generate(),
  },
  mediaUrl: {
    type: String,
    required: true,
  },
});

// Check first if the Product model is already created
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
