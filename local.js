import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import localReducers from './local-reducers';
import { destroy, update } from './actions';

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

const local = config => localHOC.bind(null, config);


const localHOC = (config, WrappedComponent) => {

	const ConnectedWrappedComponent = connect((state, { ns }) => ({
		state: state.local[ns]
	}))(WrappedComponent);

	return class extends React.PureComponent {
		static contextTypes = {
			store: PropTypes.object,
			sagaMiddleware: PropTypes.func
		};

		componentWillReceiveProps(nextProps) {
			if (
				this.props.ns !== nextProps.ns ||
				this.props.persist !== nextProps.persist
			) {
				throw new Error("Changing 'ns' or 'persist' prop of a mounted component with the local state is prohibited.")
			}
		}

		componentWillMount() {
			// before the wrappedcomponent is mounted, we can adjust the config passed to the decorator
			// the code below must be in componentWillMount(), because it should set this.config that is going to be used in render()

			// make a copy of the config first
			const newConfig = { ...config };

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

			const { store, sagaMiddleware } = this.context;
			const state = store.getState();

			// if the state already exists (i.e. persist = true) we do nothing
			// otherwise initialize it and etc.
			if (state.local[newConfig.ns] === undefined) {

        if (newConfig.reducer) {
          localReducers.add(
            newConfig.ns,
            newConfig.reducer
          );
        }

        // initialize the local state -- dispatch the action
        this.reset();

        // run only after the local state was initialized
        if (newConfig.saga) {
          this.runningSaga = sagaMiddleware.run(newConfig.saga, this.createPropsObject());
        }
			}
		}

		update = (state, shouldReplace) => {
			this.context.store.dispatch(
				update(
					this.config.ns,
					state,
					shouldReplace
				)
			);
		};

		createPropsObject() {
      const state = this.context.store.getState();

			return {
				...this.props,
				state: state.local[this.config.ns],
				ns: this.config.ns,
				update: this.update,
				reset: this.reset,
				localDispatch: this.localDispatch
			};
		}

		reset = () => {
			const state =
				typeof this.config.state === 'function' ?
				// recalculate state on every reset if state is a function
				this.config.state(
					this.context.store.getState(),
					this.props
				) :
				this.config.state;

			this.update(state, true);
		};

		localDispatch = action => {
      this.context.store.dispatch({
        ...action,
        ns: this.config.ns
      });
    };

		componentWillUnmount() {
			const { persist, reducer, ns } = this.config;

			if (!persist) {
				if (reducer) {
					localReducers.remove(ns);
				}

				if (this.runningSaga) {
					this.runningSaga.cancel();
				}
				// should go after deleting the reducer
				// otherwise the reducer will be still present, but its state is undefined
				this.context.store.dispatch( destroy(ns) );
			}
		}

		render() {
			const props = this.createPropsObject();

      //return the wrapped component only when the local state is ready for consumption
			if (props.state === undefined) return null;
			return (
				<ConnectedWrappedComponent
					{...this.createPropsObject()}
				/>
			);
		}
	}

};

export default local;