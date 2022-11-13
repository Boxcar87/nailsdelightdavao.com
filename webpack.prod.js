const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const fs = require('fs');
const noIndex = '';
const pages = [
    // add more html pages here
]
const webpackPages = [];

for (var i in pages) {
    webpackPages.push(new HtmlWebpackPlugin({
        template: `./src/pages/${pages[i]}.html`,
        inject: true,
        chunks: ["index"],
        filename: `${pages[i]}.html`,
        noIndex: noIndex
    }))
}

module.exports = {
    entry: {
        index: `./src/pages/index.js`
    },
    output: {
        filename: '[name].[hash:20].js',
        path: path.resolve(__dirname, `./src/pages/prod`)
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|abi|mp4)$/i,
                loader: 'file-loader',
                // use: [
                //     {
                        
                //     },
                // ],
                options: {
                    name: '/src/assets/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new NodePolyfillPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: `./src/pages/index.html`,
            inject: true,
            chunks: ['index'],
            filename: 'index.html',
            noIndex: noIndex
        }),
        ...webpackPages,
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css"
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true
            }),
            new OptimizeCssAssetsPlugin({})
        ]
    },
    externals:[{
        xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
    }]
};