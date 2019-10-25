module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        indent: [1, 4],
        'linebreak-style': [1, 'unix'],
        quotes: [1, 'single'],
        semi: [1, 'never'],
        'no-console': 'off',
        'max-classes-per-file': [1, 2]
    }
}
