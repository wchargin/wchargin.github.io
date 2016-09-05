/*
 * The main component for the home page.
 */

import React, {Component} from 'react';

import {routeData} from '../../data/Routes';
import {Blurb, Heading, Link, MailLink} from '../../Components';

Link.registerPreloadResources('/', () => [
    require('./me.png'),
]);

export default class HomePage extends Component {

    render() {
        const urls = {
            cmu: "https://www.cs.cmu.edu",
            resume: require("./resume.pdf"),
            github: "https://github.com/wchargin",
        };
        return <div>
            <Heading level={1}>Hey!</Heading>
            <Blurb
                image={require("./me.png")}
                imagePosition={Blurb.IMAGE_RIGHT}
            >
                <p>
                    I&rsquo;m pursuing a computer science major and math minor
                    at <Link href={urls.cmu}>Carnegie Mellon</Link>.
                    I&nbsp;love computer science because it unites math, logic,
                    and critical thinking into a powerful toolset that
                    I&nbsp;can use to solve real-world problems. You&rsquo;ve
                    landed on my personal website and portfolio.
                </p>
                <p>
                    Helpful info and links:
                </p>
                <ul>
                    <li>
                        Pick up a copy of my{" "}
                        <Link href={urls.resume}>r&eacute;sum&eacute;!</Link>
                    </li>
                    <li>
                        Feel free to check out{" "}
                        <Link href={urls.github}>my GitHub profile!</Link>
                    </li>
                    <li>
                        If you&rsquo;d like to contact me,{" "}
                        <MailLink>request my email!</MailLink>
                    </li>
                </ul>
            </Blurb>
            <Heading level={2}>What do you want to know?</Heading>
            <ul>
                <li>
                    My surname is pronounced with a hard&nbsp;<i>g</i>: it
                    rhymes with&nbsp;<i>bargain</i>,
                    not&nbsp;<i>barge&nbsp;in</i>.
                </li>
                <li>
                    My hobbies include learning Greek and the game of Go.
                </li>
                <li>
                    Here are some more pages with information about me:
                    <ul>
                        {routeData.map(route =>
                            !route.isIndex && route.navbarTitle && <li>
                                <Link key={route.path} to={route.path}>
                                    {route.navbarTitle}
                                </Link>
                            </li>)}
                    </ul>
                </li>
            </ul>
        </div>;
    }

}
