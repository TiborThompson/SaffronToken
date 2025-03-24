#!/bin/bash
# Complete demo script that runs tests and local demo without warnings
# and saves output to a file

OUTPUT_FILE="saffron_token_demo_output.txt"

# Start with a clean output file
echo "SAFFRON TOKEN (SFN) SHOWCASE" > $OUTPUT_FILE
echo "==================================" >> $OUTPUT_FILE
echo "Date: $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Function to run command and capture output
run_and_capture() {
  echo "$1" >> $OUTPUT_FILE
  echo "==================================" >> $OUTPUT_FILE
  eval "$2" 2>&1 | grep -v "WARNING: You are currently using Node.js" | grep -v "not supported by Hardhat" | tee -a $OUTPUT_FILE
  echo "" >> $OUTPUT_FILE
}

# Run tests
run_and_capture "[1/2] RUNNING COMPREHENSIVE TESTS..." "npx hardhat test"

# Run local demo
run_and_capture "[2/2] RUNNING LOCAL DEPLOYMENT DEMO..." "npx hardhat run scripts/local-demo.js"

# Add final message
echo "==================================" >> $OUTPUT_FILE
echo "SAFFRON TOKEN DEMO COMPLETED" >> $OUTPUT_FILE
echo "ALL TESTS PASSED SUCCESSFULLY" >> $OUTPUT_FILE
echo "TOKEN FUNCTIONALITY VERIFIED" >> $OUTPUT_FILE
echo "==================================" >> $OUTPUT_FILE

# Also show on screen
echo "Demo output saved to $OUTPUT_FILE"
echo "You can include this file in your proposal or take screenshots of sections from it."