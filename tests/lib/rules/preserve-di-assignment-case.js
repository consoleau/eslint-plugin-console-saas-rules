"use strict";

const rule = require("../../../lib/rules/preserve-di-assignment-case");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");

const ruleTester = new RuleTester();
ruleTester.run("preserve-di-assignment-case", rule, {
    valid: [ `
class MyClass {
    constructor(MyService, MyService2) {
        this.MyService = MyService;
        this.MyService2 = MyService2;
    }
}`],
    invalid: [
        {
            code: `
class MyClass {
    constructor(MyService, MyService2, MyService3) {
        this.nyService = MyService;
        this.nyService2 = MyService2;
        this.MyService3 = MyService3;
    }
}
            `,
            errors: [
              {message: "Should preserve the import name when assigning to this"},
              {message: "Should preserve the import name when assigning to this"}
            ]
        }
    ]
});
