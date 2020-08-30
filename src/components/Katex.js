/**
 * Simple KaTeX bindings, compatible with server-side rendering due to
 * doing everything synchronously.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {renderToString as katexSync} from 'katex';

import {dedentRaw} from '../dedent';

// Rendering context that detects whether `Katex` appears in the tree.
const Context = React.createContext(() => {});

export default function katex(options) {
    options = {
        display: false,
        ...(options || {}),
    };
    return function katexTag(template, ...args) {
        const tex = dedentRaw(template, ...args);
        return <Katex tex={tex} display={options.display} />;
    };
}

const inlineCache = new Map();
const displayCache = new Map();

function cacheMap(display) {
    return display ? displayCache : inlineCache;
}

class Katex extends Component {

    static propTypes = {
        tex: PropTypes.string.isRequired,
        display: PropTypes.bool.isRequired,
    }

    render() {
        return <Context.Consumer>
            {(katexCallback) => {
                katexCallback();
                if (typeof document !== 'undefined') {
                    // Side-effect in render!? Hey, it works great ;-)
                    ensureStylesLoaded();
                }
                return this._render();
            }}
        </Context.Consumer>;
    }

    _html() {
        const cache = cacheMap(this.props.display);
        const cachedResult = cache.get(this.props.tex);
        if (cachedResult != null) {
            return cachedResult;
        }
        const options = {
            displayMode: this.props.display,
            fleqn: true,
        };
        const html = katexSync(this.props.tex, options);
        cache.set(this.props.tex, html);
        return html;
    }

    _render() {
        // We use `dangerouslySetInnerHTML`, which should be safe
        // because KaTeX is meant to be injection-safe [1] and also
        // because all the inputs are static text written by me.
        //
        // [1]: https://katex.org/docs/security.html
        return <span dangerouslySetInnerHTML={{__html: this._html()}} />;
    }

}

/**
 * Decorate a component to detect whether `<Katex />` is used in its render tree.
 *
 * Usage: assign the result of this call to `{component, usesKatex}`,
 * then render `component`, *then* call `usesKatex` to get a boolean.
 * Rendering `component` has a side-effect of (idempotently) mutating
 * the state read by the `usesKatex` callback.
 */
export function listenForKatex(component) {
    const box = {called: false};
    const callback = () => void (box.called = true);
    const wrapped =
        <Context.Provider value={callback}>{component}</Context.Provider>;
    return {component: wrapped, usesKatex: () => box.called};
}

let stylesLoaded = false;

function ensureStylesLoaded() {
    if (stylesLoaded) {
        return;
    }
    for (const child of document.head.children) {
        if (child.tagName === 'STYLE' && child.dataset.katex != null) {
            stylesLoaded = true;
            return;
        }
    }
    const style = document.createElement('style');
    style.dataset.katex = '';
    style.textContent = require('katex/dist/katex.min.css');
    document.head.appendChild(style);
    stylesLoaded = true;
}
