/*
 * A reusable component to display a styled heading.
 */

import React, {Component, PropTypes} from 'react';
import {StyleSheet, css} from 'aphrodite';

export default class Heading extends Component {

    static propTypes = {
        level: PropTypes.oneOf([1, 2]).isRequired,
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
        marginTop: 18,
        fontSize: 32,
        fontWeight: 'normal',
    },
    h2: {
        marginTop: 14,
        fontSize: 24,
        fontWeight: 'normal',
    },
});
