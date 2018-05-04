"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isEmpty = exports.isEmpty = function isEmpty(obj) {
  return !Object.keys(obj).length;
};

var combineReducers = exports.combineReducers = function combineReducers(reducers) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var newState = Object.keys(reducers).reduce(function (newState, key) {
      newState[key] = reducers[key](state[key], action);
      return newState;
    }, {});

    var areEqual = Object.keys(state).every(function (key) {
      return state[key] === newState[key];
    });

    // if values of newState and values of state are equal, then return the old state
    // otherwise return the new state (new object)
    return areEqual ? state : newState;
  };
};