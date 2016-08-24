/*
 * A color scheme for the application. All non-trivial colors should
 * reference this module (e.g., using 'black' or '#000' is okay, but
 * something like '#ccc' should instead be `Colors.gray.medium`).
 */

export default {
    primary: '#121316',
    primaryLight: '#2a2d34',
    gray: {
        dark: '#6e6e6e',
        medium: '#cecece',
        light: '#ececec',
        lightest: '#efefef',
    },
    accentBlue: {
        lightest: '#4ca080',
        light: '#2a899b',
        base: '#0a7f96',
        dark: '#046375',
        darkest: '#024d5c',
    },
};
