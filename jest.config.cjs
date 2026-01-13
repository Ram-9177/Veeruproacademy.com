/** Jest configuration for transforming TS/TSX/JS/JSX via Babel. */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Use babel-jest to transform TS/TSX/JS/JSX for tests. It will pick up babel.config.js automatically.
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^.+\\.(png|jpg|jpeg|svg|gif)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1',
    // Mock QRCode library in tests to avoid environment-specific rendering issues
    '^qrcode.react$': '<rootDir>/__mocks__/qrcode.react.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/tests/'],
};
