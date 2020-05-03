
const path = require('path');

let jsPath = path.resolve(__dirname, "src/assets/js/");
let sadboiPath = path.resolve(jsPath, "sadboi");

module.exports = {
    // webpack folder’s entry js — excluded from jekll’s build process.
    entry: {
        sadboi_sentiment: path.join(sadboiPath, "sadboi_sentiment.js"),
        sadboi_russell: path.join(sadboiPath, "sadboi_russell.js"),
    },
    output: {
      // we’re going to put the generated file in the assets folder so jekyll will grab it.
      // if using GitHub Pages, use the following:
      // path: "assets/javascripts"
      path: path.resolve(__dirname, "assets/javascript/"),
      filename: "[name]_bundle.js"
    },
    resolve: {
      alias: {
        data: path.resolve(__dirname, "_data")
      }
    },
    optimization: {
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
    },
    module: {
        rules: [
            {

                test: /\.jsx?$/,
                use: [
                    {loader: "babel-loader"}
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
  };