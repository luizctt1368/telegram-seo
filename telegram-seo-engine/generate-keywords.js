const fs = require("fs");
const path = require("path");

function readList(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const base = readList(path.join(__dirname, "data", "base.txt"));
const stores = readList(path.join(__dirname, "data", "stores.txt"));
const products = readList(path.join(__dirname, "data", "products.txt"));

const keywords = [];
const unique = new Set();

for (const b of base) {
  for (const s of stores) {
    for (const p of products) {
      const keyword = `grupo telegram ${b} ${p} ${s}`.replace(/\s+/g, " ").trim();
      if (!unique.has(keyword)) {
        unique.add(keyword);
        keywords.push(keyword);
      }
    }
  }
}

const outputPath = path.join(__dirname, "keywords.txt");
fs.writeFileSync(outputPath, keywords.join("\n") + "\n", "utf8");

console.log(`Keywords geradas: ${keywords.length}`);
console.log(`Arquivo salvo em: ${outputPath}`);
