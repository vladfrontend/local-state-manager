import { take } from 'redux-saga/effects';

/**
 *  Factory that creates a generator for filtering out foreign local actions, i.e. actions with a different namespace,
 *  and actions with an action type different from the one passed to the generator function.
 *  If the action doesn't have any namespace, and it conforms to actionType passed to the generator function, then
 *  the action is allowed in.
 *
 * @param ns Namespace.
 * @returns {Function} Generator function that filters out actions.
 */

const createTakeLocalSaga = ns => {
  return function* (actionType) {
    while (true) {
      const action = yield take(actionType);
      if (!action.ns || action.ns === ns) {
        return action;
      }
    }
  };
};

export default createTakeLocalSaga;