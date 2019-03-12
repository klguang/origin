const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin()

let gitCommitHash = process.env.GIT_COMMIT_HASH || process.env.DEPLOY_TAG,
  gitBranch = process.env.GIT_BRANCH

try {
  gitCommitHash = gitRevisionPlugin.commithash()
  gitBranch = gitRevisionPlugin.branch()
} catch (e) {
  /* No Git repo found  */
}

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entry: {
    app: './src/index.js'
  },
  devtool: isProduction ? false : 'cheap-module-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  },
  externals: {
    Web3: 'web3'
  },
  module: {
    noParse: [/^react$/],
    rules: [
      { test: /\.flow$/, loader: 'ignore-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [
            [
              'babel-plugin-fbt',
              {
                fbtEnumManifest: require('./translations/.enum_manifest.json')
              }
            ],
            'babel-plugin-fbt-runtime'
          ]
        }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              url: url => {
                return url.match(/(svg|png)/)
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: isProduction ? 'file-loader' : 'url-loader',
            options: isProduction ? { name: 'fonts/[name].[ext]' } : {}
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [path.resolve(__dirname, 'src/constants'), './node_modules'],
    alias: {
      // https://github.com/facebook/react/issues/13991
      react: path.resolve('./node_modules/react')
    }
  },
  node: {
    fs: 'empty'
  },
  devServer: {
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  watchOptions: {
    poll: 2000
  },
  mode: isProduction ? 'production' : 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/template.html',
      inject: false,
      network: 'rinkeby'
    }),
    new webpack.EnvironmentPlugin({
      HOST: 'localhost',
      ORIGIN_LINKING: null,
      LINKER_HOST: 'localhost',
      DOCKER: false,
      ENABLE_GROWTH: false,
      IPFS_SWARM: '',
      GIT_COMMIT_HASH: gitCommitHash,
      GIT_BRANCH: gitBranch,
      BUILD_TIMESTAMP: +new Date()
    })
  ]
}

if (isProduction) {
  config.output.filename = '[name].[hash:8].js'
  config.optimization.minimizer = [
    new TerserPlugin({ cache: true, parallel: true }),
    new OptimizeCSSAssetsPlugin({})
  ]
  config.plugins.push(
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['public/app.*.css', 'public/app.*.js']
    }),
    new MiniCssExtractPlugin({ filename: '[name].[hash:8].css' }),
    new webpack.IgnorePlugin(/redux-logger/),
    new HtmlWebpackPlugin({
      template: 'public/template.html',
      inject: false,
      filename: 'mainnet.html',
      network: 'mainnet'
    }),
    new HtmlWebpackPlugin({
      template: 'public/template.html',
      inject: false,
      filename: 'kovan.html',
      network: 'kovanTst'
    }),
    new HtmlWebpackPlugin({
      template: 'public/template.html',
      inject: false,
      filename: 'rinkeby.html',
      network: 'rinkeby'
    }),
    new HtmlWebpackPlugin({
      template: 'public/template.html',
      inject: false,
      filename: 'origin.html',
      network: 'origin'
    })
  )
  config.resolve.alias = {
    'react-styl': 'react-styl/prod.js'
  }
  config.module.noParse = [/^(react-styl)$/]
}

module.exports = config
