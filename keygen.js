const crypto = require('crypto');
const fs = require('fs');

// Generate a random key and IV
const key = crypto.randomBytes(32).toString('hex'); // 32 bytes for AES-256
const iv = crypto.randomBytes(16).toString('hex');  // 16 bytes for AES-256-CBC

// Save the key and IV to a JSON file
const keyIvData = { key, iv };
fs.writeFileSync('keyiv.json', JSON.stringify(keyIvData));

console.log('Key and IV have been generated and stored in keyiv.json');
