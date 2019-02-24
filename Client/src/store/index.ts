import { combineReducers } from "redux";
import * as fromCart from "./cart/reducer";
import * as fromPath from "./path/reducer";
import * as fromToken from "./token/reducer";

export interface State {
  cart: fromCart.State;
  path: fromPath.State;
  token: fromToken.State;
}

export const initialState: State = {
  cart: fromCart.initialState,
  path: fromPath.initialState,
  token: fromToken.initialState
};

export const reducer = combineReducers<State>({
  cart: fromCart.reducer,
  path: fromPath.reducer,
  token: fromToken.reducer
});
