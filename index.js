const fs = require("fs");
const path = require("path");

const { AES_CBC } = require("./lib/aes_cbc");
const { AES_GCM_SHA256 } = require("./lib/aes_gcm_sha256");

const algorithm = AES_GCM_SHA256;

const [_, __, key, action = "decrypt"] = process.argv;

if (action !== "encrypt" && action !== "decrypt") throw new Error("Wrong action!");

const inputFileName = action === "encrypt" ? "decrypted.txt" : "encrypted.txt";
const inputPath = path.resolve(__dirname, "files", inputFileName);
const input = fs.readFileSync(inputPath, { encoding: "utf-8" });

const output = algorithm[action](key, input);
const outputFileName = action === "encrypt" ? "encrypted.txt" : "decrypted.txt";
const outputPath = path.resolve(__dirname, "files", outputFileName);

fs.writeFileSync(outputPath, output);
