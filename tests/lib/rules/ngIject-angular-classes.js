"use strict";

const rule = require("../../../lib/rules/exporting-angular-module");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");
const myConfig = require('./index.js');

RuleTester.setDefaultConfig(myConfig);

const ruleTester = new RuleTester();
ruleTester.run("exporting-angular-module", rule, {
  valid: [
    `class MyComponentController {
        constructor($q) {
          'ngInject';
          this.$q = $q;
        }
      }
      angular.module('App').service('component1', {controller: MyComponentController});`,
    `class MyService {
        constructor($http) {
          'ngInject';
          this.$http = $http;
        }
      }
      angular.module('App').service('myService', MyService);`
  ],
  invalid: [
    {
      code: "export default angular.module('App').component('hello',{});",
      errors: [{message: "Should not export the return of angular.app()"}]
    }
  ]
});
