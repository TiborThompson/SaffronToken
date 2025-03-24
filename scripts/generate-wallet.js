// Script to generate a new wallet
const { ethers } = require("ethers");

// Generate a random wallet
const wallet = ethers.Wallet.createRandom();

console.log("\n=== New Wallet Information ===");
console.log(`Address:     ${wallet.address}`);
console.log(`Private Key: ${wallet.privateKey}`);
console.log("\nIMPORTANT: Save this private key securely. Anyone with this key has access to the wallet funds.");
console.log("This wallet has no funds yet. You'll need to send test tokens to it from a faucet.\n");