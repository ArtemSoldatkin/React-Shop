import mongoose = require("mongoose");
import { Order } from "../types/orders";

const ordersSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "Новый"
  },
  created: {
    type: Date,
    required: true
  },
  client: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  productList: [
    {
      product: {
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
      }
    }
  ]
});
interface OrderModel extends Order, mongoose.Document {}
export default mongoose.model<OrderModel>("Orders", ordersSchema);
