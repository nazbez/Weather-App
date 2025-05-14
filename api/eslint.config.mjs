import eslintPluginPrettier from 'eslint-plugin-prettier';
import fs from 'fs';
import path from 'path';

const prettierConfig = JSON.parse(fs.readFileSync(path.resolve('./.prettierrc.json'), 'utf-8'));

export default [
  {
    ignores: ['node_modules', 'logs', 'dist', 'public/*.js']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs'
    },
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': ['error', prettierConfig]
    }
  }
];
