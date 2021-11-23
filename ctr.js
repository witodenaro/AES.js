const { AES_CTR } = require("./lib/aes_ctr");

const key = "16byteskeybywito";

const encrypted = AES_CTR.encrypt(key, "AES CTR mode encryption example.");
const decrypted = AES_CTR.decrypt(key, encrypted);

console.log(decrypted);
