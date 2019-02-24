import { Cookies } from "react-cookie";
import { ThunkAction } from "redux-thunk";
import { Cart, ProductCart, isCart, isProductCart } from "./model";
import { State } from "../";

const cookies = new Cookies();

type ThunkResult<R> = ThunkAction<R, State, undefined, Actions>;

export enum ActionTypes {
  ADD_PRODUCT_CART = "[cart] ADD_PRODUCT_CART",
  EDIT_PRODUCT_CART = "[cart] EDIT_PRODUCT_CART",
  REMOVE_PRODUCT_CART = "[cart] REMOVE_PRODUCT_CART",
  CHECK_CART = "[cart] CHECK_CART",
  CLEAR_CART = "[cart] CLEAR_CART"
}

export interface AddProductCartType {
  type: ActionTypes.ADD_PRODUCT_CART;
  payload: {
    cart: Cart;
  };
}

export interface EditProductCartType {
  type: ActionTypes.EDIT_PRODUCT_CART;
  payload: {
    cart: Cart;
  };
}

export interface RemoveProductCartType {
  type: ActionTypes.REMOVE_PRODUCT_CART;
  payload: {
    cart: Cart;
  };
}

export interface CheckCartType {
  type: ActionTypes.CHECK_CART;
  payload: {
    cart: Cart;
  };
}

export interface ClearCartType {
  type: ActionTypes.CLEAR_CART;
  payload: {
    cart: Cart;
  };
}

export type Actions =
  | AddProductCartType
  | EditProductCartType
  | RemoveProductCartType
  | CheckCartType
  | ClearCartType;

const addProduct = (cart: Cart): AddProductCartType => {
  cookies.remove("cart");
  cookies.set("cart", JSON.stringify(cart));
  return {
    type: ActionTypes.ADD_PRODUCT_CART,
    payload: { cart }
  };
};

export const addProductCart = (
  productCart: ProductCart
): ThunkResult<void> => async (dispatch, getState) => {
  try {
    if (!isProductCart(productCart)) return;
    if (productCart.stock <= 0) return;
    productCart.count =
      productCart.count <= productCart.stock
        ? productCart.count
        : productCart.stock;
    let cart = getState().cart;
    const res =
      isCart(cart) && cart.findIndex(product => product.id === productCart.id);
    if ((!res || res === -1) && isCart(cart))
      return await dispatch(addProduct([...cart, productCart]));
    if ((!res || res === -1) && !isCart(cart))
      return await dispatch(addProduct([productCart]));
    cart[res as number].count = productCart.count;
    return await dispatch(addProduct(cart));
  } catch (err) {
    return;
  }
};

const editProduct = (cart: Cart): EditProductCartType => {
  cookies.set("cart", JSON.stringify(cart));
  return {
    type: ActionTypes.EDIT_PRODUCT_CART,
    payload: { cart }
  };
};

export const editProductCart = (
  id: string,
  count: number
): ThunkResult<void> => async (dispatch, getState) => {
  try {
    let cart = getState().cart;
    const res = isCart(cart) && cart.findIndex(product => product.id === id);
    if (!res) return;
    cart[res].count = cart[res].stock >= count ? count : cart[res].stock;
    return await dispatch(editProduct(cart));
  } catch (err) {
    return;
  }
};

const removeProduct = (cart: Cart): RemoveProductCartType => {
  cookies.set("cart", JSON.stringify(cart));
  return {
    type: ActionTypes.REMOVE_PRODUCT_CART,
    payload: { cart }
  };
};

export const removeProductCart = (id: string): ThunkResult<void> => async (
  dispatch,
  getState
) => {
  try {
    let cart = getState().cart;
    if (!isCart(cart)) return;
    cart = cart.filter(product => product.id !== id);
    await dispatch(removeProduct(cart));
  } catch (err) {
    return;
  }
};

export const checkProductCart = (): CheckCartType => {
  let temp = cookies.get("cart");
  let cart = isCart(temp) ? temp : [];
  return {
    type: ActionTypes.CHECK_CART,
    payload: { cart }
  };
};

export const clearCart = (): ClearCartType => {
  cookies.remove("cart");
  return {
    type: ActionTypes.CLEAR_CART,
    payload: { cart: [] }
  };
};
