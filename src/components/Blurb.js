/*
 * A component that renders text along an image (aligned either
 * flush-left or flush-right).
 */

import React, {Component, PropTypes} from 'react';
import {StyleSheet, css} from 'aphrodite/no-important';

import Colors from '../data/Colors';
import {Heading, Link} from '../Components';

export default class Blurb extends Component {
    static IMAGE_RIGHT = "r";
    static IMAGE_LEFT = "l";

    static propTypes = {
        name: PropTypes.node,
        linkTo: PropTypes.string,  // a route (optional)
        image: PropTypes.string.isRequired,  // url
        imagePosition: PropTypes.oneOf([
            Blurb.IMAGE_LEFT,
            Blurb.IMAGE_RIGHT,
        ]).isRequired,
        children: PropTypes.node.isRequired,
    }

    /*
     * Create a non-pure function whose result alternates between
     * `Blurb.IMAGE_RIGHT` and `Blurb.IMAGE_LEFT` (in that order).
     *
     * Useful when laying out multiple `Blurb`s.
     */
    static makeAlternator() {
        let current = Blurb.IMAGE_RIGHT;
        return () => {
            const result = current;
            current = {
                [Blurb.IMAGE_RIGHT]: Blurb.IMAGE_LEFT,
                [Blurb.IMAGE_LEFT]: Blurb.IMAGE_RIGHT,
            }[current];
            return result;
        };
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
            {this._renderHeading()}
            {this.props.children}
        </div>;
    }

    _renderMaybeLink(x) {
        return this.props.linkTo ?
            <Link to={this.props.linkTo}>{x}</Link> :
            x;
    }

    _renderHeading() {
        if (!this.props.name) {
            return null;
        }
        return <Heading level={2}>
            {this._renderMaybeLink(this.props.name)}
        </Heading>;
    }

    _renderImage() {
        const directionClass = this._switchLeftRight(
            styles.iconContainerLeft,
            styles.iconContainerRight);
        return <div className={css(directionClass)} key="image">
            {this._renderMaybeLink(<img
                className={css(styles.icon)}
                src={this.props.image}
                role="presentation"
                onDragStart={e => e.preventDefault()}
            />)}
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
