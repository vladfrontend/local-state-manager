function ActionEnhancer(addObj = {}) {

	const action = obj => Object.assign({}, obj, addObj);

	return function(key, value) {
		if (typeof key === 'string') {
			return new ExtendableAction(
				Object.assign({}, addObj, { key, value })
			);
		} else {
			return action(...arguments);
		}
	}
}

export default new ActionEnhancer;