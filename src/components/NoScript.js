/*
 * A component to safely render non-empty noscript elements.
 *
 * See https://github.com/facebook/react/issues/1252.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

export default class NoScript extends Component {

    static contextTypes = {
        router: PropTypes.object,
    }

    render() {
        const contents = renderToStaticMarkup(
            // Since we're triggering an entirely separate render here,
            // we need to manually restart the threading of the router
            // context. Otherwise, `<Link to="/">` elements will render
            // without hrefs.
            <RouterContextProvider router={this.context.router}>
                {this.props.children}
            </RouterContextProvider>
        );
        return <noscript
            dangerouslySetInnerHTML={{__html: contents}}
        />;
    }

}


class RouterContextProvider extends Component {

    static childContextTypes = {
        router: PropTypes.object,
    }

    getChildContext() {
        return {router: this.props.router};
    }

    render() {
        return this.props.children;
    }

}
