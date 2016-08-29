/*
 * Server-side entry point. Exports a function to render a static page,
 * used by the static-site-generator-webpack-plugin.
 */

import dedent from 'dedent';
import {StyleSheetServer} from 'aphrodite/no-important';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {match, RouterContext} from 'react-router';

import {createRoutes, resolveTitleFromPath} from './data/Routes';

export default function renderStaticPage(locals, callback) {
    const url = locals.path;
    const pathToBundle = "/bundle.js";
    match({
        routes: createRoutes(),
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
                <title>${resolveTitleFromPath(url)}</title>
                <style>${require("normalize.css")}</style>
                <style data-aphrodite>${css.content}</style>
                <noscript><style>.yesscript{display:none;}</style></noscript>
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
