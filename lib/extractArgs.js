'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = extractArgs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Kir on 06.08.2016.
 */

function extractArgs(arg) {
  switch (arg.type) {
    case 'Literal':
      return arg.value;
    case 'Identifier':
      return arg.name;
    case 'MemberExpression':
      return extractArgs(arg.object) + '.' + extractArgs(arg.property);
    case 'ObjectExpression':
      {
        var res = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(arg.properties)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            res[extractArgs(arg.properties[key].key)] = extractArgs(arg.properties[key].value);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return res;
      }
    default:
      throw new Error('I18nextPlugin. Unable to parse arg ' + arg + '.');
  }
}