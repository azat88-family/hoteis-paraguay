module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // For polyfills and global configurations
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // For mocking CSS imports
    // You might need to add other mappings here if you have path aliases in tsconfig.json
    // Example: '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  // transform: { // ts-jest preset usually handles this, but if not:
  //   '^.+\\.(ts|tsx)$': 'ts-jest',
  // },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
