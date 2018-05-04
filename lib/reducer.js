'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _helpers = require('./helpers');

var _localReducers = require('./local-reducers');

var _localReducers2 = _interopRequireDefault(_localReducers);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var localState = function localState() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {

		case _actions.LOCAL_STATE_UPDATE:
			return action.replace ? action.state : _extends({}, state, action.state);

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
			newState = _extends({}, state, _defineProperty({}, action.ns, localState(state[action.ns], action)));
			break;

		case _actions.LOCAL_STATE_DESTROY:
			newState = _extends({}, state);
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