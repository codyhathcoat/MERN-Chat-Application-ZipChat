module.exports = {
    roots: ["<rootDir>/src"],
    testMatch: ["<rootDir>/src/**/*.(test|spec).js?(x)"],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleDirectories: ["node_modules", "src"],
    transformIgnorePatterns: ["/node_modules/(?!react-router-dom)"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], 
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "\\.(css|scss)$": "identity-obj-proxy"
    }
  };
  


