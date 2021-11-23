const { AES_CBC } = require("./lib/aes_cbc");

const key16byte = "Wito D. a geniusWito D. a genius";
const encrypted = AES_CBC.encrypt(key16byte, "Wito Divaro is a genius!", 16);

console.log(encrypted);

const decrypted = AES_CBC.decrypt(key16byte, encrypted);

console.log(decrypted);
