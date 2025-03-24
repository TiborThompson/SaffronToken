# Saffron Token (SFN)

![Solidity](https://img.shields.io/badge/Solidity-0.8.17-blue)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4.9.3-blue)
![Hardhat](https://img.shields.io/badge/Hardhat-2.17.1-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

This project implements Saffron (SFN), a robust ERC-20 token designed for deployment on Ethereum or Polygon networks. It features a comprehensive set of token management capabilities including minting, burning, and ownership control, with a focus on security and modularity.

## Key Features

- **ERC-20 Standard**: Full compliance with the ERC-20 interface
- **Minting Control**: Only the owner can mint new tokens
- **Burning Capability**: Token holders can burn their own tokens
- **Emergency Pause**: Owner can pause all transfers in emergency situations
- **Gasless Transactions**: ERC-20 Permit standard for signature-based approvals
- **Ownership Management**: Secure ownership transfer protocol
- **Advanced Security**: Built with OpenZeppelin's battle-tested contracts
- **Comprehensive Testing**: 30+ test cases covering all functionality
- **Gas Optimized**: Efficient implementation with low gas costs

## Technical Stack

- **Solidity**: Version 0.8.17+ for smart contract development
- **Hardhat**: Development environment for compilation, testing, and deployment
- **OpenZeppelin**: Industry-standard smart contract libraries
- **Ethers.js**: JavaScript interface for blockchain interaction
- **Waffle & Chai**: Testing frameworks for comprehensive validation

## Security Features

- **Pausable Transfers**: Emergency pause functionality for critical situations
- **Role-Based Access**: Owner-restricted sensitive operations
- **Gas Optimization**: Efficient code to minimize transaction costs
- **Comprehensive Testing**: Extensive test coverage for all contract functions
- **OpenZeppelin Base**: Built on battle-tested, audited contract implementations

## Gas Usage Analysis

Our implementation is optimized for efficiency, with the following gas consumption metrics:

| Operation            | Gas Usage |
|----------------------|-----------|
| Transfer             | ~53,662   |
| TransferFrom         | ~61,559   |
| Mint                 | ~54,959   |
| Burn                 | ~35,927   |
| Pause                | ~27,765   |
| Unpause              | ~27,698   |
| Transfer Ownership   | ~28,733   |

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm (v6+)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/saffron-token.git
   cd saffron-token
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables
   ```bash
   cp .env.example .env
   ```

4. Generate a development wallet (optional)
   ```bash
   npm run generate-wallet
   ```

   This will create a new Ethereum wallet address and private key. Copy the private key and update your `.env` file:
   ```bash
   npm run update-env <PRIVATE_KEY>
   ```

   **Note:** For production, use a secure wallet and never share your private key.

## Testing

Run the comprehensive test suite:

```bash
npm test
```

For a clean output without warnings:

```bash
./run-tests.sh
```

To run a full demonstration with deployment:

```bash
./run-full-demo.sh
```

## Deployment

### Testnet Deployment

Deploy to the Mumbai testnet:

```bash
npm run deploy:testnet
```

### Mainnet Deployment

Deploy to the Polygon mainnet:

```bash
npm run deploy:mainnet
```

### Contract Verification

After deploying, verify your contract on block explorers:

```bash
npx hardhat verify --network <network_name> <contract_address> <constructor_args>
```

The deploy script will output the exact verification command to run.

## Security Considerations

### Ownership Management

Transfer ownership to a secure multisig wallet:

```bash
npx hardhat run scripts/transfer-ownership.js --network <network_name> <contract_address> <new_owner_address>
```

### Emergency Controls

The token implements pause functionality that can freeze transfers in emergencies:

```solidity
// Pause all transfers
function pause() public onlyOwner {
    _pause();
}

// Resume normal operation
function unpause() public onlyOwner {
    _unpause();
}
```

## Future Extensions

The token is designed with modularity in mind and can be extended with:

- Governance functionality
- Staking mechanisms
- Token vesting
- Additional token utilities

## License

This project is licensed under the MIT License. See the LICENSE file for details.