// .eslintrc.cjs
// eslint-disable-next-line no-undef
module.exports = {
  parserOptions: {
    ecmaVersion: 2020, // Supports optional chaining (?.)
    sourceType: "module", // For ES modules
    ecmaFeatures: {
      jsx: true, // Enable JSX for React
    },
  },
  env: {
    browser: true, // For browser globals like window
    es2020: true, // Enables ES2020 features
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "react-hooks"],
  rules: {
    "react/prop-types": "off", // Disable prop-types for JavaScript project
    "react/react-in-scope": "off",
  },
  settings: {
    react: {
      version: "detect", // Auto-detect React version
    },
  },
};
