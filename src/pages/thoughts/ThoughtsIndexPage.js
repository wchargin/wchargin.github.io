/*
 * The main component for the experience page.
 */

import React, {Component} from 'react';

import {Heading, Link} from '../../Components';
import thoughts from './thoughts';

export default class ThoughtsIndexPage extends Component {

    render() {
        return <div>
            <Heading level={1}>Thoughts</Heading>
            <p>
                This is a loosely organized collection of some things that I’ve found interesting enough to write something about.
            </p>
            <ul>
                {thoughts.slice().reverse().map(data =>
                    <li key={data.slug}>
                        <Link to={data.path}>{data.title}</Link>
                        {" "}({data.date})
                    </li>)}
            </ul>
        </div>
    }

}
