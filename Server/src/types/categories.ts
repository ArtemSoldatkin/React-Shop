import { isString, isArrayOfString, isOptionalString } from "../utils";
//Types
export interface Category {
  name: string;
  products: string[];
}
export type Categories = Category[];
export interface NewCategory {
  name: string;
  parentID?: string;
}
export interface EditedCategory {
  id: string;
  name: string;
}
export interface RemovedCategory {
  id: string;
}

//Type Checking
export const isCategory = (data: any): data is Category =>
  <Category>data instanceof Object &&
  isString((<Category>data).name) &&
  isArrayOfString((<Category>data).products);
export const isCategories = (data: any): data is Categories =>
  <Categories>data instanceof Array &&
  (<Categories>data).every(category => isCategory(category));
export const isNewCategory = (data: any): data is NewCategory =>
  <NewCategory>data instanceof Object &&
  isString((<NewCategory>data).name) &&
  isOptionalString((<NewCategory>data).parentID);
export const isEditedCategory = (data: any): data is EditedCategory =>
  <EditedCategory>data instanceof Object &&
  isString((<EditedCategory>data).name) &&
  isString((<EditedCategory>data).id);
export const isRemovedCategory = (data: any): data is RemovedCategory =>
  <RemovedCategory>data instanceof Object &&
  isString((<RemovedCategory>data).id);
