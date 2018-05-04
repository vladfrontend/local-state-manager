export const LOCAL_STATE_DESTROY = 'LOCAL_STATE_DESTROY';
export const LOCAL_STATE_UPDATE = 'LOCAL_STATE_UPDATE';

export const destroy = ns => ({
	type: LOCAL_STATE_DESTROY,
	ns
});

export const update = (ns, state, replace) => ({
	type: LOCAL_STATE_UPDATE,
	ns,
	state,
	replace
});