import mongoose = require("mongoose");
import { ProductModel } from "../types/products";

const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  images: [],
  path: [
    {
      id: String,
      name: String
    }
  ]
});

interface Product extends ProductModel, mongoose.Document {}
export default mongoose.model<Product>("Products", ProductsSchema);
