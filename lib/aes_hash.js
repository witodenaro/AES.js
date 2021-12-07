const { encrypt } = require("./aes");
const { stringToAsciiHex } = require("./stringHelpers");
const { xorHexStrings } = require("./xor");

class AES_HASH {
  static hash(message) {
    const messageWithPad = AES_HASH.withPad(message);
    const messageHash = stringToAsciiHex(messageWithPad);

    const messageBlocks = messageHash.match(/.{1,32}/g);
    const key = messageBlocks[0];

    let currentEncryptedHex = null;
    let hash = "";

    messageBlocks.forEach((messageBlock, index) => {
      const isLastBlock = index === messageBlocks.length - 1;
      const isPreLastBlock = index === messageBlocks.length - 2;

      const elementToEncrypt = currentEncryptedHex || messageBlock;

      const encryptedElement = encrypt(key, elementToEncrypt);

      currentEncryptedHex = xorHexStrings(encryptedElement, messageBlock);

      if (isPreLastBlock || isLastBlock) {
        hash += currentEncryptedHex;
      }
    });

    return hash;
  }

  static withPad(message) {
    const BLOCK_SIZE = 16;
    const padSpace = BLOCK_SIZE - (message.length % BLOCK_SIZE);
    let pad = null;

    const messageLenStr = String(message.length);
    const messageLengthPad = "0".repeat(BLOCK_SIZE / 2 - messageLenStr.length) + messageLenStr;

    if (padSpace === 0) {
      pad = "1" + "0".repeat(7) + messageLengthPad;
    } else if (padSpace <= BLOCK_SIZE / 2 + 1) {
      pad = "1" + "0".repeat(BLOCK_SIZE / 2 + padSpace - 1) + messageLengthPad;
    } else if (padSpace > BLOCK_SIZE / 2 + 1) {
      pad = "1" + "0".repeat(padSpace - BLOCK_SIZE / 2 - 1) + messageLengthPad;
    }

    return message + pad;
  }
}

module.exports = {
  AES_HASH,
};
