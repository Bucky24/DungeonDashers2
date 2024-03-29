const path = require("path");
const fs = require("fs");

const { directories, locateInDirectoriesForSave } = require("../utils");

module.exports = function({ name, saveData }) {
    const file = locateInDirectoriesForSave(`${name}.json`, directories.campaign);

    if (!file) {
        return {
            success: false,
            message: "Unable to find appropriate save location",
        };
    }

    if (saveData.background) {
        saveData.background.image = saveData.background.originalImage;
        delete saveData.background.originalImage;
    }

    fs.writeFileSync(file, JSON.stringify(saveData, null, 4));
}