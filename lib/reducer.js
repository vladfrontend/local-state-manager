'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _helpers = require('./helpers');

var _localReducers = require('./local-reducers');

var _localReducers2 = _interopRequireDefault(_localReducers);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localState = function localState() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {

		case _actions.LOCAL_STATE_UPDATE:
			return action.replace ? action.state : (0, _extends4.default)({}, state, action.state);

		default:
			return state;
	}
};

exports.default = function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	var newState = void 0;
	switch (action.type) {

		case _actions.LOCAL_STATE_UPDATE:
			newState = (0, _extends4.default)({}, state, (0, _defineProperty3.default)({}, action.ns, localState(state[action.ns], action)));
			break;

		case _actions.LOCAL_STATE_DESTROY:
			newState = (0, _extends4.default)({}, state);
			delete newState[action.ns];
			break;

		default:
			newState = state;
	}

	// should go after the switch,
	// because the state for the newly added reducer should be first initialized in the switch, by handling LOCAL_STATE_UPDATE
	// and also the state for the recently removed reducer should be first destroyed in the switch, by handling LOCAL_STATE_DESTROY
	// only after the switch is finished, can combineReducers do its job
	if ((0, _helpers.isEmpty)(_localReducers2.default.get())) {
		return newState;
	} else {
		return (0, _helpers.combineReducers)(_localReducers2.default.get())(newState, action);
	}
};