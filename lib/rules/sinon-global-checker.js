'use strict';
const _ = require('lodash');

module.exports = {
	meta: {
		docs: {
			description: 'Should use the sinon sandbox available on this.sinon',
			category: 'Possible Errors',
			recommended: true
		},
		schema: []
	},
	create: context => {
		return {
			'MemberExpression': node => {
				if (node.object.name === 'sinon') {

					// exclude those passed in as a function param
					let thisNode = node;
					let sinonFunctionParamWasFound;
					while(thisNode.parent) {
						thisNode = thisNode.parent;

						if (thisNode.type === 'FunctionDeclaration') {
							if(_.some(thisNode.params, parameterData => parameterData.hasOwnProperty('name') && parameterData['name'] === 'sinon')) {
								sinonFunctionParamWasFound = true;
								break;
							}
						}
					}

					if (sinonFunctionParamWasFound) {
						return false;
					}

					context.report({node, message: 'Should use the sinon sandbox available on this.sinon'});
				}
			}
		};
	}
};
