import {
  isString,
  isNumber,
  isArrayOfString,
  isOptionalNumber,
  isOptionalStringArray,
  isOptionalString
} from "../utils";
//Types
export interface PathPart {
  id: string;
  name: string;
}
export type Path = PathPart[];
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  count: number;
  images: string[];
  path: Path;
}
export type Products = Product[];
export interface ProductModel {
  name: string;
  description: string;
  price: number;
  count: number;
  images: string[];
  path: Path;
}
export interface ProductProps {
  search?: string;
  categoryID?: string;
}
export interface ProductID {
  id: string;
}
export interface NewProduct {
  categoryID: string;
  name: string;
  price: number;
  count: number;
  description?: string;
  images: string[];
}
export interface EditedProduct {
  id: string;
  name?: string;
  price?: number;
  count?: number;
  description?: string;
  images?: string[];
}
//Type checking
export const isPathPart = (data: any): data is PathPart =>
  <PathPart>data instanceof Object &&
  isString((<PathPart>data).id) &&
  isString((<PathPart>data).name);
export const isPath = (data: any): data is Path =>
  <Path>data instanceof Array &&
  (<Path>data).every(pathPart => isPathPart(pathPart));
export const isProduct = (data: any): data is Product =>
  <Product>data instanceof Object &&
  isString((<Product>data)._id) &&
  isString((<Product>data).name) &&
  typeof (<Product>data).description == "string" &&
  isNumber((<Product>data).price) &&
  isNumber((<Product>data).count) &&
  isArrayOfString((<Product>data).images) &&
  isPath((<Product>data).path);
export const isProducts = (data: any): data is Products =>
  <Products>data instanceof Array &&
  (<Products>data).every(product => isProduct(product));
export const isProductModel = (data: any): data is ProductModel =>
  <ProductModel>data instanceof Object &&
  isString((<ProductModel>data).name) &&
  typeof (<ProductModel>data).description == "string" &&
  isNumber((<ProductModel>data).price) &&
  isNumber((<ProductModel>data).count) &&
  isArrayOfString((<ProductModel>data).images) &&
  isPath((<ProductModel>data).path);
export const isProductsProps = (data: any): data is ProductProps =>
  <ProductProps>data instanceof Object &&
  isOptionalString((<ProductProps>data).categoryID) &&
  isOptionalString((<ProductProps>data).search);
export const isProductID = (data: any): data is ProductID =>
  <ProductID>data instanceof Object && isString((<ProductID>data).id);
export const isNewProduct = (data: any): data is NewProduct =>
  <NewProduct>data instanceof Object &&
  isString((<NewProduct>data).categoryID) &&
  isString((<NewProduct>data).name) &&
  isNumber((<NewProduct>data).price) &&
  isNumber((<NewProduct>data).count) &&
  isOptionalString((<NewProduct>data).description) &&
  isArrayOfString((<NewProduct>data).images);
export const isEditedProduct = (data: any): data is EditedProduct =>
  <EditedProduct>data instanceof Object &&
  isString((<EditedProduct>data).id) &&
  isOptionalString((<EditedProduct>data).name) &&
  isOptionalNumber((<EditedProduct>data).price) &&
  isOptionalNumber((<EditedProduct>data).count) &&
  isOptionalString((<EditedProduct>data).description) &&
  isOptionalStringArray((<EditedProduct>data).images);
