var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV,
	entry: './src/gameClient/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'main.bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['@babel/env', '@babel/react']
				}
			},
			{
				test: /\.css$/,
				loader: 'style-loader'
			},
			{
				test: /\.css$/,
				loader: 'css-loader',
				query: {
					modules: true,
					localIdentName: '[name]__[local]___[hash:base64:5]'
				}
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
					{
						loader: 'image-webpack-loader',
						query: {
							optipng: {
								optimizationLevel: 4,
							}
						}
					}
				]
			}
		]
	},
	stats: {
		colors: true
	},
	devtool: 'source-map',
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public', "index.html")
		}),
		new ProgressBarPlugin()
	]
};