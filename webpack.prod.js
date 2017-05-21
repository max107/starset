'use strict';

let path = require('path'),
    webpack = require('webpack'),
    WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin'),
    CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    SiteGeneratorPlugin = require('./plugin/static-site');

function getEntrySources(sources) {
    sources.push(require.resolve('./polyfills'));

    if (process.env.NODE_ENV !== 'production') {
        sources.push('webpack-dev-server/client?http://localhost:8080');
        sources.push('webpack/hot/only-dev-server');
    }

    return sources;
}

let config = {
    target: 'web',
    devtool: 'cheap-source-map',
    context: path.join(__dirname, 'src'),
    entry: {
        app: getEntrySources(['./app.js'])
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

            routes: path.join(__dirname, 'src/routes.js'),
            urls: path.join(__dirname, 'urls.js')
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
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            // test: /\.(js|jsx)$/,
            sourceMap: true,
            compress: {
                screw_ie8: true, // React doesn't support IE8
                warnings: false
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        }),
        new CaseSensitivePathsPlugin,
        new WatchMissingNodeModulesPlugin(path.join(__dirname, 'node_modules')),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'src')
    },
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
