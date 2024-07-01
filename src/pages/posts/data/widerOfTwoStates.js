import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite/no-important';

import dedent from '../../../dedent';
import Prism from '../../../extern/Prism';
import {Code, CodeBlock, katex, Link} from '../../../Components';
import Colors, {hexWithAlpha} from '../../../data/Colors';

function render(Title, Section) {
    const {css: cssLang, java, markup} = Prism.languages;
    const urls = {
        aspectRatio: 'https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio',
        cardLayout: 'https://docs.oracle.com/javase/tutorial/uiswing/layout/card.html',
    };
    return <article>
        <style>{require('./widerOfTwoStates.css')}</style>
        <Title>Sizing a container to the wider of two states</Title>
        <p>
            This post presents a simple CSS recipe to keep layouts consistent when an element can transition between two states with differently sized contents.
            It bears some similarity to the behavior of the <Link href={urls.cardLayout}><Code languages={java} code="CardLayout" /> layout manager</Link> in Java Swing: you want the component to be large enough to support any of its children, but only show one of them at once.
        </p>
        <Section>The sizing problem</Section>
        <p>
            Suppose that you have a button that can be in one of two states: say, pressed or not pressed.
            The contents of the button differ between the two states:
        </p>
        <SampleButtons />
        <p>
            Since the contents in the two states may have different widths, a naïve implementation of this button will change widths when its state changes.
            This is often undesirable, since we don’t want other components to reflow around the button.
            We also want the click target area to be consistent: a given point should be in the click area either always or never.
        </p>
        <p>
            One simple approach to making the button the same width in the two states is to just pick a fixed width and use it: say, <Code language={cssLang} code="100px" />:
        </p>
        <div className={css(styles.column)}>
            <SampleButton width={100} />
            <SampleButton width={100} pressed />
        </div>
        <p>
            Wait, that’s too narrow. <Code language={cssLang} code="200px" />?
        </p>
        <div className={css(styles.column)}>
            <SampleButton width={200} />
            <SampleButton width={200} pressed />
        </div>
        <p>
            This approach kind of works, but it’s a bit finicky.
            You need to manually find a width that works well for the element, and the padding probably won’t be quite consistent with your application’s usual styles.
            You’ll need to update the width if you change the contents, and if the content can be dynamic (including appearing in more than one language) then you’re right out of luck.
        </p>
        <Section>A smashing solution</Section>
        <p>
            Here’s an approach that manages to use the natural element widths without any manual calculations:
        </p>
        <SampleButtons smash />
        <p>
            The idea is to always render <em>both</em> states in a column layout, one above the other, but let the inactive state have zero height so that it only contributes to its parent’s width:
        </p>
        <CodeBlock language={cssLang} code={dedent`\
            .two-state-container {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .inactive-state {
                height: 0;
                visibility: hidden;
            }
        `} />
        <CodeBlock language={markup} code={dedent`\
            <!-- e.g., in the "pressed" state: -->
            <button class="two-state-container">
                <span class="inactive-state">Copy to clipboard</span>
                <span>Copied!</span>
            </button>
        `} />
        <p>
            I&nbsp;think of this as “smashing” the inactive state, since it’s similar to what the built-in macro <Code code="\smash" /> does in {katex()`\TeX`}.
        </p>
        <p>
            This approach is not perfect.
            It only works in the horizontal direction, so if one of the states is wide enough that it <em>wraps</em> onto multiple lines, then the container will still need to reflow when states change, which breaks the illusion:
        </p>
        <div className={css(styles.column)}>
            <div className={css(styles.column, styles.narrowContainer)}>
                <p className={css(styles.narrowLabel)}>This is a narrow container: the buttons are as big as they can get!</p>
                <SampleButtons smash />
            </div>
        </div>
        <p>
            You can imagine trying to apply a similar trick with a horizontal flex container, but setting an element to <Code language={cssLang} code="width: 0" /> will change its wrapping and thus its height!
            Likewise, this won’t work if the contents’ width depend on their height: for instance, an image with a fixed <Link to={urls.aspectRatio}><Code language={cssLang} code="aspect-ratio:" /></Link> and <Code language={cssLang} code="height: 100%" />.
            But although it’s imperfect, it <em>is</em> easy to understand and it works well in a decent range of cases, so I’m&nbsp;happy to have it in my toolbelt.
        </p>
        <script dangerouslySetInnerHTML={{__html: script}} />
    </article>;
}

class SampleButtons extends Component {

    static propTypes = {
        smash: PropTypes.bool,
        width: PropTypes.number,
    }

    render() {
        return <div className={css(styles.column)}>
            <SampleButton {...this.props} />
            <SampleButton  {...this.props} pressed />
        </div>;
    }

}

class SampleButton extends Component {

    static propTypes = {
        pressed: PropTypes.bool,
        smash: PropTypes.bool,
        width: PropTypes.number,
    }

    render() {
        const pressed = this.props.pressed;
        const hideClass = this.props.smash ? "smash" : "hide";

        const a = "Copy to clipboard";
        const b = "Copied!";
        return <button
            className={["sample-button", pressed ? "pressed" : ""].join(" ")}
            style={{ width: this.props.width }}
        >
            <span className={[hideClass, "state-not-pressed"].join(" ")}>{a}</span>
            <span className={[hideClass, "state-pressed"].join(" ")}>{b}</span>
        </button>
    }

}

// This site is statically rendered and no global <script> element is sent
// down, but we still want to progressively enhance with a bit of interactivity
// on the buttons. The site still works fine without it because we always show
// the buttons in both states.
const script = `
(function() {
    const root = document.currentScript.parentElement;
    const pressedClass = "pressed";

    const timeouts = new Map();
    const naturallyPressed = new Set();

    const listener = function(e) {
        const node = e.currentTarget;
        node.classList.toggle(pressedClass);
        const timeout = timeouts.get(node);
        if (timeout != null) clearTimeout(timeout);
        timeouts.set(node, setTimeout(function() {
            node.classList.toggle(pressedClass, naturallyPressed.has(node));
        }, 2000));
    };

    for (const node of root.querySelectorAll(".sample-button")) {
        timeouts.set(node, null);
        if (node.classList.contains(pressedClass)) naturallyPressed.add(node);
        node.addEventListener("click", listener);
    }
})();
`;

const styles = StyleSheet.create({
    column: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        margin: 16,
    },
    narrowContainer: {
        width: 125,
        background: hexWithAlpha(Colors.accentBlue.base, 0.1),
        gap: 0,
    },
    narrowLabel: {
        fontSize: 'smaller',
        margin: 8,
        marginBottom: 0,
    },
    smash: {
        height: 0,
        visibility: 'hidden',
    },
});


export default {
    id: 9,
    title: 'Sizing a container to the wider of two states',
    filename: 'widerOfTwoStates.js',
    date: '2024-06-29',
    render,
};
