"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
* Firewall function is the factory for firewall higher order reducers.
* Their purpose is to prevent actions from reaching to foreign reducers, that is which are bound to a different ns property
*
* @param {String} ns Namespace
*
* @return {Function} Higher order reducer
*
**/

var firewall = function firewall(ns) {
	return firewallHOR.bind(null, ns);
};

var firewallHOR = function firewallHOR(ns, reducer) {
	return function (state, action) {
		return !action.ns || action.ns === ns ? reducer(state, action) : state;
	};
};

exports.default = firewall;