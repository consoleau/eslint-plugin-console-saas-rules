'use strict';
const _ = require('lodash');
const traverse = require('traverse');

module.exports = {
  meta: {
    docs: {
      description: 'Should contain a custom error message for multiple assertions.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: []
  },
  create: context => {
    return {
      'ExpressionStatement': node => {

        if (_.get(node, 'expression.callee.name') !== 'it') {
          return;
        }

        const expectCallExpressions = [];
        const expressionBodyNode = _.get(node, 'expression.arguments[1].body.body');

        traverse(expressionBodyNode).forEach(function (thisNode) {
          if (isExpectCall(thisNode)) {
            expectCallExpressions.push(thisNode);
          }
        });

        if (expectCallExpressions.length > 1) {
          if (isErrorMessageMissing(expectCallExpressions) || isErrorMessageDuplicate(expectCallExpressions)) {
            context.report({node, message: 'Should contain a unique custom error message due to multiple assertions existing in the same "it" block'});
          }
        }
      }
    };
  }
};

//this captures "expect(" and "chai.expect(" only
function isExpectCall(thisNode) {
  const expectNode = {
    callee: {
      type: 'Identifier',
      name: 'expect'
    }
  };
  const chaiExpectNode = {
    callee: {
      object: {
        type: 'Identifier',
        name: 'chai'
      },
      property: {
        type: 'Identifier',
        name: 'expect'
      }
    }
  };
  return _.isMatch(thisNode, expectNode) || _.isMatch(thisNode, chaiExpectNode);
}

function isErrorMessageMissing(expectCallExpressions) {
  return _.find(expectCallExpressions, (expectationExpression) => _.get(expectationExpression, 'arguments[1].type') !== 'Literal');
}

function isErrorMessageDuplicate(expectCallExpressions) {
  const expectExpressionsValues = expectCallExpressions.map(expectationExpression => _.get(expectationExpression, 'arguments[1].value'));
  const uniqueExpectCallExpressions = expectExpressionsValues.filter(function(item, pos, self) {
    return self.indexOf(item) === pos;
  });
  return expectCallExpressions.length !== uniqueExpectCallExpressions.length;
}
