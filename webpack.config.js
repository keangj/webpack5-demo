const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  plugins: [new ESLintPlugin({
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  })],
  resolve: {
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
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                compileType: 'icss'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              additionalData: `@import '~src/less-vars.less';`
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                compileType: 'icss'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import 'src/scss-vars.scss';`,
              sassOptions: {
                includePaths: [__dirname]
              }
            }
          }
        ]
      }
    ]
  }
}