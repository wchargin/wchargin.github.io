/*
 * Looks like a `Link`; acts like a button. Just give it an `onClick`.
 * All other props are forwarded to `Link`, too (except for `href` and `to`,
 * which are ignored---if you want a real link, use a real `Link`!).
 *
 * As far as I can tell, this is a11y-friendly and mobile-friendly.
 * (Among other things, tota11y has no complaints.)
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Link} from '../Components';

export default class LinkButton extends Component {

    static propTypes = {
        onClick: PropTypes.func.isRequired,
    }

    render() {
        const linkProps = {
            ...this.props,
            href: "#",
            onClick: this._handleClick.bind(this),
        };
        delete linkProps.children;
        delete linkProps.to;

        return <Link {...linkProps}>{this.props.children}</Link>;
    }

    _handleClick(e, ...args) {
        e.preventDefault();
        this.props.onClick(e, ...args);
    }

}
