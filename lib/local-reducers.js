import firewall from './firewall-hor';

const localReducers = {};

const get = () => localReducers;

const add = (ns, reducer) =>
	localReducers[ns] = firewall(ns)(reducer);

const remove = ns =>
	delete localReducers[ns];

export default {
	get,
	add,
	remove
};