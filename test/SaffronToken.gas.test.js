const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SaffronToken Gas Usage", function () {
  let SaffronTokenFactory;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // Token parameters
  const tokenName = "Saffron";
  const tokenSymbol = "SFN";
  const initialSupply = ethers.utils.parseEther("100000000"); // 100 million tokens

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    SaffronTokenFactory = await ethers.getContractFactory("SaffronToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new SaffronToken contract before each test
    token = await SaffronTokenFactory.deploy(initialSupply, tokenName, tokenSymbol);
    await token.deployed();
    
    // Initial setup: Give some tokens to addr1
    await token.transfer(addr1.address, ethers.utils.parseEther("10000"));
  });

  it("Should measure gas for transfer", async function () {
    const tx = await token.transfer(addr2.address, ethers.utils.parseEther("1000"));
    const receipt = await tx.wait();
    console.log(`Gas used for transfer: ${receipt.gasUsed.toString()}`);
    
    // Just a basic check to ensure the transfer worked
    expect(await token.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1000"));
  });

  it("Should measure gas for transferFrom", async function () {
    // First approve
    await token.connect(addr1).approve(owner.address, ethers.utils.parseEther("2000"));
    
    // Then transferFrom
    const tx = await token.transferFrom(addr1.address, addr2.address, ethers.utils.parseEther("1000"));
    const receipt = await tx.wait();
    console.log(`Gas used for transferFrom: ${receipt.gasUsed.toString()}`);
    
    // Check balances
    expect(await token.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1000"));
  });

  it("Should measure gas for mint", async function () {
    const tx = await token.mint(addr2.address, ethers.utils.parseEther("5000"));
    const receipt = await tx.wait();
    console.log(`Gas used for mint: ${receipt.gasUsed.toString()}`);
    
    expect(await token.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("5000"));
  });

  it("Should measure gas for burn", async function () {
    const tx = await token.connect(addr1).burn(ethers.utils.parseEther("1000"));
    const receipt = await tx.wait();
    console.log(`Gas used for burn: ${receipt.gasUsed.toString()}`);
    
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("9000"));
  });

  it("Should measure gas for pause", async function () {
    const tx = await token.pause();
    const receipt = await tx.wait();
    console.log(`Gas used for pause: ${receipt.gasUsed.toString()}`);
    
    // Verify it's paused
    expect(await token.paused()).to.equal(true);
  });

  it("Should measure gas for unpause", async function () {
    // First pause
    await token.pause();
    
    // Then unpause
    const tx = await token.unpause();
    const receipt = await tx.wait();
    console.log(`Gas used for unpause: ${receipt.gasUsed.toString()}`);
    
    // Verify it's unpaused
    expect(await token.paused()).to.equal(false);
  });

  it("Should measure gas for transferOwnership", async function () {
    const tx = await token.transferOwnership(addr1.address);
    const receipt = await tx.wait();
    console.log(`Gas used for transferOwnership: ${receipt.gasUsed.toString()}`);
    
    expect(await token.owner()).to.equal(addr1.address);
  });
});