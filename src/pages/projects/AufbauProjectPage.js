/*
 * The individual project page for aufbau, the automated grading system.
 */

import React, {Component} from 'react';

import {Code, Heading, Link} from '../../Components';
import Project from './Project';

Link.registerPreloadResources('/projects/aufbau', () => [
    require('./aufbau_hero.png'),
]);

export default class AufbauProjectPage extends Component {

    render() {
        return <Project
            name="Automated grading system"
            heroImage={require("./aufbau_hero.png")}
        >
            <Heading level={2}>Overview</Heading>
            <p>
                When I&nbsp;was offered the position of Instructional Student Assistant for introductory CS&nbsp;courses at Cal&nbsp;Poly, I&nbsp;found that the existing autograding system was a fragile jumble of giant, monolithic Bash scripts.
                The scripts were still working, but just barely, and adding any of the desired new functionality would have been asking for trouble.
            </p>
            <p>
                To remedy this, I&nbsp;designed a modular grading system, based on the premise that any grading process can be broken down into a sequence of discrete steps.
                For example, the process for grading a Java assignment might be as follows:
            </p>
            <ol>
                <li>Copy student's source files to the grading directory.</li>
                <li>Copy the test driver to the grading directory.</li>
                <li>Compile the source files with <Code code="javac" />.</li>
                <li>Run the test driver, and make sure that it passes.</li>
                <li>Deduct points for overly long lines.</li>
                <li>Deduct points for tab characters.</li>
                <li>Deduct points for incomplete documentation.</li>
                <li>Email scores to students.</li>
            </ol>
            <p>
                Most of these steps are not specific to any one assignment, or even any one programming language.
                By writing each of these steps independently, it becomes trivially easy to create assignment specifications that can be automatically executed.
            </p>
            <Heading level={2}>Features</Heading>
            <ul>
                <li>
                    Support for multiple grading periods, and penalties for late submissions or repeated submissions (partial credit).
                    This includes a tool to extract each student’s best score and export the results as CSV for easy input into a gradebook.
                </li>
                <li>
                    Integration with cron via a configurable schedule file that lists upcoming assignments, grading periods, and parameters.
                </li>
                <li>
                    Language bindings for steps written in Bash and Python, with the option of easy expansion to other languages.
                </li>
                <li>
                    <span>Wide variety of built-in steps, including:</span>
                    <ul>
                        <li>
                            simple file manipulation scripts (e.g., “copy files from the student directory to the testing directory”);
                        </li>
                        <li>
                            a custom Javadoc doclet to automatically check and score documentation;
                        </li>
                        <li>
                            style checking tools for long lines, tab characters, etc.;
                        </li>
                        <li>
                            a runner for Java test drivers; and
                        </li>
                        <li>
                            utility to mail scores and deduction explanations to students.
                        </li>
                    </ul>
                </li>
                <li>
                    And, of course, comprehensive documentation for instructors and new student graders.
                </li>
            </ul>
            <Heading level={2}>Deployment</Heading>
            <p>
                My system is in use by Computer Science 102 classes at Cal&nbsp;Poly.
            </p>
            <p>
                Unfortunately, Cal&nbsp;Poly requires that the source code for this project remain private. Sorry.
            </p>
        </Project>;
    }

}
