import mongoose = require("mongoose");
import uniqueValidator = require("mongoose-unique-validator");
import materializedPlugin = require("mongoose-tree-materialized");
import { Category } from "../types/categories";

const CategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products"
    }
  ]
});

CategoriesSchema.plugin(uniqueValidator);
CategoriesSchema.plugin(materializedPlugin);
export interface CategoriesModel
  extends mongoose.Document,
    Category,
    materializedPlugin.Document {}
export default mongoose.model<CategoriesModel>("Categories1", CategoriesSchema) as any;
