const path = require("path");
const fs = require("fs");

function getSettingsDirectory() {
    const settingsDir = path.resolve(__dirname, "../../settings");

    if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir);
    }

    return settingsDir;
}

module.exports = {
    getSettingsDirectory,
};