module.exports = {
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/src/$1"
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };