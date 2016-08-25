/*
 * The routing data for the application.
 *
 * A route object has some subset of the following properties:
 *
 *   - path (String, required): the path associated with the route
 *   - component (React class, required): the page component to render
 *     for the route
 *   - inNavbar (boolean, defaults to false): true if the route should
 *     be displayed in the top-of-page navigation bar
 *   - isIndex (boolean, defaults to false): true only for the home page
 *
 * The route data is exported as `routeData`. This can be converted to
 * react-router routes with `createRoutes()`. For convenience, the
 * `path` properties of the routes are projected into `staticPaths`.
 */

import React from 'react';
import {IndexRoute, Route} from 'react-router';

import Page from '../components/Page';

import HomePage from '../pages/home/HomePage';
import ProjectsPage from '../pages/projects/ProjectsPage';
import AufbauProjectPage from '../pages/projects/AufbauProjectPage';
import PhysBAMProjectPage from '../pages/projects/PhysBAMProjectPage';
import ExperiencePage from '../pages/experience/ExperiencePage';
import EducationPage from '../pages/education/EducationPage';

/*
 * Create a route object, filling in default properties.
 *
 * This raises an error if any required properties are absent.
 *
 * @param {object} data the data for the route object
 * @return {object} the data object with defaults filled in
 */
function route(data) {
    if (!data.path) {
        throw new Error("route missing path");
    }
    if (!data.component) {
        throw new Error("route missing component");
    }
    const defaults = {
        isIndex: false,
        inNavbar: false,
    };
    return {
        ...defaults,
        ...data,
    };
}

export const routeData = [
    route({
        path: '/',
        component: HomePage,
        inNavbar: true,
        isIndex: true,
    }),
    route({
        path: '/projects',
        component: ProjectsPage,
        inNavbar: true,
    }),
    route({
        path: '/projects/aufbau',
        component: AufbauProjectPage,
    }),
    route({
        path: '/projects/physbam',
        component: PhysBAMProjectPage,
    }),
    route({
        path: '/experience',
        component: ExperiencePage,
        inNavbar: true,
    }),
    route({
        path: '/education',
        component: EducationPage,
        inNavbar: true,
    }),
];

export function createRoutes() {
    return <Route path="/" component={Page}>
        {routeData.map(({isIndex, path, component}, i) =>
            isIndex ?
                <IndexRoute key={i} component={component} /> :
                <Route key={i} path={path} component={component} />)}
    </Route>;
}

export const staticPaths = routeData.map(x => x.path);
