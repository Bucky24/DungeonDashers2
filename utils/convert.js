// this script converts a v1 map to a v2 map

const fs = require("fs");
const path = require("path");

const map = process.argv[2];

const fullPath = path.resolve(map);

if (!fs.existsSync(fullPath)) {
    console.error("File ",fullPath, "does not exist");
    process.exit(1);
}

console.log("Converting", fullPath);

const stringContents = fs.readFileSync(fullPath, "utf8");
const contents = JSON.parse(stringContents);

if (contents.version !== 1) {
    console.error("Version is", contents.version, ", this script only works on version 1");
    process.exit(1);
}

contents.modules = ['main'];
contents.version = 2;

for (let i=0;i<contents.map.length;i++) {
    contents.map[i].tile = `main_${contents.map[i].tile}`;
}

const finalString = JSON.stringify(contents, null, 4);
fs.writeFileSync(fullPath, finalString);