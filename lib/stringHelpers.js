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

module.exports = {
  extendStringToLength,
  asciiHexToString,
  stringToAsciiHex,
};
