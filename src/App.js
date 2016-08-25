/*
 * The root component for the application.
 */

import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';

import {createRoutes} from './data/Routes';

export default class App extends Component {

    render() {
        return <Router
            history={browserHistory}
            onUpdate={() => window.scrollTo(0, 0)}
            routes={createRoutes()}
        />;
    }

}
