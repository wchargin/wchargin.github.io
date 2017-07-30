/*
 * The individual project page for my CMU 15-214 projects.
 */

import React, {Component} from 'react';

import {Code, Heading, Link} from '../../Components';
import Project from './Project';

Link.registerPreloadResources('/projects/cmu-15-214', () => [
    require('./cmu-15-214_hero.png'),
]);

export default class CMU15214ProjectPage extends Component {

    render() {
        const urls = {
            josh: "https://en.wikipedia.org/wiki/Joshua_Bloch",
            charlie: "https://www.cs.cmu.edu/~charlie/",
        };
        return <Project
            name="Projects from CMU 15-214"
            heroImage={require("./cmu-15-214_hero.png")}
        >
            <Heading level={2}>Overview</Heading>
            <p>
                CMU’s&nbsp;15-214 class is a principles of software engineering course taught in&nbsp;Java.
                I&nbsp;was fortunate to take the course under <Link href={urls.josh}>Josh Bloch</Link> and <Link href={urls.charlie}>Charlie Garrod</Link>.
                I&nbsp;include here some of the projects that I&nbsp;wrote for that course, as they were often interesting both from a programming perspective and of their own accord.
            </p>
            <p>
                Unfortunately, I&nbsp;am unable to release the source code for these programs due to academic integrity.
                However, I&nbsp;do have screenshots, and, in some cases, documentation!
            </p>
            {this.renderScrabbleDescription()}
            {this.renderDataVizualiationDescription()}
        </Project>;
    }

    renderScrabbleDescription() {
        const urls = {
            fixtureBoard: require("./cmu-15-214/scrabble_board_view.png"),
            fixtureSpecialTiles: require("./cmu-15-214/scrabble_special_tiles.png"),
            demo: "https://vimeo.com/190101811",
        };
        return <div>
            <Heading level={2}>“Scrabble with Stuff”</Heading>
            <p>
                I&nbsp;implemented an expanded version of Scrabble called “Scrabble with Stuff,” which is just like Scrabble except for the addition of <em>special tiles</em>, which players purchase with points and then place on the board; special tiles are hidden to other players, and have some special effect when a tile is played on them.
            </p>
            <p>
                <Link href={urls.demo}>Here’s a demo of me playing the game against myself on the Greek dictionary.</Link>{" "}
                (I’ve cut out boring portions when I&nbsp;was thinking about what words to play!)
            </p>
            <p>
                Here are some fun facts about my implementation:
            </p>
            <ul>
                <li><p>
                    I&nbsp;wrote and tested all of the core logic before I&nbsp;wrote any of the&nbsp;GUI; the core was well-enough tested that I&nbsp;found only one minor bug in the core logic.
                </p></li>
                <li><p>
                    The core logic is written with an immutable state object.
                    This immutability proivdes strong guarantees, and makes implementations of certain features much easier than they would otherwise be—in particular, challenges are simply a matter of rolling back to a previous game state, which does not require reversing the effects of mutations but rather simply updating the value of the state reference.
                    (In fact, it’s possible to roll back to <em>any</em> previous state, for the purposes of replaying the history of a game!)
                </p></li>
                <li><p>
                    The GUI is written in a functinoally reactive style.
                    Unlike the traditional technique of using heavy events that contain information about the new state as instructions about mutations, my design uses a single source of truth (the&nbsp;<Code code="GameState" />), and simply asks components to update themselves whenver an action is performed.
                    This design helps tremendously with encapsulation: components only need to know how to render themselves, and controllers don’t need to worry about what data to pass to what component.
                    Most importantly, it is much easier to show that the views are correct, as they depend only on a single state object and not on a history of past mutations.
                </p></li>
                <li><p>
                    All icons are drawn programmatically with the AWT graphics facilities; there are no external resources (except for a dictionary file).
                    This was fun for copmlex shapes like the bomb tile and the intricate details of the fringes around the board squares.
                    I&nbsp;even have code to draw a perfectly pixel-aligned <i>n</i>-pointed star!
                </p></li>
                <li><p>
                    I’ve written tests for the GUI in the form of <em>fixtures</em> for various important components.
                    Each fixture show the component in its most important states, so that I&nbsp;can easily iterate on the design and also so that I&nbsp;can easily identify regressions.
                    Here are some sample fixtures: <Link href={urls.fixtureBoard}>all the possible states for a board square </Link> (the bottom three rows are pulsing because the tiles there are only tentatively placed), and <Link href={urls.fixtureSpecialTiles}>the icons for all the specila tiles, at various sizes</Link>.
                </p></li>
            </ul>
        </div>;
    }

    renderDataVizualiationDescription() {
        const urls = {
            gettingStarted: "https://wchargin.github.io/cmu-15214-team9/",
            documentation: "https://wchargin.github.io/cmu-15214-team9/javadoc/",
            bostock: "https://bost.ocks.org/mike/algorithms/",
            randomUniform: require("./cmu-15-214/random_uniform.png"),
            randomBridson: require("./cmu-15-214/random_bridson.png"),
        };
        return <div>
            <Heading level={2}>Data visualization framework</Heading>
            <p>
                With a partner, I&nbsp;wrote a geaneral-purpose data visualization framework.
                The framework allows clients to supply <em>data source plugins</em> and <em>data view plugins</em>.
                An arbitrary data source plugin can be used with any data view plugin, as long as it provides data of the right type (e.g., two numeric coolumns for a scatter plot).
            </p>
            <p>
                This framework was selected as one of the four best in the class (out of about fifty total), so I&nbsp;provided support for the twenty students who chose to write source and visualization plugins for it.
                I&nbsp;prepared <Link href={urls.gettingStarted}>a “getting started” guide for students</Link>, and <Link href={urls.documentation}>the formal Javadoc is also available online</Link>.
            </p>
            <p>
                Here are some fun facts about my implementation:
            </p>
            <ul>
                <li><p>
                    A data view can require that the input be expressed in columns of any desired type.
                    For example, a bubble chart might require three numeric columns (for the position and radius of each point), while a choropleth might require a more exotic “polygon column” in addition to some scalar value.
                    I&nbsp;came up with some clever tricks with generics and static typing to allow this to work completely type-safely; not only does the client code not require any casts, the framework backend doesn’t, either!
                </p></li>
                <li><p>
                    The framework supports dynamic (runtime) loading of plugins stored in JAR&nbsp;files, so students don’t have to recompile the framework to link their creations.
                    When selecting a JAR&nbsp;file, the framework will scan it for all implementations of the plugin interfaces, and will register them automatically; on subsequent launches, the selected JAR&nbsp;files and plugins will be remembered and loaded.
                </p></li>
                <li><p>
                    The sample plugins that I&nbsp;provided with the framework include basic readers like CSV&nbsp;file input, as well as more interesting algorithms, like an <i>s</i>-expression evaluator for arbitrary parameterized functions and different approaches for <i>k</i>-dimensional randomness (a uniform distribution vs.&nbsp;Bridson's algorithm).
                    The latter allows for an interesting visualization comparing <Link href={urls.randomUniform}>the uniform distribution</Link> with <Link href={urls.randomBridson}>the Poisson-disc sampling</Link> (open in new tabs for best comparison).
                    This is, of course, inspired by <Link href={urls.bostock}>“Visualizing Algorithms.”</Link>
                </p></li>
            </ul>
        </div>;
    }

}
