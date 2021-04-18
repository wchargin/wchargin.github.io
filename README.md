# wchargin.github.io

Hi! You've found the source code for [my website][].

This is a static site with content rendered in [React][], with [Aphrodite][] for styling.
It works perfectly without JavaScript.

I&nbsp;used to have client-side routing and resource preloading on hover, but client-side navigations to long articles caused notable scripting delays on lower-end devices.
Full page loads are simpler and don’t require setting up code splitting to keep the bundle size in check as the total content increases.
At time of writing, each page is under 15&thinsp;KB gzipped, anyway.

I'm pleased to report that it took me **fewer than one thousand hours** to configure webpack, babel, and friends to do what I wanted.

[my website]: https://wchargin.com/
[React]: https://facebook.github.io/react/
[Aphrodite]: https://github.com/Khan/aphrodite

That's about it. It's MIT licensed; feel free to grab anything that you find interesting.

---

*The home icon on this site is by Timothy Miller, released under CC-BY-SA [\[1\]][icon-1] [\[2\]][icon-2].*

[icon-1]: https://commons.wikimedia.org/wiki/File:Home-icon.svg
[icon-2]: https://www.iconfinder.com/icons/126572/home_house_icon#size=128
