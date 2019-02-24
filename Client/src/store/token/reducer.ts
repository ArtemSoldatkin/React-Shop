import { Token } from "./model";
import { Actions, ActionTypes } from "./actions";

export type State = Token;
export const initialState = null;

export function reducer(state: State = initialState, action: Actions) {
  switch (action.type) {
    case ActionTypes.ADD_TOKEN: {
      return action.payload.token;
    }
    case ActionTypes.REMOVE_TOKEN: {
      return action.payload.token;
    }
    default:
      return state;
  }
}
