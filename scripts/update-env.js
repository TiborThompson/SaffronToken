// Script to update .env file with wallet private key
const fs = require('fs');
const path = require('path');

// Get command line arguments
const privateKey = process.argv[2];

if (!privateKey) {
  console.error('Error: Private key is required');
  console.error('Usage: node update-env.js YOUR_PRIVATE_KEY');
  process.exit(1);
}

// Path to .env file
const envPath = path.join(__dirname, '..', '.env');

// Read current .env file
fs.readFile(envPath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading .env file: ${err.message}`);
    process.exit(1);
  }

  // Replace the private key line
  const updatedData = data.replace(
    /PRIVATE_KEY=.*/,
    `PRIVATE_KEY=${privateKey}`
  );

  // Write updated content back to .env
  fs.writeFile(envPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing to .env file: ${err.message}`);
      process.exit(1);
    }
    console.log('Updated .env file with new private key');
  });
});