'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _firewallHor = require('./firewall-hor');

var _firewallHor2 = _interopRequireDefault(_firewallHor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localReducers = {};

var get = function get() {
	return localReducers;
};

var add = function add(ns, reducer) {
	return localReducers[ns] = (0, _firewallHor2.default)(ns)(reducer);
};

var remove = function remove(ns) {
	return delete localReducers[ns];
};

exports.default = {
	get: get,
	add: add,
	remove: remove
};