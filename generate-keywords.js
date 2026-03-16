const fs = require("fs");
const path = require("path");

function readLines(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const base = readLines(path.join(__dirname, "data", "base.txt"));
const stores = readLines(path.join(__dirname, "data", "stores.txt"));
const products = readLines(path.join(__dirname, "data", "products.txt"));
const cities = readLines(path.join(__dirname, "data", "cities.txt"));
const intents = readLines(path.join(__dirname, "data", "intents.txt"));
const brands = readLines(path.join(__dirname, "data", "brands.txt"));

const keywords = new Set();

for (const b of base) {
  for (const s of stores) {
    for (const p of products) {
      keywords.add(`grupo telegram ${b} ${p} ${s}`);
    }
  }
}

for (const b of base) {
  for (const p of products) {
    for (const c of cities) {
      keywords.add(`grupo telegram ${b} ${p} em ${c}`);
    }
  }
}

for (const b of base) {
  for (const p of products) {
    for (const i of intents) {
      keywords.add(`grupo telegram ${b} ${p} ${i}`);
    }
  }
}

for (const b of base) {
  for (const brand of brands) {
    for (const s of stores) {
      keywords.add(`grupo telegram ${b} ${brand} ${s}`);
    }
  }
}

for (const p of products) {
  for (const c of cities) {
    keywords.add(`grupo telegram ofertas ${p} ${c}`);
    keywords.add(`grupo telegram cupons ${p} ${c}`);
    keywords.add(`grupo telegram descontos ${p} ${c}`);
  }
}

const finalKeywords = Array.from(keywords).sort();

fs.writeFileSync(
  path.join(__dirname, "keywords.txt"),
  finalKeywords.join("\n"),
  "utf8"
);

console.log("keywords geradas:", finalKeywords.length);