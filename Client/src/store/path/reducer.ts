import { Path } from "./model";
import { Actions, ActionTypes } from "./actions";

export type State = Path;

export const initialState: State = [];

export const reducer = (state: State = initialState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.SET_PATH: {
      return action.payload.path;
    }
    case ActionTypes.CLEAR_PATH: {
      return [];
    }
    default:
      return state;
  }
};
