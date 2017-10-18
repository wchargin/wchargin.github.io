/*
 * The main component for the posts page.
 */

import React, {Component} from 'react';

import {Heading, Link} from '../../Components';
import posts from './posts';

export default class PostsIndexPage extends Component {

    render() {
        return <div>
            <Heading level={1}>Posts</Heading>
            <p>
                This is a loosely organized collection of some things that I’ve found interesting enough to write something about.
            </p>
            <ul>
                {posts.slice().reverse().map(data =>
                    <li key={data.slug}>
                        <Link to={data.path}>{data.title}</Link>
                        {" "}({data.date})
                    </li>)}
            </ul>
        </div>
    }

}
