/*
 * A component to safely render non-empty noscript elements.
 *
 * See https://github.com/facebook/react/issues/1252.
 */

import React, {Component} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

export default class NoScript extends Component {

    render() {
        const contents = renderToStaticMarkup(this.props.children);
        return <noscript
            dangerouslySetInnerHTML={{__html: contents}}
        />;
    }

}
