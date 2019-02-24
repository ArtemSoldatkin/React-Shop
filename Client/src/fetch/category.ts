import axios from "axios";
import { baseUrl } from "./index";
import { Msg, newMsg } from "../models/msg";
import * as _c from "../models/category";
import { Token, isToken } from "../store/token/model";

enum url {
  GET_CATEGORIES = "categories/get",
  ADD_CATEGORY = "categories/add",
  EDIT_CATEGORY = "categories/edit",
  REMOVE_CATEGORY = "categories/remove"
}
type Callback = (msg: Msg, categories: _c.Categories | undefined) => void;

export const getCategories = async (callback: Callback): Promise<void> => {
  try {
    const res = await axios.get(`${baseUrl}/${url.GET_CATEGORIES}`);
    const categories = (res.data &&
    res.data.categories &&
    _c.isCategories(res.data.categories)
      ? res.data.categories
      : undefined) as _c.Categories | undefined;
    callback(newMsg(true), categories);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const addCategory = async (
  token: Token,
  inputData: _c.NewCategory,
  callback: Callback
): Promise<void> => {
  try {
    if (!_c.isNewCategory(inputData))
      return newMsg(false, { response: { status: 400 } }), undefined;
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const res = await axios.put(`${baseUrl}/${url.ADD_CATEGORY}`, inputData, {
      headers: { "x-access-token": token }
    });
    const categories = (res.data &&
    res.data.categories &&
    _c.isCategories(res.data.categories)
      ? res.data.categories
      : undefined) as _c.Categories | undefined;
    callback(newMsg(true), categories);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const editCategory = async (
  token: Token,
  inputData: _c.EditedCategory,
  callback: Callback
): Promise<void> => {
  try {
    if (!_c.isEditedCategory(inputData))
      return newMsg(false, { response: { status: 400 } }), undefined;
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const res = await axios.put(`${baseUrl}/${url.EDIT_CATEGORY}`, inputData, {
      headers: { "x-access-token": token }
    });
    const categories = (res.data &&
    res.data.categories &&
    _c.isCategories(res.data.categories)
      ? res.data.categories
      : undefined) as _c.Categories | undefined;
    callback(newMsg(true), categories);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};

export const removeCategory = async (
  token: Token,
  inputData: _c.RemovedCategory,
  callback: Callback
): Promise<void> => {
  try {
    if (!_c.isRemovedCategory(inputData))
      return newMsg(false, { response: { status: 400 } }), undefined;
    if (!isToken(token))
      return newMsg(false, { response: { status: 401 } }), undefined;
    const res = await axios.delete(`${baseUrl}/${url.REMOVE_CATEGORY}`, {
      params: inputData,
      headers: { "x-access-token": token }
    });
    const categories = (res.data &&
    res.data.categories &&
    _c.isCategories(res.data.categories)
      ? res.data.categories
      : undefined) as _c.Categories | undefined;
    callback(newMsg(true), categories);
  } catch (error) {
    callback(newMsg(false, error), undefined);
  }
};
