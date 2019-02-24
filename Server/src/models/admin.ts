import mongoose = require("mongoose");
import uniqueValidator = require("mongoose-unique-validator");
import { User } from "../types/user";

const adminSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
});

adminSchema.plugin(uniqueValidator);
interface Admin extends User, mongoose.Document {}
export default mongoose.model<Admin>("Admin", adminSchema);
