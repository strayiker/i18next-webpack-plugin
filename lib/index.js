'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _ConstDependency = require('webpack/lib/dependencies/ConstDependency');

var _ConstDependency2 = _interopRequireDefault(_ConstDependency);

var _NullFactory = require('webpack/lib/NullFactory');

var _NullFactory2 = _interopRequireDefault(_NullFactory);

var _i18nextSyncFsBackend = require('i18next-sync-fs-backend');

var _i18nextSyncFsBackend2 = _interopRequireDefault(_i18nextSyncFsBackend);

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

var _MissingLocalizationError = require('./MissingLocalizationError');

var _MissingLocalizationError2 = _interopRequireDefault(_MissingLocalizationError);

var _extractArgs = require('./extractArgs');

var _extractArgs2 = _interopRequireDefault(_extractArgs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */

var I18nextPlugin = function I18nextPlugin(i18nextOptions, lang, _ref) {
  var failOnMissing = _ref.failOnMissing;
  var _ref$functionName = _ref.functionName;
  var functionName = _ref$functionName === undefined ? '__' : _ref$functionName;
  var _ref$quotes = _ref.quotes;
  var quotes = _ref$quotes === undefined ? '\'' : _ref$quotes;
  (0, _classCallCheck3.default)(this, I18nextPlugin);

  _initialiseProps.call(this);

  this.lang = lang;
  this.failOnMissing = !!failOnMissing;
  this.functionName = functionName;
  this.quotes = quotes;

  this.i18next = _i18next2.default.use(_i18nextSyncFsBackend2.default).init(i18nextOptions);
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.apply = function (compiler) {
    var failOnMissing = _this.failOnMissing;
    var i18n = _this.i18next;
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
      var token = void 0;
      var options = void 0;

      switch (expr.arguments.length) {
        case 2:
          token = _extractArgs2.default.apply(this, [expr.arguments[0], q]);
          options = _extractArgs2.default.apply(this, [expr.arguments[1], q]);
          options = (0, _assign2.default)({}, defaultOptions, options);

          if (typeof token !== 'string' || (typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) !== 'object') {
            return;
          }

          break;
        case 1:
          token = _extractArgs2.default.apply(this, [expr.arguments[0], q, true]);
          options = defaultOptions;

          if (typeof token !== 'string') {
            return;
          }

          break;
        default:
          return;
      }

      var value = i18n.t(token, options);

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