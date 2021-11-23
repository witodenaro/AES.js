const { AES_CBC } = require("./aes_cbc/aes_cbc");

// const encrypted = AES_CBC.encrypt("", "AES Cipher Block");
const decrypted = AES_CBC.decrypt(
  "140b41b22a29beb4061bda66b6747e14",
  "5b68629feb8606f9a6667670b75b38a5b4832d0f26e1ab7da33249de7d4afc48e713ac646ace36e872ad5fb8a512428a6e21364b0c374df45503473c5242a253"
);

console.log(decrypted);
