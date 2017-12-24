import React, {Component} from 'react';

import {Heading, Link} from '../../Components';

import autoincrementingIdTable from './data/autoincrementingIdTable';
import encodingsAndAssumptions from './data/encodingsAndAssumptions';
import gitWorkflow from './data/gitWorkflow';

const rawPosts = [
    autoincrementingIdTable,
    encodingsAndAssumptions,
    gitWorkflow,
];

function articleSourceUrl(filename) {
    const baseUrl = 'https://github.com/wchargin/wchargin.github.io/blob/source/src/pages/posts/data/';
    return baseUrl + filename;
}

/**
 * Convert a raw post datum into a richer post object.
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
function process(post) {
    if (post.id == null) {
        throw new Error("post missing id");
    }
    if (post.title == null) {
        throw new Error("post missing title");
    }
    if (post.date == null) {
        throw new Error("post missing date");
    }
    if (post.filename == null) {
        throw new Error("post missing filename");
    }
    if (post.render == null) {
        throw new Error("post missing render");
    }
    const slug =
        post.slug !== undefined ?
        post.slug :
        post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sourceUrl = articleSourceUrl(post.filename);
    const path = `/posts/${slug}`;

    class PostPage extends Component {
        static displayName = `PostPage(${slug})`;
        render() {
            const renderBackLink = () => <Link
                to="/posts"
                style={{marginBottom: 10, marginTop: 10}}
            >
                <i>«&nbsp;back to posts</i>
            </Link>;
            const Title = (props) => <div>
                <Heading {...props} level={1} />
                <p>
                    <i>{post.date}</i>
                    {" "}·{" "}
                    <i><Link to={sourceUrl}>view article source</Link></i>
                </p>
            </div>;
            const Section = (props) => <Heading {...props} level={2} />;
            return <div>
                {renderBackLink()}
                {post.render(Title, Section)}
                {renderBackLink()}
            </div>;
        }
    }

    return {
        ...post,
        slug,
        path,
        sourceUrl,
        pageComponent: PostPage,
    };

}

const processedPosts = rawPosts
    .sort((a, b) => a.id - b.id)
    .map(post => process(post));

function ensureDistinct(property) {
    const seen = {};
    for (const post of processedPosts) {
        if (seen[post[property]]) {
            throw new Error(
                `duplicate property "${property}" ` +
                `on ${JSON.stringify(seen[post[property]])} ` +
                `and ${JSON.stringify(post)}`);
        }
        seen[post[property]] = post;
    }
}

ensureDistinct("slug");
ensureDistinct("id");

export default processedPosts;
