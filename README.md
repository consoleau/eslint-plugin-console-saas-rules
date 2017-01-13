# eslint-plugin-console-saas-rules

A collection of eslint rules to check conventions used in the console saas web repo. Will cover a variety of ES6, Angular, and bespoke conecerns.
## Usage

Add `console-saas-rules` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "console-saas-rules"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "console-saas-rules/chai-expect-checker": "error"    }
}
```

## Supported Rules

* chai-expect-checker : verify that chai assertion methods are called as methods and chai assertion properties are called as properties

## Development

Here are some relevant resources for figuring out how this works:

* AST explorer : http://astexplorer.net/ - paste in code to see the AST tree
* Blog post : https://www.kenneth-truyers.net/2016/05/27/writing-custom-eslint-rules/ - A blog describing the process (justs scratches the surface thought), good intro
* The spec/tutorial for writing rules : http://eslint.org/docs/developer-guide/working-with-rules
* The spec/tutorial for plugins : http://eslint.org/docs/developer-guide/working-with-plugins
* Think of an existing rule that relates to your task, and go look at the definition in `./node_modules/eslint/` module

### run tests

`npm test`.



