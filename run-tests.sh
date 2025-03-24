#!/bin/bash
# Run tests without Node.js version warnings
npx hardhat test 2>&1 | grep -v "WARNING: You are currently using Node.js" | grep -v "not supported by Hardhat"