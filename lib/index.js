'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _ConstDependency = require('webpack/lib/dependencies/ConstDependency');

var _ConstDependency2 = _interopRequireDefault(_ConstDependency);

var _NullFactory = require('webpack/lib/NullFactory');

var _NullFactory2 = _interopRequireDefault(_NullFactory);

var _MissingLocalizationError = require('./MissingLocalizationError');

var _MissingLocalizationError2 = _interopRequireDefault(_MissingLocalizationError);

var _extractArgs = require('./extractArgs');

var _extractArgs2 = _interopRequireDefault(_extractArgs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mesnyankin_k on 05.08.2016.
 */

var I18nextPlugin = function I18nextPlugin(i18next, lang) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var failOnMissing = _ref.failOnMissing;
  var _ref$functionName = _ref.functionName;
  var functionName = _ref$functionName === undefined ? '__' : _ref$functionName;
  var _ref$quotes = _ref.quotes;
  var quotes = _ref$quotes === undefined ? '\'' : _ref$quotes;
  (0, _classCallCheck3.default)(this, I18nextPlugin);

  _initialiseProps.call(this);

  this.i18next = i18next;
  this.lang = lang;
  this.failOnMissing = !!failOnMissing;
  this.functionName = functionName;
  this.quotes = quotes;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.apply = function (compiler) {
    var failOnMissing = _this.failOnMissing;
    var i18next = _this.i18next;
    var lang = _this.lang;
    var q = _this.quotes;

    compiler.plugin('compilation', function (compilation) {
      compilation.dependencyFactories.set(_ConstDependency2.default, new _NullFactory2.default());
      compilation.dependencyTemplates.set(_ConstDependency2.default, new _ConstDependency2.default.Template());
    });

    compiler.parser.plugin('call ' + _this.functionName, function call(expr) {
      var defaultOptions = {
        lng: lang,
        interpolation: {
          escapeValue: false
        }
      };

      var token = '';
      var options = {};

      switch (expr.arguments.length) {
        case 2:
          {
            try {
              token = (0, _extractArgs2.default)(expr.arguments[0]);
              options = (0, _extractArgs2.default)(expr.arguments[1]);

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(options)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var key = _step.value;

                  options[key] = q + '+' + options[key] + '+' + q;
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

              options = (0, _assign2.default)({}, defaultOptions, options);
            } catch (ex) {
              this.state.module.errors.push(ex);
            }

            break;
          }
        case 1:
          {
            try {
              token = (0, _extractArgs2.default)(expr.arguments[0]);
              options = defaultOptions;
            } catch (ex) {
              this.state.module.errors.push(ex);
            }

            break;
          }
        default:
          return;
      }

      var value = i18next.t(token, options);

      if (value === token) {
        var error = this.state.module[__dirname];

        if (!error) {
          error = this.state.module[__dirname] = new _MissingLocalizationError2.default(this.state.module, token, token);

          if (failOnMissing) {
            this.state.module.errors.push(error);
          } else {
            this.state.module.warnings.push(error);
          }
        } else if (error.requests.indexOf(token) < 0) {
          error.add(token, token);
        }
      }

      var quotedValue = q + value + q;
      var dep = new _ConstDependency2.default(quotedValue, expr.range);

      dep.loc = expr.loc;

      this.state.current.addDependency(dep);

      return true;
    });
  };
};

exports.default = I18nextPlugin;