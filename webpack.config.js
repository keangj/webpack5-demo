const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const mode = 'production';

const cssLoaders = (...loaders) => [
  mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: {
        compileType: 'icss'
      }
    }
  },
  ...loaders
]

module.exports = {
  mode,
  output: { 
    filename: '[name].[contenthash].css', 
    path: path.resolve(__dirname, 'dist') 
  },
  plugins: [
    new ESLintPlugin({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    mode === 'production' && new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin()
  ].filter(Boolean),
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          minSize: 0, /* 如果不写 0，由于 React 文件尺寸太小，会直接跳过 */
          test: /[\\/]node_modules[\\/]/, // 为了匹配 /node_modules/ 或 \node_modules\
          name: 'vendors', // 文件名
          chunks: 'all',  // all 表示同步加载和异步加载，async 表示异步加载，initial 表示同步加载
          // 这三行的整体意思就是把两种加载方式的来自 node_modules 目录的文件打包为 vendors.xxx.js
          // 其中 vendors 是第三方的意思
        }
      },
    }
  },
  resolve: {
    extensions: [".json", '.ts', '...'],  // 按顺序解析后缀
    alias: {
      'src': path.resolve(__dirname, './src/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react', { runtime: 'classic' }],
              ['@babel/preset-typescript']
            ]
          }
        }
      },
      {
        test: /\.less$/i,
        use: cssLoaders({
          loader: 'less-loader',
          options: {
            additionalData: `@import '~src/less-vars.less';`
          }
        })
      },
      {
        test: /\.styl(us)?$/i,
        use: cssLoaders({
          loader: 'stylus-loader',
          options: {
            stylusOptions: {
              import: [path.resolve(__dirname, 'src/stylus-vars.styl')]
            }
          }
        })
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders({
          loader: 'sass-loader',
          options: {
            additionalData: `@import 'src/scss-vars.scss';`,
            sassOptions: {
              includePaths: [__dirname]
            }
          }
        })
      }
    ]
  }
}