// Demo script to showcase token functionality on testnet
const hre = require("hardhat");

async function main() {
  console.log("\n=== SAFFRON TOKEN DEMONSTRATION ===\n");
  
  // Get signers
  const [owner, recipient] = await hre.ethers.getSigners();
  console.log(`Owner address: ${owner.address}`);
  console.log(`Recipient address: ${recipient.address}`);
  
  // Get the deployed token (replace with your deployed token address)
  const tokenAddress = process.env.TOKEN_ADDRESS; 
  if (!tokenAddress) {
    console.error("Error: Please set TOKEN_ADDRESS in your .env file");
    console.error("Example: TOKEN_ADDRESS=0x123abc...");
    process.exit(1);
  }
  
  console.log(`\n-- Connecting to token at: ${tokenAddress}`);
  const SaffronToken = await hre.ethers.getContractFactory("SaffronToken");
  const token = await SaffronToken.attach(tokenAddress);
  
  // Basic token info
  console.log("\n-- TOKEN INFO:");
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  const ownerBalance = await token.balanceOf(owner.address);
  
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${hre.ethers.utils.formatEther(totalSupply)} tokens`);
  console.log(`Owner Balance: ${hre.ethers.utils.formatEther(ownerBalance)} tokens`);
  
  // Mint tokens demo
  console.log("\n-- MINTING TOKENS:");
  const mintAmount = hre.ethers.utils.parseEther("1000");
  console.log(`Minting ${hre.ethers.utils.formatEther(mintAmount)} tokens to recipient...`);
  const mintTx = await token.mint(recipient.address, mintAmount);
  await mintTx.wait();
  console.log(`Minted successfully! Transaction: ${mintTx.hash}`);
  
  const recipientBalance = await token.balanceOf(recipient.address);
  console.log(`Recipient balance: ${hre.ethers.utils.formatEther(recipientBalance)} tokens`);
  
  // Transfer tokens demo
  console.log("\n-- TRANSFERRING TOKENS:");
  const transferAmount = hre.ethers.utils.parseEther("100");
  console.log(`Transferring ${hre.ethers.utils.formatEther(transferAmount)} tokens to recipient...`);
  const transferTx = await token.transfer(recipient.address, transferAmount);
  await transferTx.wait();
  console.log(`Transferred successfully! Transaction: ${transferTx.hash}`);
  
  const newRecipientBalance = await token.balanceOf(recipient.address);
  console.log(`New recipient balance: ${hre.ethers.utils.formatEther(newRecipientBalance)} tokens`);
  
  // Pause token demo
  console.log("\n-- PAUSING TOKEN:");
  const pauseTx = await token.pause();
  await pauseTx.wait();
  console.log(`Token paused successfully! Transaction: ${pauseTx.hash}`);
  
  console.log("\n-- Attempting to transfer while paused (should fail):");
  try {
    await token.transfer(recipient.address, transferAmount);
  } catch (error) {
    console.log(`Transfer correctly failed with error: ${error.message.split("'")[1]}`);
  }
  
  // Unpause token demo
  console.log("\n-- UNPAUSING TOKEN:");
  const unpauseTx = await token.unpause();
  await unpauseTx.wait();
  console.log(`Token unpaused successfully! Transaction: ${unpauseTx.hash}`);
  
  // Final transfer to confirm unpausing worked
  console.log("\n-- TRANSFERRING AFTER UNPAUSE:");
  const finalTransferTx = await token.transfer(recipient.address, transferAmount);
  await finalTransferTx.wait();
  console.log(`Transfer succeeded after unpause! Transaction: ${finalTransferTx.hash}`);
  
  const finalRecipientBalance = await token.balanceOf(recipient.address);
  console.log(`Final recipient balance: ${hre.ethers.utils.formatEther(finalRecipientBalance)} tokens`);
  
  console.log("\n=== DEMONSTRATION COMPLETE ===");
  console.log(`\nYou can view these transactions on the block explorer:`);
  console.log(`https://mumbai.polygonscan.com/address/${tokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });