import { Path } from "./model";

export enum ActionTypes {
  SET_PATH = "[path] SET_PATH",
  CLEAR_PATH = "[clear] CLEAR_PATH"
}

export interface SetPathAction {
  type: ActionTypes.SET_PATH;
  payload: {
    path: Path;
  };
}

export interface ClearPathAction {
  type: ActionTypes.CLEAR_PATH;
}

export type Actions = SetPathAction | ClearPathAction;

export const setPath = (path: Path): SetPathAction => {
  return {
    type: ActionTypes.SET_PATH,
    payload: {
      path
    }
  };
};

export const clearPath = (): ClearPathAction => {
  return {
    type: ActionTypes.CLEAR_PATH
  };
};
