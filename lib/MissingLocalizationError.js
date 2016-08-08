'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */

var MissingLocalizationError = function (_Error) {
  (0, _inherits3.default)(MissingLocalizationError, _Error);

  function MissingLocalizationError(module, name, value) {
    (0, _classCallCheck3.default)(this, MissingLocalizationError);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MissingLocalizationError).call(this));

    _initialiseProps.call(_this);

    _this.name = 'MissingLocalizationError';
    _this.requests = [{ name: name, value: value }];
    _this.module = module;
    _this.buildMessage();

    if (typeof Error.captureStackTrace !== 'function') {
      _this.stack = new Error(_this.message).stack;
    } else {
      Error.captureStackTrace(_this, MissingLocalizationError);
    }
    return _this;
  }

  return MissingLocalizationError;
}(Error);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.buildMessage = function () {
    _this2.message = _this2.requests.map(function (request) {
      if (request.name === request.value) {
        return 'Missing localization: ' + request.name;
      }
      return 'Missing localization: (' + request.name + ') ' + request.value;
    }).join('\n');
  };

  this.add = function (name, value) {
    for (var i = 0; i < _this2.requests.length; i++) {
      if (_this2.requests[i].name === name) {
        return;
      }
    }
    _this2.requests.push({ name: name, value: value });
    _this2.buildMessage();
  };
};

exports.default = MissingLocalizationError;