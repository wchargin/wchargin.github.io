/*
 * Webpack configuration generator. Exports two functions for creating
 * webpack configurations: one for development and one for production.
 */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import reactRouterToArray from 'react-router-to-array';
import StaticSiteGeneratorPlugin from 'static-site-generator-webpack-plugin';
import webpack from 'webpack';

import routes from '../src/routes';

export function makeDevConfig() {
    return makeWebpackConfig(false);
}

export function makeProdConfig() {
    return makeWebpackConfig(true);
}

function makeWebpackConfig(prod) {
    return {
        entry: {
            main: './src/index.js',
        },
        output: {
            path: 'dist',
            filename: 'bundle.js',
            libraryTarget: 'umd',
            sourcePrefix: '',  // don't bork template strings
            publicPath: '/',
        },
        module: {
            preLoaders: [
                {
                    test: /\.js$/,
                    include: path.resolve("src/"),
                    loader: 'eslint',
                },
            ],
            loaders: [
                {
                    test: /\.js$/,
                    include: path.resolve("src/"),
                    loader: 'babel',
                },
                {
                    test: /\.css$/,
                    loader: 'css!csso',
                },
                {
                    test: /\.(?:jpg|png|gif|eot|svg|pdf|ttf|woff|woff2)$/,
                    include: path.resolve("src/"),
                    exclude: /node_modules\//,
                    loader: 'file',
                    query: {
                        name: 'static/[name].[sha256:hash:hex:12].[ext]',
                    },
                },
            ],
        },
        plugins: plugins(prod),
    };
}

function plugins(prod) {
    return [
        new CopyPlugin([{from: 'favicon.ico'}]),
        new StaticSiteGeneratorPlugin('main', reactRouterToArray(routes), {}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': prod ? '"production"' : '"development"',
        }),
    ].concat(prod ? prodOnlyPlugins() : devOnlyPlugins());
}

function prodOnlyPlugins() {
    return [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false,
            },
            mangle: {
                screw_ie8: true,
            },
            output: {
                comments: false,
                screw_ie8: true,
            },
        }),
    ];
}

function devOnlyPlugins() {
    return [
    ];
}
