var I18nPlugin = require('../index');
var expect = require('chai').expect;


describe('I18nPlugin', function () {

  describe('extractArgs', function () {

    beforeEach(function () {
      this.instance = new I18nPlugin();
    });

    it('Literal', function () {
      var arg = {
        type: 'Literal',
        value: 'key'
      };

      expect(this.instance.extractArgs(arg))
        .to.be.eql('key');
    });

    it('Identifier', function () {
      var arg = {
        type: 'Identifier',
        name: 'test'
      };

      expect(this.instance.extractArgs(arg))
        .to.be.eql('test');
    });

    it('ObjectExpression', function () {
      var arg = {
        type: 'ObjectExpression',
        properties: [{
          type: 'Property',
          key: {
            type: 'Literal',
            value: 'what'
          },
          value: {
            type: 'Literal',
            value: 'i18next'
          }
        }, {
          type: 'Property',
          key: {
            type: 'Literal',
            value: 'how'
          },
          value: {
            type: 'Literal',
            value: 'awesome'
          }
        }]
      };

      expect(this.instance.extractArgs(arg))
        .to.be.eql({
          what: 'i18next',
          how: 'awesome'
        });
    })

  });

});
