// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

async function main() {
  // Token parameters
  const tokenName = "Saffron";
  const tokenSymbol = "SFN";
  // 100 million tokens with 18 decimals (the default for ERC20)
  const initialSupply = hre.ethers.utils.parseEther("100000000");
  
  console.log("Deploying Saffron Token with the following parameters:");
  console.log(`Name: ${tokenName}`);
  console.log(`Symbol: ${tokenSymbol}`);
  console.log(`Initial Supply: ${hre.ethers.utils.formatEther(initialSupply)} tokens`);
  
  // Get the contract factory
  const SaffronToken = await hre.ethers.getContractFactory("SaffronToken");
  
  // Deploy the contract
  const token = await SaffronToken.deploy(initialSupply, tokenName, tokenSymbol);
  
  // Wait for the contract to be deployed
  await token.deployed();
  
  console.log(`Saffron Token deployed to: ${token.address}`);
  console.log("---------------------------------------");
  console.log("To verify the contract on Etherscan/Polygonscan, run:");
  console.log(`npx hardhat verify --network <network_name> ${token.address} "${initialSupply}" "${tokenName}" "${tokenSymbol}"`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });