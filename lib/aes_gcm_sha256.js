const { pbkdf2Sync } = require("crypto");

const { encrypt } = require("./aes");
const { SHA256 } = require("./helpers");
const { generateRandomHex } = require("./random");
const { stringToAsciiHex, addDecimalTo16BytesHex, asciiHexToString } = require("./stringHelpers");
const { xorHexStrings } = require("./xor");

class AES_GCM_SHA256 {
  static encrypt(key, message) {
    const { encryptionKey, macKey } = AES_GCM_SHA256.extractEncMacKeys(key);

    const iv = generateRandomHex(16);
    const encryptedIV = encrypt(encryptionKey, iv);

    let cipherTextBlocks = [iv];
    let authTag = SHA256(macKey);

    const msgHex = stringToAsciiHex(message);
    const msgBlocks = msgHex.match(/.{1,32}/g);

    msgBlocks.forEach((messageBlock, index) => {
      const ivPlusCounter = addDecimalTo16BytesHex(iv, index + 1);
      const encryptedIvPlusCounter = encrypt(encryptionKey, ivPlusCounter);

      const xoredMessage = xorHexStrings(messageBlock, encryptedIvPlusCounter);

      cipherTextBlocks.push(xoredMessage);

      const xoredAuthTag = xorHexStrings(authTag, xoredMessage);

      authTag = SHA256(xoredAuthTag);
    });

    const cipherText = cipherTextBlocks.join("");
    const messageAndCipherTextLengths = msgHex.length.toString().concat(cipherText.length);
    const xorElement = messageAndCipherTextLengths.padStart(32, "0");

    authTag = xorHexStrings(authTag, xorElement);
    authTag = SHA256(authTag);
    authTag = xorHexStrings(authTag, encryptedIV);

    return cipherText.concat(authTag);
  }

  static decrypt(key, cipherText) {
    const { encryptionKey, macKey } = this.extractEncMacKeys(key);

    const givenAuthTag = cipherText.slice(cipherText.length - 64);

    const [iv, ...cipherTextBlocks] = cipherText.slice(0, -64).match(/.{1,32}/g);
    const encryptedIV = encrypt(encryptionKey, iv);

    let authTag = SHA256(macKey);
    const decryptedBlocks = [];

    cipherTextBlocks.forEach((cipherBlock, index) => {
      const xoredAuthTag = xorHexStrings(authTag, cipherBlock);
      authTag = SHA256(xoredAuthTag);

      const ivPlusCounter = addDecimalTo16BytesHex(iv, index + 1);
      const encryptedIvPlusCounter = encrypt(encryptionKey, ivPlusCounter);

      const xoredCipherBlock = xorHexStrings(cipherBlock, encryptedIvPlusCounter);

      decryptedBlocks.push(xoredCipherBlock);
    });

    const decryptedText = decryptedBlocks.join("");
    const messageAndCipherTextLengths = decryptedText.length.toString().concat(cipherText.length - 64);
    const xorElement = messageAndCipherTextLengths.padStart(32, "0");

    authTag = xorHexStrings(authTag, xorElement);
    authTag = SHA256(authTag);
    authTag = xorHexStrings(authTag, encryptedIV);

    const isAuthTagValid = authTag === givenAuthTag;

    const message = asciiHexToString(decryptedBlocks.join(""));

    return isAuthTagValid ? message : "~";
  }

  static extractEncMacKeys(key) {
    const derivedKey = pbkdf2Sync(key, "saltiestsaltever", 10_000_000, 32, "sha256");

    const [encryptionKey, macKey] = derivedKey.toString("hex").match(/.{1,32}/g);

    return { encryptionKey, macKey };
  }
}

module.exports = {
  AES_GCM_SHA256,
};
