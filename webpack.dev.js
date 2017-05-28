'use strict';

let path = require('path'),
    webpack = require('webpack'),
    WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin'),
    errorOverlayMiddleware = require('react-error-overlay/middleware'),
    CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

let config = {
    target: 'web',
    devtool: 'cheap-source-map',
    context: path.join(__dirname, 'src'),
    entry: {
        app: [
            // Include an alternative client for WebpackDevServer. A client's job is to
            // connect to WebpackDevServer by a socket and get notified about changes.
            // When you save a file, the client will either apply hot updates (in case
            // of CSS changes), or refresh the page (in case of JS changes). When you
            // make a syntax error, this client will display a syntax error overlay.
            // Note: instead of the default WebpackDevServer client, we use a custom one
            // to bring better experience for Create React App users. You can replace
            // the line below with these two lines if you prefer the stock client:
            // require.resolve('webpack-dev-server/client') + '?/',
            // require.resolve('webpack/hot/dev-server'),
            require.resolve('react-dev-utils/webpackHotDevClient'),
            // We ship a few polyfills by default:
            require.resolve('./polyfills'),
            // Errors should be considered fatal in development
            require.resolve('react-error-overlay'),
            './app.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        libraryTarget: 'umd',
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
    },
    plugins: [
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(__dirname, './public/index.html'),
        }),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({
            filename: 'app.bundle.css',
            allChunks: true
        }),
        new CaseSensitivePathsPlugin,
        new WatchMissingNodeModulesPlugin(path.join(__dirname, 'node_modules')),
    ],
    devServer: {
        hot: true,
        inline: true,
        contentBase: path.join(__dirname, 'build'),
        // By default files from `contentBase` will not trigger a page reload.
        watchContentBase: true,
        // WebpackDevServer is noisy by default so we emit custom message instead
        // by listening to the compiler events with `compiler.plugin` calls above.
        quiet: true,
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebookincubator/create-react-app/issues/293
        watchOptions: {
            ignored: /node_modules/,
        },
        historyApiFallback: {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebookincubator/create-react-app/issues/387.
            disableDotRule: true,
        },
        setup(app) {
            // This lets us open files from the runtime error overlay.
            app.use(errorOverlayMiddleware());
        },
    },
    module: {
        strictExportPresence: true,
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
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
        hints: false,
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
