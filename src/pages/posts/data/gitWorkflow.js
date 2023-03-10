import React from 'react';

import dedent from '../../../dedent';
import Prism from '../../../extern/Prism';
import {Code, CodeBlock} from '../../../Components';

function render(Title, Section) {
    return <article>
        <Title>Managing dependent pull requests</Title>
        <p>
            In this article, I’ll describe some of my experiences managing <em>dependent pull requests</em>: sequences of pull requests where each pull request is based off the previous pull request.
            Such sequences arise naturally as a consequence of using many small commits to develop a feature.
            We’ll discover (or re-discover!) some problems that frequently arise, and develop an elegant, systematic solution that works with GitHub’s code review system.
        </p>
        <Section>Problems in a one-branch-per-change model</Section>
        <p>
            GitHub’s code review system requires that each pull request correspond to exactly one branch.
            More precisely, each pull request is a request to merge one source branch into one base branch.
            Let’s explore how this restriction impacts dependent pull requests.
        </p>
        <p>
            Consider the following stack of dependent commits, which is a representative example from my work:
        </p>
        <CodeBlock language={Prism.languages.gitrebase} code={dedent`\
            pick a2cc9d8 Centralize a \`markdown_to_safe_html\` function
            pick 1e266ba Centralize a \`tf-markdown-view\` component
            pick 7574aa5 Display summaries' \`displayName\` and \`description\`
            pick f42c879 Introduce \`data_compat\`, legacy summary converter
            pick 7826d74 Remove histogram compression from TensorBoard core
            pick 5c8c500 Perform legacy event conversion with \`data_compat\`
        `} />
        <p>
            Each of these commits depends on some nonempty subset of the commits preceding it.
            If we were using a naive GitHub workflow, we would have a branch <Code code="markdown-to-safe-html" /> at commit&nbsp;<Code code="a2cc9d8" />, and a branch <Code code="tf-markdown-view" /> at commit&nbsp;<Code code="1e266ba" />, and so on.
        </p>
        <p>
            Now, suppose that we want to edit the third commit, <Code code="7574aa5" />.
            We check out our <Code code="show-display-name-and-description" /> branch and amend the commit, then force-push to the branch, which properly updates the corresponding&nbsp;PR.
            But now the next&nbsp;PR is in a bad state: its commit&nbsp;<Code code="f42c879" /> has parent&nbsp;<Code code="7574aa5" />, not the amended version that we just force-pushed, so it will show an incorrect diff.
        </p>
        <p>
            The fix is simple: we check out the branch <Code code="data-compat" /> corresponding to the commit&nbsp;<Code code="f42c879" />, and we rebase it onto <Code code="7574aa5" />, force-pushing freely.
            But of course this just propagates the problem one commit further.
            We must rebase-and-push each of&nbsp;<Code code="7826d74" /> and&nbsp;<Code code="5c8c500" /> as well before the remote repository will be in the correct state.
        </p>
        <p>
            Let’s take a step back to evaluate.
            The fundamental problem is that <strong>to make a single change, we needed to perform work linear in the number of commits,</strong> and furthermore the constant factors were high.
            This is unacceptable: editing a file <em>must</em> be an absolutely efficient operation.
        </p>
        <Section>
            Developing a solution using locally linear history
        </Section>
        <p>
            Let’s return to our original rebase log.
        </p>
        <CodeBlock language={Prism.languages.gitrebase} code={dedent`\
            pick a2cc9d8 Centralize a \`markdown_to_safe_html\` function
            pick 1e266ba Centralize a \`tf-markdown-view\` component
            pick 7574aa5 Display summaries' \`displayName\` and \`description\`
            pick f42c879 Introduce \`data_compat\`, legacy summary converter
            pick 7826d74 Remove histogram compression from TensorBoard core
            pick 5c8c500 Perform legacy event conversion with \`data_compat\`
        `} />
        <p>
            Forget for a moment everything you know about branches.
            Suppose that we have our <Code code="HEAD" /> pointing to&nbsp;<Code code="5c8c500" />—say, on a branch called <Code code="develop" />—and that there are no other relevant branches.
            Now, suppose that we want to make the same change as before, editing commit&nbsp;<Code code="7574aa5" />.
            We can simply use an interactive rebase to edit this commit in place:
        </p>
        <CodeBlock language={Prism.languages.gitrebase} code={dedent`\
            pick a2cc9d8 Centralize a \`markdown_to_safe_html\` function
            pick 1e266ba Centralize a \`tf-markdown-view\` component
            edit 7574aa5 Display summaries' \`displayName\` and \`description\`
            pick f42c879 Introduce \`data_compat\`, legacy summary converter
            pick 7826d74 Remove histogram compression from TensorBoard core
            pick 5c8c500 Perform legacy event conversion with \`data_compat\`\
        `} />
        <p>
            Here is a quick crash course on interactive rebases, in case you’re not familiar.
            Given the above commands, git will first <em>remove</em> all the commits above, reverting the state to that of (say) <Code code="origin/master" />.
            For each commit that you “pick”, git will apply that commit in place: so, if you write “pick” at every commit, then you will end up with the same thing that you started with, as git strips away all the commits and puts them back one by one.
            But if you say “edit” then git will instead pause the rebase, allowing you to change the commit however you want.
            You can change the contents and/or the commit message and then simply amend the commit.
            When you execute <Code code="git rebase --continue" />, git simply continues where it left off, applying the rest of the commits one by one.
            The result is exactly what we want: you get to edit the commit in question, and then the later commits are re-applied on top of it.
            (If there are any merge conflicts, you’ll have the chance to apply them along the way.)
        </p>
        <p>
            This lets us efficiently maintain our local state: we do only a constant amount of work, no matter how deep our stack is.
            This is good progress!
            However, it doesn’t answer the question of integrating with GitHub’s one-branch-per-change model.
            After all, we have six changes but only one branch among them!
            The trick is to realize that <strong>the branches on the client don’t have to correspond to the branches on the server.</strong>
            {" "}Indeed, we can simply write the following in a shell:
        </p>
        <CodeBlock code={dedent`\
            git push origin --force-with-lease \\
                7574aa6:refs/heads/show-display-name-and-description
        `} />
        <p>
            This instructs git to push our commit <Code code="7574aa6" /> to a remote branch called <Code code="show-display-name-and-description" />; using <Code code="refs/heads/" /> ensures that it's created if it doesn't yet exist.
            So we could create the proper state on the remote by pushing each commit in turn:
        </p>
        <CodeBlock code={dedent`\
            git push origin --force-with-lease \\
                7574aa6:refs/heads/show-display-name-and-description \\
                f42c87a:refs/heads/data-compat \\
                7826d75:refs/heads/encapsulate-histogram-compression \\
                5c8c501:refs/heads/use-data-compat \\
                ;
        `} />
        <p>
            While this does get the job done, it is also a terrible solution.
            Not only does it require linear work in the form of manually specifying SHAs and branch names for each commit, it is severely error-prone.
            A typo in a branch name means silently pushing to a different branch, resulting in the update being (temporarily) “lost” for that&nbsp;PR; a permutation of two SHAs or branches is even worse, swapping the commits of two&nbsp;PRs.
            We must do better.
        </p>
        <p>
            First, we can save having to write out the commit SHAs by adding “exec”&nbsp;directives to our rebase, as follows:
        </p>
        <CodeBlock language={Prism.languages.gitrebase} code={dedent`\
            pick a2cc9d8 Centralize a \`markdown_to_safe_html\` function
            pick 1e266ba Centralize a \`tf-markdown-view\` component
            pick 7574aa5 Display summaries' \`displayName\` and \`description\`
            exec git push --force-with-lease origin HEAD:refs/heads/show-display-name-and-description
            pick f42c879 Introduce \`data_compat\`, legacy summary converter
            exec git push --force-with-lease origin HEAD:refs/heads/data-compat
            pick 7826d74 Remove histogram compression from TensorBoard core
            exec git push --force-with-lease origin HEAD:refs/heads/encapsulate-histogram-compression
            pick 5c8c500 Perform legacy event conversion with \`data_compat\`
            exec git push --force-with-lease origin HEAD:refs/heads/use-data-compat
        `} />
        <p>
            The “exec”&nbsp;directive in a rebase does just what it says on the tin: it runs the following shell command at the relevant commit.
            It’s equivalent to using the “edit” directive, executing the shell command manually, and then (if the command succeeded) immediately continuing the rebase.
            Thus, we can substitute the replace SHAs with&nbsp;<Code code="HEAD" />, instructing git to always push “the current commit, whatever that is” to the specified branch.
        </p>
        <p>
            Better: less catastrophically error-prone.
            But error-prone nonetheless—we could incorrectly remember or type the branch names—and certainly not good enough.
        </p>
        <p>
            At this point, I’ll present the solution that I&nbsp;use, and then explain how it works:
        </p>
        <CodeBlock language={Prism.languages.gitrebase} code={dedent`\
            pick a2cc9d8 Centralize a \`markdown_to_safe_html\` function
            pick 1e266ba Centralize a \`tf-markdown-view\` component
            pick 7574aa5 Display summaries' \`displayName\` and \`description\`
            exec git push-to-target
            pick f42c879 Introduce \`data_compat\`, legacy summary converter
            exec git push-to-target
            pick 7826d74 Remove histogram compression from TensorBoard core
            exec git push-to-target
            pick 5c8c500 Perform legacy event conversion with \`data_compat\`
            exec git push-to-target
        `} />
        <p>
            (It’s worth nothing that I&nbsp;have configured my editor so that typing <Code code="<Space>grp" /> (“git-rebase-push”) inserts the string <Code code="exec git push-to-target" /> and moves to the next line, so creating this rebase file only involves moving to the third line and then hitting that key sequence four times. It’s very fast.)
        </p>
        <p>
            You should be asking yourself what <Code code="git push-to-target" /> is.
            It is certainly not a standard git utility, but it is the crux of this solution.
        </p>
        <Section><Code code="git-push-to-target" /></Section>
        <p>
            <Code code="git-push-to-target" /> is a very small shell script that does the following:
        </p>
        <ol>
            <li>
                Look in the commit description for a unique line starting with the string <Code code="wchargin-branch: " /> and followed by a <em>branch basename</em> matching the pattern <Code code="[A-Za-z0-9_.-]+" />.
            </li>
            <li>
                Prepend <Code code="wchargin-" /> to this string to get the <em>qualified branch</em>.
            </li>
            <li>
                Force-push the current commit to the qualified branch.
            </li>
        </ol>
        <p>
            Therefore, my process when writing a commit message is as follows.
            In addition to writing the commit title, summary, and test plan, I&nbsp;also include one line with a branch directive.
            It is at this point that I&nbsp;name the branch that will be thenceforth associated with the commit, and <strong>the commit description is the single source of truth.</strong>
        </p>
        <p>
            In retrospect, this is not an entirely novel idea.
            Existing code review systems store similar information in the commit description: for instance, Phabricator adds a “Differential Revision:” line that serves much the same purpose.
            However, this application is interesting in that it’s not tied to any particular system, as are Phabricator, Gerrit, and the like: it works with any system that wants to use branches as its source of truth.
            In effect, it serves as an adapter between two sources of truth, enabling you to work comfortably on your local machine while the remote host is no wiser.
        </p>
        <p>
            We should check whether we have achieved our goals.
            When we want to make a single change to a commit in an arbitrary location in the stack, we rebase once to make the change: this takes constant work.
            Then, we rebase again and execute <Code code="git push-to-target" /> at each commit.
            In my implementation, this technically takes linear work, but the constant factor is tiny: it easily takes less than half a second to hit <Code code="<Space>grp" /> and insert the desired text. Plus, you could easily configure your editor to “insert <Code code="git push-to-target" /> after each line from here to the end of the document”, truly requiring only constant work from the user.
            We do specify an extra parameter in the commit message, but on the other hand we don’t have to manually create branches anywhere, so this isn’t really any time lost.
            Indeed, this complexity is rather unavoidable: if we are required to use branches on the remote (which we are) and we want the branch names on the remote to be human-readable (which we do), then we should take the few seconds to specify the branch names ourselves.
            In summary, then, this solution meets all our criteria.
        </p>
        <Section>Code</Section>
        <p>
            To use <Code code="git push-to-target" />, simply create an executable file called <Code code="git-push-to-target" /> on your <Code code="$PATH" />, with the following contents (changing the two global variables appropriately, of course):
        </p>
        <CodeBlock
            language={Prism.languages.bash}
            code={gitPushToTarget}
            hideStrings={true}
        />
        <p>
            I&nbsp;also recommend using <Code code="git config --global alias.pt push-to-target" /> so that you can more easily use this command manually.
            As mentioned above, it would be foolish not to configure your editor to insert this string on a dime.
        </p>
        <Section>In practice</Section>
        <p>
            I’ve used this scheme exclusively for a few months now. Here are some of my observations.
        </p>
        <ul>
            <li>
                It works really well!
                I&nbsp;was initially nervous about having a script that automatically force-pushed to a dynamically generated branch name, but I’ve never had any problems with it.
            </li>
            <li>
                I&nbsp;still use branches: I&nbsp;have a single branch for each stack of dependent commits.
                (This usually corresponds to “one branch per feature”.)
                It is worth noting that this model is fully compatible with having multiple independent stacks of dependent commits, and indeed this is very useful for moving more quickly on commits that truly are independent.
            </li>
            <li>
                In GitHub’s interface, there is one extra constant term of overhead each time that you <em>merge</em> a pull request at the base of the stack: you have to change the base branch of the next PR in the stack to <Code code="master" /> (or whatever you merged into).
                This solution does not address this issue, but the issue is not too big of a deal—although it is annoying, to be sure, and I&nbsp;would be much relieved were it to be fixed.
            </li>
            <li>
                My goal has always been to optimize the amount of work that the <em>developer</em> has to do, but it is worth noting that this solution requires O(<i>n</i>)&nbsp;new commits to edit a commit in an <i>n</i>-deep stack.
                When all these branches are pushed to the remote so that their various pull requests can stay in sync, it’s possible for many post-push hooks, such as continuous integration jobs, to be triggered.
                To some degree, this makes sense: if a commit changes, then later commits in theory need to be retested.
                However, due to the nature of reviews, such changes are often non-functional (documentation clarifications, minor linewise refactorings, small changes to test cases) and in these cases the extra builds feel wasteful.
                I’ve not yet come up with a good solution to this problem.
            </li>
        </ul>
    </article>;
}

