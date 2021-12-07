const { sha256 } = require("hash.js");

const SHA256 = (text) => sha256().update(text).digest("hex");

module.exports = { SHA256 };
