module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', '@antfu/eslint-config-ts', 'plugin:prettier/recommended'],
  env: {
    node: true,
    jest: false,
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
    '@typescript-eslint/no-floating-promises': 'off',
    'arrow-parens': ['error', 'always'],
    'antfu/if-newline': 'off',
    'quotes': ['error', 'single', { avoidEscape: true }],
    'no-console': ['warn'],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '.',
            message:
              'Do not import from barrel files (index.{ts,js}) from within the same directory to avoid circular dependencies.',
          },
        ],
      },
    ],
  },
}
