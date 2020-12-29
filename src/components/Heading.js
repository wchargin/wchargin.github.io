/*
 * A reusable component to display a styled heading.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite/no-important';

export default class Heading extends Component {

    static propTypes = {
        level: PropTypes.oneOf([1, 2, 3]).isRequired,
    }

    render() {
        const Tag = `h${this.props.level}`;
        return <Tag className={css(styles[Tag])}>
            {this.props.children}
        </Tag>;
    }

}

const styles = StyleSheet.create({
    h1: {
        marginTop: 30,
        marginBottom: 10,
        fontSize: 32,
        fontWeight: 'normal',
    },
    h2: {
        marginTop: 26,
        marginBottom: 8,
        fontSize: 24,
        fontWeight: 'normal',
    },
    h3: {
        marginTop: 18,
        marginBottom: 6,
        fontSize: 20,
        fontWeight: 'normal',
    },
});
