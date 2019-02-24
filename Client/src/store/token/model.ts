import { isString } from "../../utils/type-checking";

//Types
export type Token = string | null;
export interface User {
  login: string;
  password: string;
}
export interface ServerToken {
  token: Token;
}
export interface TokenResult {
  result: boolean;
}
//Type checking
export const isToken = (data: any): data is Token =>
  typeof (<Token>data) === "string" || <Token>data === null;
export const isUser = (data: any): data is User =>
  <User>data instanceof Object &&
  isString((<User>data).login) &&
  isString((<User>data).password);
export const isServerToken = (data: any): data is ServerToken =>
  <ServerToken>data instanceof Object && isToken(<ServerToken>data.token);
export const isTokenResult = (data: any): data is TokenResult =>
  <TokenResult>data instanceof Object &&
  typeof (<TokenResult>data).result === "boolean";
