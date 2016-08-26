/*
 * A template for all pages, and thus a global container for the
 * application. Includes a header (with navigation bar) and footer.
 */

import React, {Component, PropTypes} from 'react';
import {StyleSheet, css} from 'aphrodite';

import Colors from '../data/Colors';
import {Link, MailLink} from '../Components';
import {routeData} from '../data/Routes';

export default class Page extends Component {

    render() {
        return <div className={css(styles.base)}>
            <header className={css(styles.header)}>
                <nav className={css(styles.centered, styles.nav)}>
                    <Link to="/" className={css(styles.navTitle)}>
                        William Chargin
                    </Link>
                    <HorizontalNav
                        currentPath={this.props.location.pathname}
                    />
                </nav>
            </header>
            <article className={css(styles.centered)}>
                {this.props.children}
            </article>
            <footer className={css(styles.footer)}>
                <div className={css(styles.centered)}>
                    <span>William Chargin</span><br />
                    <MailLink>Get my email address</MailLink>
                </div>
            </footer>
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
