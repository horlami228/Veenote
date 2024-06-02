export default  {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testMatch: ['**/dist/src/test/**/?(*.)+(spec|test).[jt]s?(x)'], // Look for test files in dist/src/test directory
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest', // Use babel-jest for transforming
  },
  moduleNameMapper: {
    '^(.*)\\.js$': '$1',
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};