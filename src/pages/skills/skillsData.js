/*
 * Data for the skills page. Exports a React propType representing a
 * single skill, and a function `createSkillsData` to create a list of
 * all the skill groups.
 */

import React, {PropTypes} from 'react';

import {Link} from '../../Components';

export const skillPropType = PropTypes.shape({
    // String name as a unique identifier.
    name: PropTypes.string.isRequired,

    // How to display the title in the DOM; defaults to just `name`.
    displayName: PropTypes.node,

    // URL to the image or icon for the skill.
    image: PropTypes.string.isRequired,

    // Resources other than `image` to preload, if any.
    extraResources: PropTypes.arrayOf(PropTypes.string.isRequired),

    // The body of the skill.
    description: PropTypes.node.isRequired,
});

/*
 * Returns an array of skill groups, each of which is an array of
 * objects ascribing to the `skill` propType.
 */
export const createSkillsData = () => [
    [
        {
            name: 'Python',
            image: require('./python.png'),
            description: renderPythonDescription(),
        },
        {
            name: 'JavaScript and React',
            image: require('./js-react.png'),
            description: renderJSReactDescription(),
        },
        {
            name: 'Java',
            image: require('./java.png'),
            description: renderJavaDescription(),
        },
        {
            name: 'Haskell',
            image: require('./haskell.png'),
            description: renderHaskellDescription(),
        },
    ],
    [
        {
            name: 'Git',
            image: require('./git.png'),
            description: <p>
                Always. Rebase.
            </p>,
        },
        {
            name: "LaTeX",
            displayName: <img
                src={require('./latex-inline.png')}
                style={{height: '1em'}}
                alt="LaTeX"
            />,
            image: require('./latex.png'),
            extraResources: [require('./latex-inline.png')],
            description: <p>
                Moisten your monitor.
            </p>,
        },
    ],
    [
        {
            name: 'Blender',
            image: require('./blender.png'),
            description: <p>
                One hand on the keyboard. One hand on the mouse.
            </p>,
        },
        {
            name: '(Neo)vim',
            image: require('./neovim.png'),
            description: <p>
                You know it.
            </p>,
        },
    ],
];

function renderPythonDescription() {
    const urls = {
        hasattr: "https://hynek.me/articles/hasattr/",
    };
    return <div>
        <p>
            I&rsquo;ve enjoyed using Python professionally since&nbsp;2014, and
            personally since around&nbsp;2011. It&rsquo;s my almost-exclusive
            tool of choice for exploring a data set and for most one-off
            scripts or tasks. I&rsquo;m consistently impressed by
            Python&rsquo;s design: the abstractions that the language core
            chooses to support always seem to have a deceptively high
            power-to-weight ratio, and of course the standard libraries are
            excellent and abundant.
        </p>
        <p>
            Most of my work on the Khan&nbsp;Academy website is in&nbsp;Python.
            Of that work, much is related to the core site infrastructure (in
            particular, the content model), to the streaks functionality, and
            to the thumbnails system.
        </p>
        <p>
            My hobbies include chaining decorators, doing terrifying
            things with metaclasses, and linking people to{" "}
            <Link href={urls.hasattr}>
                &ldquo;<tt>hasattr</tt>: a dangerous misnomer.&rdquo;
            </Link>
        </p>
    </div>;
}

