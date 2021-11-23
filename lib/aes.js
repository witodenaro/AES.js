const AES = require("aes");

function getProperSizeHex(hex, desiredSize) {
  let newHex = hex;
  while (newHex.length < desiredSize) {
    newHex = "0" + newHex;
  }

  return newHex;
}

function withHexPrefix(str) {
  return "0x" + str;
}

function withoutHexPrefix(str) {
  let newStr = str;

  if (str.startsWith("0x")) {
    newStr = newStr.slice(2);
  }

  return newStr;
}

/**
 *  Encrypts a message block with AES128
 *
 * @param {String} k - 16 bytes hex key
 * @param {String} m - 16 bytes hex message
 *
 * @example
 * "ffffffffffffffffffffffffffffffff" "ffffffffffffffffffffffffffffffff" -> "bcbf217cb280cf30b2517052193ab979"
 */
function encrypt(k, m) {
  const keyBlocks = k.match(/.{1,8}/g).map(withHexPrefix);
  const messageBlocks = m.match(/.{1,8}/g).map(withHexPrefix);

  const aes = new AES(keyBlocks);
  const cipherTextBlocks = Array.from(aes.encrypt(messageBlocks));
  const cipherText = cipherTextBlocks
    .map((el) => {
      let hex = el.toString(16);
      return getProperSizeHex(hex, 8);
    })
    .join("");

  return cipherText;
}

/**
 *  Decrypts a cipherText block with AES128
 *
 * @param {String} k - 16 bytes hex key
 * @param {String} c - 16 bytes hex cipherText
 *
 * @example
 * "ffffffffffffffffffffffffffffffff" "bcbf217cb280cf30b2517052193ab979" -> "ffffffffffffffffffffffffffffffff"
 */
function decrypt(k, c) {
  const keyBlocks = k.match(/.{1,8}/g).map(withHexPrefix);
  const cipherTextBlocks = c.match(/.{1,8}/g).map(withHexPrefix);

  const aes = new AES(keyBlocks);
  const messageBlocks = Array.from(aes.decrypt(cipherTextBlocks));
  const message = messageBlocks.map((el) => getProperSizeHex(el.toString(16), 8)).join("");

  return message;
}

module.exports = {
  encrypt,
  decrypt,
  withoutHexPrefix,
};
