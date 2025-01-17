const fs = require("fs");
const path = require("path");

module.exports = function(modulePrefix, dir, entities) {
    for (const entity of entities) {
        const manifestPath = entity.manifest.manifest;
        const fullManifestPath = path.join(dir, manifestPath);

        const manifestDirectory = path.dirname(fullManifestPath);
        if (!fs.existsSync(manifestDirectory)) {
            fs.mkdirSync(manifestDirectory, { recursive: true });
        }

        const saveData = {...entity};
        delete saveData.manifest;
        saveData.id = saveData.id.replace(modulePrefix, "");

        const saveDataString = JSON.stringify(saveData, null, 4);

        fs.writeFileSync(fullManifestPath, saveDataString);


        const oldManifestPath = path.join(dir, entity.manifest.original);
        if (
            entity.manifest.manifest !== entity.manifest.original &&
            fs.existsSync(oldManifestPath)
        ) {
            // clean up the old file   
            fs.rmSync(oldManifestPath);
        }
    }
}