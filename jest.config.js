module.exports = {
  preset: "ts-jest",
  testEnvironment: "screeps-jest",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  collectCoverageFrom: [
    'src/**/*.{js,ts}'
  ],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/dist/',
    '\\.d\\.ts$',
    'src/utils/ErrorMapper.ts'
  ],

  moduleDirectories: [
    'node_modules',
    'src'
  ],

  testMatch: [
    '**/*.spec.ts',
    '!**/node_modules/**',
    '!**/dist/**'
  ]};
