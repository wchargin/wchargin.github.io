/*
 * The main component for the projects page.
 */

import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

export default class ProjectsPage extends Component {

    render() {
        const fancy = <em className={css(styles.fancy)}>fancy</em>;
        return <h1>Here are some {fancy} projects.</h1>;
    }

}

const styles = StyleSheet.create({
    fancy: {
        color: "green",
        textDecoration: "underline",
    },
});
