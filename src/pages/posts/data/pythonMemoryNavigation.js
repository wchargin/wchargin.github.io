import React from 'react';

import dedent from '../../../dedent';
import Prism from '../../../extern/Prism';
import {Code, CodeBlock} from '../../../Components';

function render(Title, Section) {
    return <article>
        <Title>Hidden edges in the Python object graph</Title>
        <p>
            It’s well known that Python doesn’t really have a concept of private data.
            Underscore-named attributes are nothing more than a convention; anyone can access them, and they can leak implementation details across class boundaries in a way that (say) private fields in Java can’t.
        </p>
        <p>
            When actual encapsulation is desired—say, to prevent leaking new attributes onto an object—a common practice is to use a closure to <em>capture</em> the desired the value rather than assigning it to an attribute.
            For instance, in the following code, it might seem unlikely that we could implement <Code code="callback" /> such that the program always completes successfully:
        </p>
        <CodeBlock language={Prism.languages.python} code={dedent`\
            def make_greeter(expected_name):
                """Return a function that expects to greet a very specific guest."""
                def greet(actual_name):
                    if expected_name != actual_name:
                        raise ValueError("Who are you?")
                    else:
                        print("Hello, %s!" % actual_name)
                return greet

            def greet_guest(greet, choose_guest):
                guest = choose_guest()
                greet(guest)

            def main():
                greet_guest(make_greeter(input()), callback)

            def callback():
                # Wherever to begin?
                raise NotImplementedError()

            if __name__ == "__main__":
                main()
        `} />
        <p>
            But in fact we can, with the help of two “features” of Python dynamism.
            The following definition suffices:
        </p>
        <CodeBlock language={Prism.languages.python} code={dedent`\
            def callback():
                import inspect
                parent_frame = inspect.stack()[1].frame
                greeter = parent_frame.f_locals["greet"]
                expected_name = greeter.__closure__[0].cell_contents
                return expected_name
        `} />
        <Section>What?</Section>
        <p>
            In case it’s not clear, here’s what’s going on.
            We first introspect the runtime environment to traverse up the call stack, and obtain a reference to our caller’s activation record.
            This includes our caller’s local variables, which are conveniently keyed by name, so we can easily grab whatever <Code code="greet" /> function was passed into <Code code="greet_guest" />.
            Finally, we can directly access that function’s closure environment, pulling the contents of the first (and only) value over which it closes.
        </p>
        <p>
            In Python 2, the syntax is a bit different—<Code code="parent_frame" /> is just a tuple, so replace&nbsp;<Code code=".frame" /> with&nbsp;<Code code="[0]" />; and <Code code="__closure__" /> is instead called <Code code="func_closure" />.
            The semantics, however, are the same.
        </p>
        <p>
            In case you were wondering, Python at least has the good sense to make local variable dictionaries and closure cells read-only, so you can’t completely wreak havoc.
        </p>
        <Section>Why?</Section>
        <p>
            While this code probably isn’t quite ready for production, it can be useful in a pinch when you want to inspect a running Python process.
            For instance, I&nbsp;used the following incantation at a&nbsp;REPL to get the details of a particularly hard-to-access value that was being mutated by the Python import system:
        </p>
        <CodeBlock language={Prism.languages.python} code={dedent`\
            import inspect
            print(inspect.getsource(
                type(tensorboard.program)  # a dynamically generated class…
                    .__getattr__  # …whose member function closes over…
                    .__closure__[0].cell_contents  # …a decorated function…
                    .__closure__[1].cell_contents  # …whose underlying function…
                    .__closure__[0].cell_contents  # …contains a value of interest!
            ))
        `} />
        <p>
            Sure, it requires knowing the memory layout pretty well ahead of time—but hey, it works!
        </p>
        <Section>Is nothing secret?</Section>
        <p>
            So, closure-captured values and locals in ancestor function calls are accessible.
            This works even across threads, because <Code code="sys._current_frames()" /> gives references to stack frame objects for all running threads, and a frame reference is all we need to perform the traversals above.
            Are there any places that we can stash a value such that later code can’t access it?
            At the very least, values that are never bound to a name look pretty safe: in <Code code="print(input() + callback())" />, the body of <Code code="callback" /> will be hard-pressed to discover the result of <Code code="input()" />.
        </p>
        <p>
            Python, of course, thwarts any such attempt at sanity by directly providing <Code code="gc.get_objects()" />, which returns a list of all objects tracked by the garbage collector.
            This almost suffices, except that some values aren’t tracked by the garbage collector (e.g., <Code code="dict" />s containing only atomic keys and values), so this isn’t quite good enough.
            While a definitive answer proves elusive, one conclusion seems clear: if for some reason you find yourself wanting to make the assumption that you can effectively isolate a piece of secret memory from untrusted Python code running in the same process… don’t!
        </p>
    </article>;
}

export default {
    id: 5,
    title: 'Hidden edges in the Python object graph',
    filename: 'pythonMemoryNavigation.js',
    date: '2019-03-08',
    render,
};
