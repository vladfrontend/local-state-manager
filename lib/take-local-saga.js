'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

/**
 *  Factory that creates a generator for filtering out foreign local actions, i.e. actions with a different namespace,
 *  and actions with an action type different from the one passed to the generator function.
 *  If the action doesn't have any namespace, and it conforms to actionType passed to the generator function, then
 *  the action is allowed in.
 *
 * @param ns Namespace.
 * @returns {Function} Generator function that filters out actions.
 */

var createTakeLocalSaga = function createTakeLocalSaga(ns) {
  return (/*#__PURE__*/regeneratorRuntime.mark(function _callee(actionType) {
      var action;
      return regeneratorRuntime.wrap(function _callee$(_context) {
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

              if (!(!action.ns || action.ns === ns)) {
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
    })
  );
};

exports.default = createTakeLocalSaga;