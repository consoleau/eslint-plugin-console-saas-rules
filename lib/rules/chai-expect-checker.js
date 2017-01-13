'use strict';

const _ = require('lodash');

const getLastMemberExpression = function(memberExpression) {

  let currentNode = memberExpression;
  while (currentNode.parent.type === 'MemberExpression') {
    currentNode = currentNode.parent;
  }
  return currentNode;
};

// TODO 3 options:
// 1. either pass in the accessorTypes in the .eslintrc
// 1. setup up "environments"
// 1. programattically inspect all the assertMethods

const accessorTypes = {
  'a': 'function',
  'an': 'function',
  'equal': 'function',
  'property': 'function',
  'ok': 'property',
  'true': 'property',
  'false': 'property',
  'null': 'property',
  'undefined': 'property',
  'NaN': 'property',
  'exist': 'property',
  'empty': 'property',
  'eql': 'function',
  'above': 'function',
  'least': 'function',
  'below': 'function',
  'most': 'function',
  'within': 'function',
  'instanceof': 'function',
  'ownProperty': 'function',
  'ownPropertyDescriptor': 'function',
  'lengthOf': 'function',
  'match': 'function',
  'string': 'function',
  'key': 'function',
  'keys': 'function',
  'throw': 'function',
  'throws': 'function',
  'respondTo': 'function',
  'satisfy': 'function',
  'closeTo': 'function',
  'members': 'function',
  'oneOf': 'function',
  'change': 'function',
  'increase': 'function',
  'decrease': 'function',
  'extensible': 'property',
  'sealed': 'property',
  'frozen': 'property',

  // chai-as-promised
  'fulfilled': 'property',
  'rejected': 'property',
  'rejectedWith': 'function',
  'become': 'function',

  // chai-dom
  'attr': 'function',
  'attribute': 'function',
  'class': 'function',
  'id': 'function',
  'html': 'function',
  'text': 'function',
  'value': 'function',
  'length': 'function',
  'contain': 'function',

  // chai-sinon
  'called': 'property',
  'calledOnce': 'property',
  'calledTwice': 'property',
  'calledThrice': 'property',
  'calledWithNew': 'property',
  'callCount': 'function',
  'calledBefore': 'function',
  'calledAfter': 'function',
  'calledOn': 'function',
  'calledWith': 'function',
  'calledWithExactly': 'function',
  'calledWithMatch': 'function',
  'returned': 'function',
  'thrown': 'function',

  // custom angular assertions
  'submitted': 'function',
  'validModel': 'property',
  'invalidModel': 'property',
  'ngHidden': 'property',
  'modelError': 'function',

  // custom content section element assertions
  'sectionPlaceholder': 'function',

  // custom date assertions
  'dateObject': 'function',

  // custom element assertions
  'visibleError': 'function',
  'visibleRowError': 'function',
  'textContentMatching': 'function',
  'elementsMatchingText': 'function',
  'checked': 'property',

  // custom radio assertions
  'selectedRadio': 'function',

  // custom table element assertions
  'tableData': 'function',
  'loadingTableSpinner': 'function'
};

module.exports = {
  meta: {
    docs: {
      description: "ensure chai props are called as props and chai methods are called as methods",
      category: "Possible Errors",
      recommended: true
    },
    schema: []
  },
  create: function(context) {
    return {
      'MemberExpression' : (node) => {
        if (node.object.name === 'chai' && node.property.name === 'expect') {
          if (node.parent.type === 'CallExpression') {
            const callExpression = node.parent;

            const rightmostMemberExpression = getLastMemberExpression(callExpression);

            const memberType = (rightmostMemberExpression.parent.type === 'CallExpression')
              ? 'function'
              : 'property';

            const oppositeOf = function(memberType) {
              if (memberType === 'function') {
                return 'property';
              } else {
                return 'function';
              }
            };

            const memberName = rightmostMemberExpression.property.name;

            if (_.has(accessorTypes, memberName)) {
              if (memberType !== accessorTypes[memberName]) {
                context.report(node, `assertion ${memberName} is a ${memberType}, but it should be a ${oppositeOf(memberType)}`);
              }
            } else {
              context.report(node, `assertion ${memberName} is not registered in the chai-expect-checker lint checker`);
            }
          }
        }
      }
    };
  }
};
