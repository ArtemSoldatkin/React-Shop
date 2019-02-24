import {
  isString,
  isNumber,
  isPhone,
  isOptionalNumber,
  isOptionalString
} from "../utils/type-checking";

//Types
export type Status = "Новый" | "В работе" | "Выполнено";
export interface Client {
  name: string;
  phone: string;
}
export interface Product {
  product: string;
  price: number;
  count: number;
}
export type ProductList = Product[];
export interface Order {
  _id: string;
  status: Status;
  client: Client;
  productList: ProductList;
  created: Date;
}
export type Orders = Order[];
export interface ServerOrders {
  orders: Orders;
  countOfNew: number;
}
export interface OrderProps {
  search?: string;
  sort: boolean;
  filter?: string;
}
export interface CountOfNew {
  countOfNew: number;
}
export interface NewOrder {
  client: Client;
  productList: ProductList;
}
export interface EditedOrder {
  id: string;
  status: Status;
}
export interface RemovedOrder {
  id: string;
}
export interface EditedOrderWP {
  orderProps: OrderProps;
  editedOrder: EditedOrder;
}
export interface RemovedOrderWP {
  orderProps: OrderProps;
  removedOrder: RemovedOrder;
}
//Type checking
export const isStatus = (data: any): data is Status =>
  <Status>data === "Новый" ||
  <Status>data === "В работе" ||
  <Status>data === "Выполнено";
export const isClient = (data: any): data is Client =>
  <Client>data instanceof Object &&
  isString((<Client>data).name) &&
  isPhone((<Client>data).phone);
export const isProduct = (data: any): data is Product =>
  <Product>data instanceof Object &&
  isString((<Product>data).product) &&
  isNumber((<Product>data).price) &&
  isNumber((<Product>data).count);
export const isProductList = (data: any): data is ProductList =>
  <ProductList>data instanceof Array &&
  (<ProductList>data).every(product => isProduct(product));
export const isOrder = (data: any): data is Order =>
  <Order>data instanceof Object &&
  isString((<Order>data)._id) &&
  isStatus((<Order>data).status) &&
  isClient((<Order>data).client) &&
  isProductList((<Order>data).productList) &&
  isString((<Order>data).created);
export const isOrders = (data: any): data is Orders =>
  <Orders>data instanceof Array &&
  (<Orders>data).every(order => isOrder(order));
export const isServerOrders = (data: any): data is ServerOrders =>
  <ServerOrders>data instanceof Object &&
  isOrders((<ServerOrders>data).orders) &&
  isNumber((<ServerOrders>data).countOfNew);
export const isOrderProps = (data: any): data is OrderProps =>
  <OrderProps>data instanceof Object &&
  isOptionalString((<OrderProps>data).filter) &&
  isOptionalString((<OrderProps>data).search) &&
  typeof (<OrderProps>data).sort === "boolean";
export const isCountOfNew = (data: any): data is CountOfNew =>
  <CountOfNew>data instanceof Object && isNumber((<CountOfNew>data).countOfNew);
export const isNewOrder = (data: any): data is NewOrder =>
  <NewOrder>data instanceof Object &&
  isClient((<NewOrder>data).client) &&
  isProductList((<NewOrder>data).productList);
export const isEditedOrder = (data: any): data is EditedOrder =>
  <EditedOrder>data instanceof Object &&
  isString((<EditedOrder>data).id) &&
  isStatus((<EditedOrder>data).status);
export const isRemovedOrder = (data: any): data is RemovedOrder =>
  <RemovedOrder>data instanceof Object && isString((<RemovedOrder>data).id);
export const isEditedOrderWP = (data: any): data is EditedOrderWP =>
  <EditedOrderWP>data instanceof Object &&
  isOrderProps((<EditedOrderWP>data).orderProps) &&
  isEditedOrder((<EditedOrderWP>data).editedOrder);
export const isRemovedOrderWP = (data: any): data is RemovedOrderWP =>
  <EditedOrderWP>data instanceof Object &&
  isOrderProps((<RemovedOrderWP>data).orderProps) &&
  isRemovedOrder((<RemovedOrderWP>data).removedOrder);
