import { combineReducers, isEmpty } from "./helpers";
import localReducers from './local-reducers';
import {
  LOCAL_STATE_DESTROY,
  LOCAL_STATE_UPDATE
} from './actions';

const localState = (state = {}, action) => {
	switch (action.type) {

		case LOCAL_STATE_UPDATE:
			return	action.replace ?
				action.state :
				{ 
					...state,
					...action.state
				};

		default:
			return state;
	}
};

export default (state = {}, action) => {
	let newState;
	switch (action.type) {

		case LOCAL_STATE_UPDATE:
			newState = {
				...state,
				[action.ns]: localState(state[action.ns], action)
			};
			break;

		case LOCAL_STATE_DESTROY:
			newState = { ...state };
			delete newState[action.ns];
			break;

		default:
			newState = state;
	}

	// should go after the switch,
	// because the state for the newly added reducer should be first initialized in the switch, by handling LOCAL_STATE_UPDATE
	// and also the state for the recently removed reducer should be first destroyed in the switch, by handling LOCAL_STATE_DESTROY
	// only after the switch is finished, can combineReducers do its job
	if (isEmpty( localReducers.get() )) {
		return newState;
	} else {
    return combineReducers(
      localReducers.get()
    )(newState, action);
  }
};