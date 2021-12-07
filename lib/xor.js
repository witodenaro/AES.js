function xorHexStrings(hex1, hex2) {
  const firstHexes = hex1.split("");
  const secondHexes = hex2.split("");

  const hexString = firstHexes
    .reverse()
    .map((hex, index) => {
      const secondHex = secondHexes[secondHexes.length - 1 - index];
      const [firstHexNumber, secondHexNumber] = [parseInt(hex, 16), parseInt(secondHex, 16)];

      return (firstHexNumber ^ secondHexNumber).toString(16);
    })
    .reverse()
    .join("");

  return hexString;
}

module.exports = {
  xorHexStrings,
};
