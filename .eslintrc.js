module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
         "ecmaVersion": 12,
         "sourceType": "module"
    },
    "extends": ["eslint:recommended", "prettier"],
    "env": { 
         "es2021": true,
         "node": true
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
         "no-console": "error"
    }
}
