const fs = require("fs");
const path = require("path");

module.exports = function(modulePrefix, dir, entities) {
    for (const entity of entities) {
        const manifestPath = entity.manifest.manifest;
        const fullManifestPath = path.join(dir, manifestPath);

        const saveData = {...entity};
        delete saveData.manifest;
        saveData.id = saveData.id.replace(modulePrefix, "");

        const saveDataString = JSON.stringify(saveData, null, 4);

        fs.writeFileSync(fullManifestPath, saveDataString);

        if (entity.manifest.manifest !== entity.manifest.original) {
            // clean up the old file   
            const oldManifestPath = path.join(dir, entity.manifest.original);
            fs.rmSync(oldManifestPath);
        }
    }
}