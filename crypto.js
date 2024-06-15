const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Load key and IV from keyiv.json
const { key, iv } = JSON.parse(fs.readFileSync('keyiv.json'));
const keyBuffer = Buffer.from(key, 'hex');
const ivBuffer = Buffer.from(iv, 'hex');

// Function to encrypt a file
function encryptFile(filePath, key, iv) {
    try {
        const data = fs.readFileSync(filePath);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        fs.writeFileSync(filePath, encrypted);
    } catch (error) {
        console.error(`Failed to encrypt ${filePath}: ${error.message}`);
    }
}

// Function to decrypt a file
function decryptFile(filePath, key, iv) {
    try {
        const encryptedData = fs.readFileSync(filePath);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        fs.writeFileSync(filePath, decrypted);
    } catch (error) {
        console.error(`Failed to decrypt ${filePath}: ${error.message}`);
    }
}

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

// Function to encrypt all files in a folder
function encryptFolder(folderPath, key, iv) {
    const files = getAllFiles(folderPath);
    files.forEach((file) => {
        encryptFile(file, key, iv);
        console.log(`Encrypted: ${file}`);
    });
}

// Function to decrypt all files in a folder
function decryptFolder(folderPath, key, iv) {
    const files = getAllFiles(folderPath);
    files.forEach((file) => {
        decryptFile(file, key, iv);
        console.log(`Decrypted: ${file}`);
    });
}

// Command-line arguments processing
const folderPath = '/home/yamuna/crypto/cryptf'; // Change this to your folder path
const action = process.argv[2]; // 'encrypt' or 'decrypt'

if (action === 'encrypt') {
    console.log('Encrypting folder...');
    encryptFolder(folderPath, keyBuffer, ivBuffer);
} else if (action === 'decrypt') {
    console.log('Decrypting folder...');
    decryptFolder(folderPath, keyBuffer, ivBuffer);
} else {
    console.log('Usage: node folderCrypto.js <encrypt|decrypt>');
}
