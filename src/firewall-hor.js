/**
* Firewall function is the factory for firewall higher order reducers.
* Their purpose is to prevent actions from reaching to foreign reducers, that is which are bound to a different ns property
*
* @param {String} ns Namespace
*
* @return {Function} Higher order reducer
*
**/

const firewall = ns => firewallHOR.bind(null, ns);

const firewallHOR = (ns, reducer) =>
	(state, action) =>
		(!action.ns || action.ns === ns) ?
			reducer(state, action) :
			state;


export default firewall;