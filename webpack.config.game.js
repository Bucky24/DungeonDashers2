const base = require('./webpack.config.base');
const path = require('path');

module.exports = {
	...base,
	entry: path.resolve('./src/gameClient/index.js'),
};