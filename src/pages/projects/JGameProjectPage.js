/*
 * The individual project page for JGame.
 */

import React, {Component} from 'react';

import {Heading, Link} from '../../Components';
import Project from './Project';

Link.registerPreloadResources('/projects/jgame', () => [
    require('./jgame_hero.png'),
]);

export default class JGameProjectPage extends Component {

    render() {
        const urls = {
            jgameGithub: 'https://github.com/wchargin/JGame',
            jgameDocumentation: 'https://wchargin.github.io/JGame/',
            jgameGallery: 'http://mrumrocks.org/portfolio/#java-games',
        };
        return <Project
            name="JGame"
            heroImage={require("./jgame_hero.png")}
        >
            <Heading level={2}>Overview</Heading>
            <p>
                My high school used to teach game development courses for beginning programmers in ActionScript&nbsp;3, the primary language used by Adobe Flash.
                Students frequently had difficulty adjusting from ActionScript to the languages used in the more advanced programming courses (mostly Java).
                Using Java for game development would have been optimal, except that none of the Java game libraries available were easy enough to learn.
            </p>
            <p>
                So I&nbsp;made one.
                JGame is a Java GUI library designed with two overarching goals in mind: remove barriers to entry, and encourage good programming practices.
                As a consequence, JGame follows a few general design principles:
            </p>
            <ul>
                <li>
                    Developers shouldn’t have to worry about details relating to drawing graphics, matrix transformations, etc.
                    The point of the course is to teach programming and programming concepts through game design, so implementation details and complicated math only pose a barrier to entry.
                </li>
                <li>
                    The framework should encourage object-oriented programming and general best practices.
                    Setting up a sensible class hierarchy should be the <em>natural</em> way to structure the program.
                </li>
                <li>
                    Applications should run as both desktop applications and web applets with little modification.
                </li>
            </ul>
            <Heading level={2}>Features</Heading>
            <p>
                Here are some of the features that JGame provides out of the box.
            </p>
            <ul>
                <li>
                    Common actions and declarations, such as “this character should be controlled with the mouse” or “this enemy should move along a given path,” are provided in the form of listeners and controllers that can easily be added to objects.
                    For example, to make an object <code>character</code> follow the mouse, the code is simply
                    <pre><code>
                        character.addController(new MouseLocationController());
                    </code></pre>
                    Once students feel comfortable, they are encouraged to look under the hood to see how these functions work, and to implement their own.
                </li>
                <li>
                    All graphics transformations are done automatically.
                    Objects can be translated, scaled, and rotated about a given anchor point.
                    Once these parameters are set by the developer, JGame automatically performs the trigonometric and matrix computations required to draw the object as desired.
                </li>
                <li>
                    Loading resources from files—loading and displaying images, loading and playing sounds—is all automatic.
                    This means that students don’t have to worry about filesystem input and output to be able to write their games.
                    (As a technical note: this is all implemented using weak references, so it’s friendly to the garbage collector.)
                </li>
                <li>
                    And, of course, <Link href={urls.jgameDocumentation}>extensive top-level documentation</Link> as well as <Link href={urls.jgameGithub}>in-code comments</Link>, which students are encouraged to explore.
                </li>
            </ul>
            <Heading level={2}>Impact</Heading>
            <p>
                Two classes at my high school currently use JGame to teach beginning programmers: a web design course and an animation course.
                As an example, <Link href={urls.jgameGallery}>a gallery of student work work is available on my teacher’s website</Link>.
            </p>
        </Project>;
    }

}
