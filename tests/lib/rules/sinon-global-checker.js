"use strict";

const rule = require("../../../lib/rules/sinon-global-checker");
const RuleTester = require("../../../node_modules/eslint/lib/testers/rule-tester");

const ruleTester = new RuleTester();
ruleTester.run("sinon-global-checker", rule, {
	valid: [
		`beforeEach(function () {
	        this.context.loggerSpy = this.sinon.spy(logger, 'error');
	   });`,
		`beforeEach(function () {
	        this.context.loggerSpy = this.sinon.stub(logger, 'error');
	   });`,
		`beforeEach(function () {
	        this.context.loggerSpy = this.sinon.mock(logger, 'error');
	   });`,
		`function stubRemoteResponseSuccess(context, stubbedResponse, sinon) {
		  const returnMockedVersion = Promise.resolve(stubbedResponse);
		  sinon.stub(context.pollingService, '_getFromRemoteUrl', () => returnMockedVersion);
		}`
	],
	invalid: [
		{
			code:
				`beforeEach(function () {
					this.context.loggerSpy = sinon.spy(logger, 'error');
				});
				beforeEach(function () {
					this.context.loggerSpy = sinon.stub(logger, 'error');
				});
				beforeEach(function () {
					this.context.loggerSpy = sinon.mock(logger, 'error');
				});`,
			errors: [
				{ message: "Should use the sinon sandbox available on this.sinon" },
				{ message: "Should use the sinon sandbox available on this.sinon" },
				{ message: "Should use the sinon sandbox available on this.sinon" }
			]
		}
	]
});
