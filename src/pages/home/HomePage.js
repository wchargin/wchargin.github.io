/*
 * The main component for the home page.
 */

import React, {Component} from 'react';

export default class HomePage extends Component {

    render() {
        return <div>
            <h1>Hello, world.</h1>
            <img src={require("./me.png")} alt="Nice to meet you" />
        </div>;
    }

}
