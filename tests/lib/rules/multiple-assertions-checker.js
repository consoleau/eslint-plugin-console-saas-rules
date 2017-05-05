"use strict";

const rule = require("../../../lib/rules/multiple-assertions-checker");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");

const ruleTester = new RuleTester();
ruleTester.run("multiple-assertions-checker", rule, {
  valid: [
    `describe('functionUnderTest():', function() {
      it('should do things under test', function() {
        const result = { a: true, b: false };
        expect(result.a).to.equal(true);
      });
    });`,
    `describe('functionUnderTest():', function() {
      it('should do things under test', function() {
        const result = { a: true, b: false };
        expect(result.a, 'result.a test failed').to.equal(true);
        expect(result.b, 'result.b test failed').to.equal(false);
      });
    });`,
    `describe('when a property is selected', function() {
      beforeEach(function() {
        this.context = buildContext();
        angular.mock.inject((SelectPropertyUiData, $q) => {
          sinon.stub(SelectPropertyUiData, 'findProperty').returns($q.resolve([ property ]));
        });
        this.context.component.selectProperty = property.propertyId;
      });

      it('should enable the "Save & Next" button', function () {
        expect(this.context.component.nextStepButton).to.not.be.disabled;
      });

      it('should not show the input box', function () {
        expect(this.context.component.selectProperty.element).to.not.exist;
      });
    });`,
    `describe('functionUnderTest():', function() {
      it('should do things under test', function() {
        const result = { a: true, b: false };
        chai.expect(result.a, 'result.a test failed').to.equal(true);
        chai.expect(result.b, 'result.b test failed').to.equal(false);
      });
    });`
  ],
  invalid: [
    {
      errors: [{ message: 'Should contain a unique custom error message due to multiple assertions existing in the same "it" block' }],
      code:
        `describe('functionUnderTest():', function() {
          it('should do things under test', function() {
            const result = { a: true, b: false };
            expect(result.a).to.equal(true);
            expect(result.b).to.equal(false);
          });
        });`
    },
    {
      errors: [{ message: 'Should contain a unique custom error message due to multiple assertions existing in the same "it" block' }],
      code:
        `describe('functionUnderTest():', function() {
          it('should do things under test', function() {
            const result = { a: true, b: false };
            expect(result.a, 'result.a test failed').to.equal(true);
            expect(result.b).to.equal(false);
          });
        });`
    },
    {
      errors: [{ message: 'Should contain a unique custom error message due to multiple assertions existing in the same "it" block' }],
      code:
        `describe('when a property is selected', function() {
          beforeEach(function() {
            this.context = buildContext();
            angular.mock.inject((SelectPropertyUiData, $q) => {
              sinon.stub(SelectPropertyUiData, 'findProperty').returns($q.resolve([ property ]));
            });
            this.context.component.selectProperty = property.propertyId;
          });

          it('should enable the "Save & Next" button', function () {
            expect(this.context.component.nextStepButton).to.not.be.disabled;
            expect(this.context.component.nextStepButton).to.not.be.disabled;
            expect(this.context.component.nextStepButton).to.not.be.disabled;
          });

          it('should not show the input box', function () {
            expect(this.context.component.selectProperty.element).to.not.exist;
          });
        });`
    },
    {
      errors: [{ message: 'Should contain a unique custom error message due to multiple assertions existing in the same "it" block' }],
      code:
        `describe('functionUnderTest():', function() {
          it('should do things under test', function() {
            const result = { a: true, b: false };
            chai.expect(result.a).to.equal(true);
            chai.expect(result.b).to.equal(false);
          });
        });`
    },
    {
      errors: [{ message: 'Should contain a unique custom error message due to multiple assertions existing in the same "it" block' }],
      code:
        `describe('functionUnderTest():', function() {
          it('should do things under test', function() {
            const result = { a: true, b: false, c: true };
            expect(result.a, 'result.a test failed').to.equal(true);
            expect(result.b, 'result.b test failed').to.equal(false);
            expect(result.c, 'result.a test failed').to.equal(true);
          });
        });`
    }
  ]
});
