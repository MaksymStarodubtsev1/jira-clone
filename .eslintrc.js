module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
         "ecmaVersion": 12,
         "sourceType": "module"
    },
    "extends": [
     "airbnb-base",
     "airbnb-typescript/base",
     "plugin:@typescript-eslint/recommended",
     "plugin:eslint-comments/recommended",
     "plugin:jest/recommended",
     "plugin:promise/recommended",
     "prettier"
     ],
    "env": { 
         "es2021": true,
         "node": true
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
     "prettier/prettier": "error",
     "import/prefer-default-export": "off",
     "import/no-default-export": "error",
     "no-use-before-define": [
         "error",
         {
             "functions": false,
             "classes": true,
             "variables": true
         }
     ],
     "@typescript-eslint/explicit-function-return-type": "off",
     "@typescript-eslint/no-use-before-define": [
         "error",
         {
             "functions": false,
             "classes": true,
             "variables": true,
             "typedefs": true
         }
     ],
     "import/no-extraneous-dependencies": "off"
 },
 "settings": {
     "import/resolver": {
         "typescript": {
             "alwaysTryTypes": true,
             "project": "./tsconfig.json"
         }
     }
 }
}