// The contents of the actual script.
const gitPushToTarget = dedent`\
#!/bin/sh
#
# git-push-to-target: Push this commit to a branch specified in its
# commit description.
#
# Copyright (c) 2017 wchargin. Released under the MIT license.

set -eu

DIRECTIVE='wchargin-branch'  # any regex metacharacters should be escaped
BRANCH_PREFIX='wchargin-'

target_branch() {
    directive="\$( \\
        git show --pretty='%B' \\
        | sed -n 's/^'"\${DIRECTIVE}"': \\([A-Za-z0-9_.-]\\+\\)\$/\\1/p' \\
        ; )"
    if [ -z "\${directive}" ]; then
        printf >&2 'error: missing "%s" directive\\n' "\${DIRECTIVE}"
        return 1
    fi
    if [ "\$(printf '%s\\n' "\${directive}" | wc -l)" -gt 1 ]; then
        printf >&2 'error: multiple "%s" directives\\n' "\${DIRECTIVE}"
        return 1
    fi
    printf '%s%s\\n' "\${BRANCH_PREFIX}" "\${directive}"
}

main() {
    if [ "\${1:-}" = "--query" ]; then
        target_branch
        return
    fi
    remote="\${1:-origin}"
    branch="\$(target_branch)"
    set -x
    git push --force-with-lease "\${remote}" HEAD:refs/heads/"\${branch}"
}

main "$@"
`;

export default {
    id: 1,
    title: 'Managing dependent pull requests',
    filename: 'gitWorkflow.js',
    date: '2017-07-28',
    render,
};
