/*
 * A link to open a ReCAPTCHA MailHide window for requesting my email.
 * Also exports a function to open such a window programmatically.
 */

import React, {Component, PropTypes} from 'react';

import {LinkButton} from '../Components';

export default class MailLink extends Component {

    static propTypes = {
        children: PropTypes.node,
    }

    render() {
        const props = {...this.props};
        delete props.children;

        return <LinkButton {...props} onClick={this._handleClick.bind(this)}>
            {this.props.children}
        </LinkButton>;
    }

    _handleClick(e) {
        openMailLink();
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }

}

export function openMailLink() {
    const url = "https://www.google.com/recaptcha/mailhide/d" +
                "?k=01j2xJSp6GMIhivlCpmSrxBw==" +
                "&c=F0-eweu468thgo0QAg6G9LcFdYCxAAOHiwDXZtIR9Gk=";
    const params = {
        toolbar: 0,
        scrollbars: 0,
        location: 0,
        statusbar: 0,
        menubar: 0,
        resizable: 0,
        width: 500,
        height: 300,
    };
    const paramsString = Object.keys(params)
        .map(k => `${k}=${params[k]}`)
        .join(",");
    window.open(url, '', paramsString);
}
