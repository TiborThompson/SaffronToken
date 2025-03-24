// Monkey patch the console.warn function to filter out specific warnings
const originalWarn = console.warn;
console.warn = function() {
  if (arguments[0] && arguments[0].includes && 
      arguments[0].includes('which is not supported by Hardhat')) {
    // Skip the Node.js version warning
    return;
  }
  return originalWarn.apply(console, arguments);
};