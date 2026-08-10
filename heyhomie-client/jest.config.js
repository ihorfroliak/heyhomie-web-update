// Jest 26 is the last line that runs cleanly on the Node 12 pin in package.json,
// which is also what CI and the Docker image use. Newer Jest (and Vitest) need a
// newer runtime, so they are not an option until the engines pin moves.
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: ['components/**/*.js', 'pages/**/*.js', '!**/node_modules/**'],
    // twin.macro/styled-components run through babel-plugin-macros, which needs the
    // project .babelrc.js — babel-jest picks it up automatically.
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
};
