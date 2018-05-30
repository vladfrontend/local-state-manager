'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
function ActionEnhancer() {
	var addObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


	var action = function action(obj) {
		return Object.assign({}, obj, addObj);
	};

	return function (key, value) {
		if (typeof key === 'string') {
			return new ExtendableAction(Object.assign({}, addObj, { key: key, value: value }));
		} else {
			return action.apply(undefined, arguments);
		}
	};
}

exports.default = new ActionEnhancer();