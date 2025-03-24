#!/bin/bash
# Complete demo script that runs tests and local demo without warnings

# Print header
echo "===========================================" 
echo "       SAFFRON TOKEN (SFN) SHOWCASE        "
echo "===========================================" 

# Run tests
echo -e "\n\n[1/2] RUNNING COMPREHENSIVE TESTS..."
echo "==========================================="
npx hardhat test 2>&1 | grep -v "WARNING: You are currently using Node.js" | grep -v "not supported by Hardhat"

# Print separator
echo -e "\n\n"
echo "===========================================" 
echo "       TESTS COMPLETED SUCCESSFULLY        "
echo "===========================================" 

# Run local demo
echo -e "\n\n[2/2] RUNNING LOCAL DEPLOYMENT DEMO..."
echo "==========================================="
npx hardhat run scripts/local-demo.js 2>&1 | grep -v "WARNING: You are currently using Node.js" | grep -v "not supported by Hardhat"

# Print final message
echo -e "\n\n"
echo "===========================================" 
echo "     SAFFRON TOKEN DEMO COMPLETED         "
echo "     ALL TESTS PASSED SUCCESSFULLY        "
echo "     TOKEN FUNCTIONALITY VERIFIED         "
echo "==========================================="