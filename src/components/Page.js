/*
 * A template for all pages, and thus a global container for the
 * application. Includes a header (with navigation bar) and footer.
 */

import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

import Colors from '../data/Colors';
import Link from './Link';

const links = [
    {
        path: '/',
        text: 'Home',
    },
    {
        path: '/projects',
        text: 'Projects',
    },
];

export default class Page extends Component {

    render() {
        return <div className={css(styles.base)}>
            <header className={css(styles.header)}>
                <nav className={css(styles.centered, styles.nav)}>
                    <Link to="/" className={css(styles.navTitle)}>
                        William Chargin
                    </Link>
                    <ul className={css(styles.navList)}>
                        {links.map(({path, text}) =>
                            this._renderNavItem(path, text))}
                    </ul>
                </nav>
            </header>
            <article className={css(styles.centered)}>
                {this.props.children}
            </article>
            <footer className={css(styles.footer)}>
                <div className={css(styles.centered)}>
                    <span>William Chargin</span>
                </div>
            </footer>
        </div>;
    }

    _renderNavItem(path, text) {
        const strip = x => x.replace(/\/$/, '');
        const here = strip(path) === strip(this.props.location.pathname);
        return <li
            key={path}
            className={css(styles.navLink, here && styles.activeNavLink)}
        >
            <Link to={path}>{text}</Link>
        </li>;
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
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    navList: {
        listStyle: 'none',
        paddingLeft: 0,
        margin: 0,
    },
    navTitle: {
        fontSize: 24,
        letterSpacing: -0.5,
        color: '#222',
    },
    navLink: {
        display: 'inline',
        marginLeft: 20,
    },
    activeNavLink: {
        fontWeight: 'bold',
    },
    footer: {
        color: Colors.gray.dark,
        borderTop: `0.5px ${Colors.gray.medium} solid`,
        marginTop: 24,
        paddingTop: 24,
        paddingBottom: 24,
    },
});
