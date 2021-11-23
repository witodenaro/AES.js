const { encrypt, decrypt } = require("./aes");
const { generateRandomHex } = require("./random");
const { stringToAsciiHex, asciiHexToString, addDecimalTo16BytesHex } = require("./stringHelpers");
const { xorHexStrings } = require("./xor");

// Advanced Encryption System
// MODE: Counter
class AES_CTR {
  static encrypt(key, message, blockSize = 16) {
    if (key.length < blockSize) {
      throw new Error(`Key is smaller than the valid block size: ${blockSize} bytes`);
    }

    const keyHex = stringToAsciiHex(key);

    const iv = generateRandomHex(blockSize);

    let cipherTextBlocks = [iv];

    const msgHex = stringToAsciiHex(message);
    const msgBlocks = msgHex.match(new RegExp(`.{1,${blockSize * 2}}`, "g"));

    msgBlocks.forEach((messageBlock, i) => {
      const incrementedIV = addDecimalTo16BytesHex(iv, i);
      const encryptedIV = encrypt(keyHex, incrementedIV);

      const encryptedMessage = xorHexStrings(messageBlock, encryptedIV);

      cipherTextBlocks.push(encryptedMessage);
    });

    return cipherTextBlocks.join("");
  }

  static decrypt(key, cipherTextHex, blockSize = 16) {
    if (key.length < blockSize) {
      throw new Error(`Key is smaller than the valid block size: ${blockSize} bytes`);
    }

    const keyHex = stringToAsciiHex(key);

    const [iv, ...cipherTextBlocks] = cipherTextHex.match(new RegExp(`.{1,${blockSize * 2}}`, "g"));

    let messageBlocks = [];

    cipherTextBlocks.forEach((cipherTextBlock, i) => {
      const incrementedIV = addDecimalTo16BytesHex(iv, i);
      const encryptedIV = encrypt(keyHex, incrementedIV);
      const decryptedMessage = xorHexStrings(cipherTextBlock, encryptedIV);

      messageBlocks.push(decryptedMessage);
    });

    const message = asciiHexToString(messageBlocks.join(""));

    return message;
  }
}

module.exports = {
  AES_CTR,
};
