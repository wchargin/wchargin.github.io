import React from 'react';

import dedent from '../../../dedent';
import Prism from '../../../extern/Prism';
import {Code, CodeBlock, Link} from '../../../Components';

function render(Title, Section) {
    const {python, pythonRepl} = Prism.languages;
    const urls = {
        abcDocs: "https://docs.python.org/3/library/abc.html",
        abcSourceAbstracts: "https://github.com/python/cpython/blob/86c17c06c9420040c79c29ecf924741f37975342/Lib/abc.py#L133-L142",
        abcSourceInit: "https://github.com/python/cpython/blob/86c17c06c9420040c79c29ecf924741f37975342/Lib/abc.py#L143",
        anaphoric: "https://en.wikipedia.org/wiki/Anaphoric_macro",
        closure: "https://en.wikipedia.org/wiki/Closure_(computer_programming)",
        cpythonMutateLocalsTestOs: "https://github.com/python/cpython/blob/85e415108226cc5f3fdddd70196fc4c2a1d0f7f4/Lib/test/test_os.py#L1853",
        cpythonMutateLocalsTestScope: "https://github.com/python/cpython/blob/85e415108226cc5f3fdddd70196fc4c2a1d0f7f4/Lib/test/test_scope.py#L443-L449",
        cpythonMutateLocalsXml: "https://github.com/python/cpython/blob/86c17c06c9420040c79c29ecf924741f37975342/Lib/xml/dom/xmlbuilder.py#L357",
        cpythonOnlySetOnce: "https://github.com/python/cpython/blob/952899704800a5aa438e84d50f0b6fc498c72e89/Objects/typeobject.c#L584-L587",
        djangoModelBase: "https://github.com/django/django/blob/b0654fd6fafc28c3b0476cf2fa0d4eefe4162425/django/db/models/base.py#L316",
        hygienic: "https://en.wikipedia.org/wiki/Hygienic_macro",
        locals: "https://docs.python.org/3/library/functions.html#locals",
        vars: "https://docs.python.org/3/library/functions.html#vars",
    };
    return <article>
        <Title>Dubious dynamic delegation in Python</Title>
        <p>
            I&nbsp;recently had the occasion to use a <Code language={python} code="for" />-loop directly inside a class definition in Python.
            Discovering that this was possible was a bit surprising.
            Realizing that there is a sense in which it was the <em>best</em> solution was more surprising still.
            This is that story.
        </p>
        <Section>Interfaces and delegation</Section>
        <p>
            Python doesn’t have a native concept of interfaces, traits, protocols, or anything of the sort.
            This is too bad: even though Python prefers to implicitly treat <em>implementations</em> interchangeably via duck typing, explicitly defining an interface is still super useful because it provides a place to document the interface’s syntax and semantics.
            To this end, Python provides an <Code language={python} code="abc" /> module for defining abstract base classes.
        </p>
        <p>
            As a running example, let’s define a simple file system interface.
            Abbreviating docs for brevity:
        </p>
        <CodeBlock language={python} code={dedent`\
            import abc
            import six

            @six.add_metaclass(abc.ABCMeta)
            class FileSystem(object):
                """Abstract file system interface."""

                @abc.abstractmethod
                def open(self, path, mode="r"):
                    """Open a file for reading or writing."""
                    pass

                @abc.abstractmethod
                def remove(self, path):
                    """Remove a file."""
                    pass

                @abc.abstractmethod
                def listdir(self, path):
                    """List files in the given directory."""
                    pass

                @abc.abstractmethod
                def stat(self, path):
                    """Perform a \`stat\`(2) system call equivalent."""
                    pass

                @abc.abstractmethod
                def readlink(self, path):
                    """Resolve a symbolic link to its referent."""
                    pass
        `} />
        <p>
            The <Code language={python} code="ABCMeta" /> metaclass will prevent us from directly instantiating any instances of this class:
        </p>
        <CodeBlock language={pythonRepl} code={dedent`\
            >>> import main
            >>> main.FileSystem()
            Traceback (most recent call last):
              File "<string>", line 1, in <module>
            TypeError: Can't instantiate abstract class FileSystem with abstract methods listdir, open, readlink, remove, stat
        `} />
        <p>
            If we subclass our <Code language={python} code="FileSystem" /> class and implement all the methods, we can instantiate that subclass:
        </p>
        <CodeBlock language={python} code={dedent`\
            import os

            class NativeFileSystem(FileSystem):
                """File system backed by the operating system."""

                def open(self, path, mode="r"):
                    return open(path, mode)

                def remove(self, path):
                    return os.remove(path)

                def listdir(self, path):
                    return os.listdir(path)

                def stat(self, path):
                    return os.stat(path)

                def readlink(self, path):
                    return os.readlink(path)

            NativeFileSystem()  # OK!
        `} />
        <p>
            So far, so good.
            Now, suppose that we have a few implementations of our file system interface: say, the native file system, a couple of implementations backed by network file systems from various cloud service providers, and an in-memory file system for use in tests.
            We may want to write an adapter that wraps an arbitrary file system and only allows read-only operations.
            Like this:
        </p>
        <CodeBlock language={python} code={dedent`\
            class ReadOnlyFileSystem(FileSystem):
                """Adapter to make a filesystem read-only (first attempt)."""

                def __init__(self, delegate):
                    self._delegate = delegate

                def open(self, path, mode="r"):
                    if not mode.startswith("r"):
                        raise RuntimeError("Cannot open as %r: read-only filesystem" % mode)
                    return self._delegate.open(path, mode)

                def remove(self, path):
                    raise RuntimeError("Cannot remove file: read-only filesystem")

                def listdir(self, path):
                    return self._delegate.listdir(path)

                def stat(self, path):
                    return self._delegate.stat(path)

                def readlink(self, path):
                    return self._delegate.readlink(path)
        `} />
        <p>
            This works just fine.
            But there’s a fair amount of duplication—the <Code language={python} code="listdir" />, <Code language={python} code="stat" />, and <Code language={python} code="readlink" />&nbsp;methods are basically identical.
            That doesn’t feel very Pythonic.
            Let’s see if we can get rid of it.
        </p>
        <Section>Attempt: <Code language={python} code="__getattribute__" /></Section>
        <p>
            Thanks to Python’s dynamism, this seems like it should be easy to achieve.
            We can skip implementing the pass-through methods and instead dispatch dynamically in <Code language={python} code="__getattr__" />:
        </p>
        <CodeBlock language={python} code={dedent`\
            class ReadOnlyFileSystem(FileSystem):
                """Adapter to make a filesystem read-only (second attempt)."""

                def __init__(self, delegate):
                    self._delegate = delegate

                def open(self, path, mode="r"):
                    if not mode.startswith("r"):
                        raise RuntimeError("Cannot open as %r: read-only filesystem" % mode)
                    return self._delegate.open(path, mode)

                def remove(self, path):
                    raise RuntimeError("Cannot remove file: read-only filesystem")

                def __getattribute__(self, attr):
                    if attr in ("listdir", "stat", "readlink"):
                        return getattr(self._delegate, attr)
                    else:
                        return super(ReadOnlyFileSystem, self).__getattribute__(attr)
        `} />
        <p>
            (Note that we need to use <Code language={python} code="__getattribute__" /> rather than the more common <Code language={python} code="__getattr__" />. The latter is only consulted on failed attribute lookups, which sounds like what we want, but attribute lookups for the unimplemented abstract methods actually don’t fail because those methods exist on the superclass.)
        </p>
        <p>
            The runtime semantics of this are correct.
            If we were to remove the <Code language={python} code="ABCMeta" /> metaclass from the base class, this would work perfectly.
            But, alas!—the <Code language={python} code="abc" /> instantiation check is not appeased:
        </p>
        <CodeBlock language={pythonRepl} code={dedent`\
            >>> import main
            >>> main.ReadOnlyFileSystem(main.NativeFileSystem())
            Traceback (most recent call last):
              File "<string>", line 1, in <module>
            TypeError: Can't instantiate abstract class ReadOnlyFileSystem with abstract methods listdir, readlink, stat
        `} />
        <p>
            It has fewer complaints than last time, as we’ve explicitly implemented two of the methods, but it’s not taking into account those methods that are dispatched dynamically.
        </p>
        <Section>Attempt: attaching methods onto the derived class</Section>
        <p>
            Okay, fair enough: those methods aren’t actually defined on the <Code language={python} code="ReadOnlyFileSystem" /> class, so it’s understandable that the <Code language={python} code="abc" /> machinery might not be able to pick them up.
            But that shouldn’t be a big deal.
            Python is happy to let us monkey-patch attributes onto a class, so we can try that:
        </p>
        <CodeBlock language={python} code={dedent`\
            class ReadOnlyFileSystem(FileSystem):
                """Adapter to make a filesystem read-only (third attempt)."""

                def __init__(self, delegate):
                    self._delegate = delegate

                def open(self, path, mode="r"):
                    if not mode.startswith("r"):
                        raise RuntimeError("Cannot open as %r: read-only filesystem" % mode)
                    return self._delegate.open(path, mode)

                def remove(self, path):
                    raise RuntimeError("Cannot remove file: read-only filesystem")


            for method_name in ("listdir", "stat", "readlink"):
                def delegator(self, *args, **kwargs):
                    return getattr(self._delegate, method_name)(*args, **kwargs)
                setattr(ReadOnlyFileSystem, method_name, delegator)
        `} />
        <p>
            This is actually broken even without any <Code language={python} code="abc" /> considerations.
            The intent was that the <Code language={python} code="listdir" /> delegator method should call <Code language={python} code="listdir" /> on the delegate.
            But actually <Code language={python} code="listdir" /> will call <Code language={python} code="readlink" />!
            This is because <Code language={python} code="delegator" /> doesn’t actually <Link href={urls.closure}>close over</Link> the value of <Code language={python} code="method_name" />.
            Instead, it treats it as a global variable, and the value of the global variable changes at each loop iteration.
            To fix this, we have to explicitly bind <Code language={python} code="method_name" /> to a function parameter:
        </p>
        <CodeBlock language={python} code={dedent`\
            def make_delegator(method_name):
                def delegator(self, *args, **kwargs):
                    return getattr(self._delegate, method_name)(*args, **kwargs)
                return delegator
            for method_name in ("listdir", "stat", "readlink"):
                setattr(ReadOnlyFileSystem, method_name, make_delegator(method_name))
        `} />
        <p>
            This fixes the monkey-patching mechanics.
            But it still doesn’t suffice to satisfy the abstract method check:
        </p>
        <CodeBlock language={pythonRepl} code={dedent`\
            >>> import main
            >>> main.ReadOnlyFileSystem(main.NativeFileSystem())
            Traceback (most recent call last):
              File "<string>", line 1, in <module>
            TypeError: Can't instantiate abstract class ReadOnlyFileSystem with abstract methods listdir, readlink, stat
        `} />
        <p>
            Consulting the <Link href={urls.abcDocs}><Code language={python} code="abc" /> module documentation</Link>, we can see that this is intended:
        </p>
        <blockquote>
            Dynamically adding abstract methods to a class, or attempting to modify the abstraction status of a method or class once it is created, are not supported.
        </blockquote>
        <p>
            And, consulting the <Link href={urls.abcSourceInit}>CPython source code</Link>—the only way to <em>really</em> understand anything in Python—we see that indeed the <Code language={python} code="__abstractmethods__" /> attribute is set at class creation time.
            (The astute reader will note that the value of <Code language={python} code="__abstractmethods__" /> is never actually read within that module. That’s because the actual check happens in the C&nbsp;code for the interpreter’s core <Code language={python} code="object_new" /> function. Don’t ask.)
        </p>
        <p>
            It would appear that we’re in a bit of a bind.
            By the time that we start monkey-patching the class, the verdict has already been decided, and it is not in our favor.
        </p>
        <Section>A highly magical solution</Section>
        <p>
            Here’s where it starts getting a bit more unorthodox.
        </p>
        <p>
            In Python, a class definition—that is, the <Code language={python} code="class Foo: ..." /> line and everything inside the class body—is actually a statement.
            It’s executed roughly as follows:
        </p>
        <ol>
            <li>Evaluate each expression in the sequence of base classes (usually just <Code language={python} code="object" />).</li>
            <li>Create a new empty namespace for the class attributes.</li>
            <li>Execute the statements in the class body in the context of the new namespace.</li>
            <li>Invoke the metaclass’s constructor (usually just <Code language={python} code="type" />) with the class name, the sequence of base classes, and the namespace that has just been populated.</li>
            <li>Store the resulting type object onto the namespace under the class name.</li>
        </ol>
        <p>
            So, for example, given the following simple class definition…
        </p>
        <CodeBlock language={python} code={dedent`\
            class MyClass(object):
                X = 1

                def foo(self):
                    pass
        `} />
        <p>
            …the steps are:
        </p>
        <ol>
            <li>Evaluate the expression <Code language={python} code="object" /> to form the sequence of base classes <Code language={python} code="(object,)" /> (a length-1 tuple).</li>
            <li>Create a new empty namespace.</li>
            <li>
                Execute <Code language={python} code="X = 1" /> and <Code language={python} code="def foo(self): pass" /> in this new namespace.
                This assigns keys <Code language={python} code="X" /> and <Code language={python} code="foo" /> onto the namespace, with values <Code language={python} code="1" /> and a new function object, respectively.
            </li>
            <li>
                Invoke <Code language={python} code={'type("MyClass", (object,), namespace)'} />, where <Code language={python} code="namespace" /> is the namespace populated in the previous step.
            </li>
            <li>Set <Code language={python} code="MyClass" /> on the global namespace to the resulting type object.</li>
        </ol>
        <p>
            You can perform step&nbsp;(4) in normal Python code, too.
            This can often be convenient for quick one-liners and explorations where you want to remain in an expression context:
        </p>
        <CodeBlock language={pythonRepl} code={dedent`\
            >>> type("MyClass", (object,), {"X": 1, "foo": lambda self: None})
            <class '__main__.MyClass'>
        `} />
        <p>
            Now, the statements inside the class definition are <em>usually</em> simple assignments and function definitions, but they don’t <em>need</em> to be!
            For instance, the following is a valid class definition:
        </p>
        <CodeBlock language={python} code={dedent`\
            class MyClass(object):
                import random
                with open("threshold.txt") as infile:
                    if random.random() < float(infile.read()):
                        lucky = True
        `} />
        <p>
            The resulting class will always have attributes <Code language={python} code="random" /> (the imported module) and <Code language={python} code="infile" /> (the closed file object).
            Depending on the contents of <Code code="threshold.txt" /> and the whims of entropy, it may also have an attribute <Code language={python} code="lucky" />.
        </p>
        <p>
            Surely we must be able to use this to solve our delegation problem.
            All we need to do is make sure that the desired methods are defined on the namespace by the time that the class body finishes executing.
            We want to do something morally equivalent to the following:
        </p>
        <CodeBlock language={python} code={dedent`\
            class ReadOnlyFileSystem(FileSystem):
                """Adapter to make a filesystem read-only (fourth attempt)."""

                def __init__(self, delegate):
                    self._delegate = delegate

                def open(self, path, mode="r"):
                    if not mode.startswith("r"):
                        raise RuntimeError("Cannot open as %r: read-only filesystem" % mode)
                    return self._delegate.open(path, mode)

                def remove(self, path):
                    raise RuntimeError("Cannot remove file: read-only filesystem")

                # Note: Loop moved into class body!
                for method_name in ("listdir", "stat", "readlink"):
                    def delegator(self, *args, **kwargs):
                        return getattr(self._delegate, method_name)(*args, **kwargs)
                    setattr(ReadOnlyFileSystem, method_name, delegator)
        `} />
        <p>
            This doesn’t quite work as written.
            When we execute the <Code language={python} code="setattr" /> on the last line, the <Code language={python} code="ReadOnlyFileSystem" /> identifier has not yet been assigned onto the module namespace.
            This makes sense—the type object hasn’t been created yet, so we can’t refer to it.
            But we don’t really need to refer to the type object; we only care about the temporary namespace that we’re populating.
            And Python <em>does</em> expose a way to access that—the <Code language={python} code="vars" /> and <Code language={python} code="locals" /> builtins!
        </p>
        <p>
            The <Link href={urls.vars}>documentation for <Code language={python} code="vars" /></Link> clearly states that “the locals dictionary is only useful for reads since updates to the locals dictionary are ignored”.
            The <Link href={urls.locals}>underlying <Code language={python} code="locals" /> function</Link> also says that “[t]he contents of this dictionary should not be modified”.
            But like most everything else in Python, this “should” is really just a suggestion, and the admonition on <Code language={python} code="vars" /> is as wrong as it is unambiguous: updating <Code language={python} code="vars()" /> or <Code language={python} code="locals()" /> has worked fine since at least CPython&nbsp;2.7 and through at least CPython&nbsp;3.8 (latest at time of writing).
            So, pulling everything together, and with a final touch of discovering the needed method names dynamically with <Code language={python} code="__abstractmethods__" />, we behold:
        </p>
        <CodeBlock language={python} code={dedent`\
            class ReadOnlyFileSystem(FileSystem):
                """Adapter to make a filesystem read-only (at last, perfectly Pythonic)."""

                def __init__(self, delegate):
                    self._delegate = delegate

                def open(self, path, mode="r"):
                    if not mode.startswith("r"):
                        raise RuntimeError("Cannot open as %r: read-only filesystem" % mode)
                    return self._delegate.open(path, mode)

                def remove(self, path):
                    raise RuntimeError("Cannot remove file: read-only filesystem")

                for method_name in FileSystem.__abstractmethods__:
                    if method_name in locals():
                        continue
                    def make_delegator(m):  # indirection to close over \`method_name\`
                        def delegate(self, *args, **kwargs):
                            return getattr(self._delegate, m)(*args, **kwargs)
                        return delegate
                    # This works in CPython 2.7 to at least 3.8.
                    locals()[method_name] = make_delegator(method_name)
                    del make_delegator
                    del method_name
        `} />
        <p>
            If you’re still worrying about mutating <Code language={python} code="locals()" />, note that not only do <Link href={urls.cpythonMutateLocalsXml}>multiple places</Link> in the <Link href={urls.cpythonMutateLocalsTestOs}>CPython standard library</Link> do the same thing, but essentially this exact pattern is <Link href={urls.cpythonMutateLocalsTestScope}>explicitly tested in CPython core</Link>!
        </p>
        <p>
            Let’s try it out:
        </p>
        <CodeBlock language={pythonRepl} code={dedent`\
            >>> import main
            >>> fs = main.NativeFileSystem()
            >>> with fs.open("foo", "w") as outfile:
            ...     outfile.write("hello\\n")
            ... ${""}
            >>> rofs = main.ReadOnlyFileSystem(fs)
            >>> rofs.listdir(".")
            ['foo', 'main.py']
            >>> len(rofs.open("foo").read())
            6
            >>> rofs.open("foo", "w")
            Traceback (most recent call last):
              File "<stdin>", line 1, in <module>
              File "main.py", line 123, in open
                raise RuntimeError("Cannot open as %r: read-only filesystem" % mode)
            RuntimeError: Cannot open as 'w': read-only filesystem
        `} />
        <p>
            Excellent!
            Everything’s working properly.
            It took executing non-trivial code inside a class definition, abusing <Code language={python} code="locals()" /> in a way that’s explicitly discouraged, and some globals/closures kludgery, but we got there.
        </p>
        <Section>Partial alternative: a custom metaclass</Section>
        <p>
            At the start of this post, I&nbsp;claimed that this triply terrifying trick was the “<em>best</em> solution” that I&nbsp;know of.
            For comparison, let’s look at some other candidates.
            Here’s a solution along a different tack that does work, but has some other downsides.
        </p>
        <p>
            This problem was borne upon us by the <Code language={python} code="ABCMeta" /> metaclass.
            Perhaps a metaclass can fix it.
            After all, metaclasses get to directly inspect and modify the namespace object, which was our goal all along.
        </p>
        <p>
            In the generic case, it turns out to be a bit tricky to determine which methods we should implement as delegates.
            <Link href={urls.abcSourceAbstracts}>The way that <Code language={python} code="ABCMeta" /> does it</Link> requires first constructing the actual class object to defer to Python’s built-in <abbr title="method resolution order">MRO</abbr> logic.
            For example, <Code language={python} code="ReadOnlyFileSystem.open" /> resolves to a function on the derived class, but <Code language={python} code="ReadOnlyFileSystem.listdir" /> resolves to a function on the base class; the implementation of <Code language={python} code="abc" /> takes advantage of the standard attribute resolution here.
            One simple approach, then, is to construct the class <em>twice</em>: once just to figure out which methods are abstract, and then again with a different namespace to resume the normal class creation process.
        </p>
        <p>
            So let’s try our hand at writing an abstract base class metaclass with delegation support—an <Code language={python} code="ABCDMeta" />, if you will:
        </p>
        <CodeBlock language={python} code={dedent`\
            class ABCDMeta(abc.ABCMeta):
                """Metaclass for abstract base classes with implicit delegation."""

                def __new__(mcls, name, bases, attrs, **kwargs):
                    # Take advantage of existing \`__abstractmethods__\` computation
                    # logic on \`ABCMeta\`.
                    cls = super(ABCDMeta, mcls).__new__(mcls, name, bases, attrs, **kwargs)
                    abstracts = cls.__abstractmethods__
                    def make_delegator(method_name):
                        def delegator(self, *args, **kwargs):
                            return getattr(self._delegate, method_name)(*args, **kwargs)
                        return delegator
                    for method_name in abstracts:
                        if method_name not in attrs:
                            attrs[method_name] = make_delegator(method_name)
                    return super(ABCDMeta, mcls).__new__(mcls, name, bases, attrs, **kwargs)
        `} />
        <p>
            Then, we could use this as the metaclass for <Code language={python} code="ReadOnlyFileSystem" />, defining only the two methods of interest.
            (It’s legal for the metaclass of a derived class to be a strict subtype of the metaclass for its ancestor classes.)
        </p>
        <p>
            This appears to work in our simple example, but it’s not perfect.
            The fact that we’re creating the class twice is more than just inelegant: in some cases, it can lead to incorrect results.
            Some metaclasses perform side effects, like registering the new class in some global registry.
            For instance, <Link href={urls.djangoModelBase}>Django’s <Code language={python} code="ModelBase" /> does this</Link>.
            A&nbsp;downstream user who attempted to use such a metaclass in conjunction with our <Code language={python} code="ABCDMeta" /> by mixing them together (via multiple inheritance: <Code language={python} code="class ABCDModelBase(ModelBase, ABCDMeta): pass" />) could see their models registered multiple times.
            Yet it also wouldn’t be correct to somehow “skip” applying the metaclasses on the first go-around, because then we might miss any implementations of the abstract methods provided by these metaclasses.
        </p>
        <p>
            Of course, if we’re willing to make this a one-off metaclass that refers to <Code language={python} code="FileSystem.__abstractmethods__" /> or the literal method names directly, then there’s no problem.
            But it’s not obvious how to turn this attempt into a correct <em>generic</em> solution.
        </p>
        <p>
            This approach has another flaw.
            It is <Link href={urls.anaphoric}>anaphoric</Link>, not <Link href={urls.hygienic}>hygienic</Link>: there is an implicit contract between the metaclass and the derived class that the delegate is stored in a private attribute called <Code language={python} code="_delegate" />.
            This means that the metaclass is not compositional.
            For instance, it would not be possible to implement two different abstract classes with different delegate objects.
            Similarly, the delegate cannot be stored in a name-mangled variable (like <Code language={python} code="__delegate" />, with two underscores) by the derived class’s initializer without further hacks in the metaclass.
            Our previous solution didn’t disrupt name mangling, because the delegator methods were defined syntactically within the relevant class.
        </p>
        <Section>Partial alternative: monkey-patch <Code language={python} code="__abstractmethods__" /></Section>
        <p>
            Finally, a different, simple approach merits a mention.
            The source of truth for the instantiation check is the <Code language={python} code="__abstractmethods__" /> attribute on the type.
            So far, we’ve been trying to get that attribute to be an empty set organically.
            But, this being Python, we can just set the attribute directly:
        </p>
        <CodeBlock language={python} code={dedent`\
            class ReadOnlyFileSystem(FileSystem):
                """Adapter to make a filesystem read-only (monkey-patching approach)."""

                def __init__(self, delegate):
                    self._delegate = delegate

                def open(self, path, mode="r"):
                    if not mode.startswith("r"):
                        raise RuntimeError("Cannot open as %r: read-only filesystem" % mode)
                    return self._delegate.open(path, mode)

                def remove(self, path):
                    raise RuntimeError("Cannot remove file: read-only filesystem")


            def make_delegator(method_name):
                def delegator(self, *args, **kwargs):
                    return getattr(self._delegate, method_name)(*args, **kwargs)
                return delegator
            for method_name in ReadOnlyFileSystem.__abstractmethods__:
                setattr(ReadOnlyFileSystem, method_name, make_delegator(method_name))
            # No longer abstract! We implemented them. :-)
            ReadOnlyFileSystem.__abstractmethods__ = frozenset()
        `} />
        <p>
            This looks good!
            It’s simple, it requires comparatively few hacks, and it kind of makes semantic sense.
            On top of all that, it’s even almost correct.
            But it’s not, in general: not quite.
            The CPython internals have <Link href={urls.cpythonOnlySetOnce}>a comment in <Code code="type_set_abstractmethods" /></Link>:
        </p>
        <blockquote>
            <Code language={python} code="__abstractmethods__" /> should only be set once on a type, in <Code language={python} code="abc.ABCMeta.__new__" />, so this function doesn't do anything special to update subclasses.
        </blockquote>
        <p>
            So, okay, we’re apparently violating an undocumented invariant of CPython.
            At first blush, this seems irrelevant: it sure doesn’t look like we’re creating any subclasses before we set <Code language={python} code="__abstractmethods__" />.
            But we can’t even rely on that in general, because one of the parent metaclasses could have already created subclasses as soon as the original class was created, and the <Code language={python} code="__abstractmethods__" /> attributes on those subclasses will not have taken our changes into account.
        </p>
        <p>
            Like the custom metaclass approach, this solution also breaks name mangling, which is unfortunate.
        </p>
        <Section>Conclusion</Section>
        <p>
            Coming back to reality, it goes without saying that there is only one good solution in this post, and that it is the first one presented: the one with explicit delegation.
        </p>
        <p>
            Python offers a lot of tempting dynamism.
            You really can put a <Code language={python} code="for" />-loop in a class definition, and it will basically “just work”.
            But as soon as we have to start reasoning about multiple metaclass inheritance or CPython implementation details just to implement a simple interface, we should know that we’ve taken it too far.
            All these extra arms of the dynamic octopus compound with each other to make it exceedingly difficult to build robust abstractions.
        </p>
        <p>
            Taking the straightforward implementation that would be natural in, say, Java or OCaml can often lead to a clear, readable, maintainable solution.
            Sometimes it turns out boring—and boring is just fine.
        </p>
    </article>;
}

export default {
    id: 6,
    title: 'Dubious dynamic delegation in Python',
    filename: 'dubiousDynamicDelegation.js',
    date: '2019-11-10',
    render,
};
