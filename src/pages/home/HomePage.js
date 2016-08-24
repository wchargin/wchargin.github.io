/*
 * The main component for the home page.
 */

import React, {Component} from 'react';

import Heading from '../../components/Heading';

export default class HomePage extends Component {

    render() {
        return <div>
            <Heading level={1}>Hello, world.</Heading>
            <img src={require("./me.png")} alt="Nice to meet you" />
        </div>;
    }

}
