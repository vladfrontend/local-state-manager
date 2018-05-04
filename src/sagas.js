import React from 'react';
import PropTypes from 'prop-types';

/*
* Provides saga middleware to context
*/

export default class extends React.Component {
	static propTypes = {
		children: PropTypes.object.isRequired,
		middleware: PropTypes.func.isRequired
	};

	static childContextTypes = {
		sagaMiddleware: PropTypes.func
	};

	getChildContext() {
		return {
			sagaMiddleware: this.props.middleware
		};
	}

	render() {
		return this.props.children;
	}
};