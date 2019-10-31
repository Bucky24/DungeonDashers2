const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const systemWeb = path.resolve(__dirname, 'src', 'common', 'system', 'systemWeb.js');
const systemElectron = path.resolve(__dirname, 'src', 'common', 'system', 'systemElectron.js');
const useSystem = process.env.ELECTRON ? systemElectron : systemWeb;

module.exports = {
	mode: process.env.NODE_ENV,
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'main.bundle.js'
	},
	resolve: {
		alias: {
			'system': useSystem
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: [
						[
							'@babel/env',
							{
								targets: {
									node: '10'
								}
							}
						],
						'@babel/react'
					]
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
					'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
				]
			},
			{
				test: /\.(map|enemy|object|camp|char)$/,
				loader: 'json-loader'
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
	],
	devServer: {
		port: 3000
	}
};