import express = require("express");
import jwt = require("jsonwebtoken");

export const secret: string = "adminiscool";

export const queryToObj = (data: any) => {
  if (!(data instanceof Object)) return undefined;
  for (let i in data) {
    if (typeof data[i] !== "string") return;
    data[i] = JSON.parse(data[i]);
  }
  return data;
};

export const checkToken = async (req: express.Request): Promise<boolean> => {
  try {
    const token = req.headers["x-access-token"];
    if (!isString(token)) return false;
    const result = jwt.verify(token, secret);
    if (!result) return false;
    return true;
  } catch (err) {
    return false;
  }
};

export const isString = (data: any): data is string =>
  typeof (<string>data) === "string" && (<string>data).trim().length > 0;

export const isNumber = (data: any): data is number =>
  typeof (<number>data) === "number" && <number>data >= 0;

export const isPhone = (data: any): data is string =>
  typeof (<string>data) === "string" &&
  (<string>data).replace(/[^\d]/g, "").length === 11;

type OptionalString = string | undefined;
export const isOptionalString = (data: any): data is OptionalString =>
  <OptionalString>data === undefined ||
  typeof (<OptionalString>data) === "string";

type OptionalNumber = number | undefined;
export const isOptionalNumber = (data: any): data is OptionalNumber =>
  <OptionalNumber>data === undefined || isNumber(<OptionalNumber>data);

type ArrayOfString = string[];
export const isArrayOfString = (data: any): data is ArrayOfString =>
  <ArrayOfString>data instanceof Array &&
  (<ArrayOfString>data).every(element => isString(element));

type OptionalArrayOfString = string[] | undefined;
export const isOptionalStringArray = (
  data: any
): data is OptionalArrayOfString =>
  <OptionalArrayOfString>data === undefined ||
  isArrayOfString(<OptionalArrayOfString>data);
