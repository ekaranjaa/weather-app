const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
   mode: 'production',
   entry: './src/js/index.js',
   output: {
      path: path.resolve(__dirname, 'public/dist'),
      filename: 'bundle.js',
   },
   node: {
      fs: 'empty',
   },

   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
               loader: 'babel-loader',
            },
         },
         {
            test: /\.(sa|sc|c)ss$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
               },
               {
                  loader: 'css-loader',
               },
               {
                  loader: 'postcss-loader',
               },
               {
                  loader: 'sass-loader',
                  options: {
                     implementation: require('sass'),
                  },
               },
            ],
         },
         {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     outputPath: 'images',
                  },
               },
            ],
         },
         {
            test: /\.(woff|woff2|ttf|otf|eot)$/,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     outputPath: 'fonts',
                  },
               },
            ],
         },
      ],
   },

   plugins: [
      new MiniCssExtractPlugin({
         filename: 'bundle.css',
      }),
      new Dotenv(),
   ],
};
