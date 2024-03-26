const path = require("path");
const fs = require("fs");

const { directories } = require("../utils");

module.exports = function({ name, saveData }) {
    const dir = directories.save[0];
    const fullFile = path.resolve(dir, `${name}.json`);

    fs.writeFileSync(fullFile, JSON.stringify(saveData, null, 4));
}