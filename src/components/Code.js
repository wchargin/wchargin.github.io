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
        initializeStyles();
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
        supplementaryFonts: PropTypes.bool,
    }

    render() {
        initializeStyles();
        const language = this.props.language || {};
        const html = Prism.highlight(this.props.code, language);
        const codeStyles =
            this.props.supplementaryFonts ? styles.notoCode : styles.code;
        return <pre className={css(styles.pre)}>
            <code
                className={css(codeStyles)}
                dangerouslySetInnerHTML={{__html: html}}
                data-hide-strings={this.props.hideStrings}
            />
        </pre>;
    }
}


// This has to be late-initialized because it depends on a font
// resource, which cannot be required at module load time or Babel will
// be confused. (We need webpack to load it, not Babel.)
let styles;

function initializeStyles() {
    if (styles !== undefined) {
        return;
    }
    const notoUrls = [
        require('../shared_files/noto_supplementary/NotoSansCypriot-Regular.ttf'),
        require('../shared_files/noto_supplementary/NotoSansDeseret-Regular.ttf'),
        require('../shared_files/noto_supplementary/NotoSansOldTurkic-Regular.ttf'),
    ];
    const notos = [notoUrls.map(url => ({
        fontFamily: "Noto Sans",
        fontStyle: "normal",
        fontWeight: "normal",
        src: `url(${url})`,
    }))];
    styles = StyleSheet.create({
        pre: {
            margin: 16,
            overflowX: 'auto',
            background: hexWithAlpha(Colors.accentBlue.base, 0.1),
            borderLeft: `${Colors.accentBlue.base} 2px solid`,
            padding: 16,
            lineHeight: '140%',
        },
        code: {
            fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
        },
        notoCode: {
            fontFamily: ['Helvetica', 'Arial', 'sans-serif', notos],
        },
        inlineCode: {
            padding: '2px 4px',
            background: hexWithAlpha(Colors.accentBlue.base, 0.1),
            whiteSpace: 'pre-wrap',
        },
    });
}
