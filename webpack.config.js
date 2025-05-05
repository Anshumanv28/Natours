const path = require('path');

module.exports = {
  mode: 'development', // Add mode for better debugging
  entry: './public/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'), // Output to a separate directory
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply Babel loader to JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devtool: 'source-map', // Enable source maps for easier debugging
};
