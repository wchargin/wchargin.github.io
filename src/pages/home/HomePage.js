/*
 * The main component for the home page.
 */

import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

import {Heading, Link, MailLink} from '../../Components';

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
            <img
                src={require("./me.png")}
                alt="me"
                className={css(styles.face)}
            />
            <p>
                I&rsquo;m pursuing a computer science major and math minor
                at <Link href={urls.cmu}>Carnegie Mellon</Link>.
                I&nbsp;love computer science because it unites math, logic,
                and critical thinking into a powerful toolset that I&nbsp;can
                use to solve real-world problems. You&rsquo;ve landed on my
                personal website and portfolio.
            </p>
            <p>
                Helpful info and links:
            </p>
            <ul>
                <li>
                    Pick up a copy of
                    my <Link href={urls.resume}>r&eacute;sum&eacute;!</Link>
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
            <p>
                My surname is pronounced with a hard&nbsp;<i>g</i>: it rhymes
                with&nbsp;<i>bargain</i>, not&nbsp;<i>barge&nbsp;in</i>.
            </p>
        </div>;
    }

}

const styles = StyleSheet.create({
    face: {
        float: 'right',
        borderRadius: '100%',
    },
});
