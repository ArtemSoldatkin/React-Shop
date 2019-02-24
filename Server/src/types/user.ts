import { isString, isOptionalString } from "../utils";
//Types
export interface User {
  login: string;
  password: string;
}
export interface InputToken {
  token: string;
}
export interface EditedUser {
  id: string;
  login?: string;
  password?: string;
}
export interface UserID {
  id: string;
}
//Type checking
export const isUser = (data: any): data is User =>
  <User>data instanceof Object &&
  isString((<User>data).login) &&
  isString((<User>data).password);
export const isInputToken = (data: any): data is InputToken =>
  <InputToken>data instanceof Object && isString((<InputToken>data).token);
export const isEditedUser = (data: any): data is EditedUser =>
  <EditedUser>data instanceof Object &&
  isString((<EditedUser>data).id) &&
  isOptionalString((<EditedUser>data).login) &&
  isOptionalString((<EditedUser>data).password);
export const isUserID = (data: any): data is UserID =>
  <UserID>data instanceof Object && isString((<UserID>data).id);
