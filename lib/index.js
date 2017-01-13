/**
 * @fileoverview
 * @author Kyle Zeeuwen
 */

const requireIndex = require('requireindex');
module.exports.rules = requireIndex(`${__dirname}/rules`);
