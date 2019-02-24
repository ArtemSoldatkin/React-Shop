import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Cookies } from "react-cookie";
import { Token, User } from "./model";
import * as _t from "../../fetch/token";
import { State } from "./reducer";
import { Msg } from "../../models/msg";

const cookies = new Cookies();
type ThunkResult<R> = ThunkAction<R, State, null, Actions>;

export enum ActionTypes {
  ADD_TOKEN = "[token] ADD_TOKEN",
  REMOVE_TOKEN = "[token] REMOVE_TOKEN",
  SET_TOKEN = "[token] SET_TOKEN"
}

interface AddTokenActions {
  type: ActionTypes.ADD_TOKEN;
  payload: {
    token: Token;
  };
}

interface RemoveTokenActions {
  type: ActionTypes.REMOVE_TOKEN;
  payload: {
    token: Token;
  };
}

export type Actions = AddTokenActions | RemoveTokenActions;

const addToken = (token: Token): AddTokenActions => {
  return {
    type: ActionTypes.ADD_TOKEN,
    payload: { token }
  };
};

export const removeToken = (): RemoveTokenActions => {
  cookies.remove("token");
  return {
    type: ActionTypes.REMOVE_TOKEN,
    payload: { token: null }
  };
};

export function setToken(
  { login, password }: User,
  callback: (msg: Msg) => void
): ThunkResult<void> {
  return async dispatch => {
    await _t.authorization({ login: login, password }, (msg, token) => {
      callback(msg);
      if (!token) return;
      cookies.set("token", token);
      return dispatch(addToken(token));
    });
  };
}

export function checkToken(): ThunkResult<void> {
  return async dispatch => {
    const token = cookies.get("token");
    await _t.checkToken({ token }, (msg, result) => {
      if (result) return dispatch(addToken(token));
      return cookies.remove("token");
    });
  };
}
