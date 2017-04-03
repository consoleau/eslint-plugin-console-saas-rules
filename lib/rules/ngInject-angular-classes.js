'use strict';
const utils = require('./../utils/utils');

module.exports = {
  meta: {
    docs: {
      description: "Should not export the return of angular.app()",
      category: "Possible Errors",
      recommended: true
    },
    schema: []
  },
  create: (context) => {
    return {
      'ExportDefaultDeclaration': (node) => {
        const exportedObject = node.declaration;
        if (exportedObject) {
          if (exportedObject.type !== 'CallExpression' || exportedObject.callee.type !== 'MemberExpression') {
            return;
          }
          if (exportedObject.callee.object && exportedObject.callee.object.callee) {
            if (utils.isAngularModuleCall(exportedObject.callee.object.callee)) {
              context.report(node, 'Should not export the return of angular.app()');
            }
          }
        }
      }
    }
  }
};
