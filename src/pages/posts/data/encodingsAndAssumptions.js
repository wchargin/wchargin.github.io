import React from 'react';

import Prism from '../../../extern/Prism';
import {Code, CodeBlock, Link} from '../../../Components';

function render(Title, Section) {
    const urls = {
        binarySearch: 'https://research.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html',
        repo: 'https://github.com/wchargin/anagrams-benchmark',
    };
    return <article>
        <Title>Encodings and assumptions</Title>
        <p>
            The best algorithms are simple and elegant.
            Their implementations are “clearly correct” and have straightforward proofs to this effect.
            And, sometimes, they are still wrong.
        </p>
        <p>
            Usually, this happens because the language in question has primitives whose behavior differs from that of their purely mathematical counterparts.
            With the binary search implementation proven correct in <i>Programming Pearls</i> and used in the JDK, <Link href={urls.binarySearch}>this was integer overflow</Link>.
            In this article, we explore a case in which encodings are the culprit.
        </p>
        <Section>Anagrams</Section>
        <p>
            Suppose that we want to find all groups of at least five English words that are all anagrams of each other, such as the group [<i>emits</i>, <i>items</i>, <i>mites</i>, <i>smite</i>, <i>times</i>].
            A standard approach to tasks like this is to assign a <em>canonical form</em> to each word such that two words have the same canonical form if and only if they are in the same group.
            Then, we can group words by their canonical forms.
            For anagrams, the canonical form is created by alphabetizing the letters in each word: <i>eimst</i> is the canonical form for <i>emits</i>, <i>items</i>, and so on.
            Then, two words have the same canonical form if and only if they are anagrams.
        </p>
        <p>
            Here’s some straightforward Java code to implement this algorithm (adapted from <i>Effective Java</i>, third edition; used with permission):
        </p>
        <CodeBlock language={Prism.languages.java} code={anagramsCode} />
        <p>
            (The call to <Code code="computeIfAbsent" /> creates a new set the first time we see each canonical form, and returns the existing set for a canonical form if we see it again.)
        </p>
        <p>
            Here’s some of the output if we hook it up to a simple <Code code="main" /> method:
        </p>
        <CodeBlock
            language={Prism.languages.shellSession}
            code={goodOutput}
            supplementaryFonts={true}
        />
        <p>
            Well, it sure looks like it’s doing the right thing.
            But, of course, you already know that it’s not.
        </p>
        <p>
            The culprit is the <Code code="alphabetize" /> function, and in particular its call to <Code code="Arrays.sort(a)" />, which sorts the character array&nbsp;<Code code="a" /> by its numeric values.
            The JLS guarantees that a <Code code="char" /> stores a 16-bit unsigned integer value—it always has, and it always will.
            When Java was created, this was a perfectly reasonable choice: there were just a few thousand Unicode characters, fitting comfortably into 16&nbsp;bits.
            (Indeed, it was progressive for Java to not stick with the “a character is a byte and ASCII is all that there will ever be” philosophy.)
            But by the release of Java&nbsp;1.5, the Unicode standard had expanded to define more than 65,536 code points, and thus a <Code code="char" /> was no longer wide enough to hold a Unicode character.
            Widening the primitive <Code code="char" /> type to be a 32-bit type would have been catastrophic for backward compatibility, so the Java language designers did the sensible thing and instead decided that strings would use UTF-16 (a backward-compatible encoding).
        </p>
        <p>
            There’s just one problem with UTF-16: it makes our implementation of <Code code="alphabetize" /> incorrect.
        </p>
        <Section>Surrogates</Section>
        <p>
            UTF-16 is a variable-length encoding.
            Each Unicode code point is represented as one or more 16-bit <em>code units</em> (i.e., <Code code="char" /> values).
            Code points with small values are represented by a <em>single</em> code unit with value equal to its code point.
            Code points greater than&nbsp;U+FFFF are represented by a <em>surrogate pair</em>: two code units, one with value between&nbsp;0xD800 and&nbsp;0xDB99 (encoding the high bits of the code point), and one with value between&nbsp;0xDC00 and&nbsp;0xDFFF (encoding the low bits).
        </p>
        <p>
            From this description, it’s not immediately clear why sorting the code units is problematic.
            The high surrogate precedes the low surrogate in the code unit stream, and its value is also smaller, so the relative order of the surrogates should be preserved by the sort.
            Furthermore, the ranges of the high and low surrogates are disjoint, so even if we did somehow swap the surrogates we would still be able to tell them apart: we wouldn’t be throwing away information.
        </p>
        <p>
            And, indeed, the <Code code="alphabetize" /> function works fine when a string has just one surrogate pair.
            It’s when there are multiple surrogate pairs that we can have problems.
            Consider the code unit sequences
        </p>
        <blockquote>
            D801 DC02 D803 DC04
        </blockquote>
        <p>
            and
        </p>
        <blockquote>
            D801 DC04 D803 DC02.
        </blockquote>
        <p>
            Each is a valid UTF-16 string with two surrogate pairs, but the surrogates are paired up differently, and so they represent different code points.
            The first string is U+10402&nbsp;U+10C04; the second is U+10404&nbsp;U+10C02.
            The catch, of course, is that while these strings are not anagrams, their arrays of UTF-16 code units <em>are</em> anagrams—they sort to the same array, and so our program groups them together:
        </p>
        <CodeBlock
            language={Prism.languages.shellSession}
            code={badOutput}
            supplementaryFonts={true}
        />
        <p>
            Whoops!
        </p>
        <Section>Decoders</Section>
        <p>
            So, we have a broken anagrams program.
            How can we fix it?
        </p>
        <p>
            In Java&nbsp;7 and prior versions, we’d be in a bit of a bind.
            The <Code code="String" /> class provides some methods for decoding into arrays of bytes, but not into arrays of code points.
            UTF-16 is a simple format, so it’s not very difficult to write our own, but the resulting decoder <em>is</em> longer than the rest of the program:
        </p>
        <CodeBlock language={Prism.languages.java} code={handwrittenDecoder} />
        <p>
            Note that we’ve had to change the return type method of <Code code="alphabetize" /> to be a list of code points rather than a string: otherwise, we would have had to write an encoder, too, and that’s twice the work!
        </p>
        <p>
            As of Java&nbsp;8, there’s a better way.
            We can use a new method on <Code code="CharSequence" /> (a supertype of <Code code="String" />) to accomplish our goal concisely, elegantly, and correctly:
        </p>
        <CodeBlock language={Prism.languages.java} code={fixedCode} />
        <p>
            As a bonus, it’s a line shorter than our original, incorrect version.
        </p>
        <Section>Conclusion</Section>
        <p>
            This post used Java as the working language, but the underlying issue is language-agnostic.
            When we develop programs, we must be aware of the quirks and footguns hidden in our building blocks.
            Aside from encodings and bounded integer arithmetic, the behavior of floating-point numbers is another common stumbling ground.
        </p>
        <p>
            How does your favorite language represent strings?
            It might be worth finding out.
        </p>
        <Section>Appendix: Benchmarks and a full program</Section>
        <p>
            You can find full implementations and benchmarks at <Link href={urls.repo}>wchargin/anagrams-benchmark</Link>, which tests ten variants of these algorithms.
            The executive summary of the benchmarks is: the correct version is about 50% slower than the naive version.
        </p>
        <p>
            Here’s a standalone version of the fixed program:
        </p>
        <CodeBlock language={Prism.languages.java} code={fullCode} />
        <p>
            And some sample output (the best proof of correctness):
        </p>
        <CodeBlock
            language={Prism.languages.shellSession}
            code={finalOutput}
            supplementaryFonts={true}
        />
    </article>;
}

