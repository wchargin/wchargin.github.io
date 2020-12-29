/*
 * Server-side entry point. Exports a function to render a static page,
 * used by the static-site-generator-webpack-plugin.
 */

import {StyleSheetServer} from 'aphrodite/no-important';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {match, RouterContext} from 'react-router';

import dedent from './dedent';
import {listenForKatex} from './components/Katex';
import {RedirectPage} from './components/Page';
import {createRoutes, resolveTitleFromPath} from './data/Routes';


const HOST = 'https://wchargin.github.io'


export default function renderStaticPage(locals, callback) {
    const url = locals.path;
    const routes = createRoutes();
    match({routes, location: url}, (error, redirectLocation, renderProps) => {
        if (error) {
            throw error;
        } else if (redirectLocation) {
            const canonical = HOST + redirectLocation.pathname;
            const component = <RedirectPage targetUrl={canonical} />;
            const {html, css} = StyleSheetServer.renderStatic(() =>
                ReactDOMServer.renderToStaticMarkup(component));
            const page = dedent`\
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <meta http-equiv="refresh" content="0;url=${canonical}" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link rel="canonical" href="${canonical}" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>Redirecting</title>
                <style>${require("normalize.css")}</style>
                <style>${require("./base.css")}</style>
                <style>${require("katex/dist/katex.min.css")}</style>
                <style data-aphrodite>${css.content}</style>
                <noscript><style>.yesscript{display:none;}</style></noscript>
                </head>
                <body style="overflow-y:scroll">
                <div id="container">${html}</div>
                <script>location.href = ${JSON.stringify(canonical)};</script>
                </body>
                </html>
                `;
            callback(null, page);
        } else if (renderProps) {
            const {component, usesKatex} =
                listenForKatex(<RouterContext {...renderProps} />);
            const {html, css} = StyleSheetServer.renderStatic(() =>
                ReactDOMServer.renderToString(component));
            let katexStyleElement = '';
            if (usesKatex()) {
                katexStyleElement = [
                    '<style data-katex>',
                    require('katex/dist/katex.min.css'),
                    '</style>\n',
                ].join('');
            }
            const page = dedent`\
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>${resolveTitleFromPath(url)}</title>
                <style>${require("normalize.css")}</style>
                <style>${require("./base.css")}</style>
                ${katexStyleElement}<style>${require("./extern/prism-styles.css")}</style>
                <style data-aphrodite>${css.content}</style>
                <noscript><style>.yesscript{display:none;}</style></noscript>
                </head>
                <body style="overflow-y:scroll">
                <div id="container">${html}</div>
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
