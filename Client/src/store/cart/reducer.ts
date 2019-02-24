import { Cart } from "./model";
import { Actions, ActionTypes } from "./actions";

export type State = Cart;

export const initialState: State = [];

export const reducer = (state: State = initialState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.ADD_PRODUCT_CART: {
      return action.payload.cart;
    }
    case ActionTypes.EDIT_PRODUCT_CART: {
      return action.payload.cart;
    }
    case ActionTypes.REMOVE_PRODUCT_CART: {
      return action.payload.cart;
    }
    case ActionTypes.CHECK_CART: {
      return action.payload.cart;
    }
    case ActionTypes.CLEAR_CART: {
      return action.payload.cart;
    }
    default:
      return state;
  }
};
