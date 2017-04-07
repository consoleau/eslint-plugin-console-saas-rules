'use strict';
const utils = require('./../utils/utils');
const _ = require('lodash');

module.exports = {
  meta: {
    docs: {
      description: "Should preserve the import name and case of injected items assigned to this",
      category: "Possible Errors",
      recommended: true
    },
    schema: []
  },
  create: (context) => {
    return {
      'ClassDeclaration': (node) => {
        // class has no methods/constructor, so nothing to inject...
        if (utils.isClassEmpty(node)) {
          return;
        }

        const constructor = utils.getConstructor(node);
        // no parameters in constructor, so nothing to assign...
        if (utils.constructorHasNoParameters(constructor)) {
          return;
        }

        const assignmentsToThis = utils.getAssignmentsToThis(constructor);

        constructor.value.params.forEach(param => {
          assignmentsToThis.forEach( assignment => {
            if (assignment.expression.right.name === param.name && assignment.expression.left.property.name !== param.name) {
              context.report(assignment, 'Should preserve the import name when assigning to this');
            }
          });
        });
      }
    };
  }
};
