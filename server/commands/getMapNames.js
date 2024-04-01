const path = require("path");
const fs = require("fs");

const { directories, getAllInDirectories } = require("../utils");

module.exports = function() {
    const files = getAllInDirectories(directories.map);

    return {
        success: true,
        maps: files.map(({ name }) => name ),
    };
}