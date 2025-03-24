// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

/**
 * @title Saffron Token
 * @dev Saffron Token (SFN)
 * Features:
 * - ERC20 standard implementation
 * - Mintable: Only owner can mint new tokens
 * - Burnable: Anyone can burn their own tokens
 * - Pausable: Owner can pause token transfers in emergency
 * - Permit: Support for gasless transactions
 * - Ownership control
 */
contract SaffronToken is ERC20, ERC20Burnable, Pausable, Ownable, ERC20Permit {
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    
    /**
     * @dev Constructor that gives the msg.sender an initial supply of tokens
     * @param initialSupply The initial token supply
     * @param _name The name of the token
     * @param _symbol The symbol of the token
     */
    constructor(
        uint256 initialSupply,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        // Mint initial supply to the contract creator
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Pauses all token transfers.
     * Requirements:
     * - Only callable by the contract owner.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     * Requirements:
     * - Only callable by the contract owner.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     * Requirements:
     * - Only callable by the contract owner.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Hook that is called before any transfer of tokens.
     * This implementation allows minting even when the contract is paused,
     * but blocks regular transfers.
     *
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param amount uint256 the amount of tokens to be transferred
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        // Allow minting when paused (from == address(0)), block other transfers
        if (from != address(0) && paused()) {
            revert("Pausable: paused");
        }
        
        super._beforeTokenTransfer(from, to, amount);
    }
}