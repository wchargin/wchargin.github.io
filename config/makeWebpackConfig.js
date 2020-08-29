/*
 * Webpack configuration generator. Exports two functions for creating
 * webpack configurations: one for development and one for production.
 */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import StaticSiteGeneratorPlugin from 'static-site-generator-webpack-plugin';
import webpack from 'webpack';

import {staticPaths} from '../src/data/Routes';

export function makeDevConfig() {
    return makeWebpackConfig(false);
}

export function makeProdConfig() {
    return makeWebpackConfig(true);
}

function makeWebpackConfig(prod) {
    return {
        mode: prod ? 'production' : 'development',
        entry: {
            main: './src/index.js',
        },
        output: {
            path: path.join(path.dirname(__dirname), 'dist'),
            filename: 'bundle.js',
            libraryTarget: 'umd',
            sourcePrefix: '',  // don't bork template strings
            publicPath: '/',
            globalObject: 'this',  // static-site-generator-webpack-plugin#130
        },
        devServer: {
            inline: false,  // for ssg: https://stackoverflow.com/a/41492420
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: path.resolve("src/"),
                    loader: 'eslint-loader',
                    enforce: 'pre',
                },
                {
                    test: /\.js$/,
                    include: path.resolve("src/"),
                    loader: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    loader: 'css-loader!csso-loader',
                },
                {
                    test: /\.(?:jpg|png|gif|eot|svg|pdf|gpg|ttf|woff|woff2)$/,
                    include: [path.resolve("src/"), path.resolve("node_modules/katex/")],
                    loader: 'file-loader',
                    query: {
                        name: 'static/[name].[sha256:hash:hex:12].[ext]',
                    },
                },
            ],
        },
        plugins: [
            new CopyPlugin([{from: 'favicon.ico'}]),
            new StaticSiteGeneratorPlugin('main', staticPaths, {}),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': prod ? '"production"' : '"development"',
            }),
        ],
    };
}
