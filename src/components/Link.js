/*
 * A styled link component, either as a client-side router link or as
 * a normal anchor tag (use `to` for the former or `href` for the
 * latter). All properties are forwarded.
 *
 * This component also supports preloading resources on hover. Use the
 * static function `Link.registerPreloadResources` to get this behavior.
 */

import React, {Component} from 'react';
import {Link as RouterLink} from 'react-router';
import {StyleSheet, css} from 'aphrodite/no-important';

import Colors from '../data/Colors';

export default class Link extends Component {

    // A map from route to a list of resources to preload.
    static _preloadingResources = {};

    // A set containing resources that have already been preloaded.
    static _preloadedResources = {};

    /**
     * Register a list of resources to preload in conjunction with a given
     * route.
     *
     * Does nothing on the server.
     *
     * @param {string} route
     *     the route whose resources are being specified
     * @param {() => [string]} resourcesCallback
     *     a callback that, given no arguments, will return an array of
     *     paths to resources to preload; this is in a callback so that
     *     it can be executed only on the client side
     */
    static registerPreloadResources(route, resourcesCallback) {
        if (typeof document === 'undefined') {
            // We're on the server. There's nothing to do here.
            return;
        }
        const existing = Link._preloadingResources[route] || [];
        Link._preloadingResources[route] = [
            ...existing,
            ...resourcesCallback().filter(x => existing.indexOf(x) < 0),
        ];
    }

    render() {
        const linkClass = css(styles.link);
        const className = this.props.className ?
            `${this.props.className} ${linkClass}` :
            linkClass;
        const Tag =
            Object.keys(this.props).indexOf("to") >= 0 ? RouterLink : 'a';
        return <Tag
            {...this.props}
            className={className}
            onMouseOver={this._handleMouseOver.bind(this)}
        >
            {this.props.children}
        </Tag>;
    }

    _handleMouseOver(e) {
        Link.preloadResourcesFor(this.props.to);
        if (this.props.onMouseOver) {
            this.props.onMouseOver(e);
        }
    }

    static preloadResourcesFor(resource) {
        const resourcesToPreload = Link._preloadingResources[resource];
        if (resourcesToPreload) {
            for (const resource of resourcesToPreload) {
                if (!Link._preloadedResources[resource]) {
                    Link._preloadedResources[resource] = true;
                    const img = document.createElement('img');
                    img.src = resource;
                    img.style.display = 'none';
                    img.setAttribute('data-preload', 1);
                    document.body.appendChild(img);
                }
            }
        }
    }

}

const styles = StyleSheet.create({
    link: {
        textDecoration: 'none',
        color: Colors.accentBlue.base,
        ':hover': {
            color: Colors.accentBlue.dark,
            textDecoration: 'underline',
        },
        ':active': {
            color: Colors.accentBlue.base,
            textDecoration: 'underline',
        },
    },
});
