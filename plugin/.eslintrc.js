const path = require('path')

module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'react-app', '@antfu', 'plugin:prettier/recommended'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['~', './src']],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      },
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      },
      webpack: {
        config: {
          resolve: {
            alias: {
              '~': path.resolve(__dirname, 'src'),
            },
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
          },
        },
      },
    },
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    '@typescript-eslint/indent': 'off',
    'arrow-parens': ['error', 'always'],
    'antfu/if-newline': 'off',
    'quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/prop-types': 'off',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false,
      },
    ],
    'import/no-unresolved': [
      'error',
      {
        ignore: ['\\.(scss|less|css)$', '\\.(png|svg|jpe?g)$', '^virtual:.*$'],
      },
    ],
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
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks:
          'useConditionalEffect|useCustomCompareEffect|useDebouncedEffect|useDeepCompareEffect|useIsomorphicLayoutEffect|useLifecycleLogger|useRafEffect|useThrottledEffect|useUpdateEffect|useEffectOnce',
      },
    ],
  },
}
