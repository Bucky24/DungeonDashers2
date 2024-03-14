const path = require("path");
const fs = require("fs");

const { getSettingsDirectory } = require("../utils/settings");

module.exports = async function() {
    const settingsDir = getSettingsDirectory();
    const controlSettingsFile = path.resolve(settingsDir, "controls.json");

    const settings = {};
    if (fs.existsSync(controlSettingsFile)) {
        const controlsString = fs.readFileSync(controlSettingsFile);
        const controls = JSON.parse(controlsString);
        settings.controls = controls;
    }

    return {
        success: true,
        settings,
    };
}