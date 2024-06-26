const path = require("path");
const fs = require("fs");

const { directories } = require("../utils");

module.exports = function({ name, saveData }) {
    const dir = directories.saves.save[0];
    const fullFile = path.resolve(dir, `${name}.json`);
    saveData.type = "game";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullFile, JSON.stringify(saveData, null, 4));
}