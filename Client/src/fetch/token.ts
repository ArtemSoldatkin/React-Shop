import axios from "axios";
import * as _t from "../store/token/model";
import { Msg, newMsg } from "../models/msg";
import { baseUrl } from "./index";

enum url {
  LOG_IN = "admin/login",
  CHECK_TOKEN = "admin/check",
  ADD_USER = "admin/add",
  EDIT_USER = "admin/edit",
  REMOVE_USER = "admin/remove"
}
type Callback = (msg: Msg, token: _t.Token) => void;
type CheckCallback = (msg: Msg, result: boolean | null) => void;

export const authorization = async (
  inputData: _t.User,
  callback: Callback
): Promise<void> => {
  try {
    const response = await axios.post(`${baseUrl}/${url.LOG_IN}`, inputData);
    const token = _t.isServerToken(response.data) ? response.data.token : null;
    callback(newMsg(true), token);
  } catch (error) {
    callback(newMsg(false, error), null);
  }
};
export const checkToken = async (
  inputData: _t.ServerToken,
  callback: CheckCallback
): Promise<void> => {
  try {
    if (!_t.isServerToken(inputData))
      return callback(newMsg(false, { response: { status: 400 } }), null);
    const response = await axios.post(
      `${baseUrl}/${url.CHECK_TOKEN}`,
      inputData
    );
    const result = _t.isTokenResult(response.data)
      ? response.data.result
      : null;
    callback(newMsg(true), result);
  } catch (error) {
    callback(newMsg(false, error), null);
  }
};
/*
---//In Progress//---
export const addUser = () => {}
export const editUser = () => {}
export const removeUser = () => {}
*/
