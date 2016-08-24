/*
 * Main entry point. Exports a function to do server-side rendering,
 * and runs client initialization (rehydration) code if on the frontend.
 */

import initializeClient from './client';

if (typeof document !== "undefined") {
    initializeClient();
}

export {default} from './server';
