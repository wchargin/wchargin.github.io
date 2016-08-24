/*
 * The main component for the projects page.
 */

import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

import Heading from '../../components/Heading';

export default class ProjectsPage extends Component {

    render() {
        const fancy = <em className={css(styles.fancy)}>fancy</em>;
        return <Heading level={1}>Here are some {fancy} projects.</Heading>;
    }

}

const styles = StyleSheet.create({
    fancy: {
        color: "green",
        textDecoration: "underline",
    },
});
