/*
 * Server-side entry point. Exports a function to render a static page,
 * used by the static-site-generator-webpack-plugin.
 */

import dedent from 'dedent';
import {StyleSheetServer} from 'aphrodite';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {match, RouterContext} from 'react-router';

import routes from './routes';

export default function renderStaticPage(locals, callback) {
    const url = locals.path;
    const pathToBundle = "/bundle.js";
    match({
        routes,
        location: url,
    }, (error, redirectLocation, renderProps) => {
        if (error) {
            throw error;
        } else if (redirectLocation) {
            throw new Error(
                `unexpected redirect from ${url} to ${redirectLocation}`);
        } else if (renderProps) {
            const component = <RouterContext {...renderProps} />;
            const {html, css} = StyleSheetServer.renderStatic(() =>
                ReactDOMServer.renderToString(component));
            const page = dedent`
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>wchargin:${url}</title>
                <style>${require("normalize.css")}</style>
                <style data-aphrodite>${css.content}</style>
                </head>
                <body style="overflow-y:scroll">
                <div id="container">${html}</div>
                <script src="${pathToBundle}"></script>
                </body>
                </html>
                `;
            callback(null, page);
        } else {
            // This shouldn't happen because we should only be visiting
            // the right routes.
            throw new Error(`unexpected 404 from ${url}`);
        }
    });
};
