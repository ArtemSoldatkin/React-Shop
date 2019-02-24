import { isString, isNumber } from "../../utils/type-checking";

//types
export interface ProductCart {
  id: string;
  name: string;
  price: number;
  count: number;
  stock: number;
}
export type Cart = ProductCart[];

//type checking
export const isProductCart = (data: any): data is ProductCart =>
  <ProductCart>data instanceof Object &&
  isString((<ProductCart>data).id) &&
  isString((<ProductCart>data).name) &&
  isNumber((<ProductCart>data).price) &&
  isNumber((<ProductCart>data).count) &&
  isNumber((<ProductCart>data).stock);
export const isCart = (data: any): data is Cart =>
  <Cart>data instanceof Array &&
  (<Cart>data).every(product => isProductCart(product));
