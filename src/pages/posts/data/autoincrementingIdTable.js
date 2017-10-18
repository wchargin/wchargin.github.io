import React from 'react';

import dedent from '../../../dedent';
import Prism from '../../../extern/Prism';
import {CodeBlock} from '../../../Components';

function render(Title, Section) {
    return <article>
        <Title>A cute autoincrementing ID table in one line of Python</Title>
        <p>
            Consider the following definition:
        </p>
        <CodeBlock language={Prism.languages.python} code={dedent`\
            import collections  # this line doesn't count! :-)
            ids = collections.defaultdict(lambda: len(ids))
        `} />
        <p>
            Whenever we access the ID for a key that isn’t already in the table, it’s inserted into the table with value the number of existing keys.
            This gives us a very concise implementation of an autoincrementing ID table:
        </p>
        <CodeBlock language={Prism.languages.python} code={dedent`\
            assert ids["alice"] == 0
            assert ids["bob"] == 1
            assert ids["alice"] == 0
        `} />
        <p>
            There’s nothing revolutionary here, but the self-referential nature of the dictionary makes it a particularly pleasant implementation.
        </p>
    </article>;
}

export default {
    id: 2,
    title: 'A cute autoincrementing ID table in one line of Python',
    filename: 'autoincrementingIdTable.js',
    date: '2017-07-28',
    render,
};
