/*
 * Single-line and multi-line formatted code displays.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite/no-important';

import Prism from '../extern/Prism';
import Colors, {hexWithAlpha} from '../data/Colors';

/*
 * An inline code display.
 */
export class Code extends Component {

    static propTypes = {
        code: PropTypes.string.isRequired,
        language: PropTypes.object,  // Prism language definition
        hideStrings: PropTypes.bool,
    }

    render() {
        const language = this.props.language || {};
        const html = Prism.highlight(this.props.code, language);
        return <code
            className={css(styles.code, styles.inlineCode)}
            dangerouslySetInnerHTML={{__html: html}}
            data-hide-strings={this.props.hideStrings}
        />;
    }

}

/**
 * A multi-line code display.
 */
export class CodeBlock extends Component {

    static propTypes = {
        code: PropTypes.string.isRequired,
        language: PropTypes.object,  // Prism language definition
        hideStrings: PropTypes.bool,
    }

    render() {
        const language = this.props.language || {};
        const html = Prism.highlight(this.props.code, language);
        return <pre className={css(styles.pre)}>
            <code
                className={css(styles.code)}
                dangerouslySetInnerHTML={{__html: html}}
                data-hide-strings={this.props.hideStrings}
            />
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
        padding: '2px 4px',
        background: hexWithAlpha(Colors.accentBlue.base, 0.1),
        whiteSpace: 'pre-wrap',
    },
});
