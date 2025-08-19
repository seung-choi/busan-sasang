module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'prettier', 'tailwindcss', 'simple-import-sort'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
    ],
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            typescript: {
                project: './tsconfig.app.json',
            },
        },
    },
    rules: {
        'prettier/prettier': 'error',
        'tailwindcss/classnames-order': 'warn',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/order': [
            'error',
            {
                groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                pathGroups: [
                    {
                        pattern: '@/**',
                        group: 'internal',
                    },
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'react/react-in-jsx-scope': 'off', // React 17+
    },
};
