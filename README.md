# wchargin.github.io

Hi! You've found the source code for [my website][].

This is a single-page [React][] application that uses [React Router][] for client-side routing and [Aphrodite][] for styling. At build time, it's server-side rendered to static HTML and CSS (which weighs in at no more than 10&thinsp;KB for any page), so that the entire site works without JavaScript enabled. When the user loads the page, the static content is rehydrated, so the navigation becomes instant instead of requiring another page load.

The other thing that makes the site feel snappy is resource preloading. As soon as you hover an (internal) link, all the resources needed to load the linked page are fetched, so that chances are higher that the resources have already loaded once you click the link.

I'm pleased to report that it took me **fewer than one thousand hours** to configure webpack, babel, and friends to do what I wanted.

[my website]: https://wchargin.github.io/
[React]: https://facebook.github.io/react/
[React Router]: https://github.com/reactjs/react-router#readme
[Aphrodite]: https://github.com/Khan/aphrodite

That's about it. It's MIT licensed; feel free to grab anything that you find interesting.

---

*The home icon on this site is by Timothy Miller, released under CC-BY-SA [\[1\]][icon-1] [\[2\]][icon-2].*

[icon-1]: https://commons.wikimedia.org/wiki/File:Home-icon.svg
[icon-2]: https://www.iconfinder.com/icons/126572/home_house_icon#size=128
