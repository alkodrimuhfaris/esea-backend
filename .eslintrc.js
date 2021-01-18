module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["standard", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "warn",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    camelcase: 0,
  },
};
