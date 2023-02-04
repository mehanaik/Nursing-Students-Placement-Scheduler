module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ["plugin:react/recommended", "airbnb"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
    },
    extends: ["plugin:react/jsx-runtime"],

    plugins: ["react"],
    rules: {
        quotes: ["error", "double"],
        "comma-dangle": ["error", "never"],
        "no-unused-vars": ["off"],
        "import/prefer-default-export": 0,
        "react/jsx-indent": ["error", 4],
        "react/react-in-jsx-scope": 0,
        indent: [
            2,
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                ArrayExpression: "first",
                outerIIFEBody: 1,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1
                },
                CallExpression: {
                    arguments: 1
                },
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                ignoredNodes: [
                    "JSXElement",
                    "JSXElement > *",
                    "JSXAttribute",
                    "JSXIdentifier",
                    "JSXNamespacedName",
                    "JSXMemberExpression",
                    "JSXSpreadAttribute",
                    "JSXExpressionContainer",
                    "JSXOpeningElement",
                    "JSXClosingElement",
                    "JSXText",
                    "JSXEmptyExpression",
                    "JSXSpreadChild"
                ],
                ignoreComments: false
            }
        ],
        "react/jsx-indent-props": [2, 4],
        "react/jsx-filename-extension": [
            1,
            {
                extensions: [".js", ".jsx"]
            }
        ],
        "no-param-reassign": 0,
        "no-return-assign": [0, "always"],
        "react/no-array-index-key": 0,
        "react/prop-types": 0,
        "max-len": [
            "error",
            200,
            2,
            {
                ignoreUrls: true,
                ignoreComments: false,
                ignoreRegExpLiterals: true,
                ignoreStrings: false,
                ignoreTemplateLiterals: true
            }
        ],
        "jsx-a11y/alt-text": 0,
        "jsx-a11y/label-has-associated-control": 0,
        "jsx-a11y/label-has-for": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "jsx-a11y/no-noninteractive-element-interactions": 0,
        "no-plusplus": 0,
        "linebreak-style": 0,
        "react/jsx-max-props-per-line": [1, { maximum: { single: 2, multi: 1 } }],
        "jsx-a11y/mouse-events-have-key-events": 0,
        "react/jsx-props-no-spreading": 0,
        "react/destructuring-assignment": 0,
        "no-empty": 0,
        "no-underscore-dangle": 0,
        "consistent-return": 0,
         // suppress errors for missing 'import React' in files
   "react/react-in-jsx-scope": "off",
   // allow jsx syntax in js files (for next.js project)
  "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }], //should add ".ts" if typescript project
    }
};
