/*
 * The LaTeX logo, to be used inline with text.
 */

import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

export const getResourcesToPreload = () => [
    require('./latex-inline.png'),
];

export default class LaTeX extends Component {

    static propTypes = {}

    render() {
        return <img
            src={require('./latex-inline.png')}
            className={css(styles.latex)}
            alt="LaTeX"
        />;
    }

}

const styles = StyleSheet.create({
    latex: {
        height: '1em',
        marginBottom: '-0.238em',
    },
});
