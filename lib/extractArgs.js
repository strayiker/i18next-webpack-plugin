'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = extractArgs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Kir on 06.08.2016.
 */

function extractArgs(arg, q, wrap) {
  switch (arg.type) {
    case 'Literal':
      return arg.value;
    case 'Identifier':
      if (wrap) {
        return q + '+' + arg.name + '+' + q;
      }
      return arg.name;
    case 'BinaryExpression':
      return extractArgs(arg.left, q, true) + extractArgs(arg.right, q, true);
    case 'ObjectExpression':
      {
        var res = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(arg.properties), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            var key = extractArgs(arg.properties[i].key, q);
            res[key] = extractArgs(arg.properties[i].value, q, true);
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
      {
        this.state.module.errors.push(new Error('I18nextPlugin. Unable to parse arg ' + arg + '.'));
        return '';
      }
  }
}