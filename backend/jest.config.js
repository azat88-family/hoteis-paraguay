module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js?(x)'],
  // Fix for "ReferenceError: regeneratorRuntime is not defined" if using async/await
  // and not using babel (e.g. if targeting a Node version that supports it natively)
  // setupFilesAfterEnv: ['regenerator-runtime/runtime'], // Not always needed, depends on Node version and Babel setup
};
