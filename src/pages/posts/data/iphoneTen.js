import React from 'react';
import {StyleSheet, css} from 'aphrodite/no-important';

import {Link} from '../../../Components';

const urls = {
    ddevault: 'https://drewdevault.com/2019/01/23/Why-I-use-old-hardware.html',
    externality: 'https://en.wikipedia.org/wiki/Externality',
    fastRepair: 'https://fastrepair.biz/',
};
const images = () => ({
    hero: require('./iphone4_small.png'),
    back: require('./iphone4_back_small.png'),
});

Link.registerPreloadResources('/', () => [
    images().hero,
    images().back,
]);

function render(Title, Section) {
    return <article>
        <Title>iPhone Ten</Title>
        <p>
            Until now, I’ve only ever owned one phone: an iPhone&nbsp;4, which I’ve had for just over ten years (2010–2021).
            As I&nbsp;finally upgrade to a modern device, it seems in order to look back on the phone’s long life.
        </p>
        <figure className={css(styles.figure)}>
            <img
                src={images().hero}
                width={408}
                height={600}
                alt="A black iPhone 4 in a hard shell case, powered on at the lock screen. There are some smudges and light cosmetic scratches on the bezel, but the phone appears to be in good condition overall."
                className={css(styles.figureImg)}
            />
            <figcaption className={css(styles.caption)}>
                My old phone, as photographed by my new phone.
            </figcaption>
        </figure>
        <p>
            (Disclaimer: I’m currently employed by Google, but I&nbsp;don’t work on Android or related products, and The Man has no power over what I&nbsp;say here.)
        </p>
        <Section>Why?</Section>
        <p>
            I&nbsp;run an old phone for three reasons: two philosophical and one practical.
        </p>
        <p>
            First, I&nbsp;support building systems that last.
            Software doesn’t decay, despite what the term <i>bitrot</i> may suggest.
            It only degrades when the environment around it changes in incompatible ways.
            Application programmers have the flexibility to make software robust or fragile, and systems programmers have the flexibility to support or break old applications.
            Hardware is trickier, since it’s actually subject to wear and tear.
            But we know how to build devices that can last decades.
            All we have to do is agree that it’s worth it.
        </p>
        <p>
            Second, using old systems cultivates empathy for people who <em>have</em> to use those systems.
            Not everyone can afford to buy each hot new smartphone as it’s released.
            As a programmer, it’s important that I&nbsp;build experiences that work well for everyone.
            Using a phone with a 3G&nbsp;radio (not&nbsp;5G!) and less RAM than the footprint of a typical Electron app makes the pain points painfully clear.
            Drew&nbsp;DeVault’s article <Link href={urls.ddevault}><i>Why I&nbsp;use old hardware</i></Link> also discusses this perspective.
        </p>
        <p>
            Third, it reduces e-waste.
            This one’s simple.
            The more phones you don’t buy, the more phones you don’t send to landfill.
            Our current social systems don’t internalize this <Link href={urls.externality}>externality</Link> very well, so your personal impact is up to you.
        </p>
        <p>
            And why upgrade now?
            Most new apps aren’t available for my device, so the carrot has been growing steadily for some time.
            It’s been a decade.
            I’m giving myself a “well done” and moving forward.
        </p>
        <Section>Hardware</Section>
        <p>
            The iPhone&nbsp;4’s hardware has held up <em>remarkably</em> well.
        </p>
        <p>
            The display is apparently built like a tank.
            The glass has some light scratches, but none deep, and none visible when the screen is lit.
            I’m moderately careful with my phone, but I’ve surely dropped it hundreds of times, and never has it even considered shattering.
            I&nbsp;don’t use a screen protector.
        </p>
        <p>
            Most things still just work: the cameras have retained their quality, the buttons still respond, the speakers are still loud enough.
            Of special commendation is the battery.
            I&nbsp;generally get two or three days of battery life with casual usage: light internet, email, maps, plus always-on push notifications.
            Combined with a tiny portable battery that I&nbsp;keep in my backpack, I&nbsp;only need to plug into a wall once a week.
        </p>
        <p>
            The only hardware issue: in late&nbsp;2019, the on-board microphone stopped working.
            It turned out to be a faulty logic board.
            I&nbsp;got it fixed in an hour for&nbsp;$70 at a local repair shop (thanks, <Link href={urls.fastRepair}>Fast Repair</Link> in Palo Alto!), bringing my total amortized repair costs to&nbsp;$7/year.
        </p>
        <p>
            My custom-printed hard shell case—hey, it was as cheap as a stock case at the time—also deserves a shout-out.
            It still boasts vibrant colors, and the few chips around the edges are easily forgiven.
            (I&nbsp;wish that I&nbsp;could remember the brand, but its records seem to be lost to time. It had something like “3D ink” or “tattoo” in the name.)
        </p>
        <figure className={css(styles.figure)}>
            <img
                src={images().back}
                width={650}
                height={409}
                alt="The back of the iPhone 4 case. Printed on the case sits a dog with salt-and-pepper coloring, lying on a grass field and holding a yellow tennis ball. The grass and tennis ball are both bright, not faded."
                className={css(styles.figureImg)}
            />
            <figcaption className={css(styles.caption)}>
                <strong>Left:</strong> The back of the phone case, still vivid after ten years.<br />
                <strong>Right:</strong> The original digital image, for comparison.
            </figcaption>
        </figure>
        <Section>Software</Section>
        <p>
            The software hasn’t fared as well as the hardware.
        </p>
        <p>
            Most OS features still work well, but with notable latency.
            Some third-party apps still chug along, slowly; many just fail.
            I&nbsp;can’t upgrade the operating system past iOS&nbsp;7 due to Apple’s restrictions, and effectively no recent apps support iOS&nbsp;7, so I’m&nbsp;stuck with what I’ve&nbsp;got.
        </p>
        <p>
            A sampling of software behavior:
        </p>
        <ul>
            <li><p>
                The <strong>lock screen, launcher, and system apps</strong> all mostly just work.
                Pressing the home button or launching an app has latency on the order of 3–5&nbsp;seconds.
                Push notifications appear promptly, whether locked or not.
                Many new-fangled emoji just appear as “alien head in a square” when sent to me in (e.g.) text messages.
            </p></li>
            <li><p>
                <strong>Google&nbsp;Maps</strong> crashes on launch about 50% of the time, after about 30&nbsp;seconds of latency.
                If it crashes, relaunch it.
                Once in the app, focusing an input field incurs about 60&nbsp;seconds of latency.
                You can type an address; expect your keystrokes to queue for a few seconds each.
                Turn-by-turn navigation works well, but sometimes the app while crash after an hour or so.
                Latency and crash probability have gotten steadily worse over the years.
            </p></li>
            <li><p>
                <strong>Google Authenticator</strong> loads pretty fast and still serves its core purpose, but since mid-2020 it has crashed if you try to add a new code.
                Thankfully, more and more sites support hardware security keys these days.
            </p></li>
            <li><p>
                <strong>Dropbox</strong>’s background camera upload service worked flawlessly until mid-2019, when they changed their login handshake such that my device can no longer authenticate.
                Of course, no updated version of the app is available for my OS.
                A shame: this was useful and dependable while it lasted, much easier than emailing photos to myself.
            </p></li>
            <p><li>
                Around 2015, <strong>Uber</strong>’s app had latency on the order of <em>20&nbsp;minutes</em> to get past the splash screen, at which point it would sometimes crash.
                I&nbsp;find this especially egregious, since the phone wasn’t very old at the time.
                This was before most of the scandals; I&nbsp;happily uninstalled it and now use Lyft exclusively.
            </li></p>
            <p><li>
                Plain old <strong>web pages</strong> (like this one!) work great!
                Massive bundles of JavaScript generally have a hard time.
            </li></p>
        </ul>
        <p>
            It might sound like I’m displeased with some of the third-party apps listed above, but note the survivorship bias: these are the ones that still work!
            I&nbsp;respect that Maps can still bring me <em>some</em> useful value, years after the end of official support.
            Many apps just crash on startup, and remember that I&nbsp;haven’t been able to install anything new for the last few years.
        </p>
        <Section>Analysis</Section>
        <p>
            This may sound revolting to you—<em>minutes</em> of latency to get driving directions?
            But it’s not so bad, because I’ve&nbsp;naturally shifted my usage patterns.
            If I&nbsp;want to use Maps, I&nbsp;load it a few minutes ahead of time.
            If I&nbsp;need to present an e-ticket to enter a venue, I&nbsp;load the email before I&nbsp;leave home, and screenshot that, just in case.
            My action space is limited, but my strategic space isn’t too badly constrained.
            If nothing else, it’s an interesting exercise in serenity.
        </p>
        <p>
            At the end of the day, I&nbsp;don’t demand much from my phone.
            I&nbsp;need a reliable telephone for voice calls and SMS, the two things with no easy fallback.
            I&nbsp;need a timely daily alarm.
            A camera and flashlight can be super handy, and push notifications for email are nice.
            So what if I&nbsp;don’t have Siri, or fancy animated stickers in MMS?
            With computers and friends close at hand, everything else is gravy.
        </p>
        <Section>What’s next?</Section>
        <p>
            This one’s easy: Pixel&nbsp;4a&nbsp;(5G).
            It has a headphone jack.
        </p>
    </article>;
}

const styles = StyleSheet.create({
    figure: {
        textAlign: 'center',
    },
    figureImg: {
        maxWidth: '100%',
        height: 'auto',
    },
    caption: {
        fontStyle: 'italic',
    },
});

export default {
    id: 8,
    title: 'iPhone Ten',
    filename: 'iphoneTen.js',
    date: '2021-04-02',
    render,
};
