/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
var ConstDependency = require("webpack/lib/dependencies/ConstDependency");
var NullFactory = require("webpack/lib/NullFactory");
var i18next = require('i18next');
var clc = require('cli-color');


i18next.on('missingKey', function(lngs, namespace, key, res) {
  if (lngs !== 'basic') {
    console.log(clc.yellow('[' + lngs + '] key `' + namespace + ':' + key + '` not found'));
  }
});

function I18nPlugin(i18nOptions, lang, functionName, quotes) {
  this.lang = lang;
  this.functionName = functionName || '__';
  this.quotes = quotes || '\'';

  i18next.init(i18nOptions);
}

function extractArgs(arg) {

  switch (arg.type) {
    case 'Literal':
      return arg.value;
    case 'Identifier':
      return arg.name;
    case 'ObjectExpression':
      var res = {};
      for (i in arg.properties) {
        res[extractArgs(arg.properties[i].key)] = extractArgs(arg.properties[i].value);
      }
      return res;
    default:
      console.log(clc.red('unable to parse arg ' + arg));
      return '';
  }
}


I18nPlugin.prototype.apply = function(compiler) {

  var q = this.quotes;
  var lang = this.lang;

  compiler.plugin("compilation", function(compilation) {
    compilation.dependencyFactories.set(ConstDependency, new NullFactory());
    compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
  });

  compiler.parser.plugin("call " + this.functionName, function(expr) {
    var args = expr.arguments.map(function(arg) {return extractArgs(arg)});

    i18next.changeLanguage(lang, function (err, t) {
      var value = q + t.apply(i18next, args) + q;

      var dep = new ConstDependency(value, expr.range);
      dep.loc = expr.loc;
      this.state.current.addDependency(dep);

    }.bind(this));

    return true;
  });

};

I18nPlugin.prototype.extractArgs = extractArgs;


module.exports = I18nPlugin;
