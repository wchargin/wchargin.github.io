/*
 * A template for all pages, and thus a global container for the
 * application. Includes a header (with navigation bar) and footer.
 */

import {Link} from 'react-router';
import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

import Colors from '../data/Colors';

export default class Page extends Component {

    render() {
        return <div className={css(styles.base)}>
            <header className={css(styles.header)}>
                <nav className={css(styles.centered)}>
                    <em>(Here: <tt>{this.props.location.pathname}</tt>)</em>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                    </ul>
                </nav>
            </header>
            <article className={css(styles.centered)}>
                {this.props.children}
            </article>
            <footer className={css(styles.footer)}>
                <div className={css(styles.centered)}>
                    <span>The end</span>
                </div>
            </footer>
        </div>;
    }

}

const styles = StyleSheet.create({
    base: {
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: 16,
        color: Colors.primary,
        lineHeight: 1.5,
    },
    header: {
        borderTop: `${Colors.accentBlue.dark} 5px solid`,
        borderBottom: `0.5px ${Colors.gray.medium} solid`,
        marginBottom: 24,
        paddingTop: 10,
        paddingBottom: 10,
    },
    centered: {
        maxWidth: 800,
        margin: 'auto',
        paddingLeft: 20,
        paddingRight: 20,
    },
    footer: {
        color: Colors.gray.dark,
        borderTop: `0.5px ${Colors.gray.medium} solid`,
        marginTop: 24,
        paddingTop: 24,
        paddingBottom: 10,
    },
});
