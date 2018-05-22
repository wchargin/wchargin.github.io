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

export {Prism as default};
