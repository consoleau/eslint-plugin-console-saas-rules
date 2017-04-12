"use strict";

const rule = require("../../../lib/rules/ngInject-resolve-objects");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");
const myConfig = require('./index.js');

RuleTester.setDefaultConfig(myConfig);

const ruleTester = new RuleTester();
ruleTester.run("ngInject-resolve-objects", rule, {
  valid: [
    `Provider.bind('view', {
        bindings: [{
          resolve: {
            Property: function (State) {
              'ngInject';
            },
            carIds: State => {
              'ngInject';
              return State.get('car.ids');
            }
          }
        }]
     });`
  ],

  invalid: [
    {
      code: `Provider.bind('view', {
                bindings: [{
                  resolve: {
                        BadProperty: ['State',  (State) => {
                        }],
                        BadProperty2: ['State',  (State) => {
                        }]
                      }
                    }]
                  });`,
      errors: [{message: "Should use ngInject"}, {message: "Should use ngInject"}]
    }
  ]
})
;
