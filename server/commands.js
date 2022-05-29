const path = require('path');

const { locateInDirectories, getJsonFile } = require('./utils');

const saveDirectories = [
    path.resolve(__dirname, "..", "data", "saves"),
];

module.exports = {
    getSavedGames: () => {
        return {
            success: true,
            games: ['main'],
        };
    },
    getSavedGame: ({ name }) => {
        const file = locateInDirectories(`${name}.json`, saveDirectories);

        if (!file) {
            return {
                success: false,
                message: "Can't locate save in any directory",
            };
        }

        const content = getJsonFile(file);

        return {
            success: true,
            game: content,
        };
    },
}