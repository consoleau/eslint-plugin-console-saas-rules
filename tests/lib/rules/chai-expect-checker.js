"use strict";

const rule = require("../../../lib/rules/chai-expect-checker");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");

const ruleTester = new RuleTester();
ruleTester.run("chai-expect-checker", rule, {
  valid: [
    "chai.expect(x).to.throw()"
  ],
  invalid: [
    {
      code: "chai.expect(x).to.throw",
      errors: [ { message: "assertion throw is a property, but it should be a function"} ]
    }
  ]
});
