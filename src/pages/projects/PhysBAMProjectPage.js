/*
 * The individual project page for my physics simulations work.
 */

import React, {Component} from 'react';

import {Heading, Link} from '../../Components';
import Project from './Project';

Link.registerPreloadResources('/projects/physbam', () => [
    require('./physbam_hero.png'),
]);

export default class PhysBAMProjectPage extends Component {

    render() {
        const urls = {
            writeup: require("../../shared_files/ahpcrc_writeup.pdf"),
            demo: 'https://vimeo.com/103361487',
        };
        return <Project
            name="Physics simulations"
            heroImage={require("./physbam_hero.png")}
        >
            <Heading level={2}>Overview</Heading>
            <p>
                In this project, I&nbsp;implemented a variety of physical simulations on a low-powered Android tablet.
                The main goal of this project was to look for ways to increase the algorithmic efficiency of the simulations.
                The temptation with physics simulations is generally to purchase more or better hardware, so limiting myself to a low-powered tablet made more diverse techniques necessary.
                Additionally, it was always a goal to be entirely physically accurate, never sacrificing accuracy for speed.
            </p>
            <p>
                The simulations implemented in the application include:
            </p>
            <ul>
                <li>articulated rigid body;</li>
                <li>cloth simulation;</li>
                <li>smoke simulation (voxel density); and</li>
                <li>dynamic paint via displacement.</li>
            </ul>
            <p>
                <Link href={urls.writeup}>My research writeup</Link> is also available.
            </p>
            <Heading level={2}>Accomplishments</Heading>
            <p>
                Some things accomplished during the course of this project include:
            </p>
            <ul>
                <li>
                    efficient collision detection for rigid bodies, via manual collision groups;
                </li>
                <li>
                    efficient quadtree-based collision detection for arbitrarily dense urban environments;
                </li>
                <li>
                    efficient joint constraint solution for arbitrarily structured articulated rigid bodies;
                </li>
                <li>
                    inclusion of partially or fully pre-baked expensive simulations such as cloth and smoke (based in finite element analysis), modified for current environment;
                </li>
                <li>
                    support for realistic rendering features, such as camera-dependent fog and UV-mapped textures on both height maps and triangulated meshes.
                </li>
            </ul>
            <Heading level={2}>Demonstration</Heading>
            <p>
                I’ve prepared <Link href={urls.demo}>a demonstration reel</Link> to exhibit some of the features described above.
            </p>
            <Heading level={2}>Source</Heading>
            <p>
                Some of the libraries upon which this project relies utilize state-of-the-art techniques from papers that have not yet been published.
                For this reason, I&nbsp;have been asked not to make the source code publicly available.
            </p>
        </Project>;
    }

}
