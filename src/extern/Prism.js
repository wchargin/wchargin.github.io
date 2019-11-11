/**
 * An interface to the Prism highlighter module.
 */

import Prism from 'prismjs/components/prism-core';

import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-clike';  // dependency for Java
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';  // dependency for Flow (below)
import 'prismjs/components/prism-python';

// Prism 1.9.0+ provides a `flow` language, but I don't like its output
// (it marks `null` as a "type" even in value positions), so here we
// reimplement what little we need.
Prism.languages.flow = (() => {
    const flow = Prism.languages.extend('javascript', {});
    if (Prism.util.type(flow.keyword) !== 'Array') {
        flow.keyword = [flow.keyword];
    }
    flow.keyword.unshift(/\b(?:any|declare|type)\b/);
    return flow;
})();

Prism.languages.gitrebase = {
    'commit-description': {
        pattern: /^(\w+ [A-Fa-f0-9]+ ).*/m,
        lookbehind: true,
        alias: 'comment',
    },
    'exec-target': {
        pattern: /^(exec ).*/m,
        lookbehind: true,
        // not highlighted
    },
    'sha': {
        pattern: /^(\w+ )[A-Fa-f0-9]+/m,
        lookbehind: true,
        alias: 'constant',
    },
    'pick-action': {
        pattern: /^pick\b/m,
        // not highlighted
    },
    'non-pick-action': {
        pattern: /^\w+/m,
        alias: 'keyword',
    },
};

Prism.languages.shellSession = {
    'input': {
        pattern: /^\$.*/m,
        alias: 'keyword',
    },
    'xxd': {
        pattern: /^[0-9a-fA-F]{8}: .*/m,
        alias: 'tt',
    },
};

const {python} = Prism.languages;

// Hack to fix highlighting for `not`. Not observable given that we don't
// highlight operators specially. Would be obviated by updating past:
// <https://github.com/PrismJS/prism/pull/1617>
delete python.operator;
python['logical'] = {
    pattern: /\b(?:and|or|not)\b/,
    alias: 'keyword',
};

Prism.languages.pythonRepl = Object.assign({}, Prism.languages.python);
const {pythonRepl} = Prism.languages;
pythonRepl.comment = Object.assign({}, python.comment);
pythonRepl.comment.pattern = new RegExp(
    `(?:^[^>.\\n].*)|(?:${pythonRepl.comment.pattern.source})`,
    "m"
);
pythonRepl['repl-marker'] = {
    pattern: /^(?:>>>|\.\.\.) /m,
    alias: 'prompt',
};
// Hack to avoid matching repl-marker `>>>` as a `>>` operator. Not observable
// given that we don't highlight operators or punctuation specially.
delete pythonRepl.operator;
delete pythonRepl.punctuation;

export {Prism as default};
