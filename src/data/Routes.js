/*
 * The routing data for the application.
 *
 * A route object has some subset of the following properties:
 *
 *   - path (String, required): the path associated with the route
 *   - component (React class, required): the page component to render
 *     for the route
 *   - title (String, required): the <title /> for the page
 *   - navbarTitle (string, defaults to null): if present, the string
 *     that should be used for the link in the navbar; if absent,
 *     indicates that the route should not appear in the navbar
 *   - isIndex (boolean, defaults to false): true only for the home page
 *
 * The route data is exported as `routeData`. This can be converted to
 * react-router routes with `createRoutes()`. For convenience, the
 * `path` properties of the routes are projected into `staticPaths`.
 */

import React from 'react';
import {IndexRoute, Redirect, Route} from 'react-router';

import Page from '../components/Page';
import posts from '../pages/posts/posts';

import HomePage from '../pages/home/HomePage';
import SkillsPage from '../pages/skills/SkillsPage';
import ProjectsPage from '../pages/projects/ProjectsPage';
import AufbauProjectPage from '../pages/projects/AufbauProjectPage';
import PhysBAMProjectPage from '../pages/projects/PhysBAMProjectPage';
import KioskProjectPage from '../pages/projects/KioskProjectPage';
import JGameProjectPage from '../pages/projects/JGameProjectPage';
import CMU15214ProjectPage from '../pages/projects/CMU15214ProjectPage';
import ExperiencePage from '../pages/experience/ExperiencePage';
import EducationPage from '../pages/education/EducationPage';
import PostsIndexPage from '../pages/posts/PostsIndexPage';

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
    if (!!data.redirectTo === !!data.component) {
        throw new Error("route must have exactly one of component, redirectTo");
    }
    if (!data.title) {
        throw new Error("route missing title");
    }
    const defaults = {
        isIndex: false,
        navbarTitle: null,
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
        title: "wchargin",
        navbarTitle: "Home",
        isIndex: true,
    }),
    route({
        path: '/skills/',
        component: SkillsPage,
        title: "Skills",
    }),
    route({
        path: '/projects/',
        component: ProjectsPage,
        title: "Projects",
    }),
    route({
        path: '/projects/aufbau/',
        component: AufbauProjectPage,
        title: "Automated grading",
    }),
    route({
        path: '/projects/physbam/',
        component: PhysBAMProjectPage,
        title: "Physics simulations",
    }),
    route({
        path: '/projects/kiosk/',
        component: KioskProjectPage,
        title: "Kiosk",
    }),
    route({
        path: '/projects/jgame/',
        component: JGameProjectPage,
        title: "JGame",
    }),
    route({
        path: '/projects/cmu-15-214/',
        component: CMU15214ProjectPage,
        title: "CMU 15-214 projects",
    }),
    route({
        path: '/experience/',
        component: ExperiencePage,
        title: "Experience",
    }),
    route({
        path: '/education/',
        component: EducationPage,
        title: "Education",
    }),
    route({
        path: '/posts/',
        component: PostsIndexPage,
        title: "Posts",
        navbarTitle: "Posts",
    }),
    ...posts.map(post => route({
        path: post.path,
        component: post.pageComponent,
        title: post.title,
    })),
    //
    // "Posts" used to be known as "thoughts"; preserve those
    // permalinks.
    route({
        path: '/thoughts/',
        redirectTo: '/posts',
        title: "Posts",
    }),
    ...posts.map(post => route({
        path: post.path.replace(/^\/posts\//, '/thoughts/'),
        redirectTo: post.path,
        title: post.title,
    })),
];

export function createRoutes() {
    return <Route path="/" component={Page}>
        {routeData.map(({redirectTo, isIndex, path, component}, i) => {
            if (redirectTo !== undefined) {
                return <Redirect key={i} from={path} to={redirectTo} />;
            } else if (isIndex) {
                return <IndexRoute key={i} component={component} />;
            } else {
                return <Route key={i} path={path} component={component} />;
            }
        })}
    </Route>;
}

export function resolveRouteFromPath(path) {
    const matches = (candidateRoute) => {
        const candidatePath = candidateRoute.path;
        const start = path.substring(0, candidatePath.length);
        const end = path.substring(candidatePath.length);
        return start === candidatePath && (end.length === 0 || end === '/');
    };
    return routeData.filter(matches)[0] || null;
}

export function resolveTitleFromPath(path) {
    const route = resolveRouteFromPath(path);
    const fallback = "wchargin";
    return (route && route.title) || fallback;
}

export const staticPaths = routeData.map(x => x.path);
