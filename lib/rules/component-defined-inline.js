'use strict';
const utils = require('./../utils/utils');

module.exports = {
  meta: {
    docs: {
      description: "Ensure component object is defined inline, and not created as a class or named object",
      category: "Possible Errors",
      recommended: true
    },
    schema: []
  },
  create: (context) => {
    return {
      'MemberExpression': (node) => {
        if (!utils.isAngularModuleCall(node)) {
          return
        }
        const angularDefinitionType = node.parent.parent.property.name
        if (angularDefinitionType === 'component') {
          const angularComponentBodyType = node.parent.parent.parent.arguments[1].type
          if (angularComponentBodyType !== 'ObjectExpression') {
            context.report(node, 'Component not created as in-line anonymous object');
          }
        }
      }
    }
  }
};
