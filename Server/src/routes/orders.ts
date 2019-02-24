import express = require("express");
import { checkToken, queryToObj } from "../utils";
import Orders from "../models/orders";
import * as _o from "../types/orders";

const router = express.Router();

const getCountOfNew = async (): Promise<number | undefined> => {
  try {
    const orders = await Orders.find({ status: "Новый" });
    if (!orders) return undefined;
    return orders.length;
  } catch (err) {
    return undefined;
  }
};

const getOrdersWithParams = async (
  orderProps: _o.OrderProps
): Promise<_o.Orders | undefined> => {
  try {
    const { search, sort, filter } = orderProps;
    const searchRegExp = search
      ? new RegExp(search.trim(), "i")
      : new RegExp("", "i");
    const filterRegExp = filter
      ? new RegExp(filter.trim(), "i")
      : new RegExp("", "i");
    const orders = await Orders.find({
      $or: [
        { $and: [{ status: filterRegExp }, { status: searchRegExp }] },
        { $and: [{ status: filterRegExp }, { "client.name": searchRegExp }] },
        { $and: [{ status: filterRegExp }, { "client.phone": searchRegExp }] }
      ]
    }).sort({ created: sort ? 1 : -1 });
    if (!orders) return undefined;
    return orders;
  } catch (err) {
    return undefined;
  }
};

router.get(
  "/get",
  async (req, res): Promise<express.Response> => {
    try {
      const isAuth = await checkToken(req);
      if (!isAuth) return res.sendStatus(401);
      const orders = await Orders.find();
      if (!orders) return res.sendStatus(404);
      const countOfNew = await getCountOfNew();
      return res.status(200).send({ orders, countOfNew });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.get(
  "/get-count-of-new",
  async (req, res): Promise<express.Response> => {
    try {
      const isAuth = await checkToken(req);
      if (!isAuth) return res.sendStatus(401);
      const countOfNew = await getCountOfNew();
      if (!countOfNew) return res.sendStatus(404);
      return res.status(200).send({ countOfNew });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.post(
  "/get-with-params",
  async (req, res): Promise<express.Response> => {
    try {
      const isAuth = await checkToken(req);
      if (!isAuth) return res.sendStatus(401);
      const data = req.body;
      if (!_o.isOrderProps(data)) return res.sendStatus(400);
      const orders = await getOrdersWithParams(data);
      if (!orders) return res.sendStatus(404);
      const countOfNew = await getCountOfNew();
      return res.status(200).send({ orders, countOfNew });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.put(
  "/add",
  async (req, res): Promise<express.Response> => {
    try {
      const data = req.body;
      if (!_o.isNewOrder(data)) return res.sendStatus(400);
      let { client, productList } = data;
      const order = new Orders({ client, productList, created: new Date() });
      const savedOrder = await order.save();
      if (!savedOrder) return res.sendStatus(500);
      return res.sendStatus(201);
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.put(
  "/edit",
  async (req, res): Promise<express.Response> => {
    try {
      const isAuth = await checkToken(req);
      if (!isAuth) return res.sendStatus(401);
      const data = req.body;
      if (!_o.isEditedOrderWP(data)) return res.sendStatus(400);
      const { orderProps, editedOrder } = data;
      const order = await Orders.findByIdAndUpdate(editedOrder.id, {
        status: editedOrder.status
      });
      if (!order) return res.sendStatus(404);
      const orders = await getOrdersWithParams(orderProps);
      if (!orders) return res.sendStatus(404);
      const countOfNew = await getCountOfNew();
      return res.status(200).send({ orders, countOfNew });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.delete(
  "/remove",
  async (req, res): Promise<express.Response> => {
    try {
      const isAuth = await checkToken(req);
      if (!isAuth) return res.sendStatus(401);
      const data = queryToObj(req.query);
      if (!_o.isRemovedOrderWP(data)) return res.sendStatus(400);
      const { orderProps, removedOrder } = data;
      const order = await Orders.findByIdAndDelete(removedOrder.id);
      if (!order) return res.sendStatus(404);
      const orders = await getOrdersWithParams(orderProps);
      if (!orders) return res.sendStatus(404);
      const countOfNew = await getCountOfNew();
      return res.status(200).send({ orders, countOfNew });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

export const orders = router;