function renderJSReactDescription() {
    const urls = {
        lc3App: "https://wchargin.github.io/lc3web/",
        lc3Source: "https://wchargin.github.io/lc3web/",
        lc3ReactSource: "https://wchargin.github.io/lc3/",
        vareseApp: "https://wchargin.github.io/varese/",
        vareseSource: "https://github.com/wchargin/varese",
        vareseTreeView: "https://wchargin.github.io/varese/#/infinite-tree",
        vareseTreeSource: "https://github.com/wchargin/varese/blob/master/src/core/CanvasCore.js",
        vareseTreeTest: "https://github.com/wchargin/varese/blob/master/test/core/CanvasCoreTest.js",
        siteSource: "https://github.com/wchargin/wchargin.github.io",
    };
    return <div>
        <p>
            Some relevant projects include:
        </p>
        <ul>
            <li><p>
                <Link href={urls.lc3App}>
                    An assembler and interpreter for the&nbsp;LC-3, a
                    teaching microcomputer
                </Link>{" "}
                (<Link href={urls.lc3Source}>source on GitHub</Link>).
                This is a single-page jQuery application currently that
                I&nbsp;wrote to replace the course-provided interpreter for my
                computer architecture course at Cal&nbsp;Poly; it continues to
                be used by students of that course. (I&nbsp;also started{" "}
                <Link href={urls.lc3ReactSource}>porting it to React</Link>,
                and rewrote the assembler with full test coverage, but
                abandoned that port a while ago.)
            </p></li>
            <li><p>
                <Link href={urls.vareseApp}>
                    A set of tools for a music professor of mine
                </Link>{" "}
                (<Link href={urls.vareseSource}>
                    source and explanation on GitHub
                </Link>).
                This is a React application that, I&rsquo;m&nbsp;pleased to
                report, has 100%&nbsp;test coverage, including the
                GUI&nbsp;components. I&rsquo;m&nbsp;particularly proud of the
                implementation for{" "}
                <Link href={urls.vareseTreeView}>
                    the infinite tree view
                </Link>, an infinitely scrolling canvas from dynamically
                generated data; all the logic for the scrolling, positioning,
                and rendering is{" "}
                <Link href={urls.vareseTreeSource}> purely functional</Link>
                {" "}and{" "}
                <Link href={urls.vareseTreeTest}>extensively tested!</Link>
            </p></li>
            <li><p>
                This very site, also written in React!
                (<Link href={urls.siteSource}>
                    The source is on GitHub.
                </Link>)
                Everything is server-side rendered to a static site, so
                there&rsquo;s no lag before the initial render and the site
                should function just fine even with JavaScript disabled. After
                rehydration, client-side routing takes over to enable instant
                page loads, as well as interactive components like this one.
            </p></li>
        </ul>
    </div>;
}

function renderJavaDescription() {
    const urls = {
        kiosk: "/projects/kiosk",
        kioskSource: "https://github.com/wchargin/kiosk",
        jgame: "/projects/jgame",
        jgameSource: "https://github.com/wchargin/jgame",
    };
    return <div>
        <p>
            Java is the language that I&rsquo;ve used for the longest time.
            I&rsquo;ve used Java when I&nbsp;want it to be easy to write
            a&nbsp;GUI for a desktop application. I&nbsp;don&rsquo;t use it
            much anymore, though, instead using React for GUIs&mdash;even more
            portable, and&mdash;in some respects, at least&mdash;more pleasant
            to use.
        </p>
        <p>
            Some relevant projects include:
        </p>
        <ul>
            <li><p>
                <Link to={urls.kiosk}>
                    Kiosk, an application for moderating debates.
                </Link>{" "}
                See <Link to={urls.kiosk}>
                    the relevant project page
                </Link> for more information, or jump to{" "}
                <Link href={urls.kioskSource}>
                    the source on GitHub
                </Link>.
            </p></li>
            <li><p>
                <Link to={urls.jgame}>
                    JGame, a game development library for new programmers.
                </Link>{" "}
                See <Link to={urls.jgame}>
                    the relevant project page
                </Link> for more information, or jump to{" "}
                <Link href={urls.jgameSource}>
                    the source on GitHub
                </Link>.
            </p></li>
        </ul>
    </div>;
}

function renderHaskellDescription() {
    const urls = {
        hgo: "https://github.com/wchargin/hgo/",
        colorgo: "https://gist.github.com/wchargin/7f8bcec0a615971a73c884d017de85ba",
        looi: "https://github.com/wchargin/looi/",
        graphcount: "https://github.com/wchargin/graphcount/blob/master/pdf/graphcount.pdf",
        graphcountSource: "https://github.com/wchargin/graphcount/tree/master/src",
    };
    return <div>
        <p>
            I&rsquo;m reasonably comfortable in Haskell after having dabbled in
            it since around&nbsp;2013. I&nbsp;use Haskell frequently for pipes
            in Unix command lines, and also for standalone utility
            applications.
        </p>
        <p>
            I&rsquo;ve written such things as{" "}
            <Link href={urls.hgo}>the game of Go</Link>{" "}
            (as well as <Link href={urls.colorgo}>
                a simpler Unix filter to colorize <tt>gnugo</tt>
            </Link>) and{" "}
            <Link href={urls.looi}>a Scheme-like language</Link>.
            I&nbsp;also wrote{" "}
            <Link href={urls.graphcount}>
                a Haskell program to solve a graph theory problem
            </Link>, which doubled as a Haskell tutorial for a CS-inclined
            math-major friend of mine. (<Link href={urls.graphcountSource}>
                The source is here.
            </Link>)
        </p>
    </div>;
}
