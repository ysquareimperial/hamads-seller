// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // '@/…' aliases come from jsconfig.json and are resolved by Metro.
      'import/no-unresolved': 'off',
      // Data-fetching hooks start a request in an effect by design.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);
