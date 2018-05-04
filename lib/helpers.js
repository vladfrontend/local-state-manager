export const isEmpty = obj => !Object.keys(obj).length;

export const combineReducers = reducers =>
  (state = {}, action) => {
    const newState =
      Object.keys(reducers).reduce((newState, key) => {
        newState[key] = reducers[key](
          state[key],
          action
        );
        return newState;
      }, {});

    const areEqual = Object.keys(state).every(
      key => state[key] === newState[key]
    );

    // if values of newState and values of state are equal, then return the old state
    // otherwise return the new state (new object)
    return areEqual ? state : newState;
  };