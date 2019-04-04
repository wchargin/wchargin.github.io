/*
 * The main component for the home page.
 */

import React, {Component} from 'react';

import {Blurb, Heading, Link} from '../../Components';

Link.registerPreloadResources('/', () => [
    require('./me.png'),
]);

export default class HomePage extends Component {

    render() {
        const urls = {
            brain: "https://ai.google/research/teams/brain",
            ka: "https://www.khanacademy.org/",
            pgpKey: require("../../shared_files/wchargin_public_key.gpg"),
            sourcecred: "https://sourcecred.io/",
            tensorboard: "https://github.com/tensorflow/tensorboard",
        };
        return <div>
            <Heading level={1}>Hey!</Heading>
            <Blurb
                image={require("./me.png")}
                imagePosition={Blurb.IMAGE_RIGHT}
            >
                <p>
                    I’m William.
                    I&nbsp;enjoy creating software that is correct, efficient, and useful.
                </p>
                <p>
                    I&nbsp;currently work full time on <Link href={urls.tensorboard}>TensorBoard</Link> at <Link href={urls.brain}>Google Brain</Link>, and on <Link href={urls.sourcecred}>SourceCred</Link> in my free time.
                    In the past, I&nbsp;worked at <Link href={urls.ka}>Khan Academy</Link>.
                </p>
                <p>
                    Miscellanea about me:
                </p>
                <ul>
                    <li>
                        My email address is at gmail.com.
                        (You can figure it out.)
                    </li>
                    <li>
                        <Link href={urls.pgpKey}>My PGP key</Link>’s ID is 9ADC5E04<span style={{width: "0.25em", display: "inline-block"}} />FB5CCEE9.
                    </li>
                    <li>
                        Sometimes <Link to="/posts">I&nbsp;write things</Link>.
                    </li>
                </ul>
                <p>
                    My surname is pronounced /'ʧɑɹgɪn/, with a hard&nbsp;<i>g</i>.
                    It rhymes with&nbsp;<i>bargain</i>, not&nbsp;<i>barge&nbsp;in</i>.
                </p>
            </Blurb>
        </div>;
    }

}
