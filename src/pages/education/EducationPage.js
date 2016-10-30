/*
 * The main component for the education page.
 */

import React, {Component} from 'react';

import {Blurb, Heading, Link} from '../../Components';

Link.registerPreloadResources('/education', () => [
    require('./cmu.png'),
    require('./calpoly.png'),
    require('./whs.png'),
]);

export default class EducationPage extends Component {

    render() {
        const urls = {
            cmuSCS: 'https://www.cs.cmu.edu/',
            calPoly: 'http://calpoly.edu/',
            whs: 'http://woodsidehs.org/',
        };
        const course = (id, description) =>
            <li>{id}{description && ": "}{description}</li>;
        const alternator = Blurb.makeAlternator();
        return <div>
            <Heading level={1}>Education</Heading>
            <Blurb
                name="Carnegie Mellon University"
                image={require('./cmu.png')}
                imagePosition={alternator()}
            >
                <p>
                    I&nbsp;currently attend
                    {" "}<Link href={urls.cmuSCS}>
                        Carnegie Mellon's School of Computer Science
                    </Link>, seeking a degree in Computer Science with a minor
                    in Mathematics.
                </p>
                <p>
                    Relevant coursework:
                </p>
                <ul>
                    {course('15-150',
                        'functional programming')}
                    {course('15-210',
                        'parallel and sequential data structures and algorithms')}
                    {course('15-251',
                        'selected topics in theoretical computer science')}
                    {course('15-359',
                        'probability in computing (honors)')}
                    {course('15-411',
                        'compiler design and implementation')}
                    {course('15-816',
                        'substructural logics')}
                </ul>
            </Blurb>
            <Blurb
                name="Cal Poly San Luis Obispo"
                image={require('./calpoly.png')}
                imagePosition={alternator()}
            >
                <p>
                    I&nbsp;previously attended
                    {" "}<Link href={urls.calPoly}>Cal Poly SLO</Link>, where
                    I&nbsp;sought a degree in Computer Science with a minor in
                    Mathematics. I&nbsp;was a member of the University Honors
                    Program.
                </p>
                <p>
                    Relevant coursework:
                </p>
                <ul>
                    {course('CPE 430',
                        'programming language design')}
                    {course('CPE 357',
                        'Unix systems programming, advanced C programming')}
                    {course('CPE 225',
                        'introduction to computer organization and assembly')}
                    {course('CPE 123, 101, 102, 103',
                        'standard introductory CS sequence')}
                    {course('CSC 141, MATH 248',
                        'discrete structures, methods of proof')}
                    {course('MATH 244',
                        'linear algebra and differential equations')}
                    {course('MATH 141, 142, 143, 241',
                        'calculus series, through vector calculus')}
                </ul>
                <p>
                    Some awards and honors:
                </p>
                <ul>
                    <li>University Honors Program</li>
                    <li>Dean's List (all quarters)</li>
                    <li>Honors Public Speaking: Best Informative Speaker</li>
                    <li>Honors Public Speaking: Best Persuasive Speaker</li>
                </ul>
            </Blurb>
            <Blurb
                name="Woodside High School"
                image={require('./whs.png')}
                imagePosition={alternator()}
            >
                <p>
                I&nbsp;attended Woodside High School in Woodside,&nbsp;CA. In
                addition to my own academics, I&nbsp;served as a peer tutor for
                AP&nbsp;Calculus&nbsp;BC and for special ed students.
                I&nbsp;also privately tutored one CS teacher during his prep
                period, at his request. Most recently, I&nbsp;was a teaching
                assistant for an introductory computer science course, helping
                students in class and creating resources and labs.
                </p>
                <p>
                    Some awards and honors:
                </p>
                <ul>
                    <li>
                        <span>Senior year</span>
                        <ul>
                            <li>National Merit Scholar</li>
                            <li>Valedictorian</li>
                            <li>
                                Inter-Departmental Award
                                (first ever; created specifically for me)
                            </li>
                            <li>National AP Scholar
                                (score of&nbsp;5 on nine AP exams)
                            </li>
                            <li>
                                CA&nbsp;Department of Education Award
                                for Exemplary Mathematics Achievement
                            </li>
                            <li>Best Mandarin&nbsp;I Student</li>
                            <li>
                                California Scholarship Federation Sealbearer
                            </li>
                        </ul>
                    </li>
                    <li>
                        <span>Junior year</span>
                        <ul>
                            <li>Most Outstanding Math and Science Student</li>
                            <li>Best Junior in Math</li>
                            <li>Best Junior in Spanish</li>
                            <li>Best Junior in History</li>
                        </ul>
                    </li>
                </ul>
            </Blurb>
        </div>;
    }

}
