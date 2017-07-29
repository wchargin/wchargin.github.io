/*
 * Single-line and multi-line formatted code displays.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite/no-important';

import Colors, {hexWithAlpha} from '../data/Colors';

/*
 * An inline code display.
 */
export class Code extends Component {

    static propTypes = {
        code: PropTypes.string.isRequired,
    }

    render() {
        return <code className={css(styles.code, styles.inlineCode)}>
            {this.props.code}
        </code>;
    }

}

/**
 * A multi-line code display.
 */
export class CodeBlock extends Component {

    static propTypes = {
        code: PropTypes.string.isRequired,
    }

    render() {
        return <pre className={css(styles.pre)}>
            <Code {...this.props} />
        </pre>;
    }
}

const styles = StyleSheet.create({
    pre: {
        margin: 16,
        overflowX: 'auto',
        background: hexWithAlpha(Colors.accentBlue.base, 0.1),
        borderLeft: `${Colors.accentBlue.base} 2px solid`,
        padding: 16,
        lineHeight: '140%',
    },
    code: {
        fontFamily: 'Helvetica, Arial, sans-serif',
    },
    inlineCode: {
        whiteSpace: 'pre-wrap',
    },
});
