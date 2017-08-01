/*
 * A generic component for an individual project page.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Heading, Link} from '../../Components';

export default class Project extends Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        heroImage: PropTypes.string,  // url
        children: PropTypes.node.isRequired,
    }

    render() {
        const renderBackLink = () => <Link
            to="/projects"
            style={{marginBottom: 10, marginTop: 10}}
        >
            <i>«&nbsp;back to projects</i>
        </Link>;
        return <div>
            <Heading level={1}>{this.props.name}</Heading>
            {renderBackLink()}
            {this.props.heroImage &&
                <div style={{
                    background: 'center no-repeat',
                    backgroundImage:
                        `url(${JSON.stringify(this.props.heroImage)})`,
                    marginBottom: 10,
                    height: 200,
                }} />}
            {this.props.children}
            {renderBackLink()}
        </div>;
    }

}
