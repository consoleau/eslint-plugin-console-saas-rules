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
      'Property': (node) => {
        // looking for resolve objects, typically within angular bind functions...
        const resolveObject = utils.getNonEmptyResolveObject(node);
        if (resolveObject) {
          resolveObject.properties.forEach((property) => {
            // any array mapped to a property is typically an injection array...
            if (utils.isInjectionArray(property)) {
              context.report(node, 'Should use ngInject');
            }
          })
        }
      }
    }
  }
};
