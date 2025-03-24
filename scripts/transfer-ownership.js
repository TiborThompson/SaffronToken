// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

async function main() {
  // Get the contract address and new owner address from command line arguments
  const contractAddress = process.argv[2];
  const newOwnerAddress = process.argv[3];
  
  if (!contractAddress || !newOwnerAddress) {
    console.error("Please provide the contract address and new owner address as command line arguments");
    console.error("Example: npx hardhat run scripts/transfer-ownership.js --network polygon CONTRACT_ADDRESS NEW_OWNER_ADDRESS");
    process.exit(1);
  }
  
  // Validate addresses
  if (!hre.ethers.utils.isAddress(contractAddress) || !hre.ethers.utils.isAddress(newOwnerAddress)) {
    console.error("Invalid address format. Please provide valid Ethereum addresses.");
    process.exit(1);
  }

  console.log(`Transferring ownership of contract at ${contractAddress} to ${newOwnerAddress}...`);
  
  // Get the contract instance using the deployed address
  const SaffronToken = await hre.ethers.getContractFactory("SaffronToken");
  const token = await SaffronToken.attach(contractAddress);
  
  // Get current owner
  const currentOwner = await token.owner();
  console.log(`Current owner: ${currentOwner}`);
  
  // Transfer ownership
  const tx = await token.transferOwnership(newOwnerAddress);
  await tx.wait();
  
  // Verify the new owner
  const newOwner = await token.owner();
  console.log(`New owner: ${newOwner}`);
  
  if (newOwner.toLowerCase() === newOwnerAddress.toLowerCase()) {
    console.log("Ownership transfer successful!");
  } else {
    console.error("Ownership transfer failed!");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });