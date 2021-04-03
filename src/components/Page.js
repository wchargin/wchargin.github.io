/*
 * A template for all pages, and thus a global container for the
 * application. Includes a header (with navigation bar) and footer.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite/no-important';

import Colors, {hexWithAlpha} from '../data/Colors';
import {Heading, Link} from '../Components';
import {routeData} from '../data/Routes';

export default class Page extends Component {

    render() {
        const urls = {
            github: "https://github.com/wchargin",
        };
        return <div className={css(styles.base)}>
            <header className={css(styles.header)}>
                <nav className={css(styles.centered, styles.nav)}>
                    <Link to="/" className={css(styles.navTitle)}>
                        William Chargin
                    </Link>
                    <HorizontalNav currentPath={this.props.location.pathname} />
                </nav>
            </header>
            <article className={css(styles.centered)}>
                {this.props.children}
            </article>
            <footer className={css(styles.footer)}>
                <div className={css(styles.centered)}>
                    <Link href={urls.github}>
                        <GitHubIcon />&nbsp;wchargin
                    </Link><br />
                    <span>email me @gmail.com</span>
                </div>
            </footer>
        </div>;
    }

}

/**
 * A barebones page that will be displayed while a meta-refresh is being
 * processed. This component will be rendered as static HTML and
 * instantiated without a React Router context, so we strip out all
 * inessential functionality---but we can still preserve the general
 * styling of the site.
 */
export class RedirectPage extends Component {

    static propTypes = {
        targetUrl: PropTypes.string.isRequired,
    }

    render() {
        const target = this.props.targetUrl;
        return <div className={css(styles.base)}>
            <header className={css(styles.header)}>
                <nav className={css(styles.centered, styles.nav)}>
                    <Link href="/" className={css(styles.navTitle)}>
                        William Chargin
                    </Link>
                </nav>
            </header>
            <article className={css(styles.centered)}>
                <Heading level={1}>Redirecting…</Heading>
                <p>
                    This page has moved.
                    If you are not redirected automatically, click the following link:
                </p>
                <p><Link href={target}>{target}</Link></p>
            </article>
        </div>;
    }

}

/*
 * Test whether `maybeChild` is equal to or a subroute of `parent`.
 *
 * @param {string} maybeChild
 * @param {string} parent
 * @return {boolean}
 */
function isSubroute(maybeChild, parent) {
    const start = maybeChild.substring(0, parent.length);
    const end = maybeChild.substring(parent.length);
    const startOkay = start === parent;
    const endOkay = end.length === 0 || end.charAt(0) === '/';
    return startOkay && endOkay;
}

/*
 * A navbar that shows its entries in a horizontal row.
 */
class HorizontalNav extends Component {

    static propTypes = {
        currentPath: PropTypes.string.isRequired,
    }

    render() {
        return <ul className={css(styles.navList)}>
            {routeData
                .filter(x => x.navbarTitle)
                .map(({path, navbarTitle, isIndex}) =>
                    this._renderNavItem(
                        path, navbarTitle, isIndex))}
        </ul>;
    }

    _renderNavItem(linkPath, linkText, isIndex) {
        const here = isSubroute(this.props.currentPath, linkPath);
        return <li
            key={linkPath}
            className={css(styles.navLink, here && styles.activeNavLink)}
        >
            <Link to={linkPath}>{isIndex ? <HomeIcon /> : linkText}</Link>
        </li>;
    }

}

/*
 * A simple home icon component. This icon is by Timothy Miller and is
 * released under CC-BY-SA [1] [2].
 *
 * [1]: https://commons.wikimedia.org/wiki/File:Home-icon.svg
 * [2]: https://www.iconfinder.com/icons/126572/home_house_icon#size=128
 */
class HomeIcon extends Component {

    static svgPath = 'M15.45,7L14,5.551V2c0-0.55-0.45-1-1-1h-1c-0.55,0-1,0.45-1,1v0.553L9,0.555C8.727,0.297,8.477,0,8,0S7.273,0.297,7,0.555  L0.55,7C0.238,7.325,0,7.562,0,8c0,0.563,0.432,1,1,1h1v6c0,0.55,0.45,1,1,1h3v-5c0-0.55,0.45-1,1-1h2c0.55,0,1,0.45,1,1v5h3  c0.55,0,1-0.45,1-1V9h1c0.568,0,1-0.437,1-1C16,7.562,15.762,7.325,15.45,7z';

    render() {
        const size = 14;
        return <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            alt="Home"
            aria-label="Home"
        >
            <path fill="currentColor" d={HomeIcon.svgPath} />
        </svg>;
    }

}

/*
 * An icon with the GitHub logo.
 */
class GitHubIcon extends Component {

    static svgPath = 'm8 0.431c-4.28 0-7.76 3.47-7.76 7.76 0 3.43 2.22 6.34 5.31 7.36 0.388 0.071 0.53-0.168 0.53-0.374 0-0.184-0.007-0.672-0.01-1.32-2.16 0.469-2.61-1.04-2.61-1.04-0.353-0.896-0.862-1.14-0.862-1.14-0.705-0.481 0.053-0.472 0.053-0.472 0.779 0.055 1.19 0.8 1.19 0.8 0.692 1.19 1.82 0.843 2.26 0.645 0.071-0.502 0.271-0.843 0.493-1.04-1.73-0.3-3.54-0.9-3.54-3.91 0-0.847 0.302-1.54 0.799-2.08-0.08-0.2-0.35-0.99 0.07-2.06 0 0 0.652-0.209 2.13 0.796 0.63-0.18 1.29-0.26 1.95-0.27 0.659 0.003 1.32 0.089 1.94 0.261 1.48-1 2.13-0.796 2.13-0.796 0.423 1.07 0.157 1.86 0.077 2.05 0.497 0.542 0.798 1.24 0.798 2.08 0 2.98-1.81 3.64-3.54 3.83 0.279 0.24 0.527 0.713 0.527 1.44 0 1.04-0.01 1.87-0.01 2.13 0 0.208 0.14 0.449 0.534 0.373 3.08-1.03 5.3-3.94 5.3-7.36 0-4.23-3.5-7.71-7.8-7.71z';

    render() {
        const size = 16;
        return <svg
            width={size}
            height={size}
            style={{verticalAlign: "middle"}}
            viewBox="0 0 16 16"
            alt="GitHub"
            aria-label="GitHub"
        >
            <path fill="currentColor" d={GitHubIcon.svgPath} />
        </svg>;
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
    navColumnLink: {
        display: 'block',
        paddingLeft: 30,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        textAlign: 'right',
        ':hover': {
            background: hexWithAlpha(Colors.accentBlue.base, 0.1),
        },
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
