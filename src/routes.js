/*
 * The react-router route data for this application. The default export
 * is a Route component that contains the entire application hierarchy.
 */

import React from 'react';
import {IndexRoute, Route} from 'react-router';

import Page from './components/Page';

import HomePage from './pages/home/HomePage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ExperiencePage from './pages/experience/ExperiencePage';
import EducationPage from './pages/education/EducationPage';

export default (
    <Route path="/" component={Page}>
        <IndexRoute component={HomePage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/experience" component={ExperiencePage} />
        <Route path="/education" component={EducationPage} />
    </Route>
);
