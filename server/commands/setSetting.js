const path = require("path");
const fs = require("fs");

const { getSettingsDirectory } = require("../utils/settings");

module.exports = async function({ setting, data}) {
    const settingsDir = getSettingsDirectory();

    if (setting === "controls") {
        const controlSettingsFile = path.resolve(settingsDir, "controls.json");

        fs.writeFileSync(controlSettingsFile, JSON.stringify(data, null, 4));
    } else {
        return {
            success: false,
            error: `Invalid setting ${setting}`,
        };
    }

    return {
        success: true,
    };
}