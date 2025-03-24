#!/bin/bash
# Run local demo without Node.js version warnings
npx hardhat run scripts/local-demo.js 2>&1 | grep -v "WARNING: You are currently using Node.js" | grep -v "not supported by Hardhat"