"use strict";

const rule = require("../../../lib/rules/component-defined-inline");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");

const ruleTester = new RuleTester();
ruleTester.run("component-defined-inline", rule, {
  valid: [
    "angular.module('App').component('foo', {});",
    "angular.mock.module('App', { TenantAgreement: tenantAgreement });"
  ],
  invalid: [
    {
      code: "var MyComponent={}; angular.module('App').component('foo', MyComponent);",
      errors: [{message: "Component not created as in-line anonymous object"}]
    }
  ]
});
