/*
 * Data for the skills page. Exports a React propType representing a
 * single skill, and a function `createSkillsData` to create a list of
 * all the skill groups.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {Link} from '../../Components';
import LaTeX, {getResourcesToPreload as getLaTeXResources}
    from '../../components/LaTeX';

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
            description: renderGitDescription(),
        },
        {
            name: "LaTeX",
            displayName: <LaTeX />,
            image: require('./latex.png'),
            extraResources: [...getLaTeXResources()],
            description: renderLaTeXDescription(),
        },
    ],
    [
        {
            name: 'Blender',
            image: require('./blender.png'),
            description: renderBlenderDescription(),
        },
        {
            name: '(Neo)vim',
            image: require('./neovim.png'),
            description: renderNeovimDescription(),
        },
    ],
];

function renderPythonDescription() {
    const urls = {
        hasattr: "https://hynek.me/articles/hasattr/",
    };
    return <div>
        <p>
            I&rsquo;ve enjoyed using Python professionally since&nbsp;2014, and personally since around&nbsp;2011.
            It&rsquo;s my almost-exclusive tool of choice for exploring a data set and for most one-off scripts or tasks.
            I&rsquo;m consistently impressed by Python&rsquo;s design: the abstractions that the language core chooses to support always seem to have a deceptively high power-to-weight ratio, and of course the standard libraries are excellent and abundant.
        </p>
        <p>
            Most of my work on the Khan&nbsp;Academy website is in&nbsp;Python.
            Of that work, much is related to the core site infrastructure (in particular, the content model), to the streaks functionality, and to the thumbnails system.
        </p>
        <p>
            My hobbies include chaining decorators, doing terrifying things with metaclasses, and linking people to <Link href={urls.hasattr}>&ldquo;<tt>hasattr</tt>: a dangerous misnomer.&rdquo;</Link>
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
                <Link href={urls.lc3App}>An assembler and interpreter for the&nbsp;LC-3, a teaching microcomputer</Link> (<Link href={urls.lc3Source}>source on GitHub</Link>).
                This is a single-page jQuery application currently that I&nbsp;wrote to replace the course-provided interpreter for my computer architecture course at Cal&nbsp;Poly; it continues to be used by students of that course.
                (I&nbsp;also started <Link href={urls.lc3ReactSource}>porting it to React</Link>, and rewrote the assembler with full test coverage, but abandoned that port a while ago.)
            </p></li>
            <li><p>
                <Link href={urls.vareseApp}>A set of tools for a music professor of mine</Link> (<Link href={urls.vareseSource}>source and explanation on GitHub</Link>).
                This is a React application that, I&rsquo;m&nbsp;pleased to report, has 100%&nbsp;test coverage, including the GUI&nbsp;components.
                I&rsquo;m&nbsp;particularly proud of the implementation for <Link href={urls.vareseTreeView}>the infinite tree view</Link>, an infinitely scrolling canvas from dynamically generated data; all the logic for the scrolling, positioning, and rendering is <Link href={urls.vareseTreeSource}> purely functional</Link> and <Link href={urls.vareseTreeTest}>extensively tested!</Link>
            </p></li>
            <li><p>
                This very site, also written in React!
                (<Link href={urls.siteSource}>The source is on GitHub.</Link>)
                Everything is server-side rendered to a static site, so there&rsquo;s no lag before the initial render and the site should function just fine even with JavaScript disabled.
                After rehydration, client-side routing takes over to enable instant page loads, as well as interactive components like this one.
            </p></li>
        </ul>
    </div>;
}

function renderJavaDescription() {
    const urls = {
        cmu15214: "/projects/cmu-15-214",
        kiosk: "/projects/kiosk",
        kioskSource: "https://github.com/wchargin/kiosk",
        jgame: "/projects/jgame",
        jgameSource: "https://github.com/wchargin/jgame",
    };
    return <div>
        <p>
            Java is the language that I&rsquo;ve used for the longest time.
            I&rsquo;ve often used Java when I&nbsp;want it to be easy to write a&nbsp;GUI for a desktop application.
            (These days, I&nbsp;also use React for the same purpose.)
        </p>
        <p>
            Some relevant projects include:
        </p>
        <ul>
            <li>
                <Link to={urls.cmu15214}>My projects for CMU&rsquo;s&nbsp;15-214 software engineering course,</Link> including a Scrabble game and a general-purpose data analysis framework.
                I&nbsp;can&rsquo;t publish the source for these due to academic integrity restrictions, but I&nbsp;do have <Link to={urls.cmu15214}>overviews and screenshots</Link>.
            </li>
            <li><p>
                <Link to={urls.kiosk}>Kiosk, an application for moderating debates.</Link>
                {" "}See <Link to={urls.kiosk}>the relevant project page</Link> for more information, or jump to <Link href={urls.kioskSource}>the source on GitHub</Link>.
                (If examining the source, please note that I&nbsp;wrote this a long time ago, and the implementation does not reflect my current skills!)
        </p></li>
            <li><p>
                <Link to={urls.jgame}>JGame, a game development library for new programmers.</Link>
                {" "}See <Link to={urls.jgame}>the relevant project page</Link> for more information, or jump to <Link href={urls.jgameSource}> the source on GitHub</Link>.
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
            I&rsquo;m reasonably comfortable in Haskell after having dabbled in it since around&nbsp;2013.
            I&nbsp;use Haskell frequently for pipes in Unix command lines, and also for standalone utility applications.
        </p>
        <p>
            I&rsquo;ve written such things as <Link href={urls.hgo}>the game of Go</Link> (as well as <Link href={urls.colorgo}>a simpler Unix filter to colorize <tt>gnugo</tt></Link>) and <Link href={urls.looi}>a Scheme-like language</Link>.
            I&nbsp;also wrote <Link href={urls.graphcount}>a Haskell program to solve a graph theory problem</Link>, which doubled as a Haskell tutorial for a CS-inclined math-major friend of mine.
            (<Link href={urls.graphcountSource}>The source is here.</Link>)
        </p>
    </div>;
}

function renderGitDescription() {
    const urls = {
        megarebase: "https://gist.github.com/wchargin/c0e37a955d7977450f5f3ff8ac10e51c",
    };
    return <div>
        <p>
            I&nbsp;tend to use git for the vast majority of my work, even if I&nbsp;don&rsquo;t intend to push it to any remote.
            My workflow is to rebase aggressively: I&nbsp;prefer to keep a clean history where each commit is atomic, minimal, and has no lint errors or test failures, instead of a more literal recording of my keystrokes.
            For example, I&nbsp;recently <Link href={urls.megarebase}>fixed all lint errors in every commit of a (local-only) repository</Link> easily via an interactive rebase.
        </p>
        <p>
            Similarly, I&nbsp;prefer to keep coarse-grained branches, corresponding more to &ldquo;project&rdquo; than &ldquo;feature,&rdquo; so that I&nbsp;can more easily curate that history by bouncing around in a rebase.
            (If I&nbsp;want a literal history, I&rsquo;ll consult my persistent undo files!)
        </p>
        <p>
            I&nbsp;try to post most of my work on&nbsp;GitHub, unless restricted by confidentiality or academic integrity.
        </p>
    </div>;
}

function renderLaTeXDescription() {
    const urls = {
        wclatex: "https://github.com/wchargin/wclatex",
        gallery: "https://imgur.com/a/corNs",
    };
    return <div>
        <p>
            I&rsquo;ve used <LaTeX /> exclusively for all my documents&mdash;notes, homework, papers, presentations&mdash;since&nbsp;2013, and haven&rsquo;t looked back.
            When I&nbsp;have the time, I&nbsp;especially enjoy creating scientific diagrams with Ti<i>k</i>Z and related packages&hellip;here&rsquo;s <Link href={urls.gallery}>a gallery of some of my favorite pages over the years</Link>.
        </p>
        <p>
            My <Link href={urls.wclatex}>personal style files</Link> are on&nbsp;GitHub.
        </p>
    </div>;
}

function renderBlenderDescription() {
    const urls = {
        blender: "https://www.blender.org/",
    };
    return <div>
        <p>
            I&nbsp;enjoy using <Link href={urls.blender}>Blender</Link> for all the 3D modeling that I&nbsp;do&mdash;which is not much&mdash;but I&rsquo;ve also found it to be a valuable tool in many more contexts than one might expect.
            For example, I&rsquo;ve used its powerful image compositing tools to perform batch transformations, used it as a simple cross-platform standalone video editor, and used its modeling and animation tools to mock up designs.
            It&rsquo;s a beautiful and versatile software package that many developers could probably benefit from learning.
        </p>
    </div>;
}

function renderNeovimDescription() {
    const urls = {
        neovim: "https://neovim.io/",
        vimrc: "https://github.com/wchargin/compinit/blob/master/dotfiles/vimrc",
    };
    return <div>
        <p>
            (Vim users are contractually obligated to announce this, right?)
            Anyway, I’ve used vim exclusively for a while, and have been even happier after moving to <Link href={urls.neovim}>Neovim</Link>, primarily because of its excellent built-in terminal emulation, its significantly faster startup time, and all the little things that it fixes that make me smile.
        </p>
        <p>
            Many people have asked me for my <code>.vimrc</code>&nbsp;file.
            To new users of vim, I always respond that{" "} <Link href={urls.vimrc}>my <code>.vimrc</code>&nbsp;file is on GitHub</Link>, and that they should feel totally free to <em>read</em> from it, and to <em>type</em> any portions of it into their own <code>.vimrc</code>&nbsp;files, but <em>not</em> to paste things in directly.
            The point of the file is to enable you to configure vim how you want it; if you don’t learn how to do that, you’ll be shirking its potential.
        </p>
    </div>;
}
