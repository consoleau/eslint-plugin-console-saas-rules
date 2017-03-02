module.exports = {
  meta: {
    docs: {
      description: "disallow returning promises in client tests",
      category: "Possible Errors",
      recommended: true
    }
  },
  create: function (context) {
    return {
      ReturnStatement(node) {
        // No idea if this is a good idea, or if there's a better way to detect "expect(something).to.eventually" type expressions
        // using the AST node itself.
        const tokens = context.getSourceCode().getTokens(node);
        const expectIndex = tokens.findIndex(token => token.type === 'Identifier' && token.value === 'expect');

        if (expectIndex == -1) {
          return;
        }

        const eventuallyIndex = tokens.findIndex(token => token.type === 'Identifier' && token.value === 'eventually');

        if (eventuallyIndex > expectIndex) {
          context.report({
            node,
            message: 'Do not return promises in the client tests, your test will not work properly'
          });
        }
      }
    };
  }
};