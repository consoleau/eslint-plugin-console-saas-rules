'use strict';

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
        if (node.object.name !== 'angular' && node.property.name !== 'module') {
          return
        }
        if (node.parent.arguments[0].type === 'Literal') { // module name
          if (node.parent.parent.property.name === 'component') {
            if (node.parent.parent.parent.arguments[1].type !== 'ObjectExpression') {
              context.report(node, 'Component not created as in-line anonymous object');
            }
          }
        }
      }
    }
  }
};
