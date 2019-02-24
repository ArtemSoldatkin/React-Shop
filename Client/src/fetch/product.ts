import axios from "axios";
import { Msg, newMsg } from "../models/msg";
import { baseUrl } from "./index";
import * as _p from "../models/product";
import { Token, isToken } from "../store/token/model";

enum url {
  GET_PRODUCTS = "products/get",
  GET_PRODUCTS_BY_PARAM = "products/get-by-param ",
  GET_ONE_PRODUCT = "products/get-one",
  ADD_PRODUCT = "products/add",
  EDIT_PRODUCT = "products/edit",
  REMOVE_PRODUCT = "products/remove"
}

type Callback = (msg: Msg, data: _p.ServerProducts | undefined) => void;
type ProductCallback = (msg: Msg, data: _p.Product | undefined) => void;

export const getProducts = async (callback: Callback): Promise<void> => {
  try {
    const response = await axios.get(`${baseUrl}/${url.GET_PRODUCTS}`);
    const data = _p.isServerProducts(response.data) ? response.data : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const getProductsByParam = async (
  inputData: _p.ProductProps,
  callback: Callback
): Promise<void> => {
  try {
    if (!_p.isProductsProps(inputData))
      return newMsg(false, { response: { status: 400 } }), undefined;
    const response = await axios.post(
      `${baseUrl}/${url.GET_PRODUCTS_BY_PARAM}`,
      inputData
    );
    const data = _p.isServerProducts(response.data) ? response.data : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const getProduct = async (
  inputData: _p.ProductID,
  callback: ProductCallback
): Promise<void> => {
  try {
    if (!_p.isProductID(inputData))
      return newMsg(false, { response: { status: 400 } }), undefined;
    const response = await axios.post(
      `${baseUrl}/${url.GET_ONE_PRODUCT}`,
      inputData
    );
    const data =
      response.data && _p.isProduct(response.data.product)
        ? response.data.product
        : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const addProduct = async (
  token: Token,
  inputData: _p.NewProduct,
  callback: Callback
): Promise<void> => {
  try {
    if (!_p.isNewProduct(inputData))
      return callback(newMsg(false, { response: { status: 400 } }), undefined);
    if (!isToken(token))
      return callback(newMsg(false, { response: { status: 401 } }), undefined);
    const response = await axios.put(
      `${baseUrl}/${url.ADD_PRODUCT}`,
      inputData,
      { headers: { "x-access-token": token } }
    );
    const data = _p.isServerProducts(response.data) ? response.data : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const editProduct = async (
  token: Token,
  inputData: _p.EditedProduct,
  callback: Callback
): Promise<void> => {
  try {
    if (!_p.isEditedProduct(inputData))
      return newMsg(false, { response: { status: 400 } }), undefined;
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const response = await axios.put(
      `${baseUrl}/${url.EDIT_PRODUCT}`,
      inputData,
      { headers: { "x-access-token": token } }
    );
    const data = _p.isServerProducts(response.data) ? response.data : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const removeProduct = async (
  token: Token,
  inputData: _p.ProductID,
  callback: Callback
): Promise<void> => {
  try {
    if (!_p.isProductID(inputData))
      return newMsg(false, { response: { status: 400 } }), undefined;
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const response = await axios.delete(`${baseUrl}/${url.REMOVE_PRODUCT}`, {
      params: inputData,
      headers: { "x-access-token": token }
    });
    const data = _p.isServerProducts(response.data) ? response.data : undefined;
    callback(newMsg(true), data);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};
