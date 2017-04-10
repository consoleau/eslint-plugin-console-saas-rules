'use strict';

const _ = require('lodash');

module.exports = {
  isAngularModuleCall: function (node) {
    return (node.object.name === 'angular' && node.property.name === 'module');
  },

  isClassEmpty: function (classNode) {
    const methods = classNode.body.body;
    return !methods || methods.length === 0;
  },

  getAssignmentsToThis: function(node) {
    return _.filter(node.value.body.body, (item) => {
      return item.type === 'ExpressionStatement' &&
        item.expression.type === 'AssignmentExpression' &&
        item.expression.operator === '=' &&
        item.expression.left.object.type === 'ThisExpression' &&
        item.expression.left.property.type === 'Identifier';
    });
  },

  getConstructor: function (classNode) {
    return _.find(classNode.body.body, (method) => method.type === 'MethodDefinition' && method.kind === 'constructor');
  },

  constructorHasNoParameters: function(constructorNode){
    return !constructorNode || constructorNode.value.params.length === 0;
  },

  isNodeSingleTopEntityInFile: function(node){
    return (!node.parent.body || node.parent.body.length === 1);
  },

  constructorContainsNgInject: function (constructorNode) {
    const constructorBody = constructorNode.value.body.body;
    return constructorBody[0].expression && constructorBody[0].expression.value === 'ngInject';
  },

  inlineDirectiveFuncContainsNgInject: function (callExpressionNode) {
    return callExpressionNode.callee.property.name === 'directive' &&
      callExpressionNode.arguments[1].body.body[0].expression.value === 'ngInject';
  }
};