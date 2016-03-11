var path = require("path");
var I18nPlugin = require("../index");
var languages = require('./i18n.config');


module.exports = Object.keys(languages).map(function(language) {
  return {
    name: language,
    entry: "./example",
    output: {
      path: path.join(__dirname, "js"),
      filename: language + ".output.js"
    },
    plugins: [
      new I18nPlugin(
        languages[language], language
      )
    ]
  };
});
