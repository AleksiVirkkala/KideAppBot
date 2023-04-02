module.exports = {
  "root": true,
  "extends": [
    "base",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react/prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/no-empty-function": 0
  },
  "plugins": ["prettier", "react", "import", "jsx-a11y", "@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": ["./tsconfig.json", "../backend/tsconfig.json"]
      }
    }
  }
}
