const crypto = require('crypto');

const generateHash = (password, salt = '10') => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
};

const password = '112345_aA';
const salt = '10';  // 使用独特的盐
const hashedPassword = generateHash(password, salt);

console.log(`Hashed Password: ${hashedPassword}`);
