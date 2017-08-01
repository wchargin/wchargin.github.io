/*
 * The individual project page for Kiosk.
 */

import React, {Component} from 'react';

import {Heading, Link} from '../../Components';
import Project from './Project';

Link.registerPreloadResources('/projects/kiosk', () => [
    require('./kiosk_hero.png'),
]);

export default class KioskProjectPage extends Component {

    render() {
        const urls = {
            kioskManual: require('./kiosk_manual.pdf'),
            kioskGithub: 'https://github.com/wchargin/kiosk',
        };
        return <Project
            name="Kiosk"
            heroImage={require("./kiosk_hero.png")}
        >
            <Heading level={2}>Overview</Heading>
            <p>
                While debate conferences excel on a number of levels&mdash;education, awareness, inspiration&mdash;one area where conferences commonly fall short is the use of technology.
                Chairs (debate moderators) attempt to use assortments of independent tools, like online stopwatches for timing, text documents for note-taking, and Windows Notepad for projecting a speakers list.
                This often results in slow, error-prone workflows that either leave delegates uninformed or subject them to information overload.
            </p>
            <p>
                To solve this, I&nbsp;created Kiosk.
            </p>
            <p>
                Kiosk is an application suite that integrates everything a chair could need into a single application for the main chair, and companion applications for assistant chairs, rapporteurs, and other dais members.
                This includes timing of speeches and caucuses, automatic management of speakers&rsquo; lists and queues, motion management and voting facilitation, crisis creation and deployment, speech analysis and graphs, and more.
            </p>
            <Heading level={2}>Features</Heading>
            <ul>
                <li>
                    <strong>Automatic motion management.</strong>{" "}
                    Motion order is a critical yet often overlooked facet of parliamentary procedure, and even experienced chairs sometimes fail to recall the correct order in which motions should be entertained.
                    Kiosk automatically orders, votes on, and executes any motions on the floor.
                    Kiosk also knows which type of majority (half-plus-one or two-thirds) each motion requires.
                </li>
                <li>
                    <strong>Crisis management.</strong>{" "}
                    Chairs of stagnant or one-sided debates often manufacture and introduce &ldquo;crises&rdquo; to spur the committee onward.
                    Kiosk integrates the process of creating, assigning, and deploying crises, complete with opportunities for projected fake (or real) news articles, guest speakers, and Q&amp;A&nbsp;sessions.
                </li>
                <li>
                    <strong>Working papers and resolutions.</strong>{" "}
                    Kiosk allows chairs to entertain motions to introduce working papers submitted as PDF files or published with Google Docs.
                    Delegates can then hold formal caucuses to discuss the papers, in which the relevant papers will automatically be projected.
                    If delegates use Google Docs, the displayed paper will be automatically updated in real time.
                </li>
                <li>
                    <strong>Speech analysis.</strong>{" "}
                    If a committee has multiple chairs, one can be designated as the speech analyzer.
                    By opening the Speech Analyzer companion application, the chair will see a record of each speech as it is begun, and can analyze it on various qualities in real-time.
                    The speech records can then be exported to CSV format (human-readable and supported by Excel, Google Sheets, and LibreOffice Calc), and the chairs can see real-time graphs of how often each delegate has spoken.
                </li>
                <li>
                    <strong>Transparency.</strong>{" "}
                    To mitigate information overload or sparsity, Kiosk provides a separate Public Panel that can be projected for the delegates to see, while Kiosk's controls remain visible to the chairs only.
                    The public panel adjusts its view according to the current context, and always displays exactly what delegates need to know at any given time&mdash;no more, no less&mdash;in a clear and elegant format.
                </li>
            </ul>
            <Heading level={2}>Technical goodies</Heading>
            <ul>
                <li>
                    Full documentation, with Javadoc and <Link href={urls.kioskManual}>user manual</Link>
                </li>
                <li>
                    Networking (over&nbsp;TCP) for communication between main Kiosk and co-chairs&rsquo; computers
                </li>
                <li>
                    Networking (over&nbsp;UDP) with conference-wide master computer
                </li>
                <li>
                    Integration with PDF files and Google Docs with realtime updating
                </li>
                <li>
                    Localization to English and Spanish
                </li>
                <li>
                    Included Windows installer (via&nbsp;NSIS)
                </li>
                <li>
                    Portability, supported any Java 6+ system
                    (Windows, Mac, Linux)
                </li>
            </ul>
            <Heading level={2}>Impact</Heading>
            <p>
                Kiosk has been used at about a dozen conferences by hundreds of delegates.
                After each conference, I&nbsp;collect feedback from chairs, and continue to implement new features and suggestions.
            </p>
            <p>
                Kiosk is open-source and <Link href={urls.kioskGithub}>available on GitHub</Link>.
            </p>
        </Project>;
    }

}
