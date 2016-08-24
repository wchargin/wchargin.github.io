/*
 * A component that renders text along an image (aligned either
 * flush-left or flush-right).
 */

import React, {Component, PropTypes} from 'react';
import {StyleSheet, css} from 'aphrodite';

import Colors from '../data/Colors';
import {Heading} from '../Components';

export default class Blurb extends Component {
    static IMAGE_RIGHT = "r";
    static IMAGE_LEFT = "l";

    static propTypes = {
        name: PropTypes.node,
        image: PropTypes.string.isRequired,  // url
        imagePosition: PropTypes.oneOf([
            Blurb.IMAGE_LEFT,
            Blurb.IMAGE_RIGHT,
        ]).isRequired,
        children: PropTypes.node.isRequired,
    }

    render() {
        const body = this._renderBody();
        const image = this._renderImage();
        const components = this._switchLeftRight(
            [image, body],
            [body, image]);
        return <section className={css(styles.description)}>
            {components}
        </section>;
    }

    _renderBody() {
        return <div className={css(styles.body)} key="body">
            {this.props.name && <Heading level={2}>{this.props.name}</Heading>}
            {this.props.children}
        </div>;
    }

    _renderImage() {
        const directionClass = this._switchLeftRight(
            styles.iconContainerLeft,
            styles.iconContainerRight);
        return <div className={css(directionClass)} key="image">
            <img
                className={css(styles.icon)}
                src={this.props.image}
                role="presentation"
                onDragStart={e => e.preventDefault()}
            />
        </div>;
    }

    /**
     * Return the first argument if the image is positioned at left,
     * or the second argument if the image is positioned at right.
     */
    _switchLeftRight(left, right) {
        return {
            [Blurb.IMAGE_LEFT]: left,
            [Blurb.IMAGE_RIGHT]: right,
        }[this.props.imagePosition];
    }

}

const hideImagesMediaQuery = '@media(max-width:600px)';

const styles = StyleSheet.create({
    description: {
        marginBottom: 15,
        display: 'flex',
    },
    body: {
        verticalAlign: 'top',
        flexGrow: 1,
    },
    icon: {
        width: 200,
        borderRadius: '100%',
        border: `1px ${Colors.gray.medium} solid`,
        [hideImagesMediaQuery]: {
            display: 'none',
        },
    },
    iconContainerLeft: {
        marginRight: 24,
        [hideImagesMediaQuery]: {
            marginRight: 0,
        },
    },
    iconContainerRight: {
        marginLeft: 24,
        [hideImagesMediaQuery]: {
            marginLeft: 0,
        },
    },
});
