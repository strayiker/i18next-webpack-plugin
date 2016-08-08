/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */

import ConstDependency from 'webpack/lib/dependencies/ConstDependency';
import NullFactory from 'webpack/lib/NullFactory';
import Backend from 'i18next-sync-fs-backend';
import i18next from 'i18next';
import MissingLocalizationError from './MissingLocalizationError';
import extractArgs from './extractArgs';


export default class I18nextPlugin {
  constructor(i18nextOptions, lang, {
    failOnMissing,
    functionName = '__',
    quotes = '\''
  }) {
    const defaults = {
      initImmediate: false
    };

    this.lang = lang;
    this.failOnMissing = !!failOnMissing;
    this.functionName = functionName;
    this.quotes = quotes;

    this.i18next = i18next.use(Backend)
      .init(Object.assign({}, defaults, i18nextOptions));
  }

  apply = (compiler) => {
    const failOnMissing = this.failOnMissing;
    const i18n = this.i18next;
    const lang = this.lang;
    const q = this.quotes;

    compiler.plugin('compilation', (compilation) => {
      compilation.dependencyFactories.set(ConstDependency, new NullFactory());
      compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
    });

    compiler.parser.plugin(`call ${this.functionName}`, function call(expr) {
      const defaultOptions = {
        lng: lang,
        interpolation: {
          escapeValue: false
        }
      };
      let token;
      let options;

      switch (expr.arguments.length) {
        case 2:
          token = extractArgs.apply(this, [expr.arguments[0], q]);
          options = extractArgs.apply(this, [expr.arguments[1], q]);
          options = Object.assign({}, defaultOptions, options);

          if (typeof token !== 'string' || typeof options !== 'object') {
            return;
          }

          break;
        case 1:
          token = extractArgs.apply(this, [expr.arguments[0], q, true]);
          options = defaultOptions;

          if (typeof token !== 'string') {
            return;
          }

          break;
        default:
          return;
      }

      const value = i18n.t(token, options);

      if (value === token) {
        let error = this.state.module[__dirname];
        if (!error) {
          error = this.state.module[__dirname] = new MissingLocalizationError(this.state.module, token, token);
          if (failOnMissing) {
            this.state.module.errors.push(error);
          } else {
            this.state.module.warnings.push(error);
          }
        } else if (error.requests.indexOf(token) < 0) {
          error.add(token, token);
        }
      }

      const quotedValue = q + value + q;
      const dep = new ConstDependency(quotedValue, expr.range);

      dep.loc = expr.loc;

      this.state.current.addDependency(dep);

      return true;
    });
  };
}