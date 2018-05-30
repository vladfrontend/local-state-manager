'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// checks if the action object meets the passed rules
var meetsRules = function meetsRules(rules, action) {
	return rules.every(function (_ref) {
		var key = _ref.key,
		    value = _ref.value;
		return !action[key] || action[key] === value;
	});
};

function Take() {
	var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	var _take = function _take(actionType) {
		return (0, _effects.call)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
			var action;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							if (!true) {
								_context.next = 8;
								break;
							}

							_context.next = 3;
							return (0, _effects.take)(actionType);

						case 3:
							action = _context.sent;

							if (!meetsRules(rules, action)) {
								_context.next = 6;
								break;
							}

							return _context.abrupt('return', action);

						case 6:
							_context.next = 0;
							break;

						case 8:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, this);
		}));
	};

	return function (key, value) {
		if (typeof value === 'string') {
			return new Take(rules.concat({ key: key, value: value }));
		} else {
			return _take.apply(undefined, arguments);
		}
	};
}

exports.default = new Take();