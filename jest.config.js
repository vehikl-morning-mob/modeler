module.exports = {
  preset: 'jest-puppeteer',
  globalSetup: './tests/puppeteerSetup/setup.js',
  globalTeardown: './tests/puppeteerSetup/teardown.js',
  testEnvironment: './tests/puppeteerSetup/puppeteer_environment.js',
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
  },
  // setupFiles: [
  //   '<rootDir>/src/setup/initialLoad.js',
  //   '<rootDir>/src/setup/defaultNodes.js',
  //   '<rootDir>/src/setup/globals.js',
  // ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(bpmn-moddle|moddle))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  testURL: 'http://localhost:8080/',
};
