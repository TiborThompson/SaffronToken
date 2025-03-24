const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SaffronToken Extended Tests", function () {
  let SaffronTokenFactory;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  // Token parameters
  const tokenName = "Saffron";
  const tokenSymbol = "SFN";
  const initialSupply = ethers.utils.parseEther("100000000"); // 100 million tokens

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    SaffronTokenFactory = await ethers.getContractFactory("SaffronToken");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    // Deploy a new SaffronToken contract before each test
    token = await SaffronTokenFactory.deploy(initialSupply, tokenName, tokenSymbol);
    await token.deployed();
  });

  describe("ERC20 Permit Functionality", function () {
    it("Should support permits for gasless approvals", async function () {
      // This is a basic test to check if the ERC20Permit interface is available
      expect(token.permit).to.be.a('function');
      expect(token.nonces).to.be.a('function');
      expect(token.DOMAIN_SEPARATOR).to.be.a('function');
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero transfers correctly", async function () {
      await token.transfer(addr1.address, 0);
      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should revert when transferring to the zero address", async function () {
      await expect(
        token.transfer(ethers.constants.AddressZero, 100)
      ).to.be.revertedWith("ERC20: transfer to the zero address");
    });

    it("Should revert when minting to the zero address", async function () {
      await expect(
        token.mint(ethers.constants.AddressZero, 100)
      ).to.be.revertedWith("ERC20: mint to the zero address");
    });

    it("Should revert when burning more than balance", async function () {
      // Transfer 100 tokens to addr1
      await token.transfer(addr1.address, 100);
      
      // Try to burn 101 tokens (more than balance)
      await expect(
        token.connect(addr1).burn(101)
      ).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
  });

  describe("Transfer Scenarios", function () {
    beforeEach(async function () {
      // Setup: Transfer initial amounts to test accounts
      await token.transfer(addr1.address, ethers.utils.parseEther("1000"));
      await token.transfer(addr2.address, ethers.utils.parseEther("500"));
    });

    it("Should handle multiple transfers correctly", async function () {
      // Initial balances
      const initialOwnerBalance = await token.balanceOf(owner.address);
      const initialAddr1Balance = await token.balanceOf(addr1.address);
      const initialAddr2Balance = await token.balanceOf(addr2.address);
      
      // Series of transfers
      await token.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("100"));
      await token.connect(addr2).transfer(addr3.address, ethers.utils.parseEther("50"));
      await token.connect(addr1).transfer(owner.address, ethers.utils.parseEther("200"));
      
      // Final balances
      const finalOwnerBalance = await token.balanceOf(owner.address);
      const finalAddr1Balance = await token.balanceOf(addr1.address);
      const finalAddr2Balance = await token.balanceOf(addr2.address);
      const finalAddr3Balance = await token.balanceOf(addr3.address);
      
      // Verify all balances are as expected
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.add(ethers.utils.parseEther("200")));
      expect(finalAddr1Balance).to.equal(initialAddr1Balance.sub(ethers.utils.parseEther("300")));
      expect(finalAddr2Balance).to.equal(initialAddr2Balance.add(ethers.utils.parseEther("100")).sub(ethers.utils.parseEther("50")));
      expect(finalAddr3Balance).to.equal(ethers.utils.parseEther("50"));
    });

    it("Should track total supply correctly after burns", async function () {
      const initialTotalSupply = await token.totalSupply();
      
      // Burn tokens from multiple accounts
      await token.connect(addr1).burn(ethers.utils.parseEther("200"));
      await token.connect(addr2).burn(ethers.utils.parseEther("100"));
      await token.burn(ethers.utils.parseEther("1000"));
      
      const finalTotalSupply = await token.totalSupply();
      const burnedAmount = ethers.utils.parseEther("1300"); // 200 + 100 + 1000
      
      expect(finalTotalSupply).to.equal(initialTotalSupply.sub(burnedAmount));
    });
  });

  describe("Pause Functionality", function () {
    it("Should block transfers when paused", async function () {
      // Transfer some tokens first
      await token.transfer(addr1.address, ethers.utils.parseEther("1000"));
      
      // Setup allowance for transferFrom
      await token.connect(addr1).approve(owner.address, 200);
      
      // Pause the token
      await token.pause();
      
      // Transfers should fail when paused
      await expect(token.transfer(addr2.address, 100)).to.be.revertedWith("Pausable: paused");
      await expect(token.connect(addr1).transfer(addr2.address, 100)).to.be.revertedWith("Pausable: paused");
    });
    
    it("Should allow minting when paused and transfers after unpausing", async function () {
      // Pause the token
      await token.pause();
      
      // Minting should still work when paused
      await token.mint(addr3.address, 100);
      expect(await token.balanceOf(addr3.address)).to.equal(100);
      
      // Unpause
      await token.unpause();
      
      // After unpausing, transfers should work again
      await token.transfer(addr2.address, 100);
      expect(await token.balanceOf(addr2.address)).to.equal(100);
    });
    
    it("Should allow approvals when paused", async function () {
      // Pause the token
      await token.pause();
      
      // Approvals should still work when paused
      await token.approve(addr1.address, 100);
      expect(await token.allowance(owner.address, addr1.address)).to.equal(100);
      
      // But transferFrom should fail
      await expect(
        token.connect(addr1).transferFrom(owner.address, addr2.address, 50)
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Multiple Minting and Burning", function () {
    it("Should correctly handle multiple mint and burn operations", async function () {
      // Initial supply
      const initialSupply = await token.totalSupply();
      
      // Mint to multiple addresses
      await token.mint(addr1.address, ethers.utils.parseEther("10000"));
      await token.mint(addr2.address, ethers.utils.parseEther("20000"));
      await token.mint(addr3.address, ethers.utils.parseEther("30000"));
      
      const afterMintSupply = await token.totalSupply();
      expect(afterMintSupply).to.equal(initialSupply.add(ethers.utils.parseEther("60000")));
      
      // Burn from multiple addresses
      await token.connect(addr1).burn(ethers.utils.parseEther("5000"));
      await token.connect(addr2).burn(ethers.utils.parseEther("10000"));
      
      const finalSupply = await token.totalSupply();
      expect(finalSupply).to.equal(afterMintSupply.sub(ethers.utils.parseEther("15000")));
      
      // Check individual balances
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("5000"));
      expect(await token.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("10000"));
      expect(await token.balanceOf(addr3.address)).to.equal(ethers.utils.parseEther("30000"));
    });
  });
});