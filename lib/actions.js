'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var LOCAL_STATE_DESTROY = exports.LOCAL_STATE_DESTROY = 'LOCAL_STATE_DESTROY';
var LOCAL_STATE_UPDATE = exports.LOCAL_STATE_UPDATE = 'LOCAL_STATE_UPDATE';

var destroy = exports.destroy = function destroy(ns) {
	return {
		type: LOCAL_STATE_DESTROY,
		ns: ns
	};
};

var update = exports.update = function update(ns, state, replace) {
	return {
		type: LOCAL_STATE_UPDATE,
		ns: ns,
		state: state,
		replace: replace
	};
};