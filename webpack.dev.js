const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const noIndex = fs.readFileSync(__dirname + "/src/common/noindex.html");

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
  devServer: {
    port: 3000,
  },
  resolve: {
    fallback: {
      fs: false
    }
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: `./src/pages/index.html`,
      inject: true,
      chunks: ["index"],
      filename: "index.html",
      noIndex: noIndex
    }),
    ...webpackPages
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|abi|mp4)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  externals: [
    {
      xmlhttprequest: "{XMLHttpRequest:XMLHttpRequest}",
    },
  ],
};
