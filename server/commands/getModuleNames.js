const path = require("path");
const fs = require("fs");

const { directories, getAllDirsInDirectories } = require("../utils");

module.exports = function() {
    const dirs = getAllDirsInDirectories(directories.modules.load);

    return {
        success: true,
        modules: dirs.map(({ name }) => name ),
    };
}