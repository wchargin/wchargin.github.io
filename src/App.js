/*
 * The root component for the application.
 */

import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';

import {createRoutes, resolveTitleFromPath} from './data/Routes';
import Link from './components/Link';

export default class App extends Component {

    render() {
        const app = this;
        return <Router
            history={browserHistory}
            onUpdate={function() {
                const router = this;
                app._handleUpdate(router.state.location.pathname);
            }}
            routes={createRoutes()}
        />;
    }

    _handleUpdate(path) {
        window.scrollTo(0, 0);
        document.title = resolveTitleFromPath(path);
        Link.preloadResourcesFor(path);
    }

}
