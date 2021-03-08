const crypto = require('crypto');

const key1 = crypto.randomBytes(32).toString('hex') // '32' for 256-bit encryption
const key2 = crypto.randomBytes(32).toString('hex') // '32' for 256-bit encryption
console.table({ key1, key2 });