const anagramsCode = `\
public static void printAnagrams(List<String> words, int minGroupSize) {
    Map<String, Set<String>> groups = new HashMap<>();
    for (String word : words) {
        groups.computeIfAbsent(alphabetize(word),
            (unused) -> new TreeSet<>()).add(word);
    }
    for (Set<String> group : groups.values()) {
        if (group.size() >= minGroupSize) {
            System.out.println(group.size() + ": " + group):
        }
    }
}

private static String alphabetize(String s) {
    char[] a = s.toCharArray();
    Arrays.sort(a);
    return new String(a);
}
`;

const handwrittenDecoder = `\
private static List<Integer> codePointsOf(String s) {
    final List<Integer> result = new ArrayList<>();
    final char[] chars = s.toCharArray();
    for (int i = 0; i < chars.length; i++) {
        final char here = chars[i];
        if (here < 0xD800 || here > 0xDFFF) {
            result.add((int) here);
        } else {
            if (i + 1 >= chars.length) {
                throw new IllegalArgumentException(
                        "Incomplete surrogate at index " + i);
            }
            final char next = chars[++i];
            if (0xD800 <= here && here <= 0xDBFF
                    && 0xDC00 <= next && next <= 0xDFFF) {
                result.add(
                        (((int) here - 0xD800) << 10)
                        + ((int) next - 0xDC00)
                        + 0x010000);
            } else {
                throw new IllegalArgumentException(
                        "Invalid surrogate pair at index " + (i - 1));
            }
        }
    }
    return result;
}

private static List<Integer> alphabetize(String s) {
    final List<Integer> codePoints = codePointsOf(s);
    Collections.sort(codePoints);
    return codePoints;
}
`;

