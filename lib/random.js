function generateRandomHex(byteSize) {
  let randomAscii = null;
  let randomAsciiHex = null;
  let randomHex = "";

  for (let i = 0; i < byteSize; i++) {
    randomAscii = Math.floor(Math.random() * 256);
    randomAsciiHex = randomAscii.toString(16);
    randomHex += randomAsciiHex.length === 2 ? randomAsciiHex : "0" + randomAsciiHex;
  }

  return randomHex;
}

module.exports = {
  generateRandomHex,
};
