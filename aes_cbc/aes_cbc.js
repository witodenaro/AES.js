const { encrypt, decrypt } = require("../lib/aes");
const { generateRandomHex } = require("../lib/random");
const { stringToAsciiHex, asciiHexToString } = require("../lib/stringHelpers");
const { xorHexStrings } = require("../lib/xor");

// Advanced Encryption System
// MODE: Cipher Block Chain
class AES_CBC {
  static encrypt(key, message, blockSize = 16) {
    if (key.length < blockSize) {
      throw new Error(`Key is smaller than the valid block size: ${blockSize} bytes`);
    }

    const keyHex = stringToAsciiHex(key);

    const iv = generateRandomHex(blockSize);

    let cipherTextBlocks = [iv];

    const messageWithPadBlock = AES_CBC.generatePadBlock(message, blockSize);

    const msgHex = stringToAsciiHex(messageWithPadBlock);

    const msgBlocks = msgHex.match(new RegExp(`.{1,${blockSize * 2}}`, "g"));

    msgBlocks.forEach((messageBlock, i) => {
      const cipherTextBlocksLength = cipherTextBlocks.length;

      let xorElement = i === 0 ? iv : cipherTextBlocks[cipherTextBlocksLength - 1];
      const xoredMessage = xorHexStrings(xorElement, messageBlock);
      const encryptedMessage = encrypt(keyHex, xoredMessage);

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
      const decryptedXor = decrypt(keyHex, cipherTextBlock);

      const xorElement = i === 0 ? iv : cipherTextBlocks[i - 1];
      const decryptedMessage = xorHexStrings(xorElement, decryptedXor);

      messageBlocks.push(decryptedMessage);
    });

    const message = asciiHexToString(messageBlocks.join(""));

    console.log(message);
    const messageWithoutPad = AES_CBC.getMessageWithoutPad(message);
    return messageWithoutPad;
  }

  static getMessageWithoutPad(message) {
    const [pre2LastBytes, last2Bytes] = message.slice(message.length - 4).match(/.{1,2}/g);
    let padLength = 1;

    if (last2Bytes[0] === last2Bytes[1]) {
      padLength = Number(pre2LastBytes[0]);
    } else if (pre2LastBytes === last2Bytes) {
      padLength = Number(last2Bytes);
    }

    return message.slice(0, message.length - padLength);
  }

  static generatePadBlock(message, blockSize) {
    let messageWithPadBlock = message;

    let padLength = 0;

    if (message.length % blockSize !== 0) {
      padLength = blockSize - (message.length % blockSize);
    } else {
      padLength = blockSize;
    }

    let pad = "";

    while (pad.length < padLength) {
      pad += padLength;
    }

    if (pad.length > padLength) {
      pad = pad.slice(pad.length - padLength);
    }

    messageWithPadBlock += pad;

    return messageWithPadBlock;
  }
}

module.exports = {
  AES_CBC,
};
