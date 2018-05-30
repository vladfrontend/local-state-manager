'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ActionEnhancer() {
	var addObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


	var action = function action(obj) {
		return Object.assign({}, obj, addObj);
	};

	return function (key, value) {
		if (typeof key === 'string') {
			return new ActionEnhancer(Object.assign({}, addObj, (0, _defineProperty3.default)({}, key, value)));
		} else {
			return action.apply(undefined, arguments);
		}
	};
}

exports.default = new ActionEnhancer();