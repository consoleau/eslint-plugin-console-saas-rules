'use strict';
const utils = require('./../utils/utils');

const prologueDirective = 'ngInject';

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
        if (utils.isClassEmpty(node)) {
          return;
        }
        const constructor = utils.getConstructor(node);
        if (!constructor || constructor.value.params.length === 0) {
          return
        }
        if (utils.classConstructorContainsDirectiveProlog(constructor, prologueDirective)) {
          return;
        }
        if (!node.parent.body || node.parent.body.length === 1) {
          return;
        }
        node.parent.body.forEach((entry) => {
            if (entry.type === 'ExpressionStatement') {
              if (entry.expression.callee && entry.expression.callee.type === 'MemberExpression') {
                if (utils.isAngularModuleCall(entry.expression.callee.object.callee)) {
                  if (entry.expression.callee.property.name === 'factory') {
                    return;
                  }
                  if (utils.inlineDirectiveFuncContainsProlog(entry.expression, prologueDirective))
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
