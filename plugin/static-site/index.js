'use strict';

let RawSource = require('webpack-sources/lib/RawSource'),
    evaluate = require('eval'),
    path = require('path'),
    url = require('url'),
    Promise = require('bluebird');

let findAsset = (src, compilation, webpackStatsJson) => {
    src = src || Object.keys(webpackStatsJson.assetsByChunkName)[0];

    let asset = compilation.assets[src];
    if (asset) {
        return asset;
    }

    let chunkValue = webpackStatsJson.assetsByChunkName[src];
    if (!chunkValue) {
        return null;
    }

    // Webpack outputs an array for each chunk when using sourcemaps
    if (chunkValue instanceof Array) {
        // Is the main bundle always the first element?
        chunkValue = chunkValue[0];
    }

    return compilation.assets[chunkValue];
};

function StaticSiteWebpackPlugin(options) {
    options = options || {};

    this.entry = options.entry;
    this.urls = options.urls || [];
}

StaticSiteWebpackPlugin.prototype.apply = function(compiler) {
    let urls = this.urls,
        entry = this.entry;

    compiler.plugin('this-compilation', compilation => {
        compilation.plugin('optimize-assets', (_, done) => {
            let webpackStats = compilation.getStats(),
                webpackStatsJson = webpackStats.toJson();

            try {
                let asset = findAsset(entry, compilation, webpackStatsJson);

                if (asset == null) {
                    throw new Error('Source file not found: "' + this.entry + '"');
                }

                let assets = getAssetsFromCompilation(compilation, webpackStatsJson),
                    source = asset.source(),
                    render = evaluate(source, /* filename: */ this.entry, /* scope: */ this.globals, /* includeGlobals: */ true);

                if (render.hasOwnProperty('default')) {
                    render = render['default'];
                }

                if (typeof render !== 'function') {
                    throw new Error('Export from "' + this.entry + '" must be a function that returns an HTML string. Is output.libraryTarget in the configuration set to "umd"?');
                }

                renderUrls(urls, render, assets, webpackStats, compilation).nodeify(done);
            } catch (err) {
                compilation.errors.push(err.stack);
                done();
            }
        });
    });
};

function renderUrls(urls, render, assets, webpackStats, compilation) {
    return Promise.all(urls.map(item => {
        let props = Object.assign({}, item, {
            assets: assets,
            webpackStats: webpackStats
        });

        let renderPromise = render.length < 2 ?
            Promise.resolve(render(props)) :
            Promise.fromNode(render.bind(null, props));

        return renderPromise
            .then(output => {
                let outputByPath = {};
                outputByPath[item.target] = output
                    .replace(/ >/g, ">")
                    .replace(/>\s+</g, "><");

                return Promise.all(Object.keys(outputByPath).map(key => {
                    let rawSource = outputByPath[key];
                    let assetName = pathToAssetName(key);

                    if (compilation.assets[assetName]) {
                        return;
                    }

                    compilation.assets[assetName] = new RawSource(rawSource);
                }));
            })
            .catch(err => compilation.errors.push(err.stack));
    }));
}

// Shamelessly stolen from html-webpack-plugin - Thanks @ampedandwired :)
let getAssetsFromCompilation = (compilation, webpackStatsJson) => {
    let assets = {};
    for (let chunk in webpackStatsJson.assetsByChunkName) {
        let chunkValue = webpackStatsJson.assetsByChunkName[chunk];

        // Webpack outputs an array for each chunk when using sourcemaps
        if (chunkValue instanceof Array) {
            // Is the main bundle always the first element?
            chunkValue = chunkValue[0];
        }

        if (compilation.options.output.publicPath) {
            chunkValue = compilation.options.output.publicPath + chunkValue;
        }

        assets[chunk] = chunkValue;
    }

    return assets;
};

function pathToAssetName(outputPath) {
    let outputFileName = outputPath.replace(/^(\/|\\)/, ''); // Remove leading slashes for webpack-dev-server

    if (!/\.(html?)$/i.test(outputFileName)) {
        outputFileName = path.join(outputFileName, 'index.html');
    }

    return outputFileName;
}

module.exports = StaticSiteWebpackPlugin;