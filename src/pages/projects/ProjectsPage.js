/*
 * The main component for the projects page.
 */

import React, {Component, PropTypes} from 'react';
import {StyleSheet, css} from 'aphrodite';

import {Heading, Link} from '../../Components';
import Colors from '../../data/Colors';

Link.registerPreloadResources('/projects', () => [
    require('./aufbau.png'),
    require('./physbam.png'),
    require('./kiosk.png'),
    require('./jgame.png'),
]);

export default class ProjectsPage extends Component {

    render() {
        const urls = {
            ahpcrc: "https://ahpcrc.stanford.edu/",
            ahpcrcPaper: require("./ahpcrc_writeup.pdf"),
            kiosk: "https://github.com/wchargin/kiosk",
            jgame: "https://github.com/wchargin/jgame",
            jgameGallery: "http://www.mrumrocks.org/portfolio#java-games",
        };
        return <div>
            <Heading level={1}>Projects</Heading>
            <ProjectView
                name="Automated grading"
                image={require('./aufbau.png')}
                imagePosition={ProjectView.IMAGE_RIGHT}
            >
                <p>
                    I&nbsp;designed, implemented, and documented a
                    modular automated grading system. It&rsquo;s
                    designed to be simple and highly reusable, breaking
                    up the assignment grading process into a sequence of
                    self-contained &ldquo;steps&rdquo; that can be
                    rearranged and configured to represent just about
                    any assignment. My system is used in CS&nbsp;102
                    classes at Cal&nbsp;Poly.
                </p>
            </ProjectView>
            <ProjectView
                name="Physics simulations"
                image={require('./physbam.png')}
                imagePosition={ProjectView.IMAGE_LEFT}
            >
                <p>
                    During June&ndash;August of&nbsp;2014, I&nbsp;worked
                    at the {" "}<Link href={urls.ahpcrc}>
                        Army High Performance Computing Research Center
                    </Link>,
                    conducting research on physics simulations on
                    low-powered tablets. I&nbsp;developed an application
                    capable of performing various types of physically
                    accurate simulations in real time, including
                    articulated rigid body, cloth, smoke, and dynamic
                    paint simulations. See {" "}<Link
                        href={urls.ahpcrcPaper}>my research paper</Link>
                    {" "}for more information.
                </p>
            </ProjectView>
            <ProjectView
                name="Kiosk"
                image={require('./kiosk.png')}
                imagePosition={ProjectView.IMAGE_RIGHT}
            >
                <p>
                    Technology problems often plague debate conferences.
                    To address this, I&nbsp;created and deployed an
                    application system that unifies the tools that
                    chairs need to aptly moderate debates. It integrates
                    timing, voting, motions, speech analysis, and more,
                    and networks across computers so that co-chairs can
                    collaborate. My system has been used at multiple
                    conferences, by dozens of chairs and hundreds of
                    students. It's open-source and
                    {" "}<Link href={urls.kiosk}>available on GitHub</Link>.
                </p>
            </ProjectView>
            <ProjectView
                name="JGame"
                image={require('./jgame.png')}
                imagePosition={ProjectView.IMAGE_LEFT}
            >
                <p>
                    My high school wanted to teach game development to
                    beginning programmers, but existing Java libraries
                    had prohibitively steep learning curves. As such,
                    I&nbsp;designed and implemented JGame, a library for
                    the Java programming language that enables students
                    to focus on learning computer science and game
                    development concepts instead of worrying about
                    implementation details. My framework is widely used
                    by students at my school; here is
                    {" "}<Link href={urls.jgameGallery}>
                        a sample of some student projects based on my library
                    </Link>. JGame is open-source and
                    {" "}<Link href={urls.jgame}>
                        available on GitHub
                    </Link>.
                </p>
            </ProjectView>
        </div>;
    }

}

class ProjectView extends Component {
    static IMAGE_RIGHT = "r";
    static IMAGE_LEFT = "l";

    static propTypes = {
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,  // url
        imagePosition: PropTypes.oneOf([
            ProjectView.IMAGE_LEFT,
            ProjectView.IMAGE_RIGHT,
        ]).isRequired,
        children: PropTypes.node.isRequired,
    }

    render() {
        const body = this._renderBody();
        const image = this._renderImage();
        const components = {
            [ProjectView.IMAGE_RIGHT]: [body, image],
            [ProjectView.IMAGE_LEFT]: [image, body],
        }[this.props.imagePosition];

        return <section className={css(styles.description)}>
            {components}
        </section>;
    }

    _renderBody() {
        return <div className={css(styles.descriptionContent)} key="body">
            <Heading level={2}>{this.props.name}</Heading>
            {this.props.children}
        </div>;
    }

    _renderImage() {
        const margin = {
            [ProjectView.IMAGE_RIGHT]: 'marginLeft',
            [ProjectView.IMAGE_LEFT]: 'marginRight',
        }[this.props.imagePosition];
        return <div
            className={css(styles.descriptionIconContainer)}
            style={{[margin]: 24}}
            key="image"
        >
            <img
                className={css(styles.descriptionIcon)}
                src={this.props.image}
                role="presentation"
                onDragStart={e => e.preventDefault()}
            />
        </div>;
    }
}

const styles = StyleSheet.create({
    description: {
        marginBottom: 15,
    },
    descriptionContent: {
        display: 'inline-block',
        width: '70%',
        verticalAlign: 'top',
    },
    descriptionIconContainer: {
        display: 'inline-block',
        width: '25%',
        verticalAlign: 'top',
    },
    descriptionIcon: {
        width: '100%',
        borderRadius: '100%',
        border: `thin ${Colors.gray.medium} solid`,
    },
});
