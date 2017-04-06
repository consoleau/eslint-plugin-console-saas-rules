'use strict';
const utils = require('./../utils/utils');

module.exports = {
  meta: {
    docs: {
      description: "Should use ngInject",
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
        // no parameters in constructor, so nothing to inject...
        if (utils.constructorHasNoParameters(constructor)) {
          return
        }

        // ngInject already present in constructor
        if (utils.constructorContainsNgInject(constructor)) {
          return;
        }

        // the class is the only top level entity, so assumption is it is not angular related class.
        if (utils.isNodeSingleTopEntityInFile(node)) {
          return;
        }

        //check siblings of the class entity, looking for angular.module() ...
        node.parent.body.forEach((entry) => {
            if (entry.type === 'ExpressionStatement') {
              if (entry.expression.callee && entry.expression.callee.type === 'MemberExpression') {
                if (utils.isAngularModuleCall(entry.expression.callee.object.callee)) {
                  // checks not required for our factory classes
                  if (entry.expression.callee.property.name === 'factory') {
                    return;
                  }
                  // our inline directves are functions that can include the 'ngInject',
                  // before instantiating the controller class
                  if (utils.inlineDirectiveFuncContainsNgInject(entry.expression))
                    return;
                }
                context.report(node, 'Should use ngInject');
              }
            }
          }
        );
      }
    }
  }
};
