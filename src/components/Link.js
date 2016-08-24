/*
 * A styled link component, either as a client-side router link or as
 * a normal anchor tag (use `to` for the former or `href` for the
 * latter). All properties are forwarded.
 */

import React, {Component} from 'react';
import {Link as RouterLink} from 'react-router';
import {StyleSheet, css} from 'aphrodite';

import Colors from '../data/Colors';

export default class Link extends Component {

    render() {
        const linkClass = css(styles.link);
        const className = this.props.className ?
            `${this.props.className} ${linkClass}` :
            linkClass;
        const Tag =
            Object.keys(this.props).indexOf("to") >= 0 ? RouterLink : 'a';
        return <Tag {...this.props} className={className}>
            {this.props.children}
        </Tag>;
    }

}

const styles = StyleSheet.create({
    link: {
        textDecoration: 'none',
        color: Colors.accentBlue.base,
        ':hover': {
            color: Colors.accentBlue.dark,
            textDecoration: 'underline',
        },
        ':active': {
            color: Colors.accentBlue.base,
            textDecoration: 'underline',
        },
    },
});
