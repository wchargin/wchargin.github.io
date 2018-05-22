import React from 'react';

import dedent from '../../../dedent';
import Prism from '../../../extern/Prism';
import {Code, CodeBlock, Link} from '../../../Components';

function render(Title, Section) {
    const urls = {
        flow: "https://flow.org/",
        commentSyntax: "https://flow.org/en/docs/types/comments/",
    };
    const flow = Prism.languages.flow;
    return <article>
        <Title>Abusing Flow comment syntax for great good</Title>
        <p>
            <Link to={urls.flow}>Flow</Link> is a static type system for JavaScript.
            Code written with Flow looks like normal JavaScript with extra type declarations and type annotations:
        </p>
        <CodeBlock language={flow} code={dedent`\
            type ShoppingCartEntry = {productName: string, count: number};
            function totalCount(cart: ShoppingCartEntry[]): number {
                const counts: number[] = cart.map((entry) => entry.count);
                return counts.reduce((a, b) => a + b, 0);
            }
        `} />
        <p>
            These addenda of course mean that the code is not itself valid JavaScript.
            Flow provides a preprocessor to strip away these annotations, but also offers an alternative <Link to={urls.commentSyntax}>comment syntax</Link> in case using a preprocessor would be undesirable for some reason or other:
        </p>
        <CodeBlock language={flow} code={dedent`\
            /*:: type ShoppingCartEntry = {productName: string, count: number}; */
            function totalCount(cart /*: ShoppingCartEntry[] */) /*: number */ {
                const counts /*: number[] */ = cart.map((entry) => entry.count);
                return counts.reduce((a, b) => a + b, 0);
            }
        `} />
        <p>
            The semantics are simple: any block comment that starts with <Code code="::" /> (a double colon) is treated as normal Flow code by the Flow parser, and for convenience any block comment that starts with <Code code=":" /> (a single colon) is treated as normal Flow code that starts with a literal colon, so that type annotations can be written like <Code language={flow} code="(17 /*: number */)" /> instead of the more awkward <Code language={flow} code="(17 /*:: : number */)" />.
        </p>
        <p>
            This comment syntax is an entirely reasonable feature that we can abuse to create horrifying, devious contraptions.
            Sounds like fun!
        </p>
        <p>
            (Note: All code in this post works on Flow&nbsp;v0.72. These techniques may well be patched in the future.)
        </p>
        <Section>Motivation: Incompleteness</Section>
        <p>
            Sometimes, we write code that is provably correct in a way that the type checker can’t infer.
            For instance, suppose that we have an array with elements of type <Code language={flow} code="Person | null" /> (“either <Code language={flow} code="Person" /> or <Code language={flow} code="null" />”), where <Code language={flow} code="Person" /> is an object type with a string field called <Code language={flow} code="name" />.
            We want to retrieve the names of all the people in the array, ignoring the <Code language={flow} code="null" /> elements.
            In plain JavaScript, we might write something like this:
        </p>
        <CodeBlock language={flow} code={dedent`\
            /*:: type Person = {name: string, favoriteColor: string}; */
            function peopleNames(maybePeople /*: (Person | null)[] */) /*: string[] */ {
                return maybePeople
                    .filter((person) => person !== null)
                    .map((person) => person.name);
            }
        `} />
        <p>
            A human can look at this code and easily see that it returns a valid list of strings.
            But Flow can’t, for a fully understandable reason.
            Flow knows that <Code language={flow} code="filter" /> takes an array <Code language={flow} code="T[]" /> and a predicate <Code language={flow} code="(T) => boolean" />, and returns a new array <Code language={flow} code="T[]" />.
            However, Flow doesn’t understand the relationship between the inputs and the output—in particular, that every element in the output satisfies the predicate.
            So, as far as Flow is concerned, the result of the call to <Code language={flow} code="filter" /> might still contain <Code language={flow} code="null" /> elements, and in that case the expression <Code language={flow} code="person.name" /> would indeed be cause for alarm.
        </p>
        <p>
            In situations like these, it is tempting to reach for the <Code language={flow} code="any" /> keyword: this is a magic type that is interconvertible with every type and for which all operations are permitted.
            In effect, it says that “anything goes” whenever a particular variable is involved.
            We can write:
        </p>
        <CodeBlock language={flow} code={dedent`\
            function peopleNames(maybePeople: (Person | null)[]): string[] {
                return maybePeople
                    .filter((person) => person !== null)
                    .map((person) => (person: any).name);  // cast through \`any\`!
            }
        `} />
        <p>
            But here we are losing valuable type safety.
            We lose the ability to catch many potential errors in our code—for instance, a typo like <Code language={flow} code="person.nmae" /> would go completely undetected.
            We want to <em>refine</em> the type information, not throw it away.
        </p>
        <p>
            We could give Flow a hint, by explicitly checking that each person in the filtered array is actually not <Code language={flow} code="null" />:
        </p>
        <CodeBlock language={flow} code={dedent`\
            function peopleNames(maybePeople: (Person | null)[]): string[] {
                return maybePeople
                    .filter((person) => person !== null)
                    .map((person) => {
                        // Explicit assertion just to appease the typechecker.
                        if (person === null) {
                            throw new Error("Unreachable!");
                        }
                        // If we get here, \`person\` is non-null, so this next line is fine.
                        return person.name;
                    });
            }
        `} />
        <p>
            Flow is now happy to treat the argument to <Code language={flow} code="map" /> as a function taking <Code language={flow} code="Person | null" /> and returning <Code language={flow} code="string" />, so this code type-checks and runs correctly.
            But this is not a great solution.
            Assertions like this make the code more verbose and harder to read, interrupting (ironically) a reader’s flow.
            Furthermore, writing code in anything other than the most natural way simply to appease tooling of any sort should always be a red flag: tools exist to <em>help</em> programmers, not hinder them, and if the tools are broken then they must be fixed.
        </p>
        <p>
            Or: instead of fixing these tools, we can just lie to them.
        </p>
        <Section>White lies</Section>
        <p>
            Suppose that we had access to a function <Code language={flow} code="withoutNulls" /> that gave a copy of its input array with all <Code language={flow} code="null" /> elements removed.
            In that case, Flow would be satisfied by the following code:
        </p>
        <CodeBlock language={flow} code={dedent`\
            function withoutNulls<T>(xs: (T | null)[]): T[] { /* implementation elided */ }
            function peopleNames(maybePeople: (Person | null)[]): string[] {
                let people = maybePeople.filter((person) => person !== null);
                people = withoutNulls(people);  // no-op
                return people.map((person) => person.name);
            }
        `} />
        <p>
            Of course, we don’t actually want to call this function, and ideally we don’t even want the function to exist.
        </p>
        <p>
            In fact, Flow makes it easy for us to declare that a function exists without providing its implementation, because this is commonly needed to talk about external library functions and the like.
            We can start with the following:
        </p>
        <CodeBlock language={flow} code={dedent`\
            declare function withoutNulls<T>(xs: (T | null)[]): T[];
            function peopleNames(maybePeople: (Person | null)[]): string[] {
                let people = maybePeople.filter((person) => person !== null);
                people = withoutNulls(people);  // now fails at runtime: no such function
                return people.map((person) => person.name);
            }
        `} />
        <p>
            Now, Flow is still happy, but our code will fail at runtime unless we actually provide an implementation of the <Code language={flow} code="withoutNulls" /> function.
            We need Flow to <em>think</em> that we’re calling this function without actually having to do so.
        </p>
        <p>
            Behold:
        </p>
        <CodeBlock language={flow} code={dedent`\
            declare function withoutNulls<T>(xs: (T | null)[]): T[];
            function peopleNames(maybePeople: (Person | null)[]): string[] {
                let people = maybePeople.filter((person) => person !== null);
                /*:: people = withoutNulls(people); */  // ta-da!
                return people.map((person) => person.name);
            }
        `} />
        <p>
            The comment syntax was designed to allow including Flow type annotations, declarations, and the like, but nothing stops us from including actual code!
            As far as Flow is concerned, the middle line of the function is just as real as the other two.
        </p>
        <p>
            Now, for something a bit crazier.
        </p>
        <Section>Utter fabrications</Section>
        <p>
            Suppose that we have some code that requires a module of generated code: created at build time, say, or even at runtime.
            In JavaScript, it is perfectly fine to write
        </p>
        <CodeBlock language={flow} code={dedent`\
            const frobnicateWidgets = require("./frobnicateWidgets");
        `} />
        <p>
            as long as the module is available when the <Code language={flow} code="require" /> expression is evaluated.
            But such an import is of course incompatible with any static analysis.
            In particular, Flow will yield an error—“Cannot resolve module”—when the module in question has not yet been generated.
        </p>
        <p>
            We can’t use exactly the same trick as before, wherein we performed some assertions that only Flow could see.
            The problem is that Flow knows what <Code language={flow} code="require" /> does—it loads a module.
            If we were in a context where <Code language={flow} code="require" /> were a normal function of appropriate type, then this wouldn’t be a problem.
        </p>
        <p>
            And we can make it so:
        </p>
        <CodeBlock language={flow} code={dedent`\
            const frobnicateWidgets =
                /*:: ((require: any) => */ require("./frobnicateWidgets") /*:: )() */;
        `} />
        <p>
            Here we see the return of <Code language={flow} code="any" />.
            Within the body of this lambda expression—which only exists in Flow’s eyes!—<Code language={flow} code="require" /> is treated as a normal function that we call with a normal string to get back what we need.
        </p>
        <p>
            We can even give the result a well-defined type so that code in the rest of the program continues to have statically strong types, instead of being polluted by the <Code language={flow} code="any" />:
        </p>
        <CodeBlock language={flow} code={dedent`\
            type WidgetFrobnicator = (Widget) => void;  // whatever the module signature is
            const frobnicateWidgets: WidgetFrobnicator =
                /*:: ((require: any) => */ require("./frobnicateWidgets") /*:: )() */;
        `} />
        <p>
            (This works because <Code language={flow} code="require" />, at type <Code language={flow} code="any" />, is treated as a function that also <em>returns</em> an <Code language={flow} code="any" />, which is then converted to a <Code language={flow} code="WidgetFrobnicator" />.)
        </p>
        <p>
            In the <Code language={flow} code="peopleNames" /> example, we added some phantom statements to the body of a function.
            Here, we’re actually changing the structure of the AST.
            Dangerous?
            Perhaps.
            Brittle?
            Probably.
            Interesting?
            Certainly!
        </p>
        <Section>Conclusion</Section>
        <p>
            We have seen how to bend Flow to our will by splicing arbitrary code into its token stream.
        </p>
        <p>
            Ridiculous as it seems, this method has some benefits.
            It’s more precise than using casts through <Code language={flow} code="any" />.
            Using this method, we lie to Flow in a very specific and explicit way, instead of declaring that “all bets are off” for a particular variable and anything that it touches.
            Indeed, the keyword <Code language={flow} code="any" /> is itself a grand lie, just one that tends to be better documented and supported.
        </p>
        <p>
            The observant reader may recall our motivating suggestion that an ideal solution should be unsurprising to readers and should be written like natural JavaScript code, and protest that we have failed on both these counts.
        </p>
        <p>
            Such a reader is 100% correct, but is also no fun at parties, because this hack is way cooler than any “practical”, “enterprise-grade” solution—so there.
        </p>
    </article>;
}

export default {
    id: 4,
    title: 'Abusing Flow comment syntax for great good',
    filename: 'abusingFlowComments.js',
    date: '2018-05-23',
    render,
};
