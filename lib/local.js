'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _localReducers = require('./local-reducers');

var _localReducers2 = _interopRequireDefault(_localReducers);

var _actions = require('./actions');

var _takeLocalSaga = require('./take-local-saga');

var _takeLocalSaga2 = _interopRequireDefault(_takeLocalSaga);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A decorator function that connects the provided component to local state
 *
 * @param {Object} config Configuration object
 *
 * @param {String|Function} config.ns Namespace. The key name under which the data will be bound to the store.
 *        If a function is provided, it'll be called with the props object passed to a component; expected to return the string value, a namespace.
 *        Defaults to the name of a component.
 *
 * @param {Boolean} config.persist Should the data be persisted to the store when the component unmounts. Defaults to false.
 *
 * @param {Object|Function} config.state Initial state object.
 *        If the function is provided, it'll receive the global state, and props passed to the Wrapping Component; expected to return the initial state.
 *
 * @param {Function} config.reducer The reducer function.
 *        If config.state is specified, the initial state for the reducer will be taken from there
 *        Required if config.state is undefined, otherwise not.
 *
 * @param {Function} config.saga Saga to run (Generator function).
 * 				If not state.persist, it'll be cancelled when the component unmounts.
 * 				Not required.
 *
 * @returns {Function} HOC
 */

var local = function local(config) {
	return localHOC.bind(null, config);
};

var localHOC = function localHOC(config, WrappedComponent) {
	var _class, _temp2;

	var ConnectedWrappedComponent = (0, _reactRedux.connect)(function (state, _ref) {
		var ns = _ref.ns;
		return {
			state: state.local[ns]
		};
	})(WrappedComponent);

	return _temp2 = _class = function (_React$PureComponent) {
		_inherits(_class, _React$PureComponent);

		function _class() {
			var _ref2;

			var _temp, _this, _ret;

			_classCallCheck(this, _class);

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref2, [this].concat(args))), _this), _this.update = function (state, shouldReplace) {
				_this.context.store.dispatch((0, _actions.update)(_this.config.ns, state, shouldReplace));
			}, _this.reset = function () {
				var state = typeof _this.config.state === 'function' ?
				// recalculate state on every reset if state is a function
				_this.config.state(_this.context.store.getState(), _this.props) : _this.config.state;

				_this.update(state, true);
			}, _this.$ = function (action) {
				return _extends({}, action, {
					ns: _this.config.ns
				});
			}, _temp), _possibleConstructorReturn(_this, _ret);
		}

		_createClass(_class, [{
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				if (this.props.ns !== nextProps.ns || this.props.persist !== nextProps.persist) {
					throw new Error("Changing 'ns' or 'persist' prop of a mounted component with the local state is prohibited.");
				}
			}
		}, {
			key: 'componentWillMount',
			value: function componentWillMount() {
				// before the wrappedcomponent is mounted, we can adjust the config passed to the decorator
				// the code below must be in componentWillMount(), because it should set this.config that is going to be used in render()

				// make a copy of the config first
				var newConfig = _extends({}, config);

				// adjust ns
				if (typeof config.ns === 'function' && config.ns !== null) {
					newConfig.ns = config.ns(this.props);
				}
				if (newConfig.ns === undefined) {
					newConfig.ns = WrappedComponent.displayName || WrappedComponent.name || Math.random().toString();
				}

				// adjust persist
				if (typeof config.persist === 'function' && config.ns !== null) {
					newConfig.persist = config.persist(this.props);
				}

				// adjust state
				if (config.state === undefined) {
					newConfig.state = config.reducer(undefined, {});
				}

				// make it available for future access
				this.config = newConfig;

				var _context = this.context,
				    store = _context.store,
				    sagaMiddleware = _context.sagaMiddleware;

				var state = store.getState();

				// if the state already exists (i.e. persist = true) we do nothing
				// otherwise initialize it and etc.
				if (state.local[newConfig.ns] === undefined) {

					if (newConfig.reducer) {
						_localReducers2.default.add(newConfig.ns, newConfig.reducer);
					}

					// initialize the local state -- dispatch the action
					this.reset();

					// run only after the local state was initialized
					if (newConfig.saga) {
						this.runningSaga = sagaMiddleware.run(newConfig.saga, this.createPropsObject({
							// also pass takeLocal generator function configured to the namespace
							takeLocal: (0, _takeLocalSaga2.default)(newConfig.ns)
						}));
					}
				}
			}
		}, {
			key: 'createPropsObject',
			value: function createPropsObject() {
				var additionalProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
				var store = this.context.store;

				var state = store.getState();

				return _extends({}, this.props, {
					state: state.local[this.config.ns],
					ns: this.config.ns,
					update: this.update,
					reset: this.reset,
					$: this.$,
					dispatch: store.dispatch
				}, additionalProps);
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				var _config = this.config,
				    persist = _config.persist,
				    reducer = _config.reducer,
				    ns = _config.ns;


				if (!persist) {
					if (reducer) {
						_localReducers2.default.remove(ns);
					}

					if (this.runningSaga) {
						this.runningSaga.cancel();
					}
					// should go after deleting the reducer
					// otherwise the reducer will be still present, but its state is undefined
					this.context.store.dispatch((0, _actions.destroy)(ns));
				}
			}
		}, {
			key: 'render',
			value: function render() {
				var props = this.createPropsObject();

				//return the wrapped component only when the local state is ready for consumption
				if (props.state === undefined) return null;
				return _react2.default.createElement(ConnectedWrappedComponent, this.createPropsObject());
			}
		}]);

		return _class;
	}(_react2.default.PureComponent), _class.contextTypes = {
		store: _propTypes2.default.object,
		sagaMiddleware: _propTypes2.default.func
	}, _temp2;
};

exports.default = local;