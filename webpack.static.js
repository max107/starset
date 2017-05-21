'use strict';

let path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    SiteGeneratorPlugin = require('./plugin/static-site'),
    CompressionPlugin = require('compression-webpack-plugin');

let config = {
    target: 'web',
    devtool: 'cheap-source-map',
    context: path.join(__dirname, 'src'),
    entry: {
        app: [
            require.resolve('./polyfills'),
            './app.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        libraryTarget: 'umd'
    },
    plugins: [
        new SiteGeneratorPlugin({
            // todo for what this needed?
            entry: 'app.bundle.js',
            urls: require('./urls.js'),
        }),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale/,
            /(en-gb|ru)\.js/
        ),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({
            filename: 'app.bundle.css',
            allChunks: true
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.html$/,
            threshold: 0,
            minRatio: 999
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true
                }
            },
            {
                test: /(\.css|\.scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: false,
                                sourceMap: true,
                                modules: false,
                                importLoaders: true,
                                localIdentName: "[name]__[local]___[hash:base64:5]"
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                                plugins: () => [
                                    require("autoprefixer"),
                                    require('postcss-csso')
                                ]
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                options: {
                                    includePaths: [
                                        // TODO not work path.resolve("./node_modules/flexy-framework")
                                    ]
                                }
                            }
                        },
                    ]
                })
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.join(__dirname, 'src')
        ],
        extensions: ['.json', '.js', '.jsx']
    }
};

module.exports = config;
