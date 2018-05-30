'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var localReducer = function localReducer(key, value, reducer) {
	return function (state, action) {
		return !action[key] || action[key] === value ? reducer(state, action) : state;
	};
};

exports.default = function (ns) {
	return localReducer.bind(null, 'ns', ns);
};