"use strict";

const rule = require("../../../lib/rules/exporting-angular-module");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");
const myConfig = require('./index.js');

RuleTester.setDefaultConfig(myConfig);

const ruleTester = new RuleTester();
ruleTester.run("exporting-angular-module", rule, {
  valid: [
    "angular.module('App').directive('me', function(){})",
    "angular.module('App').component('comp', {})",
    "export default class DisplayableError{}",
    "const mapper = {}; export default mapper;"
  ],
  invalid: [
    {
      code: "export default angular.module('App').component('hello',{});",
      errors: [{message: "Should not export the return of angular.app()"}]
    }
  ]
});
