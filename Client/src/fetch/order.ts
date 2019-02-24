import axios from "axios";
import * as _o from "../models/order";
import { Token, isToken } from "../store/token/model";
import { Msg, newMsg } from "../models/msg";
import { baseUrl } from "./index";

enum url {
  GET_ORDERS = "orders/get",
  GET_ORDERS_WITH_PARAMS = "orders/get-with-params",
  GET_COUNT_OF_NEW = "orders/get-count-of-new",
  ADD_ORDER = "orders/add",
  EDIT_ORDER = "orders/edit",
  REMOVE_ORDER = "orders/remove"
}
type Callback = (msg: Msg, data: _o.ServerOrders | undefined) => void;
type CountOfNewCallback = (msg: Msg, data: _o.CountOfNew | undefined) => void;
type AddOrderCallback = (msg: Msg) => void;

export const getOrders = async (
  token: Token,
  callback: Callback
): Promise<void> => {
  try {
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const response = await axios.get(`${baseUrl}/${url.GET_ORDERS}`, {
      headers: { "x-access-token": token }
    });
    const data =
      response.data && _o.isServerOrders(response.data)
        ? response.data
        : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const getOrdersWithParams = async (
  token: Token,
  inputData: _o.OrderProps,
  callback: Callback
): Promise<void> => {
  try {
    if (!_o.isOrderProps(inputData))
      return callback(newMsg(false, { response: { status: 400 } }), undefined);
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const response = await axios.post(
      `${baseUrl}/${url.GET_ORDERS_WITH_PARAMS}`,
      inputData,
      { headers: { "x-access-token": token } }
    );
    const data =
      response.data && _o.isServerOrders(response.data)
        ? response.data
        : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const getCountOfNew = async (
  token: Token,
  callback: CountOfNewCallback
): Promise<void> => {
  try {
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const response = await axios.get(`${baseUrl}/${url.GET_COUNT_OF_NEW}`, {
      headers: { "x-access-token": token }
    });
    const data =
      response.data && _o.isCountOfNew(response.data)
        ? response.data
        : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const addOrder = async (
  inputData: _o.NewOrder,
  callback: AddOrderCallback
): Promise<void> => {
  try {
    if (!_o.isNewOrder(inputData))
      return callback(newMsg(false, { response: { status: 400 } }));
    await axios.put(`${baseUrl}/${url.ADD_ORDER}`, inputData);
    callback(newMsg(true));
  } catch (error) {
    callback(newMsg(false, error));
  }
};

export const editOrder = async (
  token: Token,
  inputData: _o.EditedOrderWP,
  callback: Callback
): Promise<void> => {
  try {
    if (!_o.isEditedOrderWP(inputData))
      return callback(newMsg(false, { response: { status: 400 } }), undefined);
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const response = await axios.put(
      `${baseUrl}/${url.EDIT_ORDER}`,
      inputData,
      { headers: { "x-access-token": token } }
    );
    const data =
      response.data && _o.isServerOrders(response.data)
        ? response.data
        : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const removeOrder = async (
  token: Token,
  inputData: _o.RemovedOrderWP,
  callback: Callback
): Promise<void> => {
  try {
    if (!_o.isRemovedOrderWP(inputData))
      return callback(newMsg(false, { response: { status: 400 } }), undefined);
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const response = await axios.delete(`${baseUrl}/${url.REMOVE_ORDER}`, {
      params: inputData,
      headers: { "x-access-token": token }
    });
    const data =
      response.data && _o.isServerOrders(response.data)
        ? response.data
        : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};
