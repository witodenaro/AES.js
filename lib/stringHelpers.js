const { MAX_EIGHT_BYTES_IN_DECIMAL } = require("./const");

function extendStringToLength(string, length) {
  const stringLetters = string.split("");

  while (stringLetters.length < length) {
    const diff = length - stringLetters.length;
    const toAdd = Math.min(diff, stringLetters.length);
    stringLetters.push(...stringLetters.slice(0, toAdd));
  }

  return stringLetters.join("");
}

function stringToAsciiHex(string) {
  const asciiString = string.split("").map((letter) => letter.charCodeAt(0));

  const asciiHex = asciiString
    .map((hex) => {
      const asciiLetterHex = hex.toString(16);
      const extendedAsciiLetterHex = asciiLetterHex.length === 1 ? "0" + asciiLetterHex : asciiLetterHex;
      return extendedAsciiLetterHex;
    })
    .join("");

  return asciiHex;
}

function asciiHexToString(asciiHex) {
  const hexes = asciiHex.match(/.{1,2}/g);

  return hexes
    .map((hex) => parseInt(hex, 16))
    .map((ascii) => String.fromCharCode(ascii))
    .join("");
}

/**
 * Add a decimal number to 16 bytes hex string.
 * Return will be the of size 16 bytes (meaning it will cycle).
 *
 * @param {String} hex16bytes - 16 bytes hex
 * @param {Number} decimal
 */
function addDecimalTo16BytesHex(hex16bytes, decimal) {
  if (hex16bytes.length !== 32) throw new Error("hex16bytes hex is not 16 bytes size");

  const hex4ByteBlocks = hex16bytes.match(/.{1,8}/g);

  let toAdd = decimal;
  let extendedHex = "";

  for (let i = hex4ByteBlocks.length - 1; i >= 0; i--) {
    const lastBlock = hex4ByteBlocks[i];

    const hexInDecimal = parseInt(lastBlock, 16);
    let newDecimal = hexInDecimal + toAdd;

    if (newDecimal > MAX_EIGHT_BYTES_IN_DECIMAL) {
      toAdd = MAX_EIGHT_BYTES_IN_DECIMAL - newDecimal;
      newDecimal = MAX_EIGHT_BYTES_IN_DECIMAL;
    } else if (toAdd !== 0) {
      toAdd = 0;
    }

    extendedHex = newDecimal.toString(16) + extendedHex;
  }

  let finalHex = extendedHex;
  const diff = extendedHex.length - 32;

  if (diff > 0) {
    finalHex = finalHex.slice(diff, 32 + diff);
  }

  if (diff < 0) {
    finalHex = "0".repeat(Math.abs(diff)) + finalHex;
  }

  return finalHex;
}

module.exports = {
  extendStringToLength,
  asciiHexToString,
  stringToAsciiHex,
  addDecimalTo16BytesHex,
};
