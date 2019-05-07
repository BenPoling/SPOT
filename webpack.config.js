// var path = require('path');
// var SRC_DIR = path.join(__dirname, '/react-client/src');
// var DIST_DIR = path.join(__dirname, '/react-client/dist');

// module.exports = {
//   entry: `${SRC_DIR}/index.jsx`,
//   output: {
//     filename: 'bundle.js',
//     path: DIST_DIR
//   },
//   module : {
//     loaders : [
//       {
//         test : /\.jsx?/,
//         include : SRC_DIR,
//         loader : 'babel-loader',
//         query: {
//           presets: ['react', 'es2015']
//        }
//       }
//     ]
//   }
// };

module.exports = {
  entry: `${__dirname}/react-client/src/index.jsx`,
  module: {
    rules: [
      {
        test: [/\.jsx$/],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"]
          }
        }
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: `${__dirname}/react-client/dist`
  }
};
