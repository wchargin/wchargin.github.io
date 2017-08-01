import React, {Component} from 'react';

import {Heading, Link} from '../../Components';


const rawThoughts = [
];

function articleSourceUrl(filename) {
    const baseUrl = 'https://github.com/wchargin/wchargin.github.io/blob/source/src/pages/thoughts/data/';
    return baseUrl + filename;
}

/**
 * Convert a raw thought datum into a richer thought object.
 *
 * The input must have properties
 *   - id: a unique integer;
 *   - title: a string;
 *   - date: a string;
 *   - filename: the string name of the enclosing file, like "foo.js"
 *     (used to provide a link to article source);
 *   - render: a function of two arguments `Title` and `Section` that
 *     returns the contents of the article; `<Title>My title</Title>`
 *     and `<Section>My section title</Section>` can be used for
 *     organization.
 *
 * The object may also have a `slug`; one is derived from the title if
 * not provided. Slugs must also be unique.
 *
 * The resulting object also has properties `path` (site-absolute path
 * starting with `/` to the article page), `sourceUrl` (link to GitHub),
* and `pageComponent` (React component class).
 */
function process(thought) {
    if (thought.id == null) {
        throw new Error("thought missing id");
    }
    if (thought.title == null) {
        throw new Error("thought missing title");
    }
    if (thought.date == null) {
        throw new Error("thought missing date");
    }
    if (thought.filename == null) {
        throw new Error("thought missing filename");
    }
    if (thought.render == null) {
        throw new Error("thought missing render");
    }
    const slug =
        thought.slug !== undefined ?
        thought.slug :
        thought.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sourceUrl = articleSourceUrl(thought.filename);
    const path = `/thoughts/${slug}`;

    class ThoughtPage extends Component {
        static displayName = `ThoughtPage(${slug})`;
        render() {
            const renderBackLink = () => <Link
                to="/thoughts"
                style={{marginBottom: 10, marginTop: 10}}
            >
                <i>«&nbsp;back to thoughts</i>
            </Link>;
            const Title = (props) => <div>
                <Heading {...props} level={1} />
                <p>
                    <i>{thought.date}</i>
                    {" "}·{" "}
                    <i><Link to={sourceUrl}>view article source</Link></i>
                </p>
            </div>;
            const Section = (props) => <Heading {...props} level={2} />;
            return <div>
                {renderBackLink()}
                {thought.render(Title, Section)}
                {renderBackLink()}
            </div>;
        }
    }

    return {
        ...thought,
        slug,
        path,
        sourceUrl,
        pageComponent: ThoughtPage,
    };

}

const processedThoughts = rawThoughts
    .sort((a, b) => a.id - b.id)
    .map(thought => process(thought));

function ensureDistinct(property) {
    const seen = {};
    for (const thought of processedThoughts) {
        if (seen[thought[property]]) {
            throw new Error(
                `duplicate property "${property}" ` +
                `on ${JSON.stringify(seen[thought[property]])} ` +
                `and ${JSON.stringify(thought)}`);
        }
        seen[thought[property]] = thought;
    }
}

ensureDistinct("slug");
ensureDistinct("id");

export default processedThoughts;
