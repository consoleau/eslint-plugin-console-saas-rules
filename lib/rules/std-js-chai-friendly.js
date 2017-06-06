/**
 * @fileoverview Flag expressions in statement position that do not side effect
 * TODO -- forked and pulled in to console ruleset, awaiting a PR from original
 * @author Michael Ficarra
 * @author Ihor Diachenko
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow unused expressions",
            category: "Best Practices",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowShortCircuit: {
                        type: "boolean"
                    },
                    allowTernary: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ]
    },
    create: function (context) {
        var config = context.options[0] || {},
            allowShortCircuit = config.allowShortCircuit || false,
            allowTernary = config.allowTernary || false;

        /**
         * @param {ASTNode} node - any node
         * @returns {boolean} whether the given node structurally represents a directive
         */
        function looksLikeDirective(node) {
            return node.type === "ExpressionStatement" &&
                node.expression.type === "Literal" && typeof node.expression.value === "string";
        }

        /**
         * @param {Function} predicate - ([a] -> Boolean) the function used to make the determination
         * @param {a[]} list - the input list
         * @returns {a[]} the leading sequence of members in the given list that pass the given predicate
         */
        function takeWhile(predicate, list) {
            for (var i = 0; i < list.length; ++i) {
                if (!predicate(list[i])) {
                    return list.slice(0, i);
                }
            }
            return list.slice();
        }

        /**
         * @param {ASTNode} node - a Program or BlockStatement node
         * @returns {ASTNode[]} the leading sequence of directive nodes in the given node's body
         */
        function directives(node) {
            return takeWhile(looksLikeDirective, node.body);
        }

        /**
         * @param {ASTNode} node - any node
         * @param {ASTNode[]} ancestors - the given node's ancestors
         * @returns {boolean} whether the given node is considered a directive in its current position
         */
        function isDirective(node, ancestors) {
            var parent = ancestors[ancestors.length - 1],
                grandparent = ancestors[ancestors.length - 2];

            return (parent.type === "Program" || parent.type === "BlockStatement" &&
                    (/Function/.test(grandparent.type))) &&
                    directives(parent).indexOf(node) >= 0;
        }

        /**
         * Determines whether or not a given node is a valid expression. Recurses on short circuit eval and ternary nodes if enabled by flags.
         * @param {ASTNode} node - any node
         * @returns {boolean} whether the given node is a valid expression
         */
        function isValidExpression(node) {
            if (allowTernary) {

                // Recursive check for ternary and logical expressions
                if (node.type === "ConditionalExpression") {
                    return isValidExpression(node.consequent) && isValidExpression(node.alternate);
                }
            }
            if (allowShortCircuit) {
                if (node.type === "LogicalExpression") {
                    return isValidExpression(node.right);
                }
            }

            return /^(?:Assignment|Call|New|Update|Yield|Await)Expression$/.test(node.type) ||
                (node.type === "UnaryExpression" && ["delete", "void"].indexOf(node.operator) >= 0);
        }

        /**
         * Determines whether or not a given node is a chai's expect statement.
         * e.g. expect(foo).to.eventually.be.true;
         * @param {ASTNode} node - any node
         * @returns {boolean} whether the given node is a chai expectation
         */
        function isChaiExpectation(node) {
            var expression = node.expression;
            if (expression.type !== 'MemberExpression') {
                return false;
            }

            var hasExpectCall =  Boolean(findExpectCall(expression.object));

            return hasExpectCall;
        }

        /**
         * Searches for the chai expect(...) call down the AST.
         * @param {ASTNode} node - any node
         * @returns {ASTNode} expect(...) call expression or null
         */
        function findExpectCall(node) {
            // Found expect(...) call, return the node
            if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'expect') {
                return node;
            }

            if (node.property && node.property.name === 'expect') {
                return node;
            }

            // Continue search up the AST if it's a member call
            if (node.type === 'MemberExpression') {
                return findExpectCall(node.object);
            }
            if (node.type === 'CallExpression') {
                return findExpectCall(node.callee);
            }

            // Stop search, expect(...) not found
            return null;
        };


        return {
            ExpressionStatement: function(node) {
                if (!isValidExpression(node.expression) && !isDirective(node, context.getAncestors()) && !isChaiExpectation(node)) {
                    context.report(node, "Expected an assignment or function call and instead saw an expression.");
                }
            }
        };
    }
};