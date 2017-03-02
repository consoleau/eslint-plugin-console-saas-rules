const RuleTester = require('eslint/lib/testers/rule-tester');
const ruleTester = new RuleTester();
const rule = '../../../lib/rules/no-chai-as-promised-return';

ruleTester.run('no-chai-as-promised-return', rule, {
  valid: [
    `function someFunction() {
       return chai.expect(something).to.equal("someValue");
    }`
  ],
  invalid: [{
    code: `
    function someFunction() {
      return chai.expect(something).to.eventually.equal("someValue");
    }`,
    errors: [{
      message: 'Do not return promises in the client tests, your test will not work properly',
      type: 'ReturnStatement'
    }]
  }, {
    code: `
    function someFunction() {
      return expect(something).to.eventually.equal("someValue");
    }`,
    errors: [{
      message: 'Do not return promises in the client tests, your test will not work properly',
      type: 'ReturnStatement'
    }]
  }]
});
