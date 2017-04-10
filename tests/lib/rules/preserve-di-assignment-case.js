"use strict";

const rule = require("../../../lib/rules/preserve-di-assignment-case");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");
const myConfig = require('./index.js');

RuleTester.setDefaultConfig(myConfig);

const ruleTester = new RuleTester();
ruleTester.run("preserve-di-assignment-case", rule, {
  valid: [
    `class MyTestService1 {
      constructor(MyService, MyService2) {
          this.MyService = MyService;
          this.MyService2 = MyService2;
      }
    }
    angular.module('App').service('MyTestService', MyTestService1);
`,
    `class ConfigInjectService {
      constructor(CONFIG) {
          this.TIMEOUT = CONFIG.TIMEOUT;
      }
    }
    angular.module('App').service('ConfigInjectService', ConfigInjectService);
`,
    `class ConfigInjectService {
      constructor({ CONFIG, SomethingElse}) {
          this.something = new Decimal(0);
      }
    }
    angular.module('App').service('ConfigInjectService', ConfigInjectService);
`],
  invalid: [{
    code:
      `class MyTestService2 {
        constructor(MyService, MyService2, MyService3) {
            this.myService = MyService;
            this.MyCustomServiceHolder = MyService2;
            this.MyService3 = MyService3;
        }
      }
      angular.module('App').service('MyTestService', MyTestService2);
    `,
    errors: [
      {message: "Should preserve the import name when assigning to this"},
      {message: "Should preserve the import name when assigning to this"}
    ]
  }]
});