const fixedCode = `\
private static String alphabetize(String s) {
    int[] newCodePoints = s.codePoints().sorted().toArray();
    return new String(newCodePoints, 0, newCodePoints.length);
}
`;

const fullCode = `\
import java.io.*;
import java.util.*;

public class AnagramsV2 {
    public static void main(String[] args) throws IOException {
        final String fileName = args[0];
        final int minGroupSize = Integer.parseInt(args[1]);

        // Read words from file and put into a simulated multimap
        Map<String, Set<String>> groups = new HashMap<>();
        try (final Scanner s = new Scanner(new File(fileName))) {
            while (s.hasNext()) {
                final String word = s.next();
                groups.computeIfAbsent(alphabetize(word),
                        (unused) -> new TreeSet<>()).add(word);
            }
        }

        // Print all anagram groups above size threshold
        for (final Set<String> group : groups.values())
            if (group.size() >= minGroupSize)
                System.out.println(group.size() + ": " + group);
    }

    private static String alphabetize(String s) {
        int[] newCodePoints = s.codePoints().sorted().toArray();
        return new String(newCodePoints, 0, newCodePoints.length);
    }
}
`;

const goodOutput = `\
$ java Anagrams /usr/share/dict/words 5 | head -n 3
5: [alerting, altering, integral, relating, triangle]
6: [opts, post, pots, spot, stop, tops]
5: [drawer, redraw, reward, warder, warred]
`;

const badOutput = `\
$ cat example
𐐂𐰄
𐐄𐰂
$ xxd example
00000000: f090 9082 f090 b084 0af0 9090 84f0 90b0  ................
00000010: 820a                                     ..
$ java Anagrams example 1
2: [𐐂𐰄, 𐐄𐰂]
`;

const finalOutput = `\
$ cat words
𐐄𐠃
𐐃𐠄
𐐂𐰄
𐐄𐰂
𐰄𐐂
𐰂𐐄
pastel
staple
plates
syzygy
ten
net
t👍n
n👍t
t👎n
$ xxd words
00000000: f090 9084 f090 a083 0af0 9090 83f0 90a0  ................
00000010: 840a f090 9082 f090 b084 0af0 9090 84f0  ................
00000020: 90b0 820a f090 b084 f090 9082 0af0 90b0  ................
00000030: 82f0 9090 840a 7061 7374 656c 0a73 7461  ......pastel.sta
00000040: 706c 650a 706c 6174 6573 0a73 797a 7967  ple.plates.syzyg
00000050: 790a 7465 6e0a 6e65 740a 74f0 9f91 8d6e  y.ten.net.t....n
00000060: 0a6e f09f 918d 740a 74f0 9f91 8e6e 0a    .n....t.t....n.
$ javac AnagramsV2.java && java AnagramsV2 words 1
3: [pastel, plates, staple]
1: [𐐃𐠄]
1: [𐐄𐠃]
2: [𐐄𐰂, 𐰂𐐄]
2: [𐐂𐰄, 𐰄𐐂]
2: [n👍t, t👍n]
1: [t👎n]
2: [net, ten]
1: [syzygy]
`;

export default {
    id: 3,
    title: 'Encodings and assumptions',
    filename: 'encodingsAndAssumptions.js',
    date: '2017-12-20',
    render,
};
