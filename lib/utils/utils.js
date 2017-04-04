'use strict';

const _ = require('lodash');

module.exports = {
  isAngularModuleCall: function (node) {
    return (node.object.name === 'angular' && node.property.name === 'module')
  },

  isClassEmpty: function (classNode) {
    const methods = classNode.body.body;
    return !methods || methods.length === 0;
  },

  getConstructor: function (classNode) {
    return _.find(classNode.body.body, (method) => method.type === 'MethodDefinition' && method.kind === 'constructor');
  },

  classConstructorContainsDirectiveProlog: function (constructorNode, prologueDirective) {
    const constructorBody = constructorNode.value.body.body;
    return constructorBody[0].expression && constructorBody[0].expression.value === prologueDirective
  },

  inlineDirectiveFuncContainsProlog: function (callExpressionNode, prologueDirective) {
    return callExpressionNode.callee.property.name === 'directive' &&
      callExpressionNode.arguments[1].body.body[0].expression.value === prologueDirective
  }
}