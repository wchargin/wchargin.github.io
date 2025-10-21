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
            carbon: "https://carbonrobotics.com",
            brain: "https://ai.google/research/teams/brain",
            ka: "https://www.khanacademy.org/",
            pgpKey: require("../../shared_files/wchargin_public_key.gpg"),
            sourcecred: "https://sourcecred.io/",
            tensorboard: "https://www.tensorflow.org/tensorboard",
            tensorboardGithub: "https://github.com/tensorflow/tensorboard",
            climbing: "https://wchargin.com/climbing",
        };
        return <div>
            <Heading level={1}>Hey!</Heading>
            <Blurb
                image={require("./me.png")}
                imagePosition={Blurb.IMAGE_RIGHT}
            >
                <p>
                    I’m Willow.
                    I&nbsp;enjoy creating software that is correct, efficient, and useful.
                </p>
                <p>
                    I&nbsp;used to work at <Link href={urls.carbon}>Carbon Robotics</Link> building robots that kill weeds using lasers.
                    Before that, I&nbsp;worked at <Link href={urls.brain}>Google Brain</Link> on <Link href={urls.tensorboard}>TensorBoard</Link>, which is <Link href={urls.tensorboardGithub}>fully open source</Link>.
                    Before that, I&nbsp;co-founded <Link href={urls.sourcecred}>SourceCred</Link>.
                    Earlier still, I&nbsp;worked at <Link href={urls.ka}>Khan&nbsp;Academy</Link>.
                    And along the way, I&nbsp;worked on a variety of independent projects with close friends.
                </p>
                <p>
                    These days, I&nbsp;work on software for access control at Google.
                </p>
                <p>
                    About me:
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
                        Other times <Link href={urls.climbing}>I&nbsp;climb rocks</Link>.
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
