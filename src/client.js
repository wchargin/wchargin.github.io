/*
 * Client-side entry point. Rehydrates a server-side rendered page.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

export default function initializeClient() {
    const container = document.getElementById("container");
    ReactDOM.render(<App />, container);
}
