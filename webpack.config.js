const VueLoaderPlugin = require('vue-loader/lib/plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
    	path: __dirname + '/dist',
    	filename: 'built.js'
    },
    module: {
      rules:[
        {
          test: /\.css$/,
      		loader: 'style-loader!css-loader!less-loader'
        },
        {
          test: /\.less$/,
          loader: 'style-loader!css-loader!less-loader'
        },
        {
          test: /\.(jpg|jpeg|gif|ttf|svg|png|woff)$/,
          loader: 'url-loader',
          options: {
              esModule: false, 
              name: '[name].[ext]',
              limit: 10240
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/transform-runtime']
                  },
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
      	title: '首页',
      	filename: 'index.html',
      	template: './public/index.html'
      }),
      new VueLoaderPlugin(),
    ]
}
