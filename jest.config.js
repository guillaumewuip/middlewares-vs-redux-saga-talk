// @see https://jestjs.io/docs/en/configuration.html

module.exports = {
  roots: [
    '<rootDir>',
  ],
  testEnvironment: 'jsdom',
  testRegex: [
    '\\.(test|spec)\\.[jt]sx?$',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@iadvize)/)',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};

