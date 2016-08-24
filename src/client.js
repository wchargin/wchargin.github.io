/*
 * Client-side entry point. Rehydrates a server-side rendered page.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';

import routes from './routes';

export default function initializeClient() {
    const container = document.getElementById("container");
    const router = <Router history={browserHistory} routes={routes} />;
    ReactDOM.render(router, container);
}
