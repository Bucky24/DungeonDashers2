const fs = require('fs');
const path = require('path');

module.exports = {
    locateInDirectories: (name, dirs, extra = '') => {
        let foundFile = null;

        for (const dir of dirs) {
            let fullPath = path.join(dir, name);
            if (extra || extra !== '') {
                fullPath = path.join(dir, extra, name);
            }

            // security. If someone uses a .. in the name, then we won't contain the full dir anymore
            if (!fullPath.startsWith(dir)) {
                continue;
            }

            if (fs.existsSync(fullPath)) {
                foundFile = fullPath;
                break;
            }
        }

        return foundFile;
    },
    getJsonFile: (file) => {
        if (!fs.existsSync(file)) {
            return null;
        }

        const contents = fs.readFileSync(file, 'utf8');
        return JSON.parse(contents);
    },
    getImageSlug: (type, filePath, data) => {
        const resultObj = {
            type,
            filePath,
            data,
        };

        return btoa(JSON.stringify(resultObj));
    },
    decodeImageSlug: (slug) => {
        const json = JSON.parse(atob(slug));

        return json;
    }
};