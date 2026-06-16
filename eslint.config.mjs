import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      '.next/**',
      '.next.codex*/**',
      '.open-next/**',
      '.wrangler/**',
      'node_modules/**',
      'public/data/prompts/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/error-boundaries': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^',
          varsIgnorePattern: '^',
          caughtErrorsIgnorePattern: '^',
        },
      ],
    },
  }
];

export default eslintConfig;
