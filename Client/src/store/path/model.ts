import { isString } from "../../utils/type-checking";

//types
export interface PathPart {
  id: string;
  name: string;
}
export type Path = PathPart[];

//type checking
export const isPathPart = (data: any): data is PathPart =>
  <PathPart>data instanceof Object &&
  isString((<PathPart>data).id) &&
  isString((<PathPart>data).name);
export const isPath = (data: any): data is Path =>
  <Path>data instanceof Array &&
  (<Path>data).every(pathPart => isPathPart(pathPart));
