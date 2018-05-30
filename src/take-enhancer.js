import { take, call } from 'redux-saga/effects';

// checks if the action object meets the passed rules
const meetsRules = (rules, action) =>
	rules.every(({ key, value }) =>
		!action[key] || action[key] === value
	);

function Take(rules = []) {
	const _take = actionType =>
		call(function* () {
			while (true) {
				const action = yield take(actionType);
				if (meetsRules(rules, action)) {
					return action;
				}
			}
		});

	return function(key, value) {
		if (typeof value === 'string') {
			return new Take(
				rules.concat({ key, value })
			);
		} else {
			return _take(...arguments);
		}
	};
}

export default new Take;


