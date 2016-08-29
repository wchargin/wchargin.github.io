/*
 * Main entry point. Exports a function to do server-side rendering,
 * and runs client initialization (rehydration) code if on the frontend.
 *
 * Note that this module _is_ transpiled by Babel. However, we want to
 * require the `object-assign` polyfill before _anything_ else happens.
 * As a consequence, we can't use the ES6 module syntax, because Babel
 * hosts these imports---including `export ... from` forms---to the very
 * top of the file. So we manually define the exports, old-school style.
 */

Object.assign = null;
Object.assign = require("object-assign");

const isServerRendering = typeof document === "undefined";

if (!isServerRendering) {
    require("./client").default();
}

module.exports = {
    default: require("./server.js").default,
};
