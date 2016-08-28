/*
 * Data for the skills page. Exports a React propType representing a
 * single skill, and a function `createSkillsData` to create a list of
 * all the skill groups.
 */

import React, {PropTypes} from 'react';

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
            description: <p>
                Did you know that a Python is also a kind of snake?
            </p>,
        },
        {
            name: 'JavaScript and React',
            image: require('./js-react.png'),
            description: <p>
                Nothing goes over my head; my reflexes are too fast.
            </p>,
        },
        {
            name: 'Java',
            image: require('./java.png'),
            description: <p>
                Not really my brew.
            </p>,
        },
        {
            name: 'Haskell',
            image: require('./haskell.png'),
            description: <p>
                It&rsquo;s true. <em>All of it.</em>
            </p>,
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
