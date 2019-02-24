import express = require("express");
import mongoose = require("mongoose");
import bodyParser = require("body-parser");
import cors = require("cors");

import { admin } from "./routes/admin";
import { categories } from "./routes/categories";
import { products } from "./routes/products";
import { orders } from "./routes/orders";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

const dbConnect = () => {
  const options = { useCreateIndex: true, useNewUrlParser: true };
  mongoose.connect("mongodb://localhost:27017/db", options);
  return mongoose.connection;
};

const serverStart = () => {
  //mongoose.connection.collections['orders','products','categories1'].drop(() => console.log('drop'))
  app.listen(port, () => console.log(`App is started on port ${port}`));
};

dbConnect()
  .on("error", console.error)
  .on("disconnected", dbConnect)
  .once("open", serverStart);

app.use("/admin", admin);
app.use("/categories", categories);
app.use("/products", products);
app.use("/orders", orders);
