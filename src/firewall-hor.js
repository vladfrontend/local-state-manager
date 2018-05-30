const localReducer = (key, value, reducer) =>
	(state, action) =>
		(!action[key] || action[key] === value) ?
			reducer(state, action) :
			state;

export default ns => localReducer.bind(null, 'ns', ns);