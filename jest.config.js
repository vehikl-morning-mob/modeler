module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
  ],
  verbose: true,
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    // '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!bpmn-moddle)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  testMatch: ['<rootDir>/tests/unit/**/*.spec.js'],
};




