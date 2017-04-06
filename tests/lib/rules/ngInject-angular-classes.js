"use strict";

const rule = require("../../../lib/rules/ngInject-angular-classes");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");
const myConfig = require('./index.js');

RuleTester.setDefaultConfig(myConfig);

const ruleTester = new RuleTester();
ruleTester.run("ngInject-angular-classes", rule, {
  valid: [
    `class MyComponentController {
        myMethod(){
        }
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
      angular.module('App').service('myService', MyService);`,
    `class MyClass {
        constructor(stuff) {
          this.stuff = stuff;
        }
      }
     MyClass.staticStuff={};`,
    `class MyDirective {
        constructor($timeout) {
          this.link = (scope, element) => {};
          $timeout(() => {console.log('hello');}, 0);
        }
      }
      angular.module('App').directive('myDirective', ($timeout) => {
        'ngInject';
        return new MyDirective($timeout);
      });`
  ],
  invalid: [
    {
      code: `class MyComponentController {
            constructor($q) {
              this.$q = $q;
            }
          }
          angular.module('App').service('component1', {controller: MyComponentController});`,
      errors: [{message: "Should use ngInject"}]
    },
    {
      code: `class MyComponentController {
            constructor($q) {
              this.$q = $q;
              'ngInject';
            }
          }
          angular.module('App').service('component1', {controller: MyComponentController});`,
      errors: [{message: "Should use ngInject"}]
    }
  ]
})
;
