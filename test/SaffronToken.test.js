const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SaffronToken", function () {
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
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await token.name()).to.equal(tokenName);
      expect(await token.symbol()).to.equal(tokenSymbol);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await token.transfer(addr1.address, 50);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 25 tokens from addr1 to addr2
      await token.connect(addr1).transfer(addr2.address, 25);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(25);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      
      // Try to send 1 token from addr1 (0 tokens) to owner
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed
      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Minting", function () {
    it("Should mint tokens to an address when called by owner", async function () {
      const initialBalance = await token.balanceOf(addr1.address);
      const mintAmount = ethers.utils.parseEther("1000");
      
      await token.mint(addr1.address, mintAmount);
      
      const newBalance = await token.balanceOf(addr1.address);
      expect(newBalance).to.equal(initialBalance.add(mintAmount));
    });

    it("Should fail to mint tokens when called by non-owner", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      
      await expect(
        token.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Burning", function () {
    it("Should burn tokens from an account", async function () {
      // First transfer some tokens to addr1
      const transferAmount = ethers.utils.parseEther("1000");
      await token.transfer(addr1.address, transferAmount);
      
      // Initial balances
      const initialTotalSupply = await token.totalSupply();
      const initialAddr1Balance = await token.balanceOf(addr1.address);
      
      // Burn half of addr1's tokens
      const burnAmount = transferAmount.div(2);
      await token.connect(addr1).burn(burnAmount);
      
      // Check balances after burning
      const finalTotalSupply = await token.totalSupply();
      const finalAddr1Balance = await token.balanceOf(addr1.address);
      
      expect(finalAddr1Balance).to.equal(initialAddr1Balance.sub(burnAmount));
      expect(finalTotalSupply).to.equal(initialTotalSupply.sub(burnAmount));
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause transfers", async function () {
      // Pause transfers
      await token.pause();
      
      // Try to transfer tokens
      await expect(
        token.transfer(addr1.address, 100)
      ).to.be.revertedWith("Pausable: paused");
      
      // Unpause transfers
      await token.unpause();
      
      // Transfer should work now
      await token.transfer(addr1.address, 100);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);
    });

    it("Should not allow non-owners to pause", async function () {
      await expect(
        token.connect(addr1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      // Transfer ownership from owner to addr1
      await token.transferOwnership(addr1.address);
      expect(await token.owner()).to.equal(addr1.address);
      
      // The new owner should be able to mint tokens
      await token.connect(addr1).mint(addr2.address, 100);
      expect(await token.balanceOf(addr2.address)).to.equal(100);
    });

    it("Should not allow non-owners to transfer ownership", async function () {
      await expect(
        token.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});